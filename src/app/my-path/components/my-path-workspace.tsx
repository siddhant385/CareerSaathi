"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCareerPaths } from "./data";
import type { CareerCategory } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { CareerCard } from "./career-card";
import { CompareDialog } from "./compare-dialog";
import { LanguageSelector } from "../../onboarding/components/language-selector";
import { SaathiHelpSheet } from "../../onboarding/components/saathi-help-sheet";
import { getSelectedCareerId, setSelectedCareerId, getSelectedCareer } from "@/lib/career-store";
import { Sparkles, Users, FileText, Search, X, SlidersHorizontal, CheckCircle2, ArrowRight } from "lucide-react";

export function MyPathWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [selectedCareerId, setCareerIdState] = useState<string>("electrician");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CareerCategory>("all");
  const [compareIds, setCompareIds] = useState<string[]>(["electrician", "auto_technician"]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSaathiOpen, setIsSaathiOpen] = useState(false);

  useEffect(() => {
    setCareerIdState(getSelectedCareerId());
  }, []);

  function handleSelectCareer(id: string) {
    setSelectedCareerId(id);
    setCareerIdState(id);
  }

  const categories: { id: CareerCategory; labelEn: string; labelHi: string; icon: string }[] = [
    { id: "all", labelEn: "All Trades", labelHi: "सभी काम", icon: "✨" },
    { id: "electrical", labelEn: "Electrical & Solar", labelHi: "बिजली / सोलर", icon: "⚡" },
    { id: "auto", labelEn: "Auto & Mechanical", labelHi: "गाड़ी / औजार", icon: "🚗" },
    { id: "digital", labelEn: "Office & Digital", labelHi: "कंप्यूटर / ऑफिस", icon: "💻" },
    { id: "healthcare", labelEn: "Hospital & Health", labelHi: "स्वास्थ्य / केयर", icon: "🏥" },
    { id: "construction", labelEn: "Plumbing / Field", labelHi: "प्लंबिंग / निर्माण", icon: "🔧" },
    { id: "craft", labelEn: "Tailoring & Craft", labelHi: "सिलाई / हस्तकला", icon: "🧵" },
  ];

  const allCareerPaths = getCareerPaths(language);
  const currentActiveCareer = getSelectedCareer(language);

  // Filter paths based on search keyword and category
  const filteredPaths = allCareerPaths.filter((path) => {
    const matchesCategory =
      selectedCategory === "all" || path.category === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      query === "" ||
      path.title.toLowerCase().includes(query) ||
      path.workStyle.toLowerCase().includes(query) ||
      path.whyFit.toLowerCase().includes(query) ||
      path.keySkills.some((s) => s.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const selectedPathsForCompare = allCareerPaths.filter((p) =>
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
              ? "आपके लिए वोकेशनल विकल्प"
              : "Recommended Vocational Career Paths"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector
            language={language}
            onSelect={(l) => setLanguage(l)}
          />
        </div>
      </header>

      {/* Selected Career Quick Action Banner */}
      {currentActiveCareer && (
        <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                {language === "hi" ? "आपका चुना हुआ करियर" : "Your Selected Career"}
              </span>
              <h3 className="font-bold text-base text-emerald-950">
                {currentActiveCareer.title}
              </h3>
              <p className="text-xs text-emerald-800">
                {currentActiveCareer.startingPay} · {currentActiveCareer.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
            <Link
              href="/family"
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <Users className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "परिवार को दिखाएं" : "Show to Parents"}</span>
            </Link>

            <Link
              href="/applications"
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "दस्तावेज चेकलिस्ट" : "Docs Checklist"}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Search and Category Filter Bar */}
      <div className="space-y-3 bg-card border rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              language === "hi"
                ? "काम खोजें (उदा. सोलर, इलेक्ट्रीशियन, नर्सिंग, कंप्यूटर, सिलाई)..."
                : "Search trades (e.g., Solar, Electrician, Nursing, Computer, Tailoring)..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border bg-background text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-ring transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 1-Tap Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1 mr-0.5" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold flex items-center gap-1 transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 border border-border text-foreground hover:bg-muted"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{language === "hi" ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

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

      {/* Recommendations / Search Results Grid */}
      {filteredPaths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPaths.map((path) => (
            <CareerCard
              key={path.id}
              path={path}
              language={language}
              isSelected={path.id === selectedCareerId}
              isSelectedForCompare={compareIds.includes(path.id)}
              onSelectCareer={handleSelectCareer}
              onToggleCompare={toggleCompare}
              onAskSaathi={handleAskSaathi}
            />
          ))}
        </div>
      ) : (
        /* Zero State / Not Found Card */
        <div className="bg-card border rounded-2xl p-8 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">
              {language === "hi" ? "कोई सटीक रास्ता नहीं मिला" : "No exact trade found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {language === "hi"
                ? "कृपया अलग शब्द खोजें या साथी से सलाह लें ताकि आपके लिए सही काम ढूंढा जा सके।"
                : "Try adjusting your search keywords or ask Saathi to re-match based on your skills."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
            >
              {language === "hi" ? "फ़िल्टर हटाएं" : "Clear Filters"}
            </button>
            <button
              type="button"
              onClick={() => setIsSaathiOpen(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "साथी से पूछें" : "Ask Saathi"}</span>
            </button>
          </div>
        </div>
      )}

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
