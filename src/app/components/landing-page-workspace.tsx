"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredLanguage } from "@/lib/profile-store";
import type { SupportedLanguage } from "../onboarding/components/types";
import {
  Sparkles,
  Compass,
  Users,
  FileText,
  Volume2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Star,
  MapPin,
  IndianRupee,
} from "lucide-react";

export function LandingPageWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  useEffect(() => {
    setLanguage(getStoredLanguage());
    const onLangChange = () => setLanguage(getStoredLanguage());
    window.addEventListener("careersaathi_language_changed", onLangChange);
    return () => window.removeEventListener("careersaathi_language_changed", onLangChange);
  }, []);

  function handleListenIntro() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text =
        language === "hi"
          ? "करियर साथी में आपका स्वागत है। यहाँ विद्यार्थी और माता-पिता मिलकर वोकेशनल कोर्स, सरकारी आईटीआई फीस, और असली नौकरी के अवसरों की सही जानकारी प्राप्त कर सकते हैं। नीचे दिए गए बटन से अपनी शुरुआत करें।"
          : "Welcome to CareerSaathi. Helping students and parents choose the right vocational career together, with verified government ITI fees, local jobs, and AI counselling. Tap start below.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  }

  const features = [
    {
      icon: Compass,
      titleEn: "1. Skill Match & Local Salary",
      titleHi: "1. कौशल पहचान और स्थानीय वेतन",
      descEn: "Find top vocational paths based on your qualification, local demand, and verified earnings.",
      descHi: "अपनी 8वीं/10वीं/12वीं पढ़ाई और पसंद के अनुसार सही वोकेशनल काम और सैलरी जानें।",
      href: "/my-path",
      badgeEn: "Verified Data",
      badgeHi: "प्रमाणित डेटा",
    },
    {
      icon: Sparkles,
      titleEn: "2. 3D Saathi AI Video Call",
      titleHi: "2. साथी 3D वीडियो परामर्श",
      descEn: "Speak directly with Saathi AI in everyday Hindi or English to clear all your career doubts.",
      descHi: "साथी एआई से सीधी बातचीत करें और कोर्स, फीस तथा कॉलेज से जुड़े सवाल पूछें।",
      href: "/counselling",
      badgeEn: "Live Speech",
      badgeHi: "लाइव बातचीत",
    },
    {
      icon: Users,
      titleEn: "3. Family Decision Room",
      titleHi: "3. परिवार निर्णय एवं परामर्श कक्ष",
      descEn: "1-page zero-jargon summary for parents answering fees, monthly income, safety, and local bus route.",
      descHi: "माता-पिता के लिए सरल 1-पेज सारांश, ऑडियो वाचन और सीनियर काउंसलर से बात की सुविधा।",
      href: "/family",
      badgeEn: "Parent Trusted",
      badgeHi: "परिवार भरोसा",
    },
    {
      icon: FileText,
      titleEn: "4. ITI Admissions & Documents",
      titleHi: "4. दाखिला चेकलिस्ट व दस्तावेज",
      descEn: "Step-by-step government ITI admission roadmap, document checklist, and deadline alerts.",
      descHi: "सरकारी आईटीआई दाखिला समय-सारणी, जरूरी दस्तावेज चेकलिस्ट और अंतिम तिथि अलर्ट।",
      href: "/applications",
      badgeEn: "Govt ITI Ready",
      badgeHi: "दाखिला तैयार",
    },
  ];

  const testimonials = [
    {
      quoteEn:
        "My father was worried about ITI fees. The Family Summary showed Govt ITI was just ₹1,500 with ₹1,000/mo scholarship. We enrolled in Solar Technician without tension.",
      quoteHi:
        "पिताजी फीस को लेकर चिंतित थे। फैमिली पोर्टल ने दिखाया कि सरकारी आईटीआई फीस केवल ₹1,500 है। हमने बिना किसी परेशानी के सोलर कोर्स में दाखिला लिया।",
      authorEn: "Rahul Kumar (10th Pass) & Ramesh Kumar (Father)",
      authorHi: "राहुल कुमार (10वीं पास) एवं रमेश कुमार (पिताजी)",
      locationEn: "Patna, Bihar",
      locationHi: "पटना, बिहार",
      tradeEn: "Electrician & Solar Tech",
      tradeHi: "इलेक्ट्रीशियन एवं सोलर",
    },
    {
      quoteEn:
        "The voice audio explanation in Hindi made it easy for my mother to understand patient care jobs and hospital safety standards.",
      quoteHi:
        "हिन्दी ऑडियो वाचन ने मेरी माँ को अस्पताल में पेशेंट केयर और सुरक्षा नियमों को आसानी से समझने में मदद की।",
      authorEn: "Priya Kumari & Sunita Devi (Mother)",
      authorHi: "प्रिया कुमारी एवं सुनीता देवी (माताजी)",
      locationEn: "Ranchi, Jharkhand",
      locationHi: "रांची, झारखंड",
      tradeEn: "General Duty Assistant",
      tradeHi: "हॉस्पिटल केयर असिस्टेंट",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {language === "hi"
              ? "भारत का पहला परिवार-केंद्रित वोकेशनल करियर साथी"
              : "India's #1 Family-Centred Vocational Guidance Platform"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          {language === "hi" ? (
            <>
              विद्यार्थी की पसंद, परिवार का भरोसा — <br className="hidden sm:inline" />
              <span className="text-primary">सही वोकेशनल करियर</span> चुनें
            </>
          ) : (
            <>
              Informed Vocational Choices, <br className="hidden sm:inline" />
              <span className="text-primary">Decided Together with Family</span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {language === "hi"
            ? "10वीं और 12वीं के बाद सही वोकेशनल कोर्स, सरकारी आईटीआई फीस (₹1,500), शुरुआती वेतन और नजदीकी प्रमाणित प्रशिक्षण केंद्रों की पारदर्शी जानकारी।"
            : "Helping students and parents explore verified vocational trades, government ITI subsidies, starting salaries, and nearby skill centers without confusion."}
        </p>

        {/* Audio Intro Button & Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>{language === "hi" ? "शुरुआत करें (निशुल्क) →" : "Start Free Onboarding →"}</span>
          </Link>

          <Link
            href="/my-path"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Compass className="h-4 w-4 text-primary" />
            <span>{language === "hi" ? "माय पाथ देखें" : "Explore My Path"}</span>
          </Link>

          <button
            type="button"
            onClick={handleListenIntro}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Listen to Audio Introduction"
          >
            <Volume2 className="h-4 w-4" />
            <span>{language === "hi" ? "परिचय सुनें" : "Listen Audio"}</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{language === "hi" ? "100% सरकारी मान्यता प्राप्त आंकड़े" : "Verified Govt ITI & NSDC Data"}</span>
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4 text-emerald-600" />
            <span>{language === "hi" ? "न्यूनतम फीस (₹1,500/वर्ष)" : "Low Cost Subsidized Fees"}</span>
          </span>
          <span className="flex items-center gap-1">
            <PhoneCall className="h-4 w-4 text-emerald-600" />
            <span>{language === "hi" ? "सीनियर काउंसलर कॉलबैक" : "Human Counsellor Bridge"}</span>
          </span>
        </div>
      </section>

      {/* 4-Step Connected Journey Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {language === "hi" ? "सरल एवं स्पष्ट प्रक्रिया" : "Complete Connected Ecosystem"}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {language === "hi" ? "करियर साथी कैसे काम करता है?" : "How CareerSaathi Empowers Households"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                href={feat.href}
                className="bg-card border rounded-2xl p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {language === "hi" ? feat.badgeHi : feat.badgeEn}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition">
                      {language === "hi" ? feat.titleHi : feat.titleEn}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {language === "hi" ? feat.descHi : feat.descEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-primary pt-1">
                  <span>{language === "hi" ? "खोलें और देखें" : "Open section"}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Real Local Metrics Banner */}
      <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {language === "hi" ? "प्रमाणित आंकड़े" : "Verified Real-World Metrics"}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {language === "hi" ? "बिना किसी धोखे के असली जानकारी" : "Transparent Outcomes for Informed Decisions"}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-card border rounded-2xl p-4 space-y-1">
            <span className="text-2xl font-extrabold text-primary block">₹1,500</span>
            <span className="text-xs font-semibold text-foreground block">
              {language === "hi" ? "सरकारी आईटीआई फीस" : "Govt ITI Annual Fee"}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              {language === "hi" ? "स्कॉलरशिप उपलब्ध" : "Scholarships applicable"}
            </span>
          </div>

          <div className="bg-card border rounded-2xl p-4 space-y-1">
            <span className="text-2xl font-extrabold text-emerald-600 block">₹14k - ₹22k</span>
            <span className="text-xs font-semibold text-foreground block">
              {language === "hi" ? "शुरुआती मासिक वेतन" : "Starting Monthly Pay"}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              {language === "hi" ? "स्थानीय कंपनियों में" : "In local verified industries"}
            </span>
          </div>

          <div className="bg-card border rounded-2xl p-4 space-y-1">
            <span className="text-2xl font-extrabold text-primary block">8 to 15 km</span>
            <span className="text-xs font-semibold text-foreground block">
              {language === "hi" ? "नजदीकी केंद्र दूरी" : "Avg. Institute Distance"}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              {language === "hi" ? "सीधी बस कनेक्टिविटी" : "Direct local transit"}
            </span>
          </div>

          <div className="bg-card border rounded-2xl p-4 space-y-1">
            <span className="text-2xl font-extrabold text-emerald-600 block">100%</span>
            <span className="text-xs font-semibold text-foreground block">
              {language === "hi" ? "कार्यशाला सुरक्षा" : "Safety Standards"}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              {language === "hi" ? "सुरक्षा उपकरण अनिवार्य" : "PPE & regulated hours"}
            </span>
          </div>
        </div>
      </section>

      {/* Family Stories & Testimonials */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {language === "hi" ? "पारिवारिक अनुभव" : "Household Stories"}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {language === "hi" ? "छात्रों और माता-पिता की सच्ची राय" : "Trusted by Students and Parents Across India"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-card border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground italic leading-relaxed">
                  &ldquo;{language === "hi" ? item.quoteHi : item.quoteEn}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">
                    {language === "hi" ? item.authorHi : item.authorEn}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span>{language === "hi" ? item.locationHi : item.locationEn}</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {language === "hi" ? item.tradeHi : item.tradeEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Final Call to Action */}
      <section className="bg-card border rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
          CS
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {language === "hi"
              ? "आज ही अपने और अपने परिवार के लिए सही रास्ता चुनें"
              : "Start Your Family's Vocational Decision Journey Today"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === "hi"
              ? "कोई जटिल अंग्रेजी नहीं, कोई छुपा हुआ खर्च नहीं। केवल 2 मिनट का सरल ऑनबोर्डिंग।"
              : "Zero confusing jargon, no hidden fees. Just 2 minutes to discover your verified path."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-md cursor-pointer"
          >
            <span>{language === "hi" ? "निशुल्क प्रोफाइल शुरू करें →" : "Get Started for Free →"}</span>
          </Link>
          <Link
            href="/profile"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border hover:bg-muted text-foreground font-bold text-sm transition cursor-pointer"
          >
            {language === "hi" ? "⚙️ भाषा / सेटिंग्स" : "⚙️ App Settings"}
          </Link>
        </div>
      </section>
    </div>
  );
}
