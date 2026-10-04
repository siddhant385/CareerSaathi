import { getCareerPaths } from "@/app/my-path/components/data";
import type { CareerPath } from "@/app/my-path/components/types";
import type { SupportedLanguage } from "@/app/onboarding/components/types";

const SELECTED_CAREER_KEY = "careersaathi_selected_career_id";

export function getSelectedCareerId(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(SELECTED_CAREER_KEY);
    if (saved) return saved;
  }
  return "electrician"; // default top match
}

export function setSelectedCareerId(id: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SELECTED_CAREER_KEY, id);
    window.dispatchEvent(new Event("careersaathi_career_changed"));
  }
}

export function getSelectedCareer(lang: SupportedLanguage = "en"): CareerPath {
  const currentId = getSelectedCareerId();
  const allPaths = getCareerPaths(lang);
  const found = allPaths.find((p) => p.id === currentId);
  return found || allPaths[0];
}
