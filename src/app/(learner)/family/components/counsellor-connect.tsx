"use client";

import { useState } from "react";
import type { CounsellorProfile } from "./types";
import { recordLiveEvent } from "@/lib/activity-store";
import { requestCallbackAction } from "@/app/actions/leads";
import { getSelectedCareer } from "@/lib/career-store";
import type { SupportedLanguage } from "../../onboarding/components/types";
import {
  MessageCircle,
  Clock,
  Globe,
  Award,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface CounsellorConnectProps {
  counsellors: CounsellorProfile[];
  language: SupportedLanguage;
}

export function CounsellorConnect({ counsellors, language }: CounsellorConnectProps) {
  const [selectedCounsellor, setSelectedCounsellor] = useState<string>(counsellors[0]?.id || "");
  const [parentPhone, setParentPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState<"morning" | "afternoon" | "evening">("evening");
  const [isBooked, setIsBooked] = useState(false);

  const activeCounsellor =
    counsellors.find((c) => c.id === selectedCounsellor) || counsellors[0];

  async function handleBookCallback(e: React.FormEvent) {
    e.preventDefault();
    if (parentPhone.trim().length >= 10) {
      setIsBooked(true);
      const activeCareer = getSelectedCareer(language);

      await requestCallbackAction({
        parentName: "Parent",
        parentPhone: parentPhone.trim(),
        preferredDialect: language === "hi" ? "bhojpuri" : "hindi",
        targetTradeId: activeCareer?.id || "electrician",
        preferredTimeSlot: preferredTime,
        primaryResistance: `Counsellor: ${activeCounsellor.name}`,
      });

      recordLiveEvent({
        type: "callback_requested",
        studentName: "Student Family",
        location: "Patna / Bihar",
        tradeTitle: activeCareer?.title || "Selected ITI Trade",
        details: `Parent Phone: ${parentPhone}, Slot: ${preferredTime}, Counsellor: ${activeCounsellor.name}`,
      });
    }
  }

  function handleWhatsAppConnect() {
    const text =
      language === "hi"
        ? `नमस्ते, मैं अपने बच्चे के वोकेशनल कोर्स के संबंध में काउंसलर ${activeCounsellor.name} से बात करना चाहता/चाहती हूँ।`
        : `Hello, I want to discuss vocational course admission for my child with Counsellor ${activeCounsellor.name}.`;
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }

  return (
    <div className="bg-card border rounded-2xl p-5 shadow-xs space-y-5">
      <div className="flex items-start justify-between gap-2 border-b pb-3">
        <div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {language === "hi" ? "विशेषज्ञ मानवीय परामर्श" : "Direct Human Counsellor"}
          </span>
          <h3 className="font-bold text-base sm:text-lg text-foreground mt-2">
            {language === "hi"
              ? "माता-पिता के लिए निःशुल्क फोन परामर्श"
              : "Free Phone Counselling For Parents"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === "hi"
              ? "अपनी स्थानीय भाषा (हिन्दी/भोजपुरी/मैथिली) में सीधे बात करें और सभी शंकाएं दूर करें।"
              : "Speak directly in your native language to clear any questions about fees, safety, and jobs."}
          </p>
        </div>
      </div>

      {/* Select Counsellor Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {counsellors.map((c) => {
          const isSelected = c.id === selectedCounsellor;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedCounsellor(c.id);
                setIsBooked(false);
              }}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3 transition ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                  <span className="text-[11px] font-bold text-amber-600">
                    ★ {c.rating}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "hi" ? c.titleHi : c.titleEn}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                  <Award className="h-3 w-3 text-primary shrink-0" />
                  <span>{language === "hi" ? c.experienceHi : c.experienceEn}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t text-[11px]">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="h-3 w-3 shrink-0" />
                  <span className="truncate">{c.languages.join(", ")}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{language === "hi" ? c.availableSlotHi : c.availableSlotEn}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Booking / Action Form */}
      {isBooked ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2 animate-in fade-in">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-sm text-emerald-900">
            {language === "hi"
              ? "कॉल अनुरोध सफलतापूर्वक दर्ज हो गया!"
              : "Callback Request Registered Successfully!"}
          </h4>
          <p className="text-xs text-emerald-700 max-w-sm mx-auto">
            {language === "hi"
              ? `काउंसलर ${activeCounsellor.name} आज चुने गए समय पर आपके नंबर (${parentPhone}) पर फोन करेंगे।`
              : `Counsellor ${activeCounsellor.name} will call your number (${parentPhone}) at the selected slot.`}
          </p>
          <button
            type="button"
            onClick={() => setIsBooked(false)}
            className="text-xs text-emerald-800 underline font-semibold pt-1"
          >
            {language === "hi" ? "नया अनुरोध करें" : "Book another call"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleBookCallback} className="bg-muted/20 border rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {language === "hi"
                  ? "माता-पिता या अभिभावक का फोन नंबर:"
                  : "Parent / Guardian Phone Number:"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 pl-12 pr-3 rounded-xl border bg-background text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {language === "hi" ? "कॉल के लिए सुविधाजनक समय:" : "Preferred Time Slot:"}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["morning", "afternoon", "evening"] as const).map((slot) => {
                  const labels = {
                    morning: language === "hi" ? "सुबह" : "Morning",
                    afternoon: language === "hi" ? "दोपहर" : "Afternoon",
                    evening: language === "hi" ? "शाम" : "Evening",
                  };
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredTime(slot)}
                      className={`h-11 rounded-xl text-xs font-semibold border transition ${
                        preferredTime === slot
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {labels[slot]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={parentPhone.length < 10}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Calendar className="h-4 w-4" />
              <span>{language === "hi" ? "मुफ्त फोन कॉल बुक करें" : "Book Free Callback"}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppConnect}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>{language === "hi" ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
