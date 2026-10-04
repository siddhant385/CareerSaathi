import type { CareerPath } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { X, IndianRupee, Clock, MapPin, Shield, TrendingUp } from "lucide-react";

interface CompareDialogProps {
  open: boolean;
  onClose: () => void;
  paths: CareerPath[];
  language: SupportedLanguage;
}

export function CompareDialog({
  open,
  onClose,
  paths,
  language,
}: CompareDialogProps) {
  if (!open || paths.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="font-bold text-base text-foreground">
              {language === "hi"
                ? "आमने-सामने तुलना (Side-by-Side Comparison)"
                : "Compare Career Options Side-by-Side"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {language === "hi"
                ? "परिवार के साथ मिलकर सही रास्ता चुनने के लिए सभी बिंदु देखें।"
                : "Review verified data points with your family to choose the best step."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison grid */}
        <div className="flex-1 overflow-x-auto p-4">
          <div className="grid grid-flow-col auto-cols-[280px] sm:auto-cols-[1fr] gap-4 min-w-[560px]">
            {paths.map((p) => (
              <div
                key={p.id}
                className="bg-card border rounded-xl p-4 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="border-b pb-2">
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {p.matchScore}% {language === "hi" ? "सुझाव मेल" : "Match"}
                    </span>
                    <h3 className="font-bold text-base mt-1.5">{p.title}</h3>
                  </div>

                  {/* Starting Pay & Growth */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{language === "hi" ? "वेतन और विकास" : "Pay & Growth"}</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                      {p.startingPay}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      <TrendingUp className="h-3 w-3 inline mr-1 text-primary" />
                      {p.payGrowth}
                    </p>
                  </div>

                  {/* Duration & Cost */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{language === "hi" ? "समय और खर्च" : "Duration & Cost"}</span>
                    </div>
                    <p className="text-xs text-foreground bg-muted/40 p-2 rounded-lg font-medium">
                      {p.duration}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{p.totalCost}</p>
                  </div>

                  {/* Location & Centers */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{language === "hi" ? "निकटतम संस्थान" : "Nearest Institute"}</span>
                    </div>
                    <p className="text-xs text-foreground font-medium">{p.nearestCenter}</p>
                    <p className="text-[11px] text-muted-foreground">{p.travelDistance}</p>
                  </div>

                  {/* Safety */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <span>{language === "hi" ? "काम का माहौल एवं सुरक्षा" : "Safety & Hours"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {p.safetyRating}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-[11px] font-semibold text-emerald-700 block">
                    ✓ {p.questionsAnswered}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            {language === "hi" ? "तुलना बंद करें" : "Close Comparison"}
          </button>
        </div>
      </div>
    </div>
  );
}
