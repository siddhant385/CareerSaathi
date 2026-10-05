export type SupportedLanguage = "en" | "hi";

export type StepId =
  | "language"
  | "basics"
  | "education"
  | "interests"
  | "workPreferences"
  | "goals"
  | "resume"
  | "portals";

export interface BasicsAnswer {
  fullName: string;
  phone: string;
  district: string;
}

export type OnboardingAnswer = string | string[] | BasicsAnswer | null;

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
  type: "single" | "multi" | "text" | "upload" | "basics";
  options?: ChoiceOption[];
  isOptional?: boolean;
  maxSelections?: number;
  listenText?: string;
}
