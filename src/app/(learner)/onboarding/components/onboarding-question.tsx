"use client";

import type {
  ChoiceOption,
  OnboardingAnswer,
  OnboardingStep,
  SupportedLanguage,
  BasicsAnswer,
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

      {step.type === "basics" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {language === "hi" ? "आपका पूरा नाम" : "Full Name"}
            </label>
            <input
              type="text"
              placeholder={language === "hi" ? "उदा. राहुल कुमार" : "e.g., Rahul Kumar"}
              value={typeof value === "object" && value && !Array.isArray(value) ? (value as BasicsAnswer).fullName || "" : ""}
              onChange={(e) => {
                const prev = typeof value === "object" && value && !Array.isArray(value) ? (value as BasicsAnswer) : { fullName: "", phone: "", district: "" };
                onChange({ ...prev, fullName: e.target.value });
              }}
              className="w-full h-12 px-4 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-ring transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {language === "hi" ? "मोबाइल नंबर (10 अंक)" : "Mobile Number (10 digits)"}
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder={language === "hi" ? "9876543210" : "9876543210"}
              value={typeof value === "object" && value && !Array.isArray(value) ? (value as BasicsAnswer).phone || "" : ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                const prev = typeof value === "object" && value && !Array.isArray(value) ? (value as BasicsAnswer) : { fullName: "", phone: "", district: "" };
                onChange({ ...prev, phone: digits });
              }}
              className="w-full h-12 px-4 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-ring transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {language === "hi" ? "गृह जिला (District)" : "Home District"}
            </label>
            <input
              type="text"
              placeholder={language === "hi" ? "उदा. पटना, गया, मुजफ्फरपुर" : "e.g., Patna, Gaya, Muzaffarpur"}
              value={typeof value === "object" && value && !Array.isArray(value) ? (value as BasicsAnswer).district || "" : ""}
              onChange={(e) => {
                const prev = typeof value === "object" && value && !Array.isArray(value) ? (value as BasicsAnswer) : { fullName: "", phone: "", district: "" };
                onChange({ ...prev, district: e.target.value });
              }}
              className="w-full h-12 px-4 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-ring transition"
            />
          </div>
        </div>
      )}

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
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            {step.options.map((option: ChoiceOption) => {
              const isSelected =
                step.type === "single"
                  ? (typeof value === "string" && value.startsWith(option.id)) ||
                    (typeof value === "object" &&
                      value !== null &&
                      !Array.isArray(value) &&
                      (value as { selected?: string }).selected === option.id) ||
                    value === option.id
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

          {/* If user picked other or graduate in education, prompt for degree / prior background */}
          {step.id === "education" &&
            (value === "other" ||
              value === "graduate" ||
              (typeof value === "string" &&
                (value.startsWith("other:") || value.startsWith("graduate:")))) && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-1 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {language === "hi"
                    ? "कृपया अपनी डिग्री या पिछली पढ़ाई का नाम लिखें (उदा. BA, B.Sc, B.Com या अन्य):"
                    : "Please specify your degree or past course (e.g. BA, B.Com, B.Sc or other):"}
                </label>
                <input
                  type="text"
                  placeholder={
                    language === "hi"
                      ? "उदा. BA राजनीति शास्त्र, या B.Com"
                      : "e.g., BA Political Science, or B.Com"
                  }
                  value={
                    typeof value === "string" && value.includes(":")
                      ? value.split(":")[1]
                      : ""
                  }
                  onChange={(e) => {
                    const prefix =
                      typeof value === "string" && value.startsWith("graduate")
                        ? "graduate"
                        : "other";
                    onChange(`${prefix}:${e.target.value}`);
                  }}
                  className="w-full h-11 px-3.5 rounded-xl border bg-background text-xs focus:outline-hidden focus:ring-2 focus:ring-ring transition"
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}
