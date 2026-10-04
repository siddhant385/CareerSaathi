import type { GenerativeWidgetData } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { BadgeCheck, Sparkles, Users, PhoneCall, ExternalLink } from "lucide-react";
import Link from "next/link";

interface GenerativeWidgetProps {
  widget: GenerativeWidgetData;
  language: SupportedLanguage;
}

export function GenerativeWidget({ widget, language }: GenerativeWidgetProps) {
  return (
    <div className="bg-background/90 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-xl space-y-3 w-full max-w-sm pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
      {/* Top Badge & Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {widget.badge || (language === "hi" ? "साथी सुझाव" : "Live Suggestion")}
            </span>
            {widget.verified && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <BadgeCheck className="h-2.5 w-2.5" />
                {language === "hi" ? "सत्यापित" : "Verified"}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-foreground mt-1 leading-snug">
            {widget.title}
          </h4>
          {widget.subtitle && (
            <p className="text-[11px] text-muted-foreground">{widget.subtitle}</p>
          )}
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-1.5 bg-muted/40 p-2.5 rounded-xl border border-border/50 text-xs">
        {widget.metrics.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-[11px]">{m.label}</span>
            <span className="font-bold text-foreground text-xs">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Call to action */}
      {widget.actionText && (
        <div className="pt-1">
          {widget.actionHref ? (
            <Link
              href={widget.actionHref}
              className="w-full py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition"
            >
              <span>{widget.actionText}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            <button
              type="button"
              className="w-full py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition"
            >
              {widget.type === "counsellor_escalation" && <PhoneCall className="h-3 w-3" />}
              {widget.type === "parent_summary" && <Users className="h-3 w-3" />}
              <span>{widget.actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
