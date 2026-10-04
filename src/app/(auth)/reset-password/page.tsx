"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Lock, Sparkles, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg(
        lang === "hi"
          ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।"
          : "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        lang === "hi"
          ? "पासवर्ड मेल नहीं खाते हैं।"
          : "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          lang === "hi"
            ? "पासवर्ड सफलतापूर्वक बदल दिया गया है! आपको रीडायरेक्ट किया जा रहा है..."
            : "Password updated successfully! Redirecting to your dashboard..."
        );
        setTimeout(() => {
          router.push("/my-path");
          router.refresh();
        }, 2000);
      }
    } catch {
      setErrorMsg(
        lang === "hi"
          ? "पासवर्ड बदलने में त्रुटि हुई।"
          : "An unexpected error occurred."
      );
    } finally {
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
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {lang === "hi" ? "पासवर्ड रीसेट" : "Set New Password"}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {lang === "hi" ? "नया पासवर्ड बनाएं" : "Create New Password"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {lang === "hi"
              ? "कृपया अपने करियर साथी अकाउंट के लिए नया सुरक्षित पासवर्ड दर्ज करें"
              : "Please enter your new secure password for CareerSaathi"}
          </p>
        </div>

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

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{lang === "hi" ? "नया पासवर्ड" : "New Password"}</span>
            </label>
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{lang === "hi" ? "पासवर्ड दोबारा दर्ज करें" : "Confirm New Password"}</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-xs cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>{lang === "hi" ? "सहेजा जा रहा है..." : "Updating..."}</span>
            ) : (
              <>
                <span>{lang === "hi" ? "पासवर्ड सुरक्षित करें" : "Update Password"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>
            {lang === "hi"
              ? "सुरक्षित सत्र प्रमाणीकरण"
              : "Encrypted password update"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs font-semibold text-muted-foreground">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
