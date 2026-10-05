"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  getStoredProfile,
  saveStoredProfile,
  setStoredLanguage,
  initialProfile,
  type UserProfile,
} from "@/lib/profile-store";
import type { SupportedLanguage } from "../../onboarding/components/types";
import {
  User,
  MapPin,
  GraduationCap,
  Sparkles,
  Briefcase,
  Target,
  FileUp,
  Settings,
  Globe,
  Bell,
  Volume2,
  CheckCircle2,
  Save,
  ArrowLeft,
  Trash2,
  LogOut,
  LogIn,
  KeyRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getLearnerProfileAction, saveLearnerProfileAction } from "@/app/actions/profile";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function ProfileWorkspace() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [savedAlert, setSavedAlert] = useState(false);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [, startTransition] = useTransition();

  const supabase = createClient();

  useEffect(() => {
    setProfile(getStoredProfile());
    const onProfileChange = () => setProfile(getStoredProfile());
    window.addEventListener("careersaathi_profile_changed", onProfileChange);

    // Fetch live profile from Supabase
    getLearnerProfileAction().then(({ profile: dbProfile }) => {
      if (dbProfile) {
        setProfile((prev) => ({
          ...prev,
          name: dbProfile.full_name || prev.name,
          phone: dbProfile.phone || prev.phone,
          location: dbProfile.district ? `${dbProfile.district}, ${dbProfile.state || "Bihar"}` : prev.location,
          education: dbProfile.highest_qualification || prev.education,
          interests: dbProfile.interests && dbProfile.interests.length > 0 ? dbProfile.interests : prev.interests,
          goal: dbProfile.goal || prev.goal,
          workPreference: dbProfile.work_preference || prev.workPreference,
          language: (dbProfile.preferred_language as SupportedLanguage) || prev.language,
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("careersaathi_profile_changed", onProfileChange);
      subscription.unsubscribe();
    };
  }, []);

  const language = profile.language;

  function handleLanguageToggle(lang: SupportedLanguage) {
    setStoredLanguage(lang);
    setProfile((prev) => ({ ...prev, language: lang }));
  }

  function handleChange<K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handleInterestToggle(interestId: string) {
    setProfile((prev) => {
      const exists = prev.interests.includes(interestId);
      const updated = exists
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests: updated };
    });
  }

  function handleSave() {
    startTransition(async () => {
      saveStoredProfile(profile);

      // Persist updates to Supabase profiles table
      await saveLearnerProfileAction({
        fullName: profile.name,
        phone: profile.phone,
        highestQualification: profile.education as any,
        preferredLanguage: profile.language,
        goal: profile.goal,
        workPreference: profile.workPreference,
      });

      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
    });
  }

  const interestOptions = [
    { id: "machines", labelEn: "Machines & Tool Repair", labelHi: "मशीन और उपकरण ठीक करना", icon: "⚙️" },
    { id: "electrical", labelEn: "Electrical & Wiring", labelHi: "बिजली और वायरिंग का काम", icon: "⚡" },
    { id: "healthcare", labelEn: "Patient Care & Hospital", labelHi: "मरीजों की सेवा और केयर", icon: "🏥" },
    { id: "vehicles", labelEn: "Auto & Vehicle Service", labelHi: "गाड़ियों की मरम्मत / ऑटोमोबाइल", icon: "🚗" },
    { id: "computers", labelEn: "Computer & Data Entry", labelHi: "कंप्यूटर और डाटा एंट्री", icon: "💻" },
    { id: "craft_tailoring", labelEn: "Tailoring & Handicraft", labelHi: "सिलाई और हस्तकला", icon: "🧵" },
    { id: "construction", labelEn: "Plumbing & Construction", labelHi: "प्लंबिंग और निर्माण", icon: "🔧" },
  ];

  const educationOptions = [
    { id: "class_8", labelEn: "Class 8th Pass", labelHi: "8वीं पास" },
    { id: "class_10", labelEn: "Class 10th Pass (Matric)", labelHi: "10वीं पास (मैट्रिक)" },
    { id: "class_12", labelEn: "Class 12th Pass (Inter)", labelHi: "12वीं पास (इंटर)" },
    { id: "iti_diploma", labelEn: "ITI / Diploma Holder", labelHi: "आईटीआई / डिप्लोमा" },
    { id: "graduate", labelEn: "Graduate / Degree", labelHi: "ग्रेजुएट / कोई अन्य डिग्री" },
    { id: "other", labelEn: "Other / Left midway", labelHi: "अन्य डिग्री या पढ़ाई बीच में छूटी" },
  ];

  const workPrefOptions = [
    { id: "near_home", labelEn: "Work near home / District", labelHi: "घर / जिले के पास काम", icon: "🏡" },
    { id: "willing_relocate", labelEn: "Willing to relocate for good pay", labelHi: "अच्छे वेतन के लिए बाहर तैयार", icon: "🚆" },
    { id: "both", labelEn: "Open to both options", labelHi: "दोनों विकल्प खुले हैं", icon: "🤝" },
  ];

  const goalOptions = [
    { id: "fast_earning", labelEn: "Start earning quickly (Short course)", labelHi: "जल्दी से कमाई शुरू करना (कम समय का कोर्स)" },
    { id: "higher_growth", labelEn: "Long-term growth & higher salary", labelHi: "भविष्य में बड़ा वेतन और स्थायी करियर" },
    { id: "own_shop", labelEn: "Start own shop / self-employment", labelHi: "खुद की दुकान या स्वरोजगार शुरू करना" },
    { id: "unsure", labelEn: "Not sure yet / Need Saathi guidance", labelHi: "अभी निश्चित नहीं / साथी मदद करे" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/my-path"
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-primary" />
              <span>CareerSaathi · Learner Profile & Settings</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {language === "hi" ? "प्रोफाइल एवं ऐप सेटिंग्स" : "Profile & App Settings"}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition shadow-xs cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{language === "hi" ? "बदलाव सहेजें" : "Save Changes"}</span>
        </button>
      </header>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-center gap-1.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>
            {language === "hi"
              ? "आपकी प्रोफाइल और प्राथमिकताएं सुरक्षित कर ली गईं!"
              : "Profile and preferences saved successfully!"}
          </span>
        </div>
      )}

      {/* 1. Global App Language Settings Card */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm sm:text-base text-foreground">
              {language === "hi" ? "ऐप की प्राथमिक भाषा" : "App Primary Language"}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {language === "hi" ? "पूरे ऐप में लागू" : "Applies Everywhere"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {language === "hi"
            ? "यह भाषा चयन आपके सभी पेजों, साथी एआई की आवाज और परिवार पोर्टल पर एक साथ लागू होगा।"
            : "This sets the default language across all screens, Saathi audio call, and Family Portal."}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleLanguageToggle("hi")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
              language === "hi"
                ? "bg-primary/5 border-primary text-primary font-bold ring-1 ring-primary/30"
                : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
            }`}
          >
            <div>
              <span className="block text-sm font-bold">हिन्दी (Hindi)</span>
              <span className="text-[11px] text-muted-foreground">सरल बोलचाल की हिन्दी</span>
            </div>
            {language === "hi" && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => handleLanguageToggle("en")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
              language === "en"
                ? "bg-primary/5 border-primary text-primary font-bold ring-1 ring-primary/30"
                : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
            }`}
          >
            <div>
              <span className="block text-sm font-bold">English</span>
              <span className="text-[11px] text-muted-foreground">Simple everyday English</span>
            </div>
            {language === "en" && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </button>
        </div>
      </section>

      {/* 2. Personal & Contact Details */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <User className="h-4 w-4 text-primary" />
          <h2 className="font-bold text-sm sm:text-base text-foreground">
            {language === "hi" ? "व्यक्तिगत एवं संपर्क विवरण" : "Personal & Contact Details"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span>{language === "hi" ? "पूरा नाम" : "Full Name"}</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>{language === "hi" ? "जिला / स्थान" : "District / Location"}</span>
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground flex items-center gap-1">
              <span>📞</span>
              <span>{language === "hi" ? "मोबाइल नंबर (काउंसलर संपर्क हेतु)" : "Mobile Phone (For Counsellor Callback)"}</span>
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
        </div>
      </section>

      {/* 3. Education & Degree Details (Supports Onboarding Skipped / Detailed Degree) */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm sm:text-base text-foreground">
              {language === "hi" ? "शिक्षा एवं योग्यता" : "Education & Qualification"}
            </h2>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {language === "hi" ? "दाखिला पात्रता हेतु" : "Determines Eligibility"}
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground block">
            {language === "hi" ? "उच्चतम शिक्षा स्तर चुनें:" : "Select Highest Education Level:"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {educationOptions.map((edu) => {
              const isSelected = profile.education === edu.id;
              return (
                <button
                  key={edu.id}
                  type="button"
                  onClick={() => handleChange("education", edu.id)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary font-bold"
                      : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
                  }`}
                >
                  {language === "hi" ? edu.labelHi : edu.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Degree Detail Input when Graduate / Other is chosen */}
        {(profile.education === "graduate" || profile.education === "other") && (
          <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-1.5 animate-in fade-in">
            <label className="text-xs font-bold text-primary block">
              {language === "hi"
                ? "विशिष्ट डिग्री / अध्ययन विषय (उदा. BA, B.Com, B.Sc, BCA):"
                : "Specific Degree / Major (e.g., BA, B.Com, B.Sc, BCA):"}
            </label>
            <input
              type="text"
              placeholder={
                language === "hi"
                  ? "उदा. B.A. History, 2nd Year B.Sc..."
                  : "e.g., B.A. History, 2nd Year B.Sc..."
              }
              value={profile.degreeDetail || ""}
              onChange={(e) => handleChange("degreeDetail", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
        )}
      </section>

      {/* 4. Interests & Preferences */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm sm:text-base text-foreground">
              {language === "hi" ? "कार्य रुचियां एवं पसंद" : "Work Interests & Trade Likes"}
            </h2>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {language === "hi" ? `${profile.interests.length} चुने गए` : `${profile.interests.length} selected`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {interestOptions.map((item) => {
            const isSelected = profile.interests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleInterestToggle(item.id)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary font-bold"
                    : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{language === "hi" ? item.labelHi : item.labelEn}</span>
                </span>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Work Style & Career Goal */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Briefcase className="h-4 w-4 text-primary" />
          <h2 className="font-bold text-sm sm:text-base text-foreground">
            {language === "hi" ? "स्थान प्राथमिकता एवं करियर लक्ष्य" : "Work Preference & Career Goals"}
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-foreground block mb-1.5">
              {language === "hi" ? "काम का स्थान:" : "Preferred Work Location:"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {workPrefOptions.map((wp) => {
                const isSelected = profile.workPreference === wp.id;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => handleChange("workPreference", wp.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-bold"
                        : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span>{wp.icon}</span>
                    <span className="text-[11px]">{language === "hi" ? wp.labelHi : wp.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="font-semibold text-foreground block mb-1.5 flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span>{language === "hi" ? "सर्वोच्च प्राथमिकता (लक्ष्य):" : "Top Priority / Goal:"}</span>
            </label>
            <div className="space-y-1.5">
              {goalOptions.map((g) => {
                const isSelected = profile.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleChange("goal", g.id)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-bold"
                        : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {language === "hi" ? g.labelHi : g.labelEn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Uploaded Resume / Document Attachment */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <FileUp className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm sm:text-base text-foreground">
              {language === "hi" ? "बायोडाटा / दस्तावेज (वैकल्पिक)" : "Resume / Documents (Optional)"}
            </h2>
          </div>
        </div>

        {profile.hasResume ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-emerald-950 block">
                  {profile.resumeFileName || "student_resume.pdf"}
                </span>
                <span className="text-[10px] text-emerald-700">
                  {language === "hi" ? "अपलोड पूर्ण · साथी ने विवरण जोड़ लिया है" : "Uploaded · Auto-parsed by Saathi"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  hasResume: false,
                  resumeFileName: "",
                }))
              }
              className="p-1.5 text-muted-foreground hover:text-red-600 transition cursor-pointer"
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-xl p-5 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              {language === "hi"
                ? "अगर आपके पास पहले से कोई बायोडाटा या मार्कशीट है, तो यहाँ जोड़ें:"
                : "Attach your marksheet or previous experience certificate:"}
            </p>
            <button
              type="button"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  hasResume: true,
                  resumeFileName: "marksheet_10th_scan.pdf",
                }))
              }
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs transition border border-border inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileUp className="h-3.5 w-3.5 text-primary" />
              <span>{language === "hi" ? "फ़ाइल अपलोड करें" : "Upload PDF / Image"}</span>
            </button>
          </div>
        )}
      </section>

      {/* 7. Accessibility & App Toggles */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Settings className="h-4 w-4 text-primary" />
          <h2 className="font-bold text-sm sm:text-base text-foreground">
            {language === "hi" ? "सुलभता एवं सूचनाएं (Settings)" : "Accessibility & Notification Preferences"}
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary" />
              <div>
                <span className="font-semibold block text-foreground">
                  {language === "hi" ? "ऑडियो वाचन (Audio Read-Aloud)" : "Audio Read-Aloud Feature"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {language === "hi" ? "माता-पिता और कम-साक्षरता सहायता हेतु" : "Assists low-literacy users & parents"}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.audioNarrationEnabled}
              onChange={(e) => handleChange("audioNarrationEnabled", e.target.checked)}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <span className="font-semibold block text-foreground">
                  {language === "hi" ? "दाखिला तिथि सूचनाएं (SMS / WhatsApp)" : "Admission & Deadline Alerts"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {language === "hi" ? "सरकारी आईटीआई आवेदन की अंतिम तिथि अलर्ट" : "Reminders for ITI admission deadlines"}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationsEnabled}
              onChange={(e) => handleChange("notificationsEnabled", e.target.checked)}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 8. Account & Authentication Security */}
      <section className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm sm:text-base text-foreground">
              {language === "hi" ? "अकाउंट एवं सुरक्षा" : "Account & Authentication"}
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {authUser ? (language === "hi" ? "लॉगिन सक्रिय" : "Active Session") : (language === "hi" ? "अतिथि मोड" : "Guest Mode")}
          </span>
        </div>

        {authUser ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-muted/20 border rounded-xl text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground block">
                {authUser.email || authUser.user_metadata?.full_name || "Authenticated User"}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                {language === "hi" ? "सुपाबेस सुरक्षित आईडी:" : "Supabase User ID:"} {authUser.id}
              </span>
            </div>

            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                setAuthUser(null);
                window.location.href = "/login";
              }}
              className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "लॉगआउट करें" : "Sign Out"}</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-foreground block">
                {language === "hi" ? "अकाउंट से नहीं जुड़े हैं" : "You are currently exploring as guest"}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                {language === "hi"
                  ? "अपनी प्रगति को हमेशा सुरक्षित रखने के लिए लॉगिन या साइन अप करें।"
                  : "Sign in to sync your shortlisted trades and counselling calls permanently."}
              </span>
            </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition shadow-xs shrink-0"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "लॉगिन / साइन अप" : "Sign In / Sign Up"}</span>
            </Link>
          </div>
        )}
      </section>

      {/* Action Footer */}
      <footer className="pt-4 border-t flex items-center justify-between gap-3 text-xs">
        <Link
          href="/my-path"
          className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted font-semibold transition"
        >
          {language === "hi" ? "← वापस जाएं" : "← Return to My Path"}
        </Link>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition shadow-xs cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{language === "hi" ? "सभी बदलाव सहेजें" : "Save All Changes"}</span>
        </button>
      </footer>
    </div>
  );
}
