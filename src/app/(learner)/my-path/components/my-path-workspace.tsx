"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCareerPaths } from "./data";
import type { CareerCategory } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { CareerCard } from "./career-card";
import { CompareDialog } from "./compare-dialog";
import { SaathiHelpSheet } from "../../onboarding/components/saathi-help-sheet";
import { getSelectedCareerId, setSelectedCareerId } from "@/lib/career-store";
import { recordLiveEvent } from "@/lib/activity-store";
import { getStoredLanguage } from "@/lib/profile-store";
import {
  Sparkles,
  Users,
  FileText,
  Search,
  X,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function MyPathWorkspace() {
  const router = useRouter();
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [selectedCareerId, setCareerIdState] = useState<string>("electrician");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CareerCategory>("all");
  const [compareIds, setCompareIds] = useState<string[]>(["electrician", "auto_technician"]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSaathiOpen, setIsSaathiOpen] = useState(false);
  const [matchPage, setMatchPage] = useState<number>(1);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setCareerIdState(getSelectedCareerId());

    const onLangChange = () => setLanguage(getStoredLanguage());
    window.addEventListener("careersaathi_language_changed", onLangChange);
    return () => window.removeEventListener("careersaathi_language_changed", onLangChange);
  }, []);

  function handleSelectCareer(id: string) {
    setSelectedCareerId(id);
    setCareerIdState(id);
    const chosen = allCareerPaths.find((p) => p.id === id);
    if (chosen) {
      recordLiveEvent({
        type: "trade_selected",
        studentName: "Student",
        location: "Bihar / Jharkhand",
        tradeTitle: chosen.title,
        details: `Selected from My Path recommendations (${chosen.startingPay})`,
      });
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
  const currentActiveCareer =
    allCareerPaths.find((p) => p.id === selectedCareerId) || allCareerPaths[0];

  // Filter paths based on category on My Path
  const filteredPaths = allCareerPaths.filter((path) => {
    const matchesCategory =
      selectedCategory === "all" || path.category === selectedCategory;
    return matchesCategory;
  });

  // Batching logic: Page 1 = Top 3 Matches, Page 2 = Alternative Matches 4-6
  const totalMatchPages = Math.max(1, Math.ceil(filteredPaths.length / 3));
  const displayedPaths = filteredPaths.slice((matchPage - 1) * 3, matchPage * 3);

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

        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition"
          >
            {language === "hi" ? "🔍 सभी ट्रेड्स डायरेक्टरी" : "🔍 Explore All Trades"}
          </Link>
          <Link
            href="/profile"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition"
          >
            {language === "hi" ? "⚙️ सेटिंग्स" : "⚙️ Settings"}
          </Link>
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

      {/* Search and Category Filter Bar with Direct Explore Redirection */}
      <div className="space-y-3 bg-card border rounded-2xl p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                language === "hi"
                  ? "सभी 30+ सरकारी ट्रेड्स खोजें (उदा. सोलर, वेल्डर, फिटर, एसी, सिलाई)..."
                  : "Search all 30+ Govt ITI trades (e.g. Solar, Welder, Fitter, RAC, Tailoring)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl border bg-background text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-ring transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="h-11 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === "hi" ? "डायरेक्टरी खोजें" : "Explore Search"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* 1-Tap Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1 mr-0.5" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.id !== "all") {
                    router.push(`/explore?category=${cat.id}`);
                  } else {
                    setSelectedCategory("all");
                    setMatchPage(1);
                  }
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
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
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
          >
            {language === "hi" ? "तुलना देखें →" : "View Comparison →"}
          </button>
        </div>
      )}

      {/* Top Curated Recommendations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>
              {matchPage === 1
                ? language === "hi"
                  ? "आपके लिए शीर्ष 3 सुझाव (बैच 1)"
                  : "Top 3 High-Match Choices (Batch 1)"
                : language === "hi"
                ? "अन्य 3 विकल्प (बैच 2)"
                : "Alternative Recommendations (Batch 2)"}
            </span>
          </h3>

          <Link
            href="/explore"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>{language === "hi" ? "सभी 30+ ट्रेड्स देखें →" : "Browse all 30+ trades →"}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedPaths.map((path) => (
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

        {/* 2-Batch Progressive Pagination Controls */}
        {totalMatchPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border shadow-xs text-xs">
            <span className="text-muted-foreground">
              {language === "hi"
                ? `सुझाव समूह: ${matchPage} of ${totalMatchPages}`
                : `Recommendation Batch: ${matchPage} of ${totalMatchPages}`}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMatchPage((prev) => Math.max(1, prev - 1))}
                disabled={matchPage === 1}
                className="px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted font-semibold transition disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{language === "hi" ? "शीर्ष 3 देखें" : "Top 3 Matches"}</span>
              </button>

              <button
                type="button"
                onClick={() => setMatchPage((prev) => Math.min(totalMatchPages, prev + 1))}
                disabled={matchPage === totalMatchPages}
                className="px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted font-semibold transition disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              >
                <span>{language === "hi" ? "अगले 3 विकल्प" : "Next 3 Matches"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <Link
                href="/explore"
                className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition shadow-xs flex items-center gap-1"
              >
                <span>{language === "hi" ? "सभी देखें" : "View All"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
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
