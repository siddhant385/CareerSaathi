"use client";

import type { SupportedLanguage } from "./types";
import { translations } from "./i18n";
import { Sparkles, X, ShieldCheck } from "lucide-react";

interface SaathiHelpSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: SupportedLanguage;
}

export function SaathiHelpSheet({
  open,
  onOpenChange,
  language,
}: SaathiHelpSheetProps) {
  if (!open) return null;

  const t = translations[language];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-md bg-background rounded-t-2xl sm:rounded-2xl border shadow-xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Saathi Helper · साथी गाइड</h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t.close}</span>
          </button>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.saathiGreeting}
        </p>

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{t.whatCanSaathiAccess}</span>
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
