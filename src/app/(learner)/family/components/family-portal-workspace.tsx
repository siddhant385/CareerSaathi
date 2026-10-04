"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { seniorCounsellors, parentConcerns } from "./data";
import { ParentSummary } from "./parent-summary";
import { CounsellorConnect } from "./counsellor-connect";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { getSelectedCareer } from "@/lib/career-store";
import { getStoredLanguage } from "@/lib/profile-store";
import type { CareerPath } from "@/app/(learner)/my-path/components/types";
import { Users, ArrowLeft, MessageSquare, CheckCircle2 } from "lucide-react";

export function FamilyPortalWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("hi");
  const [activeCareer, setActiveCareer] = useState<CareerPath | null>(null);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setActiveCareer(getSelectedCareer(getStoredLanguage()));

    const handleCareerChange = () => {
      setActiveCareer(getSelectedCareer(getStoredLanguage()));
    };
    const handleLangChange = () => {
      const l = getStoredLanguage();
      setLanguage(l);
      setActiveCareer(getSelectedCareer(l));
    };

    window.addEventListener("careersaathi_career_changed", handleCareerChange);
    window.addEventListener("careersaathi_language_changed", handleLangChange);
    return () => {
      window.removeEventListener("careersaathi_career_changed", handleCareerChange);
      window.removeEventListener("careersaathi_language_changed", handleLangChange);
    };
  }, []);

  const career = activeCareer || getSelectedCareer(language);

  // Dynamic metrics derived directly from the student's selected career
  const dynamicMetrics = [
    {
      id: "fees",
      icon: "💰",
      labelEn: "Total Course Cost",
      labelHi: "कोर्स का कुल खर्च",
      valueEn: career.totalCost,
      valueHi: career.totalCost,
      detailEn: "Govt subsidized fee (Scholarship options available)",
      detailHi: "सरकारी सब्सिडी फीस (छात्रवृत्ति सुविधा उपलब्ध)",
    },
    {
      id: "salary",
      icon: "💵",
      labelEn: "Starting Monthly Pay",
      labelHi: "शुरुआती मासिक वेतन",
      valueEn: career.startingPay,
      valueHi: career.startingPay,
      detailEn: career.payGrowth,
      detailHi: career.payGrowth,
    },
    {
      id: "distance",
      icon: "📍",
      labelEn: "Nearest Verified Center",
      labelHi: "नजदीकी संस्थान",
      valueEn: `${career.nearestCenter} (${career.travelDistance})`,
      valueHi: `${career.nearestCenter} (${career.travelDistance})`,
      detailEn: "Verified government / NSDC training center",
      detailHi: "मान्यता प्राप्त सरकारी / एनएसडीसी कौशल केंद्र",
    },
    {
      id: "safety",
      icon: "🛡️",
      labelEn: "Safety & Work Environment",
      labelHi: "सुरक्षा एवं कार्य माहौल",
      valueEn: career.safetyRating,
      valueHi: career.safetyRating,
      detailEn: "Regulated workshop hours & safety equipment mandatory",
      detailHi: "नियमित कार्यशाला समय और सुरक्षा नियम लागू",
    },
  ];

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

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition"
          >
            {language === "hi" ? "⚙️ भाषा / प्रोफाइल" : "⚙️ Profile & Lang"}
          </Link>
        </div>
      </header>

      {/* Selected Career Indicator for Parents */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              {language === "hi" ? "विद्यार्थी द्वारा चुना गया करियर" : "Student's Selected Career"}
            </span>
            <h2 className="font-bold text-base text-emerald-950">{career.title}</h2>
          </div>
        </div>

        <Link
          href="/my-path"
          className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition shrink-0"
        >
          {language === "hi" ? "करियर बदलें" : "Change Career"}
        </Link>
      </div>

      {/* 1-Page Summary & Concerns Accordion */}
      <ParentSummary
        metrics={dynamicMetrics}
        concerns={parentConcerns}
        language={language}
        careerTitle={career.title}
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
