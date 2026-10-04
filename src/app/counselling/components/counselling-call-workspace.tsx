"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VRMScene } from "./vrm-scene";
import { getCareerDialogues } from "./data";
import { GenerativeWidget } from "./generative-widget";
import type { SupportedLanguage } from "../../onboarding/components/types";
import { getSelectedCareer } from "@/lib/career-store";
import { getStoredLanguage } from "@/lib/profile-store";
import type { CareerPath } from "@/app/my-path/components/types";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

type LoadState = "loading" | "ready" | "error";

export function CounsellingCallWorkspace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [activeCareer, setActiveCareer] = useState<CareerPath | null>(null);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(12);

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
  const dialogues = getCareerDialogues(career, language);
  const activeDialogue = dialogues[activeDialogueIndex] || dialogues[0];

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // VRM 3D Scene Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new VRMScene(canvas);
    scene.load("/avatar.vrm").then(
      () => setLoadState("ready"),
      () => setLoadState("error")
    );

    return () => scene.dispose();
  }, []);

  // Audio Speech synthesis on dialogue step
  useEffect(() => {
    if (!isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text =
        language === "hi" ? activeDialogue.textHi : activeDialogue.textEn;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  }, [activeDialogueIndex, language, isMuted, activeDialogue.textHi, activeDialogue.textEn]);

  const quickPrompts =
    language === "hi"
      ? [
          { text: `💰 ${career.title} की फीस और वेतन?`, idx: 0 },
          { text: "🚌 पास का कॉलेज और दूरी?", idx: 1 },
          { text: "👨‍👩‍👦 परिवार को कैसे समझाएं?", idx: 2 },
        ]
      : [
          { text: `💰 Fees & Pay for ${career.title}?`, idx: 0 },
          { text: "🚌 Where is the nearest center?", idx: 1 },
          { text: "👨‍👩‍👦 How to explain to my parents?", idx: 2 },
        ];

  return (
    <div className="relative w-full h-screen bg-neutral-950 text-white overflow-hidden flex flex-col justify-between select-none">
      {/* 3D VRM Avatar Full-Screen Canvas */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        {loadState === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-neutral-400">
                {language === "hi" ? "साथी से जुड़ रहे हैं..." : "Connecting with Saathi..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Video Call Header Bar */}
      <header className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-neutral-950/90 to-transparent">
        <div className="flex items-center gap-2.5 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-tight">
            Saathi Live · साथी लाइव
          </span>
          <span className="text-[11px] font-mono text-neutral-400">
            {formatTime(callDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/my-path"
            className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-lg"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {language === "hi" ? "कॉल समाप्त करें" : "End Call"}
            </span>
          </Link>
        </div>
      </header>

      {/* Floating Generative UI HUD Panel (Right Side on Desktop / Bottom Tray on Mobile) */}
      <div className="relative z-20 flex-1 flex flex-col justify-end md:justify-center items-end px-4 py-2 pointer-events-none">
        {activeDialogue.widget && (
          <div className="mb-2 w-full flex justify-end">
            <GenerativeWidget
              widget={activeDialogue.widget}
              language={language}
            />
          </div>
        )}
      </div>

      {/* Bottom Subtitles & Call Control Dock */}
      <footer className="relative z-20 p-4 space-y-3 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent">
        {/* Live Subtitle Banner */}
        <div className="max-w-2xl mx-auto bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-3.5 shadow-2xl flex items-start gap-3">
          <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Saathi Speaking · साथी बोल रहे हैं
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Advice</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-100 font-medium leading-relaxed">
              &quot;{language === "hi" ? activeDialogue.textHi : activeDialogue.textEn}&quot;
            </p>
          </div>
        </div>

        {/* 1-Tap Spoken Prompt Chips */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveDialogueIndex(q.idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                activeDialogueIndex === q.idx
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-neutral-900/80 border-neutral-700/80 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {q.text}
            </button>
          ))}
        </div>

        {/* Main Controls Dock */}
        <div className="flex items-center justify-center gap-4 pt-1">
          {/* Audio Speaker Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full border transition ${
              isMuted
                ? "bg-neutral-800 border-neutral-700 text-neutral-400"
                : "bg-neutral-900/90 border-neutral-700 text-white hover:bg-neutral-800"
            }`}
            title="Toggle Speaker Audio"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>

          {/* User Mic Button (Push to talk / Active state) */}
          <button
            type="button"
            onClick={() => setIsMicActive(!isMicActive)}
            className={`px-5 py-3 rounded-full font-semibold text-xs flex items-center gap-2 transition shadow-xl ${
              isMicActive
                ? "bg-emerald-500 text-neutral-950 ring-4 ring-emerald-500/30 scale-105"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isMicActive ? (
              <>
                <Mic className="h-4 w-4 animate-bounce" />
                <span>{language === "hi" ? "साथी सुन रहा है..." : "Saathi Listening..."}</span>
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4" />
                <span>{language === "hi" ? "बोलने के लिए दबाएं" : "Tap to Speak"}</span>
              </>
            )}
          </button>

          {/* Next advice step */}
          <button
            type="button"
            onClick={() =>
              setActiveDialogueIndex((prev) => (prev + 1) % dialogues.length)
            }
            className="p-3 rounded-full bg-neutral-900/90 border border-neutral-700 text-white hover:bg-neutral-800 transition"
            title="Next Step in Advice"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Human Senior Counsellor Escalation */}
          <Link
            href="/family"
            className="p-3 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            title="Talk to Senior Human Counsellor"
          >
            <UserCheck className="h-5 w-5 text-primary" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
