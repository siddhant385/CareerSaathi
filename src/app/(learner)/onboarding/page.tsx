import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingFlow } from "./components/onboarding-flow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("district, highest_qualification, interests, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      if (profile.role === "admin" || profile.role === "counsellor") {
        redirect("/admin");
      }

      const isComplete = Boolean(
        profile.district &&
        profile.highest_qualification &&
        Array.isArray(profile.interests) &&
        profile.interests.length > 0
      );

      if (isComplete) {
        redirect("/my-path");
      }
    }
  }

  return (
    <>
      <noscript>
        <div className="p-6 max-w-md mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold">JavaScript Required</h2>
          <p className="text-sm text-muted-foreground">
            Please enable JavaScript in your browser to complete the interactive
            CareerSaathi guidance flow.
          </p>
        </div>
      </noscript>
      <OnboardingFlow />
    </>
  );
}
