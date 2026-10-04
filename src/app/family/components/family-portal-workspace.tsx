"use client";

import { useState } from "react";
import Link from "next/link";
import { parentSummaryMetrics, parentConcerns, seniorCounsellors } from "./data";
import { ParentSummary } from "./parent-summary";
import { CounsellorConnect } from "./counsellor-connect";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { LanguageSelector } from "../../onboarding/components/language-selector";
import { Users, ArrowLeft, MessageSquare } from "lucide-react";

export function FamilyPortalWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("hi");

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/my-path"
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
              title="Back to My Path"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>CareerSaathi · Family Portal</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {language === "hi"
              ? "परिवार परामर्श एवं निर्णय कक्ष"
              : "Family Decision & Counselling Room"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector
            language={language}
            onSelect={(l) => setLanguage(l)}
          />
        </div>
      </header>

      {/* 1-Page Summary & Concerns Accordion */}
      <ParentSummary
        metrics={parentSummaryMetrics}
        concerns={parentConcerns}
        language={language}
      />

      {/* Direct Human Counsellor Booking Section */}
      <CounsellorConnect
        counsellors={seniorCounsellors}
        language={language}
      />

      {/* Bottom Nav / Back to AI Counselling */}
      <footer className="pt-4 border-t flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>CareerSaathi © 2026 · AI-Enabled Vocational Guidance</span>
        <Link
          href="/counselling"
          className="font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{language === "hi" ? "साथी एआई से बात करें →" : "Talk to Saathi AI →"}</span>
        </Link>
      </footer>
    </div>
  );
}
