import type { DecisionStage } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { CheckCircle2 } from "lucide-react";

interface DecisionProgressProps {
  currentStage: DecisionStage;
  language: SupportedLanguage;
}

const stages: { id: DecisionStage; labelEn: string; labelHi: string }[] = [
  { id: "learning", labelEn: "1. Exploring", labelHi: "1. विकल्प समझना" },
  { id: "comparing", labelEn: "2. Comparing", labelHi: "2. तुलना करना" },
  { id: "discussing", labelEn: "3. Family Discussion", labelHi: "3. परिवार से चर्चा" },
  { id: "chosen", labelEn: "4. Chosen Path", labelHi: "4. सही रास्ता चुनना" },
];

export function DecisionProgress({ currentStage, language }: DecisionProgressProps) {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <div className="bg-card border rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {language === "hi" ? "आपकी निर्णय प्रगति" : "Your Decision Journey"}
        </span>
        <span className="text-xs font-bold text-primary">
          {stages[currentIndex === -1 ? 0 : currentIndex][language === "hi" ? "labelHi" : "labelEn"]}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stages.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.id} className="flex flex-col items-center text-center gap-1.5">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="text-[11px] font-medium leading-tight text-foreground/80 hidden sm:block">
                {language === "hi" ? stage.labelHi : stage.labelEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
