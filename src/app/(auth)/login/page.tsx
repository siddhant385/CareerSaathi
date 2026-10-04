"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/my-path";
  const errorParam = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup" | "forgot_password">("signin");
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (errorParam) {
      setErrorMsg(
        lang === "hi"
          ? "प्रमाणीकरण कोड अमान्य है या समाप्त हो गया है।"
          : "Authentication session expired or invalid. Please try again."
      );
    }
  }, [errorParam, lang]);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "forgot_password") {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const redirectTo = `${origin}/api/auth/callback?next=/reset-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });

        if (error) {
          setErrorMsg(
            lang === "hi"
              ? "पासवर्ड रीसेट लिंक भेजने में त्रुटि: " + error.message
              : error.message
          );
        } else {
          setSuccessMsg(
            lang === "hi"
              ? "पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है! कृपया अपना इनबॉक्स जांचें।"
              : "Password reset link sent to your email! Please check your inbox."
          );
        }
      } else if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrorMsg(
            lang === "hi"
              ? "ईमेल या पासवर्ड अमान्य है। कृपया पुनः प्रयास करें।"
              : error.message
          );
        } else {
          // Check profile to see if user is staff or if profile/onboarding is already completed
          let userRole = data.user?.app_metadata?.role;
          let hasCompletedOnboarding = false;

          if (data.user?.id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role, state, district, highest_qualification, interests")
              .eq("id", data.user.id)
              .maybeSingle();

            if (profile) {
              userRole = profile.role || userRole;
              hasCompletedOnboarding = Boolean(
                profile.district &&
                profile.highest_qualification &&
                Array.isArray(profile.interests) &&
                profile.interests.length > 0
              );
            }
          }

          if (nextPath && nextPath !== "/my-path" && nextPath !== "/onboarding") {
            router.push(nextPath);
          } else if (userRole === "admin" || userRole === "counsellor") {
            router.push("/admin");
          } else if (hasCompletedOnboarding) {
            router.push("/my-path");
          } else {
            router.push("/onboarding");
          }
          router.refresh();
        }
      } else {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const emailRedirectTo = `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) {
          setErrorMsg(
            lang === "hi"
              ? "पंजीकरण में त्रुटि: " + error.message
              : error.message
          );
        } else if (data.session) {
          router.push(nextPath || "/onboarding");
          router.refresh();
        } else {
          setSuccessMsg(
            lang === "hi"
              ? "खाता सफलतापूर्वक बन गया! हमने आपके ईमेल पर एक पुष्टिकरण लिंक भेजा है। कृपया अपना ईमेल सत्यापित करें।"
              : "Account created successfully! We sent a confirmation link to your email. Please verify your email to log in."
          );
        }
      }
    } catch {
      setErrorMsg(
        lang === "hi"
          ? "एक अप्रत्याशित त्रुटि उत्पन्न हुई।"
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setErrorMsg(null);
    setLoading(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const callbackUrl = `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch {
      setErrorMsg("Google Sign-In failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background flex flex-col justify-center items-center px-4 py-8">
      {/* Language Switcher */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            CS
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-foreground block leading-none">
              CareerSaathi
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium">
              करियर साथी · वोकेशनल गाइड
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setLang(lang === "hi" ? "en" : "hi")}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition cursor-pointer"
        >
          {lang === "hi" ? "English में देखें" : "हिन्दी में देखें"}
        </button>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-card border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Header info */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {lang === "hi"
                ? "सुरक्षित वोकेशनल करियर अकाउंट"
                : "Secure Vocational Career Account"}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {mode === "signin"
              ? lang === "hi"
                ? "साथी में लॉगिन करें"
                : "Sign in to CareerSaathi"
              : mode === "signup"
              ? lang === "hi"
                ? "नया अकाउंट बनाएं"
                : "Create a new Account"
              : lang === "hi"
              ? "पासवर्ड रीसेट लिंक भेजें"
              : "Reset Your Password"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === "forgot_password"
              ? lang === "hi"
                ? "अपना पंजीकृत ईमेल दर्ज करें, हम आपको सुरक्षित रीसेट लिंक भेजेंगे"
                : "Enter your registered email and we'll send a secure password reset link"
              : lang === "hi"
              ? "अपनी ट्रेड पसंद, आवेदन स्थिति और एआई बातचीत सुरक्षित रखें"
              : "Save your career choices, ITI applications, and counsellor sessions"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-muted rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === "signin" || mode === "forgot_password"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang === "hi" ? "लॉगिन (Sign In)" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === "signup"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang === "hi" ? "साइन अप (Sign Up)" : "Sign Up"}
          </button>
        </div>

        {mode !== "forgot_password" && (
          <>
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-11 px-4 rounded-2xl border border-border bg-card hover:bg-muted/60 text-foreground font-bold text-xs flex items-center justify-center gap-3 transition cursor-pointer shadow-xs disabled:opacity-60"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {lang === "hi" ? "गूगल (Google) से जारी रखें" : "Continue with Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-border"></div>
              <span className="shrink mx-4 text-[11px] font-medium text-muted-foreground uppercase">
                {lang === "hi" ? "या ईमेल द्वारा" : "or with email"}
              </span>
              <div className="grow border-t border-border"></div>
            </div>
          </>
        )}

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{lang === "hi" ? "पूरा नाम" : "Full Name"}</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={lang === "hi" ? "उदा. राहुल कुमार" : "e.g. Rahul Kumar"}
                className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{lang === "hi" ? "ईमेल पता" : "Email Address"}</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          {mode !== "forgot_password" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{lang === "hi" ? "पासवर्ड" : "Password"}</span>
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot_password");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    {lang === "hi" ? "पासवर्ड भूल गए?" : "Forgot password?"}
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-xs cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>{lang === "hi" ? "कृपया प्रतीक्षा करें..." : "Processing..."}</span>
            ) : (
              <>
                <span>
                  {mode === "signin"
                    ? lang === "hi"
                      ? "लॉगिन करें"
                      : "Sign In"
                    : mode === "signup"
                    ? lang === "hi"
                      ? "अकाउंट बनाएं"
                      : "Create Account"
                    : lang === "hi"
                    ? "रीसेट लिंक भेजें"
                    : "Send Reset Link"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          {mode === "forgot_password" && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
              >
                {lang === "hi" ? "← वापस लॉगिन पर जाएं" : "← Back to Sign In"}
              </button>
            </div>
          )}
        </form>

        {/* Security badge */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>
            {lang === "hi"
              ? "सुरक्षित प्रमाणीकरण · आपका डेटा 100% गोपनीय है"
              : "Supabase Secure Auth · Encrypted session"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs font-semibold text-muted-foreground">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
