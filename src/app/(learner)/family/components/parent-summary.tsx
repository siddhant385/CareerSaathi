"use client";

import { useState } from "react";
import type { ParentSummaryMetric, ParentConcern } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { Volume2, ChevronDown, ChevronUp, Sparkles, MessageCircle, Share2, Check } from "lucide-react";

interface ParentSummaryProps {
  metrics: ParentSummaryMetric[];
  concerns: ParentConcern[];
  language: SupportedLanguage;
  careerTitle?: string;
}

export function ParentSummary({ metrics, concerns, language, careerTitle }: ParentSummaryProps) {
  const [openConcernId, setOpenConcernId] = useState<string | null>(concerns[0]?.id || null);
  const [copied, setCopied] = useState(false);

  function handleListen(text: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  }

  function handleShareWhatsApp() {
    const title = careerTitle || "इलेक्ट्रीशियन एवं सोलर तकनीशियन";
    const text =
      language === "hi"
        ? `करियर साथी - माता-पिता के लिए वोकेशनल कोर्स सारांश:\n• कोर्स: ${title}\n• पूरा ब्यौरा देखें और फीस/कमाई की जांच करें:`
        : `CareerSaathi - Vocational Course Summary for Parents:\n• Course: ${title}\n• View verified details on fees and earnings:`;
    const url = `https://wa.me/?text=${encodeURIComponent(`${text} https://careersaathi.in/family`)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }

  function handleCopyLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://careersaathi.in/family");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="space-y-6">
      {/* 1-Page Clean Summary Card */}
      <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {language === "hi" ? "1-पेज माता-पिता सारांश" : "1-Page Parent Summary"}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleListen(
                    language === "hi"
                      ? `${careerTitle || "चुना गया कोर्स"}। यहाँ फीस, कमाई और सुरक्षा की पूरी जानकारी दी गई है।`
                      : `${careerTitle || "Selected course"}. Here are all the verified facts regarding fees, earnings, and safety.`
                  )
                }
                className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold hover:underline"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{language === "hi" ? "पूरा सुनें" : "Listen Audio"}</span>
              </button>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-foreground mt-1.5">
              {careerTitle || (language === "hi" ? "इलेक्ट्रीशियन और सोलर तकनीशियन" : "Electrician & Solar Technician")}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1 text-xs font-bold shadow-xs"
              title="Share on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition"
              title="Copy Link"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 4 Crucial Parent Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="bg-muted/30 border border-border/70 rounded-xl p-3.5 space-y-1"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>{m.icon}</span>
                  <span>{language === "hi" ? m.labelHi : m.labelEn}</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleListen(
                      `${language === "hi" ? m.labelHi : m.labelEn}: ${
                        language === "hi" ? m.valueHi : m.valueEn
                      }. ${language === "hi" ? m.detailHi : m.detailEn}`
                    )
                  }
                  className="text-muted-foreground hover:text-primary"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="font-bold text-sm sm:text-base text-foreground">
                {language === "hi" ? m.valueHi : m.valueEn}
              </p>

              <p className="text-[11px] text-muted-foreground leading-tight">
                {language === "hi" ? m.detailHi : m.detailEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Tap Parent Concern Accordion */}
      <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3 inline mr-1" />
            {language === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Common Parent Concerns"}
          </span>
          <h3 className="font-bold text-base sm:text-lg text-foreground">
            {language === "hi"
              ? "माता-पिता के मुख्य संदेह और उनके जवाब"
              : "Clear Answers to Important Family Questions"}
          </h3>
        </div>

        <div className="space-y-2.5">
          {concerns.map((c) => {
            const isOpen = openConcernId === c.id;
            return (
              <div
                key={c.id}
                className="border border-border/80 rounded-xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenConcernId(isOpen ? null : c.id)}
                  className={`w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition ${
                    isOpen ? "bg-primary/5 text-primary" : "bg-card hover:bg-muted/30 text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span>{language === "hi" ? c.questionHi : c.questionEn}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-3.5 bg-muted/20 border-t border-border/50 text-xs space-y-2.5 animate-in fade-in">
                    <p className="text-muted-foreground leading-relaxed">
                      {language === "hi" ? c.answerHi : c.answerEn}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ✓ {language === "hi" ? c.badgeHi : c.badgeEn}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleListen(language === "hi" ? c.answerHi : c.answerEn)
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold hover:underline"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{language === "hi" ? "उत्तर सुनें" : "Listen"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
