export type SupportedLanguage = "en" | "hi";

export type StepId =
  | "language"
  | "basics"
  | "education"
  | "interests"
  | "workPreferences"
  | "goals"
  | "resume"
  | "portals"
  | "review";

export type OnboardingAnswer = string | string[] | null;

export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface OnboardingStep {
  id: StepId;
  label: string;
  question: string;
  whyExplanation: string;
  type: "single" | "multi" | "text" | "upload" | "review";
  options?: ChoiceOption[];
  isOptional?: boolean;
  maxSelections?: number;
  listenText?: string;
}
