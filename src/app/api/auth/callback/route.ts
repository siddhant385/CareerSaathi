import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      let role = data.user.app_metadata?.role;
      let hasCompletedProfile = false;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, district, highest_qualification, interests")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile) {
        role = profile.role || role;
        hasCompletedProfile = Boolean(
          profile.district &&
          profile.highest_qualification &&
          Array.isArray(profile.interests) &&
          profile.interests.length > 0
        );
      }

      // If user had a specific requested page other than /onboarding
      if (next && next !== "/onboarding" && next !== "/my-path") {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Staff redirection
      if (role === "admin" || role === "counsellor") {
        return NextResponse.redirect(`${origin}/admin`);
      }

      // If learner has already completed onboarding, go straight to /my-path
      if (hasCompletedProfile) {
        return NextResponse.redirect(`${origin}/my-path`);
      }

      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  // Error redirect
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
