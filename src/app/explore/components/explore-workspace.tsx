"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllTrades, type ExtendedTrade } from "./data";
import type { CareerCategory } from "../../my-path/components/types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { getStoredLanguage } from "@/lib/profile-store";
import { getSelectedCareerId, setSelectedCareerId } from "@/lib/career-store";
import {
  Search,
  X,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  Volume2,
  CheckCircle2,
  BadgeCheck,
  IndianRupee,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("category") as CareerCategory) || "all";

  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [selectedCareerId, setCareerIdState] = useState<string>("electrician");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CareerCategory>(initialCategory);
  const [selectedQualification, setSelectedQualification] = useState<string>("all");
  const [selectedSuccessToast, setSelectedSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setCareerIdState(getSelectedCareerId());

    const onLangChange = () => setLanguage(getStoredLanguage());
    const onCareerChange = () => setCareerIdState(getSelectedCareerId());

    window.addEventListener("careersaathi_language_changed", onLangChange);
    window.addEventListener("careersaathi_career_changed", onCareerChange);

    return () => {
      window.removeEventListener("careersaathi_language_changed", onLangChange);
      window.removeEventListener("careersaathi_career_changed", onCareerChange);
    };
  }, []);

  // Sync state if URL search query changes
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);
    const cat = searchParams.get("category") as CareerCategory | null;
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  function handleSelectTrade(trade: ExtendedTrade) {
    setSelectedCareerId(trade.id);
    setCareerIdState(trade.id);
    setSelectedSuccessToast(
      language === "hi"
        ? `"${trade.title}" को आपका मुख्य करियर चुना गया! अब यह फैमिली पोर्टल एवं दाखिला चेकलिस्ट में दिखेगा।`
        : `"${trade.title}" selected as your active career! Updated in Family Portal & Applications.`
    );
    setTimeout(() => setSelectedSuccessToast(null), 4000);
  }

  function handleListen(trade: ExtendedTrade) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text =
        language === "hi"
          ? `${trade.title}। न्यूनतम योग्यता: ${trade.eligibilityHi}। सरकारी फीस: ${trade.govtFee}। शुरुआती वेतन: ${trade.startingPay}। ${trade.descriptionHi}`
          : `${trade.title}. Eligibility: ${trade.eligibilityEn}. Government fee: ${trade.govtFee}. Starting salary: ${trade.startingPay}. ${trade.descriptionEn}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  }

  const allTrades = getAllTrades(language);

  const categories: { id: CareerCategory; labelEn: string; labelHi: string; icon: string }[] = [
    { id: "all", labelEn: "All Trades", labelHi: "सभी काम", icon: "✨" },
    { id: "electrical", labelEn: "Electrical & Solar", labelHi: "बिजली / सोलर", icon: "⚡" },
    { id: "auto", labelEn: "Auto & Mechanical", labelHi: "गाड़ी / औजार", icon: "🚗" },
    { id: "digital", labelEn: "Office & Digital", labelHi: "कंप्यूटर / ऑफिस", icon: "💻" },
    { id: "healthcare", labelEn: "Hospital & Health", labelHi: "स्वास्थ्य / केयर", icon: "🏥" },
    { id: "construction", labelEn: "Plumbing / Field", labelHi: "प्लंबिंग / निर्माण", icon: "🔧" },
    { id: "craft", labelEn: "Tailoring & Craft", labelHi: "सिलाई / हस्तकला", icon: "🧵" },
  ];

  const qualifications = [
    { id: "all", labelEn: "All Qualifications", labelHi: "सभी योग्यताएं" },
    { id: "class_8", labelEn: "8th Pass", labelHi: "8वीं पास" },
    { id: "class_10", labelEn: "10th Pass", labelHi: "10वीं पास" },
    { id: "class_12", labelEn: "12th Pass", labelHi: "12वीं पास" },
  ];

  const filteredTrades = allTrades.filter((trade) => {
    const matchesCategory =
      selectedCategory === "all" || trade.category === selectedCategory;

    const matchesQual =
      selectedQualification === "all" ||
      trade.minQualification === selectedQualification;

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      query === "" ||
      trade.title.toLowerCase().includes(query) ||
      trade.descriptionEn.toLowerCase().includes(query) ||
      trade.descriptionHi.toLowerCase().includes(query) ||
      trade.eligibilityEn.toLowerCase().includes(query) ||
      trade.eligibilityHi.toLowerCase().includes(query) ||
      trade.keySkills.some((s) => s.toLowerCase().includes(query));

    return matchesCategory && matchesQual && matchesQuery;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>CareerSaathi · Vocational Trades Directory</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {language === "hi"
              ? "सरकारी आईटीआई एवं वोकेशनल ट्रेड्स डायरेक्टरी"
              : "Explore Government ITI & Vocational Trades"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === "hi"
              ? "सभी प्रमाणित वोकेशनल कोर्स, सरकारी बनाम प्राइवेट फीस और सैलरी की पूरी सूची।"
              : "Compare all verified technical trades, government fee subsidies, and salary potential."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-path"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition shrink-0"
          >
            {language === "hi" ? "← माय पाथ (सुझाव)" : "← Back to My Path"}
          </Link>
          <Link
            href="/profile"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition shrink-0"
          >
            {language === "hi" ? "⚙️ सेटिंग्स" : "⚙️ Settings"}
          </Link>
        </div>
      </header>

      {/* Success Notification Banner */}
      {selectedSuccessToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{selectedSuccessToast}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/family"
              className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 transition"
            >
              {language === "hi" ? "परिवार को दिखाएं →" : "Family Portal →"}
            </Link>
          </div>
        </div>
      )}

      {/* Search & Filter Hub */}
      <div className="bg-card border rounded-2xl p-4 shadow-xs space-y-3.5">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              language === "hi"
                ? "काम या कोर्स खोजें (उदा. सोलर, इलेक्ट्रीशियन, वेल्डर, फिटर, एसी मैकेनिक, सिलाई)..."
                : "Search any trade (e.g. Solar, Welder, Fitter, RAC Mechanic, AC, Tailoring, Nursing)..."
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

        {/* Qualification Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1 mr-0.5" />
          <span className="text-muted-foreground font-semibold shrink-0 text-[11px]">
            {language === "hi" ? "योग्यता:" : "Eligibility:"}
          </span>
          {qualifications.map((q) => {
            const isActive = selectedQualification === q.id;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setSelectedQualification(q.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 border border-border text-foreground hover:bg-muted"
                }`}
              >
                {language === "hi" ? q.labelHi : q.labelEn}
              </button>
            );
          })}
        </div>

        {/* Sector Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-border/60">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1 mr-0.5" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
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

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          {language === "hi"
            ? `${filteredTrades.length} वोकेशनल ट्रेड्स उपलब्ध`
            : `Showing ${filteredTrades.length} vocational trades`}
        </span>
        {(searchQuery || selectedCategory !== "all" || selectedQualification !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedQualification("all");
            }}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            {language === "hi" ? "सारे फ़िल्टर हटाएं" : "Reset all filters"}
          </button>
        )}
      </div>

      {/* Trade Directory Grid */}
      {filteredTrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrades.map((trade) => {
            const isSelected = trade.id === selectedCareerId;

            return (
              <div
                key={trade.id}
                className={`bg-card border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10"
                    : "hover:border-primary/40"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {language === "hi" ? trade.eligibilityHi : trade.eligibilityEn}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {language === "hi" ? "सक्रिय रास्ता ✓" : "Active Choice ✓"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {trade.evidenceLevel === "verified" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                          <BadgeCheck className="h-3 w-3" />
                          <span>{language === "hi" ? "NCVT मान्य" : "NCVT"}</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleListen(trade)}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-primary transition cursor-pointer"
                        title="Listen Audio"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Duration */}
                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {trade.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary" />
                        <span>{trade.duration}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{language === "hi" ? trade.centerTypeHi : trade.centerTypeEn}</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing Comparison (Govt Subsidized vs Private) */}
                  <div className="bg-muted/30 border rounded-xl p-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {language === "hi" ? "सरकारी संस्थान फीस:" : "Govt ITI Fee:"}
                      </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                        {trade.govtFee}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{language === "hi" ? "निजी (प्राइवेट) फीस:" : "Private Fee:"}</span>
                      <span className="line-through">{trade.privateFee}</span>
                    </div>
                  </div>

                  {/* Salary & Growth */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-muted/20 border space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 font-medium">
                        <IndianRupee className="h-3 w-3" />
                        <span>{language === "hi" ? "शुरुआती वेतन" : "Starting Pay"}</span>
                      </span>
                      <span className="font-bold text-foreground text-[11px] block truncate">
                        {trade.startingPay}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-muted/20 border space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 font-medium">
                        <TrendingUp className="h-3 w-3" />
                        <span>{language === "hi" ? "2-वर्ष वृद्धि" : "2-Yr Growth"}</span>
                      </span>
                      <span className="font-bold text-foreground text-[11px] block truncate">
                        {trade.payGrowth}
                      </span>
                    </div>
                  </div>

                  {/* Trade Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === "hi" ? trade.descriptionHi : trade.descriptionEn}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {trade.keySkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTrade(trade)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {isSelected
                        ? language === "hi"
                          ? "यह आपका चुना हुआ करियर है ✓"
                          : "Active Career Choice ✓"
                        : language === "hi"
                        ? "⭐ इसे अपना करियर चुनें"
                        : "⭐ Select as My Career"}
                    </span>
                  </button>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Link
                      href="/family"
                      className="flex-1 py-1.5 px-2 rounded-xl border border-border text-center text-[11px] font-semibold hover:bg-muted text-foreground transition"
                    >
                      {language === "hi" ? "परिवार सारांश" : "Family Portal"}
                    </Link>
                    <Link
                      href="/applications"
                      className="flex-1 py-1.5 px-2 rounded-xl border border-border text-center text-[11px] font-semibold hover:bg-muted text-foreground transition"
                    >
                      {language === "hi" ? "दाखिला ब्यौरा" : "Apply Details"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-card border rounded-2xl p-8 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">
              {language === "hi" ? "कोई ट्रेड नहीं मिला" : "No matching trade found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {language === "hi"
                ? "कृपया अलग शब्द खोजें या योग्यता फ़िल्टर बदलकर दोबारा प्रयास करें।"
                : "Try searching with a different trade name or reset the qualification filter."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedQualification("all");
            }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition cursor-pointer"
          >
            {language === "hi" ? "सारे फ़िल्टर हटाएं" : "Clear All Filters"}
          </button>
        </div>
      )}
    </div>
  );
}

export function ExploreWorkspace() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-muted-foreground">Loading directory...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
