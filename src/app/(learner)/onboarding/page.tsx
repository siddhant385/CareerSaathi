import { OnboardingFlow } from "./components/onboarding-flow";

export default function OnboardingPage() {
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
