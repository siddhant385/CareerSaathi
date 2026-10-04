import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );


  // Authenticate session and get validated claims from Supabase
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const pathname = request.nextUrl.pathname;

  // 1. PUBLIC ROUTES (Landing page, auth routes, password reset, and public assets)
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/auth");

  // 2. UNLOGGED-IN USERS: Must sign in for everything else (onboarding, my-path, counselling, etc.)
  if (!claims && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 3. LOGGED-IN USERS VISITING /login: Redirect them based on their profile completion
  if (claims && pathname === "/login") {
    const role = (claims.app_metadata as { role?: string } | undefined)?.role || "learner";
    const nextParam = request.nextUrl.searchParams.get("next");

    const url = request.nextUrl.clone();
    if (nextParam && nextParam !== "/onboarding" && nextParam !== "/my-path") {
      url.pathname = nextParam;
      url.searchParams.delete("next");
    } else if (role === "admin" || role === "counsellor") {
      url.pathname = "/admin";
    } else {
      url.pathname = "/my-path";
    }
    return NextResponse.redirect(url);
  }

  // 4. ROLE GUARD FOR /admin ROUTE: Only admin/counsellor role allowed
  if (claims && pathname.startsWith("/admin")) {
    const role = (claims.app_metadata as { role?: string } | undefined)?.role || "learner";
    if (role !== "admin" && role !== "counsellor") {
      const url = request.nextUrl.clone();
      url.pathname = "/my-path";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
