"use client";

import type {
  ChoiceOption,
  OnboardingAnswer,
  OnboardingStep,
  SupportedLanguage,
} from "./types";
import { translations } from "./i18n";
import { Volume2 } from "lucide-react";

interface OnboardingQuestionProps {
  step: OnboardingStep;
  value: OnboardingAnswer;
  onChange: (val: OnboardingAnswer) => void;
  language: SupportedLanguage;
}

export function OnboardingQuestion({
  step,
  value,
  onChange,
  language,
}: OnboardingQuestionProps) {
  const t = translations[language];

  function handleSingleSelect(id: string) {
    onChange(id);
  }

  function handleMultiSelect(id: string) {
    const current = Array.isArray(value) ? [...value] : [];
    const index = current.indexOf(id);

    if (index > -1) {
      current.splice(index, 1);
      onChange(current);
    } else {
      const max = step.maxSelections || 5;
      if (current.length < max) {
        current.push(id);
        onChange(current);
      }
    }
  }

  function handleSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToRead =
        step.listenText || `${step.question}. ${step.whyExplanation}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground leading-snug">
            {step.question}
          </h2>
          <button
            type="button"
            onClick={handleSpeech}
            className="inline-flex items-center gap-1 text-xs text-primary font-medium px-2.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors shrink-0"
            title="Read out loud"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>{t.listen}</span>
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {step.whyExplanation}
        </p>

        {step.type === "multi" && (
          <p className="text-xs font-semibold text-primary">
            {t.maxSelectionsNote} (
            {Array.isArray(value) ? value.length : 0}/{step.maxSelections || 5})
          </p>
        )}
      </div>

      {step.type === "text" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder={
              language === "hi"
                ? "उदा. राहुल कुमार, पटना"
                : "e.g., Rahul Kumar, Patna"
            }
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-ring transition"
          />
        </div>
      )}

      {step.type === "upload" && (
        <div className="space-y-3">
          <div className="border-2 border-dashed rounded-2xl p-6 text-center space-y-3 bg-muted/20">
            <p className="text-xs text-muted-foreground font-medium">
              {language === "hi"
                ? "यहाँ फोटो या पीडीएफ अपलोड करें"
                : "Attach photo or PDF here"}
            </p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onChange(e.target.files[0].name);
                }
              }}
              className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
            />
          </div>
          {typeof value === "string" && value && (
            <p className="text-xs text-emerald-600 font-medium">✓ {value}</p>
          )}
        </div>
      )}

      {(step.type === "single" || step.type === "multi") && step.options && (
        <div className="grid grid-cols-1 gap-2.5">
          {step.options.map((option: ChoiceOption) => {
            const isSelected =
              step.type === "single"
                ? value === option.id
                : Array.isArray(value) && value.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  step.type === "single"
                    ? handleSingleSelect(option.id)
                    : handleMultiSelect(option.id)
                }
                className={`w-full min-h-[52px] p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 font-medium ring-1 ring-primary"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-sm block">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground block">
                      {option.description}
                    </span>
                  )}
                </div>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
