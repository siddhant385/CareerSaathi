"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  initialSentimentMetrics,
  initialFamilyLeads,
  initialEditableTrades,
} from "./data";
import type {
  FamilyCallbackLead,
  SentimentLevel,
  TradeEditorItem,
} from "./types";
import { getStoredLanguage } from "@/lib/profile-store";
import { getStoredLiveEvents, type LiveActivityEvent } from "@/lib/activity-store";
import { getSelectedCareer } from "@/lib/career-store";
import type { SupportedLanguage } from "../../onboarding/components/types";
import {
  Users,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Search,
  Filter,
  Save,
  Edit3,
  TrendingUp,
  AlertCircle,
  FileText,
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
} from "lucide-react";

export function AdminWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [activeTab, setActiveTab] = useState<"callbacks" | "sentiment" | "trades" | "live_feed">("callbacks");
  const [leads, setLeads] = useState<FamilyCallbackLead[]>(initialFamilyLeads);
  const [trades, setTrades] = useState<TradeEditorItem[]>(initialEditableTrades);
  const [liveEvents, setLiveEvents] = useState<LiveActivityEvent[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialFamilyLeads[0]?.id || "");
  const [filterSentiment, setFilterSentiment] = useState<string>("all");
  const [searchLeadQuery, setSearchLeadQuery] = useState("");

  // Counsellor form state for the active selected lead
  const [callNotes, setCallNotes] = useState("");
  const [callResolutionStatus, setCallResolutionStatus] = useState<FamilyCallbackLead["status"]>("in_progress");
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Trade editor state
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
  const [tradeForm, setTradeForm] = useState<TradeEditorItem | null>(null);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setLiveEvents(getStoredLiveEvents());

    const onLangChange = () => setLanguage(getStoredLanguage());
    const onLiveEvent = () => setLiveEvents(getStoredLiveEvents());

    window.addEventListener("careersaathi_language_changed", onLangChange);
    window.addEventListener("careersaathi_live_event_logged", onLiveEvent);

    return () => {
      window.removeEventListener("careersaathi_language_changed", onLangChange);
      window.removeEventListener("careersaathi_live_event_logged", onLiveEvent);
    };
  }, []);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  useEffect(() => {
    if (selectedLead) {
      setCallNotes(selectedLead.counsellorNotes || "");
      setCallResolutionStatus(selectedLead.status);
    }
  }, [selectedLeadId, leads]);

  function handleSaveLeadCall() {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLeadId
          ? {
              ...l,
              status: callResolutionStatus,
              counsellorNotes: callNotes,
              sentimentLevel: callResolutionStatus === "resolved" ? "aligned" : l.sentimentLevel,
            }
          : l
      )
    );
    setActionSuccessToast(
      language === "hi"
        ? `${selectedLead?.parentName} के साथ बातचीत का ब्यौरा सुरक्षित कर लिया गया!`
        : `Call notes for ${selectedLead?.parentName} saved successfully!`
    );
    setTimeout(() => setActionSuccessToast(null), 3500);
  }

  function handleEditTrade(trade: TradeEditorItem) {
    setEditingTradeId(trade.id);
    setTradeForm({ ...trade });
  }

  function handleSaveTrade() {
    if (!tradeForm) return;
    setTrades((prev) => prev.map((t) => (t.id === tradeForm.id ? tradeForm : t)));
    setEditingTradeId(null);
    setActionSuccessToast(
      language === "hi"
        ? `"${tradeForm.title}" के स्थानीय आंकड़े और फीस अपडेट कर दिए गए!`
        : `Verified data for "${tradeForm.title}" updated successfully!`
    );
    setTimeout(() => setActionSuccessToast(null), 3500);
  }

  const filteredLeads = leads.filter((l) => {
    const matchesSentiment =
      filterSentiment === "all" || l.sentimentLevel === filterSentiment;
    const q = searchLeadQuery.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      l.studentName.toLowerCase().includes(q) ||
      l.parentName.toLowerCase().includes(q) ||
      l.targetTrade.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.preferredDialect.toLowerCase().includes(q);

    return matchesSentiment && matchesQuery;
  });

  const getSentimentBadge = (level: SentimentLevel) => {
    switch (level) {
      case "aligned":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            {language === "hi" ? "सहमति तैयार ✓" : "Aligned ✓"}
          </span>
        );
      case "hesitant":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {language === "hi" ? "संशय / हिचकिचाहट" : "Hesitant"}
          </span>
        );
      case "conflicted":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            {language === "hi" ? "गंभीर आपत्ति" : "Conflicted"}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {level}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>CareerSaathi · Senior Counsellor & Admin Portal</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {language === "hi"
              ? "पारिवारिक परामर्श एवं निर्णय डैशबोर्ड"
              : "Family Sentiment & Counsellor Operations"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === "hi"
              ? "माता-पिता के संशय निवारण, क्षेत्रीय बोली सहायता और सत्यापित वोकेशनल डेटा प्रबंधन।"
              : "Track household resistance, resolve parent hesitations with dialect matching, and update verified trade facts."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-path"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition"
          >
            {language === "hi" ? "← छात्र पोर्टल देखें" : "← Student View"}
          </Link>
          <Link
            href="/profile"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition"
          >
            {language === "hi" ? "⚙️ सेटिंग्स" : "⚙️ Settings"}
          </Link>
        </div>
      </header>

      {/* Action Success Toast */}
      {actionSuccessToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Top Overview Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {initialSentimentMetrics.map((m, idx) => (
          <div key={idx} className="bg-card border rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-xs text-muted-foreground font-medium block">
              {m.title}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground block">
              {m.value}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b pb-1 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("callbacks")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "callbacks"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          <span>
            {language === "hi" ? "पेरेंट कॉलबैक कतार (Leads)" : "Parent Callback Queue"}
          </span>
          <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {leads.filter((l) => l.status === "pending").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sentiment")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "sentiment"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>
            {language === "hi" ? "पारिवारिक संशय विश्लेषण (Sentiment)" : "Family Resistance Insights"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trades")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "trades"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Edit3 className="h-4 w-4" />
          <span>
            {language === "hi" ? "ट्रेड व फीस एडिटर (Content Form)" : "Verified Trade Data Editor"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("live_feed")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "live_feed"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {language === "hi" ? "लाइव यूजर एक्टिविटी (Realtime Feed)" : "Live User Activity Feed"}
          </span>
          {liveEvents.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] animate-pulse">
              {liveEvents.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PARENT CALLBACK QUEUE & INTERACTIVE COUNSELLOR ACTION FORM */}
      {activeTab === "callbacks" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Callback Lead Queue List */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search & Filter Bar */}
            <div className="bg-card border rounded-2xl p-3 shadow-xs space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={
                    language === "hi"
                      ? "परिवार, छात्र या जिला खोजें..."
                      : "Search family, student, dialect..."
                  }
                  value={searchLeadQuery}
                  onChange={(e) => setSearchLeadQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border bg-background text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1 text-[11px] overflow-x-auto">
                <Filter className="h-3 w-3 text-muted-foreground shrink-0" />
                {["all", "hesitant", "conflicted", "aligned"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterSentiment(s)}
                    className={`px-2 py-0.5 rounded-lg capitalize whitespace-nowrap transition cursor-pointer ${
                      filterSentiment === s
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredLeads.map((lead) => {
                const isSelected = lead.id === selectedLeadId;

                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition space-y-2 ${
                      isSelected
                        ? "bg-primary/5 border-primary ring-1 ring-primary/40 shadow-xs"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground text-sm">
                        {lead.parentName}
                      </span>
                      {getSentimentBadge(lead.sentimentLevel)}
                    </div>

                    <div className="text-muted-foreground space-y-0.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span>
                          {language === "hi" ? "विद्यार्थी:" : "Student:"}{" "}
                          <strong className="text-foreground">{lead.studentName}</strong>
                        </span>
                        <span>{lead.requestedAt}</span>
                      </div>
                      <p className="truncate text-foreground font-medium">
                        🎯 {lead.targetTrade}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                          🗣️ {lead.preferredDialect}
                        </span>
                        <span className="text-muted-foreground">📍 {lead.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Counsellor Pre-Call Brief & Resolution Form */}
          <div className="lg:col-span-7 space-y-4">
            {selectedLead ? (
              <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-5">
                {/* Lead Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">
                        {selectedLead.parentName}
                      </h3>
                      {getSentimentBadge(selectedLead.sentimentLevel)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === "hi" ? "छात्र:" : "Student:"} {selectedLead.studentName} ·{" "}
                      {selectedLead.location}
                    </p>
                  </div>

                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>{language === "hi" ? "कॉल करें:" : "Direct Call:"} {selectedLead.phone}</span>
                  </a>
                </div>

                {/* Pre-Call Intelligence Brief */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                    {language === "hi" ? "कॉलबैक से पहले जरूरी जानकारी" : "Pre-Call Intelligence Brief"}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-muted/30 border rounded-xl space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        {language === "hi" ? "लक्षित वोकेशनल ट्रेड:" : "Target Vocational Trade:"}
                      </span>
                      <strong className="text-foreground text-xs block">
                        {selectedLead.targetTrade}
                      </strong>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                        {selectedLead.govtFee}
                      </span>
                    </div>

                    <div className="p-3 bg-muted/30 border rounded-xl space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        {language === "hi" ? "पसंदीदा संवाद बोली:" : "Dialect Match:"}
                      </span>
                      <strong className="text-foreground text-xs block">
                        🗣️ {selectedLead.preferredDialect}
                      </strong>
                      <span className="text-[10px] text-muted-foreground">
                        Assign counsellor fluent in this regional dialect
                      </span>
                    </div>
                  </div>

                  {/* Primary Resistance */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                      <span>{language === "hi" ? "माता-पिता की मुख्य चिंता (Resistance):" : "Core Parental Objection / Hesitation:"}</span>
                    </span>
                    <p className="text-amber-950 font-medium leading-relaxed">
                      &ldquo;{selectedLead.primaryResistance}&rdquo;
                    </p>
                  </div>

                  {/* AI Snippet */}
                  <div className="p-3 bg-muted/20 border rounded-xl space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>{language === "hi" ? "साथी एआई कॉल बातचीत स्निपेट:" : "AI Conversation Excerpt:"}</span>
                    </span>
                    <p className="text-muted-foreground text-[11px] italic leading-relaxed">
                      &ldquo;{selectedLead.aiTranscriptSnippet}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Counsellor Resolution & Notes Form */}
                <div className="pt-3 border-t space-y-3">
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                    {language === "hi" ? "काउंसलर कॉल रिकॉर्ड फॉर्म" : "Counsellor Call Record & Resolution Form"}
                  </h4>

                  <div className="space-y-2 text-xs">
                    <label className="font-semibold text-foreground block">
                      {language === "hi" ? "कॉल स्थिति अपडेट करें:" : "Update Resolution Status:"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "pending", label: "Pending / लंबित" },
                        { id: "in_progress", label: "In Progress / बातचीत जारी" },
                        { id: "resolved", label: "Resolved (Agreed) / सहमत ✓" },
                        { id: "follow_up_needed", label: "Follow-up / पुनः संपर्क" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setCallResolutionStatus(st.id as FamilyCallbackLead["status"])}
                          className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition cursor-pointer ${
                            callResolutionStatus === st.id
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="font-semibold text-foreground flex items-center justify-between">
                        <span>{language === "hi" ? "काउंसलर परामर्श नोट्स (Parent Call Notes):" : "Counsellor Notes & Next Steps:"}</span>
                        <span className="text-[10px] text-muted-foreground">Internal Log</span>
                      </label>
                      <textarea
                        rows={3}
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                        placeholder={
                          language === "hi"
                            ? "उदा. पिता को सरकारी आईटीआई छात्रवृत्ति प्रक्रिया समझाई। सोमवार को सेंटर विजिट तय किया..."
                            : "e.g., Addressed father's concern on starting pay. Sent WhatsApp brochure. Scheduled ITI campus visit for Monday..."
                        }
                        className="w-full p-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveLeadCall}
                      className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition shadow-xs cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{language === "hi" ? "कॉल रिपोर्ट सुरक्षित करें" : "Save Call Notes & Update Status"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border rounded-2xl">
                Select a lead from the queue to view details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FAMILY RESISTANCE & SENTIMENT ANALYTICS */}
      {activeTab === "sentiment" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resistance Breakdown Card */}
            <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {language === "hi" ? "अवरोध के मुख्य कारण" : "Key Drivers of Family Hesitation"}
                </span>
                <h3 className="font-bold text-base text-foreground">
                  {language === "hi" ? "माता-पिता के प्रमुख संशय" : "Parental Resistance Breakdown"}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: "Course Fees & Net Cost Anxiety", pct: 46, detail: "Resolved when ₹1,500 Govt fee + ₹1k/mo stipend is clarified" },
                  { label: "Social Perception / Job Prestige", pct: 28, detail: "Father fears ITI is low-status; resolved by showing 2-yr growth" },
                  { label: "Travel Distance & Night Shift Safety", pct: 18, detail: "Mother worried about transport; resolved with daytime bus route" },
                  { label: "Course Duration vs Fast Earning", pct: 8, detail: "Needs 6-month short course instead of 2-year ITI" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{item.label}</span>
                      <span className="text-primary">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground block">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Dialect Match Card */}
            <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {language === "hi" ? "क्षेत्रीय भाषा विश्लेषण" : "Dialect Preference Distribution"}
                </span>
                <h3 className="font-bold text-base text-foreground">
                  {language === "hi" ? "परिवारों की प्राथमिक भाषा" : "Spoken Dialects in Counselling Requests"}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { dialect: "Bhojpuri / Hindi", share: "42% of calls", counsellor: "Priya Sharma, Rajeshwar Pandey" },
                  { dialect: "Maithili / Hindi", share: "26% of calls", counsellor: "Rajeshwar Pandey, Amit Jha" },
                  { dialect: "Standard Hindi (खड़ी बोली)", share: "22% of calls", counsellor: "All Senior Staff" },
                  { dialect: "Magahi / Santhali", share: "10% of calls", counsellor: "Anita Soren" },
                ].map((d, idx) => (
                  <div key={idx} className="p-3 bg-muted/20 border rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">{d.dialect}</span>
                      <span className="text-[10px] text-muted-foreground">Assigned: {d.counsellor}</span>
                    </div>
                    <span className="font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {d.share}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Household Decision Alignment Funnel */}
          <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" />
              <span>
                {language === "hi" ? "पारिवारिक निर्णय रूपांतरण फनल" : "Household Decision Conversion Funnel"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-muted/20 border rounded-xl space-y-1">
                <span className="text-muted-foreground block text-[11px]">1. Onboarded Learners</span>
                <span className="text-xl font-bold text-foreground block">1,420</span>
                <span className="text-[10px] text-emerald-700">100% Top of Funnel</span>
              </div>
              <div className="p-4 bg-muted/20 border rounded-xl space-y-1">
                <span className="text-muted-foreground block text-[11px]">2. Family Portal Shared</span>
                <span className="text-xl font-bold text-foreground block">1,180</span>
                <span className="text-[10px] text-emerald-700">83.1% WhatsApp / Audio</span>
              </div>
              <div className="p-4 bg-muted/20 border rounded-xl space-y-1">
                <span className="text-muted-foreground block text-[11px]">3. Counsellor Callback</span>
                <span className="text-xl font-bold text-foreground block">432</span>
                <span className="text-[10px] text-emerald-700">30.4% Dialect Escalations</span>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/30 rounded-xl space-y-1">
                <span className="text-primary font-bold block text-[11px]">4. ITI Admissions Confirmed</span>
                <span className="text-xl font-extrabold text-primary block">348</span>
                <span className="text-[10px] text-primary font-semibold">80.5% Callback Conversion</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED TRADE DATA CONTENT EDITOR FORM */}
      {activeTab === "trades" && (
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {language === "hi" ? "सत्यापित आंकड़े प्रबंधन" : "Verified Trade Content Management"}
                </span>
                <h3 className="font-bold text-base text-foreground">
                  {language === "hi" ? "ट्रेड फीस, सैलरी एवं प्लेसमेंट फॉर्म" : "Edit Real-World Outcomes for Students & Parents"}
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">
                Changes reflect live across My Path, Explore, and Family Portal.
              </span>
            </div>

            {/* Editing Form Modal / Inline Box */}
            {editingTradeId && tradeForm && (
              <div className="p-4 bg-primary/5 border border-primary/30 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
                    <Edit3 className="h-4 w-4" />
                    <span>Editing: {tradeForm.title}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingTradeId(null)}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Govt ITI Fee:</label>
                    <input
                      type="text"
                      value={tradeForm.govtFee}
                      onChange={(e) => setTradeForm({ ...tradeForm, govtFee: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Starting Monthly Pay:</label>
                    <input
                      type="text"
                      value={tradeForm.startingPay}
                      onChange={(e) => setTradeForm({ ...tradeForm, startingPay: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">2-Year Pay Growth:</label>
                    <input
                      type="text"
                      value={tradeForm.payGrowth}
                      onChange={(e) => setTradeForm({ ...tradeForm, payGrowth: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-foreground">Nearest Verified Center:</label>
                    <input
                      type="text"
                      value={tradeForm.nearestCenter}
                      onChange={(e) => setTradeForm({ ...tradeForm, nearestCenter: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Placement Rate:</label>
                    <input
                      type="text"
                      value={tradeForm.placementRate}
                      onChange={(e) => setTradeForm({ ...tradeForm, placementRate: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveTrade}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition shadow-xs cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Trade Updates</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Trades with Edit Trigger */}
            <div className="space-y-3">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{trade.title}</span>
                      <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {trade.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Fee: <strong className="text-foreground">{trade.govtFee}</strong> · Pay:{" "}
                      <strong className="text-foreground">{trade.startingPay}</strong> · Growth:{" "}
                      <strong className="text-foreground">{trade.payGrowth}</strong>
                    </p>
                    <span className="text-[11px] text-muted-foreground block">
                      Center: {trade.nearestCenter} ({trade.placementRate})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEditTrade(trade)}
                    className="px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground font-semibold flex items-center justify-center gap-1 transition cursor-pointer self-start sm:self-auto"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-primary" />
                    <span>Edit Facts</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE USER ACTIVITY STREAM */}
      {activeTab === "live_feed" && (
        <div className="space-y-4">
          <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Realtime Telemetry & Family Action Stream</span>
                </span>
                <h3 className="font-bold text-base text-foreground mt-1">
                  {language === "hi"
                    ? "लाइव छात्र एवं अभिभावक गतिविधियां"
                    : "Live Actions Recorded Across Student & Family Portals"}
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">
                Auto-syncs whenever user changes trades, requests callbacks, or listens to audio.
              </span>
            </div>

            {liveEvents.length > 0 ? (
              <div className="space-y-2.5">
                {liveEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition hover:bg-muted/40"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">
                          {ev.type === "callback_requested"
                            ? "📞 Callback Requested"
                            : ev.type === "trade_selected"
                            ? "🎯 Career Path Chosen"
                            : "✨ User Interaction"}
                        </span>
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                          {ev.tradeTitle}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{ev.details}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono font-semibold text-muted-foreground block">
                        {ev.timestamp}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{ev.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-2xl space-y-2">
                <Sparkles className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="font-semibold text-foreground">
                  No live events in current session yet.
                </p>
                <p>
                  When users select trades in My Path / Explore or submit callback requests on the Family Portal, actions will stream live here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
