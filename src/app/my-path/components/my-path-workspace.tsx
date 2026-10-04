"use client";

import { useState } from "react";
import Link from "next/link";
import { getCareerPaths } from "./data";
import type { DecisionStage } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { CareerCard } from "./career-card";
import { CompareDialog } from "./compare-dialog";
import { DecisionProgress } from "./decision-progress";
import { LanguageSelector } from "../../onboarding/components/language-selector";
import { SaathiHelpSheet } from "../../onboarding/components/saathi-help-sheet";
import { Sparkles, Users, MessageSquare } from "lucide-react";

export function MyPathWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [compareIds, setCompareIds] = useState<string[]>(["electrician", "auto_technician"]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSaathiOpen, setIsSaathiOpen] = useState(false);
  const [decisionStage] = useState<DecisionStage>("comparing");

  const careerPaths = getCareerPaths(language);
  const selectedPathsForCompare = careerPaths.filter((p) =>
    compareIds.includes(p.id)
  );

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleAskSaathi() {
    setIsSaathiOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            CareerSaathi · My Path
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {language === "hi"
              ? "आपके लिए सर्वश्रेष्ठ 3 वोकेशनल रास्ते"
              : "Top 3 Vocational Career Paths For You"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector
            language={language}
            onSelect={(l) => setLanguage(l)}
          />
        </div>
      </header>

      {/* Decision stage tracker */}
      <DecisionProgress currentStage={decisionStage} language={language} />

      {/* Action banner to compare */}
      {compareIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              {language === "hi"
                ? `${compareIds.length} रास्ते तुलना के लिए चुने गए`
                : `${compareIds.length} career paths selected to compare`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-xs"
          >
            {language === "hi" ? "तुलना देखें →" : "View Comparison →"}
          </button>
        </div>
      )}

      {/* 3 Career Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {careerPaths.map((path) => (
          <CareerCard
            key={path.id}
            path={path}
            language={language}
            isSelectedForCompare={compareIds.includes(path.id)}
            onToggleCompare={toggleCompare}
            onAskSaathi={handleAskSaathi}
          />
        ))}
      </div>

      {/* Family & Counselling quick bar */}
      <div className="bg-muted/30 border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {language === "hi"
                ? "माता-पिता और परिवार के साथ साझा करें"
                : "Discuss with Family on WhatsApp / SMS"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {language === "hi"
                ? "सरल भाषा में कमाई, सुरक्षा और फीस का ब्यौरा भेजें।"
                : "Send a clean, jargon-free summary card tailored for parents."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/counselling"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{language === "hi" ? "साथी काउंसलर" : "Saathi AI"}</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsSaathiOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{language === "hi" ? "सलाह लें" : "Get Advice"}</span>
          </button>
        </div>
      </div>

      {/* Side-by-side modal */}
      <CompareDialog
        open={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        paths={selectedPathsForCompare}
        language={language}
      />

      {/* Saathi Helper Drawer */}
      <SaathiHelpSheet
        open={isSaathiOpen}
        onOpenChange={setIsSaathiOpen}
        language={language}
      />
    </div>
  );
}
