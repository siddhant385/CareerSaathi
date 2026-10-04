import type { SupportedLanguage } from "@/app/(learner)/onboarding/components/types";

export interface UserProfile {
  language: SupportedLanguage;
  name: string;
  location: string;
  phone: string;
  education: string;
  degreeDetail?: string;
  interests: string[];
  workPreference: string;
  goal: string;
  hasResume: boolean;
  resumeFileName?: string;
  parentConsentNotice: boolean;
  audioNarrationEnabled: boolean;
  notificationsEnabled: boolean;
}

const PROFILE_STORAGE_KEY = "careersaathi_user_profile";
const LANGUAGE_STORAGE_KEY = "careersaathi_language";

export const initialProfile: UserProfile = {
  language: "en",
  name: "Rahul Kumar",
  location: "Patna, Bihar",
  phone: "+91 98765 43210",
  education: "class_10",
  degreeDetail: "",
  interests: ["electrical", "machines", "vehicles"],
  workPreference: "near_home",
  goal: "fast_earning",
  hasResume: false,
  resumeFileName: "",
  parentConsentNotice: true,
  audioNarrationEnabled: true,
  notificationsEnabled: true,
};

export function getStoredLanguage(): SupportedLanguage {
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
    if (savedLang === "en" || savedLang === "hi") return savedLang;
  }
  return "en";
}

export function setStoredLanguage(lang: SupportedLanguage): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    const profile = getStoredProfile();
    profile.language = lang;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event("careersaathi_language_changed"));
    window.dispatchEvent(new Event("careersaathi_profile_changed"));
  }
}

export function getStoredProfile(): UserProfile {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialProfile, ...parsed, language: getStoredLanguage() };
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
      }
    }
  }
  return initialProfile;
}

export function saveStoredProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getStoredProfile();
  const updated: UserProfile = { ...current, ...profile };
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    if (profile.language) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, profile.language);
      window.dispatchEvent(new Event("careersaathi_language_changed"));
    }
    window.dispatchEvent(new Event("careersaathi_profile_changed"));
  }
  return updated;
}
