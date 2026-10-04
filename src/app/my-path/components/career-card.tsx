import type { CareerPath } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { BadgeCheck, Sparkles, MapPin, IndianRupee, Clock, Volume2 } from "lucide-react";

interface CareerCardProps {
  path: CareerPath;
  language: SupportedLanguage;
  isSelectedForCompare: boolean;
  onToggleCompare: (id: string) => void;
  onAskSaathi: (path: CareerPath) => void;
}

export function CareerCard({
  path,
  language,
  isSelectedForCompare,
  onToggleCompare,
  onAskSaathi,
}: CareerCardProps) {
  function handleListen() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = `${path.title}. ${path.startingPay}. ${path.whyFit}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-primary/40 transition">
      <div className="space-y-3">
        {/* Top match score and evidence badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {path.matchScore}% {language === "hi" ? "सुझाव मेल" : "Match"}
          </span>

          <div className="flex items-center gap-2">
            {path.evidenceLevel === "verified" && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <BadgeCheck className="h-3 w-3" />
                {language === "hi" ? "सत्यापित डेटा" : "Verified Data"}
              </span>
            )}
            <button
              type="button"
              onClick={handleListen}
              className="p-1.5 rounded-full text-muted-foreground hover:text-primary transition"
              title="Read out loud"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title and Style */}
        <div>
          <h3 className="text-lg font-bold text-foreground leading-snug">
            {path.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{path.workStyle}</p>
        </div>

        {/* Key metrics grid for parents & students */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-muted/30 border rounded-xl p-2.5 space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground font-medium text-[11px]">
              <IndianRupee className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "शुरुआती मासिक वेतन" : "Starting Pay"}</span>
            </div>
            <p className="font-bold text-foreground text-xs">{path.startingPay}</p>
          </div>

          <div className="bg-muted/30 border rounded-xl p-2.5 space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground font-medium text-[11px]">
              <Clock className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "कोर्स समय" : "Duration"}</span>
            </div>
            <p className="font-bold text-foreground text-xs">{path.duration}</p>
          </div>
        </div>

        {/* Local verified center */}
        <div className="flex items-start gap-2 text-xs bg-muted/20 border rounded-xl p-2.5">
          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">{path.nearestCenter}</span>
            <span className="text-muted-foreground text-[11px]">
              {path.travelDistance} ({path.verifiedCentresCount} {language === "hi" ? "केंद्र उपलब्ध" : "centers near you"})
            </span>
          </div>
        </div>

        {/* Why this fits */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">
            {language === "hi" ? "यह आपके लिए क्यों सही है: " : "Why it fits you: "}
          </span>
          {path.whyFit}
        </p>
      </div>

      {/* Action buttons */}
      <div className="pt-3 border-t flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggleCompare(path.id)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            isSelectedForCompare
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:bg-muted/40"
          }`}
        >
          {isSelectedForCompare
            ? language === "hi"
              ? "तुलना में चुना गया ✓"
              : "Comparing ✓"
            : language === "hi"
            ? "+ तुलना करें"
            : "+ Compare"}
        </button>

        <button
          type="button"
          onClick={() => onAskSaathi(path)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{language === "hi" ? "साथी से पूछें" : "Ask Saathi"}</span>
        </button>
      </div>
    </div>
  );
}
