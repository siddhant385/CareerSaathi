"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { initialDocuments, admissionTimeline } from "./data";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { LanguageSelector } from "../../onboarding/components/language-selector";
import { getSelectedCareer } from "@/lib/career-store";
import type { CareerPath } from "../../my-path/components/types";
import {
  FileCheck2,
  Calendar,
  Sparkles,
  Upload,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";

export function ApplicationsWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploadedMsg, setUploadedMsg] = useState<string | null>(null);
  const [activeCareer, setActiveCareer] = useState<CareerPath | null>(null);

  useEffect(() => {
    setActiveCareer(getSelectedCareer(language));
    const handleCareerChange = () => {
      setActiveCareer(getSelectedCareer(language));
    };
    window.addEventListener("careersaathi_career_changed", handleCareerChange);
    return () => window.removeEventListener("careersaathi_career_changed", handleCareerChange);
  }, [language]);

  const career = activeCareer || getSelectedCareer(language);

  function handleToggleDoc(id: string) {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: doc.status === "ready" ? "pending" : "ready",
            }
          : doc
      )
    );
  }

  function handleFakeUpload(title: string) {
    setUploadedMsg(
      language === "hi"
        ? `${title} सफलतापूर्वक तैयार चिह्नित किया गया!`
        : `${title} marked as ready!`
    );
    setTimeout(() => setUploadedMsg(null), 3000);
  }

  const readyCount = documents.filter((d) => d.status === "ready").length;

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <FileCheck2 className="h-3.5 w-3.5 text-primary" />
            <span>CareerSaathi · Admissions & Documents</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {language === "hi"
              ? "दाखिला प्रक्रिया एवं जरूरी दस्तावेज"
              : "Application Checklist & Required Documents"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector
            language={language}
            onSelect={(l) => setLanguage(l)}
          />
        </div>
      </header>

      {/* Selected Career Card Banner */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              {language === "hi" ? "दाखिला हेतु चुना गया कोर्स" : "Admission Target Trade"}
            </span>
            <h2 className="font-bold text-base text-emerald-950">{career.title}</h2>
            <p className="text-xs text-emerald-800">
              {career.nearestCenter} · {career.totalCost} · {career.duration}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/my-path"
            className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition"
          >
            {language === "hi" ? "कोर्स बदलें" : "Change Trade"}
          </Link>
          <Link
            href="/family"
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs"
          >
            <Users className="h-3.5 w-3.5" />
            <span>{language === "hi" ? "परिवार सहमति" : "Family Portal"}</span>
          </Link>
        </div>
      </div>

      {/* Progress banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="text-xs font-bold text-primary">
            {language === "hi"
              ? `दस्तावेज तैयारी: ${readyCount} / ${documents.length} तैयार`
              : `Document Readiness: ${readyCount} of ${documents.length} Ready`}
          </span>
          <p className="text-xs text-muted-foreground">
            {language === "hi"
              ? "संस्थान जाने से पहले सभी फोटो और अंकतालिका की जांच कर लें।"
              : "Keep these verified before visiting the government institute."}
          </p>
        </div>

        <Link
          href="/counselling"
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/90 transition shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{language === "hi" ? "साथी से जांच करवाएं" : "Review with Saathi"}</span>
        </Link>
      </div>

      {uploadedMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl text-center animate-in fade-in">
          ✓ {uploadedMsg}
        </div>
      )}

      {/* Document Checklist Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
          <FileCheck2 className="h-4 w-4 text-primary" />
          <span>
            {language === "hi" ? "जरूरी दस्तावेज चेकलिस्ट" : "Required Documents Checklist"}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => {
            const isReady = doc.status === "ready";

            return (
              <div
                key={doc.id}
                className={`bg-card border rounded-2xl p-4 flex flex-col justify-between gap-3 transition shadow-xs ${
                  isReady ? "border-emerald-300 bg-emerald-50/20" : "border-border"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isReady
                          ? "bg-emerald-100 text-emerald-800"
                          : doc.required
                          ? "bg-amber-100 text-amber-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isReady
                        ? language === "hi"
                          ? "तैयार है ✓"
                          : "Ready ✓"
                        : doc.required
                        ? language === "hi"
                          ? "अनिवार्य"
                          : "Required"
                        : language === "hi"
                        ? "वैकल्पिक"
                        : "Optional"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleDoc(doc.id)}
                      className="text-xs text-muted-foreground hover:text-foreground font-semibold underline"
                    >
                      {isReady
                        ? language === "hi"
                          ? "बदलें"
                          : "Change"
                        : language === "hi"
                        ? "तैयार चिह्नित करें"
                        : "Mark Ready"}
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-foreground">
                    {language === "hi" ? doc.titleHi : doc.titleEn}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === "hi" ? doc.descriptionHi : doc.descriptionEn}
                  </p>
                </div>

                <div className="pt-2 border-t flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-muted-foreground truncate">
                    {language === "hi" ? doc.exampleHi : doc.exampleEn}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleFakeUpload(language === "hi" ? doc.titleHi : doc.titleEn)
                    }
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition shrink-0"
                    title="Upload File"
                  >
                    <Upload className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admission Timeline Steps */}
      <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-primary" />
          <span>
            {language === "hi" ? "दाखिला समय-सारणी (Timeline)" : "Admission Roadmap & Deadlines"}
          </span>
        </h3>

        <div className="space-y-3">
          {admissionTimeline.map((step) => {
            const isActive = step.status === "active";

            return (
              <div
                key={step.stepNumber}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                  isActive
                    ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                    : "border-border bg-muted/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {language === "hi" ? step.titleHi : step.titleEn}
                    </h4>
                    <span className="text-xs text-muted-foreground block font-medium">
                      {language === "hi" ? step.dateHi : step.dateEn}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-end">
                  <Link
                    href="/counselling"
                    className="px-3.5 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-1 transition"
                  >
                    <span>{language === "hi" ? step.actionTextHi : step.actionTextEn}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
