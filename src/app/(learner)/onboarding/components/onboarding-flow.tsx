"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOnboardingSteps } from "./questions";
import { translations } from "./i18n";
import type { OnboardingAnswer, SupportedLanguage, BasicsAnswer } from "./types";
import { OnboardingProgress } from "./onboarding-progress";
import { OnboardingQuestion } from "./onboarding-question";
import { LanguageSelector } from "./language-selector";
import { SaathiHelpSheet } from "./saathi-help-sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, ArrowRight, FastForward } from "lucide-react";
import { getStoredProfile, saveStoredProfile } from "@/lib/profile-store";
import { saveLearnerProfileAction } from "@/app/actions/profile";
import type { Database } from "@/lib/supabase/database.types";


export function OnboardingFlow() {
  const router = useRouter();
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OnboardingAnswer>>({
    language: "en",
    basics: { fullName: "", district: "" },
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[language];
  const steps = getOnboardingSteps(language);
  const currentStep = steps[currentIndex];
  const currentAnswer = answers[currentStep?.id] ?? null;

  function handleLanguageChange(lang: SupportedLanguage) {
    setLanguage(lang);
    setAnswers((prev) => ({ ...prev, language: lang }));
  }

  function handleAnswerChange(val: OnboardingAnswer) {
    if (!currentStep) return;
    setAnswers((prev) => ({ ...prev, [currentStep.id]: val }));
    if (currentStep.id === "language" && typeof val === "string") {
      handleLanguageChange(val as SupportedLanguage);
    }
  }

  const isAnswerValid = Boolean(
    currentStep?.isOptional ||
      (currentStep?.type === "basics"
        ? typeof currentAnswer === "object" &&
          currentAnswer !== null &&
          !Array.isArray(currentAnswer) &&
          Boolean((currentAnswer as BasicsAnswer).fullName?.trim()) &&
          Boolean((currentAnswer as BasicsAnswer).district?.trim())
        : currentStep?.type === "multi"
        ? Array.isArray(currentAnswer) && currentAnswer.length > 0
        : currentAnswer !== null && currentAnswer !== ""),
  );

  // Check if mandatory core steps (Language, Basics, Education, Interests) are answered
  const hasCompletedMandatoryCore = Boolean(
    answers.language &&
      typeof answers.basics === "object" &&
      answers.basics !== null &&
      !Array.isArray(answers.basics) &&
      (answers.basics as BasicsAnswer).fullName?.trim() &&
      (answers.basics as BasicsAnswer).district?.trim() &&
      answers.education &&
      Array.isArray(answers.interests) &&
      answers.interests.length > 0
  );

  async function persistAndComplete(redirectToMyPath = false) {
    setIsSubmitting(true);
    const existing = getStoredProfile();
    const basics = typeof answers.basics === "object" && answers.basics !== null && !Array.isArray(answers.basics)
      ? (answers.basics as BasicsAnswer)
      : { fullName: existing.name || "Learner", district: existing.location || "Bihar" };

    const updatedProfile = {
      ...existing,
      name: basics.fullName || existing.name,
      location: basics.district ? `${basics.district}, Bihar` : existing.location,
      education: (answers.education as string) || existing.education,
      interests: Array.isArray(answers.interests)
        ? (answers.interests as string[])
        : existing.interests,
      workPreference: (answers.workPreferences as string) || (answers.workPreference as string) || existing.workPreference,
      goal: (answers.goals as string) || (answers.goal as string) || existing.goal,
      language,
    };

    saveStoredProfile(updatedProfile);

    const qualMap: Record<string, Database["public"]["Enums"]["qualification_level"]> = {
      class_8: "class_8",
      class_10: "class_10",
      class_12: "class_12",
      iti_diploma: "iti_diploma",
      graduate: "graduate",
      other: "other",
    };

    await saveLearnerProfileAction({
      fullName: basics.fullName,
      highestQualification: qualMap[answers.education as string] || "class_10",
      preferredLanguage: language,
      district: basics.district,
      state: "Bihar",
      goal: typeof answers.goals === "string" ? answers.goals : typeof answers.goal === "string" ? answers.goal : undefined,
      workPreference: typeof answers.workPreferences === "string" ? answers.workPreferences : undefined,
    });

    setIsSubmitting(false);
    if (redirectToMyPath) {
      router.push("/my-path");
    } else {
      setIsCompleted(true);
    }
  }

  async function goNext() {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await persistAndComplete(false);
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function handleSaveExit() {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  if (isCompleted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
        <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{t.readyTitle}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.readySubtitle}
          </p>
        </div>

        <div className="w-full space-y-3 pt-4">
          <Link
            href="/my-path"
            className="flex items-center justify-center w-full h-12 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs"
          >
            {t.seeOptions}
          </Link>
          <Link
            href="/counselling"
            className="flex items-center justify-center w-full h-12 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition"
          >
            {t.talkSaathi}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base tracking-tight text-primary">
            {t.appName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {hasCompletedMandatoryCore && currentIndex >= 3 && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => persistAndComplete(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 transition cursor-pointer"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "सीधे कोर्स देखें" : "Skip to My Path"}</span>
            </button>
          )}

          <LanguageSelector
            language={language}
            onSelect={handleLanguageChange}
          />
          <button
            type="button"
            onClick={handleSaveExit}
            className="text-xs text-muted-foreground hover:text-foreground font-medium underline-offset-4 hover:underline"
          >
            {t.saveExit}
          </button>
        </div>
      </header>

      {savedNotice && (
        <div className="my-2 p-2.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          {t.saveNotice}
        </div>
      )}

      {/* Main question card */}
      <main className="flex-1 py-6 flex flex-col justify-center">
        <div className="space-y-6">
          <OnboardingProgress
            currentStep={currentIndex + 1}
            totalSteps={steps.length}
            label={currentStep.label}
          />

          <div className="bg-card border rounded-2xl p-5 shadow-xs">
            <OnboardingQuestion
              step={currentStep}
              value={currentAnswer}
              onChange={handleAnswerChange}
              language={language}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{t.askSaathi}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="pt-4 border-t flex items-center justify-between gap-3 bg-background">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentIndex === 0}
          className="h-11 px-4 text-xs font-semibold gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t.back}</span>
        </Button>

        <div className="flex items-center gap-2">
          {hasCompletedMandatoryCore && currentStep?.isOptional && (
            <Button
              variant="outline"
              onClick={() => persistAndComplete(true)}
              className="h-11 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1 font-semibold"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "कोर्स देखें" : "Skip to My Path"}</span>
            </Button>
          )}

          {currentStep?.isOptional && !currentAnswer && (
            <Button
              variant="ghost"
              onClick={goNext}
              className="h-11 text-xs text-muted-foreground"
            >
              {t.skipLater}
            </Button>
          )}

          <Button
            onClick={goNext}
            disabled={!isAnswerValid || isSubmitting}
            className="h-11 px-5 text-xs font-semibold gap-1.5"
          >
            <span>{t.continue}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </footer>

      <SaathiHelpSheet
        open={isHelpOpen}
        onOpenChange={setIsHelpOpen}
        language={language}
      />
    </div>
  );
}
