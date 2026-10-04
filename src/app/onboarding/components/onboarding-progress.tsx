interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  label: string;
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  label,
}: OnboardingProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          {currentStep} / {totalSteps} · {label}
        </span>
        <span>{percentage}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full bg-muted rounded-full h-2 overflow-hidden"
      >
        <div
          className="bg-primary h-2 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
