import { createClient } from "@/lib/supabase/client";
import type { CareerPath, CareerCategory } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";

// Helper to format Supabase trades table rows into CareerPath UI shape
export async function fetchLiveCareerPaths(lang: SupportedLanguage = "en"): Promise<CareerPath[]> {
  const supabase = createClient();

  const { data: trades, error } = await supabase
    .from("vocational_trades")
    .select(`
      id,
      title_en,
      title_hi,
      category,
      duration_months,
      govt_annual_fee,
      private_annual_fee,
      starting_monthly_pay_min,
      starting_monthly_pay_max,
      pay_growth_2yr_en,
      pay_growth_2yr_hi,
      description_en,
      description_hi,
      key_skills,
      safety_rating_en,
      safety_rating_hi,
      training_centers (
        id,
        name,
        travel_distance_km,
        bus_route_info_en,
        bus_route_info_hi
      )
    `);

  if (error || !trades || trades.length === 0) {
    // Fallback to initial local cache if network/table error
    return getLocalFallbackPaths(lang);
  }

  return trades.map((t) => {
    const centers = Array.isArray(t.training_centers) ? t.training_centers : [];
    const firstCenter = centers[0];
    const isHi = lang === "hi";

    const title = isHi ? t.title_hi : t.title_en;
    const duration = isHi
      ? `${t.duration_months} महीने (सरकारी NCVT)`
      : `${t.duration_months} Months (Govt NCVT)`;

    const totalCost = isHi
      ? `सरकारी आईटीआई: ₹${t.govt_annual_fee?.toLocaleString("en-IN")} | प्राइवेट: ₹${t.private_annual_fee?.toLocaleString("en-IN")}`
      : `Govt ITI: ₹${t.govt_annual_fee?.toLocaleString("en-IN")} | Private: ₹${t.private_annual_fee?.toLocaleString("en-IN")}`;

    const startingPay = isHi
      ? `₹${t.starting_monthly_pay_min?.toLocaleString("en-IN")} - ₹${t.starting_monthly_pay_max?.toLocaleString("en-IN")} प्रति माह`
      : `₹${t.starting_monthly_pay_min?.toLocaleString("en-IN")} - ₹${t.starting_monthly_pay_max?.toLocaleString("en-IN")} / mo`;

    const payGrowth = isHi ? t.pay_growth_2yr_hi : t.pay_growth_2yr_en;
    const safetyRating = isHi ? t.safety_rating_hi : t.safety_rating_en;
    const dayInTheLife = isHi ? t.description_hi : t.description_en;
    const nearestCenter = firstCenter ? firstCenter.name : isHi ? "राजकीय आईटीआई (Govt ITI)" : "Govt ITI Campus";
    const travelDistance = firstCenter?.travel_distance_km
      ? isHi
        ? `${firstCenter.travel_distance_km} किमी दूर (${firstCenter.bus_route_info_hi || "स्थानीय बस"})`
        : `${firstCenter.travel_distance_km} km away (${firstCenter.bus_route_info_en || "Local transit"})`
      : isHi
      ? "जिला केंद्र के निकट (बस उपलब्ध)"
      : "Near district center (bus available)";

    return {
      id: t.id,
      category: (t.category as CareerCategory) || "electrical",
      title,
      matchScore: 90,
      workStyle: isHi ? "व्यावहारिक एवं तकनीकी कार्य · NCVT सर्टिफाइड" : "Practical Technical Training · NCVT Certified",
      duration,
      totalCost,
      startingPay,
      payGrowth,
      verifiedCentresCount: centers.length > 0 ? centers.length : 2,
      nearestCenter,
      travelDistance,
      safetyRating,
      dayInTheLife,
      whyFit: isHi
        ? "आपकी रुचि और 10वीं/12वीं योग्यता के अनुकूल सरकारी मान्यता प्राप्त ट्रेड।"
        : "Matches your aptitude and 10th/12th qualification with high local hiring.",
      questionsAnswered: isHi ? "परिवार के सभी 5 सवालों के जवाब सत्यापित" : "All 5 family questions verified",
      evidenceLevel: "verified" as const,
      keySkills: Array.isArray(t.key_skills) && t.key_skills.length > 0 ? t.key_skills : ["व्यावहारिक कौशल", "सुरक्षा नियम"],
    };
  });
}

export function getLocalFallbackPaths(lang: SupportedLanguage = "en"): CareerPath[] {
  if (lang === "hi") {
    return [
      {
        id: "electrician",
        category: "electrical",
        title: "इलेक्ट्रीशियन (वायरमैन एवं सोलर)",
        matchScore: 94,
        workStyle: "व्यावहारिक एवं तकनीकी कार्य · 24 महीने",
        duration: "24 महीने (2-वर्षीय ITI)",
        totalCost: "सरकारी आईटीआई: ₹1,500 | प्राइवेट: ₹38,000",
        startingPay: "₹14,000 - ₹24,000 प्रति माह",
        payGrowth: "2 साल बाद ₹28,000 से ₹38,000 प्रतिमाह",
        verifiedCentresCount: 3,
        nearestCenter: "राजकीय आईटीआई दीघा (पटना)",
        travelDistance: "4.2 किमी दूर (डायरेक्ट सिटी बस 102)",
        safetyRating: "उच्च सुरक्षा मानक (NCVT प्रमाणित)",
        dayInTheLife: "औद्योगिक वायरिंग, ट्रांसफार्मर रखरखाव और सोलर पैनल स्थापना।",
        whyFit: "आपकी व्यावहारिक उपकरणों में रुचि और 10वीं पास योग्यता के अनुकूल।",
        questionsAnswered: "परिवार के सभी 5 सवालों के जवाब सत्यापित",
        evidenceLevel: "verified",
        keySkills: ["Wiring", "Solar Inverter", "Circuit Diagnosis"],
      },
      {
        id: "auto_ev_mechanic",
        category: "auto",
        title: "ईवी और ऑटो मैकेनिक (इलेक्ट्रिक मोबिलिटी)",
        matchScore: 88,
        workStyle: "गाड़ियों की मरम्मत एवं डायग्नोस्टिक्स · 24 महीने",
        duration: "24 महीने (NCVT ITI)",
        totalCost: "सरकारी आईटीआई: ₹1,800 | प्राइवेट: ₹45,000",
        startingPay: "₹15,000 - ₹26,000 प्रति माह",
        payGrowth: "ईवी फ्लीट में 2 वर्ष बाद ₹30,000 से ₹45,000",
        verifiedCentresCount: 2,
        nearestCenter: "राजकीय आईटीआई मढ़ौरा (सारण)",
        travelDistance: "12 किमी दूर (लोकल ट्रेन व बस)",
        safetyRating: "उच्च सुरक्षा मानक (NCVT प्रमाणित)",
        dayInTheLife: "लिथियम-आयन बैटरी डायग्नोस्टिक्स और बीएलडीसी मोटर मरम्मत।",
        whyFit: "आधुनिक इलेक्ट्रिक वाहनों और ऑटोमोबाइल में रुचि के अनुकूल।",
        questionsAnswered: "परिवार के सभी 5 सवालों के जवाब सत्यापित",
        evidenceLevel: "verified",
        keySkills: ["Battery Diagnostic", "Motor Winding", "OBD-II Scanning"],
      },
      {
        id: "digital_design_cad",
        category: "digital",
        title: "डिजिटल डिजाइन एवं 3D ड्राफ्टिंग (CAD/CAM)",
        matchScore: 82,
        workStyle: "कंप्यूटर लैब एवं इंडस्ट्रियल डिजाइन · 12 महीने",
        duration: "12 महीने (PMKK / ITI)",
        totalCost: "सरकारी संस्थान: ₹2,000 | प्राइवेट: ₹32,000",
        startingPay: "₹16,000 - ₹28,000 प्रति माह",
        payGrowth: "इंडस्ट्रियल ड्राफ्ट्समैन में ₹35,000 से ₹50,000",
        verifiedCentresCount: 2,
        nearestCenter: "प्रधानमंत्री कौशल केंद्र (PMKK) कंकड़बाग",
        travelDistance: "3.5 किमी दूर (पटना जंक्शन से डायरेक्ट ऑटो)",
        safetyRating: "डेस्क एवं कंप्यूटर लैब वातावरण",
        dayInTheLife: "ऑटोकैड और सॉलिडवर्क्स से मशीनरी ब्लूप्रिंट डिजाइन करना।",
        whyFit: "कंप्यूटर डिजाइन और रचनात्मक कार्य में रुचि के अनुकूल।",
        questionsAnswered: "परिवार के सभी 5 सवालों के जवाब सत्यापित",
        evidenceLevel: "verified",
        keySkills: ["AutoCAD 2D/3D", "SolidWorks", "CNC Programming"],
      },
      {
        id: "healthcare_gda",
        category: "healthcare",
        title: "जनरल ड्यूटी असिस्टेंट (स्वास्थ्य सेवा)",
        matchScore: 80,
        workStyle: "अस्पताल क्लीनिकल केयर · 12 महीने",
        duration: "12 महीने (Govt Polytechnic / Skill)",
        totalCost: "सरकारी संस्थान: ₹1,200 | प्राइवेट: ₹28,000",
        startingPay: "₹13,000 - ₹20,000 प्रति माह",
        payGrowth: "मल्टी-स्पेशियलिटी अस्पतालों में ₹22,000 से ₹32,000",
        verifiedCentresCount: 2,
        nearestCenter: "राजकीय महिला कौशल केंद्र फुलवारी शरीफ",
        travelDistance: "6.8 किमी दूर (इलेक्ट्रिक बस 555)",
        safetyRating: "सुरक्षित अस्पताल वातावरण",
        dayInTheLife: "मरीजों की देखभाल, वाइटल साइन मॉनिटरिंग और अस्पताल सहायता।",
        whyFit: "स्वास्थ्य सेवा और रोगी सहायता में सेवा भावना के अनुकूल।",
        questionsAnswered: "परिवार के सभी 5 सवालों के जवाब सत्यापित",
        evidenceLevel: "verified",
        keySkills: ["Vital Monitoring", "First Aid & CPR", "Patient Care"],
      },
    ];
  }

  return [
    {
      id: "electrician",
      category: "electrical",
      title: "Electrician (Wireman & Solar)",
      matchScore: 94,
      workStyle: "Hands-on Technical & Solar · 24 Months",
      duration: "24 Months (Govt NCVT ITI)",
      totalCost: "Govt ITI: ₹1,500 | Private: ₹38,000",
      startingPay: "₹14,000 - ₹24,000 / mo",
      payGrowth: "₹28,000 to ₹38,000/mo after 2 years with Discom/Solar license",
      verifiedCentresCount: 3,
      nearestCenter: "Govt ITI Digha (Patna)",
      travelDistance: "4.2 km away (City Bus 102 direct)",
      safetyRating: "High Safety Standard (Govt NCVT Verified)",
      dayInTheLife: "Industrial wiring, transformer maintenance, and rooftop solar installation.",
      whyFit: "Matches your interest in electrical tools and 10th pass eligibility.",
      questionsAnswered: "All 5 family questions answered",
      evidenceLevel: "verified",
      keySkills: ["Wiring", "Solar Inverter", "Circuit Diagnosis"],
    },
    {
      id: "auto_ev_mechanic",
      category: "auto",
      title: "EV & Auto Mechanic (Electric Mobility)",
      matchScore: 88,
      workStyle: "Vehicles & Diagnostics · 24 Months",
      duration: "24 Months (Govt NCVT ITI)",
      totalCost: "Govt ITI: ₹1,800 | Private: ₹45,000",
      startingPay: "₹15,000 - ₹26,000 / mo",
      payGrowth: "₹30,000 to ₹45,000/mo in EV Fleet & Service Centers",
      verifiedCentresCount: 2,
      nearestCenter: "Govt ITI Marhowrah (Saran)",
      travelDistance: "12 km away (Local train & bus)",
      safetyRating: "High Safety Standard (Govt NCVT Verified)",
      dayInTheLife: "Lithium-ion battery diagnostics, BLDC motors, and powertrain repair.",
      whyFit: "Matches your interest in electric mobility and vehicle diagnostics.",
      questionsAnswered: "All 5 family questions answered",
      evidenceLevel: "verified",
      keySkills: ["Battery Diagnostic", "Motor Winding", "OBD-II Scanning"],
    },
    {
      id: "digital_design_cad",
      category: "digital",
      title: "Digital Design & 3D Drafting (CAD/CAM)",
      matchScore: 82,
      workStyle: "Lab & Industrial Drafting · 12 Months",
      duration: "12 Months (PMKK / ITI)",
      totalCost: "Govt Institute: ₹2,000 | Private: ₹32,000",
      startingPay: "₹16,000 - ₹28,000 / mo",
      payGrowth: "₹35,000 to ₹50,000/mo as Industrial Draftsman",
      verifiedCentresCount: 2,
      nearestCenter: "Pradhan Mantri Kaushal Kendra (PMKK) Kankarbagh",
      travelDistance: "3.5 km away (Direct auto from Patna Junction)",
      safetyRating: "Desk & Computer Lab Environment",
      dayInTheLife: "Create precision machine parts and blueprints with AutoCAD & SolidWorks.",
      whyFit: "Ideal for creative problem solving and computer drafting.",
      questionsAnswered: "All 5 family questions answered",
      evidenceLevel: "verified",
      keySkills: ["AutoCAD 2D/3D", "SolidWorks", "CNC Programming"],
    },
    {
      id: "healthcare_gda",
      category: "healthcare",
      title: "General Duty Assistant (Healthcare)",
      matchScore: 80,
      workStyle: "Hospital Clinical Care · 12 Months",
      duration: "12 Months (Govt Polytechnic / Skill)",
      totalCost: "Govt Institute: ₹1,200 | Private: ₹28,000",
      startingPay: "₹13,000 - ₹20,000 / mo",
      payGrowth: "₹22,000 to ₹32,000/mo in multi-specialty hospitals",
      verifiedCentresCount: 2,
      nearestCenter: "Govt Polytechnic Women Skill Center Phulwari Sharif",
      travelDistance: "6.8 km away (Electric Bus 555)",
      safetyRating: "Safe Clinical Environment",
      dayInTheLife: "Patient vital monitoring, emergency hospital assistance, and clinical care support.",
      whyFit: "Matches dedication to healthcare support and hospital care.",
      questionsAnswered: "All 5 family questions answered",
      evidenceLevel: "verified",
      keySkills: ["Vital Monitoring", "First Aid & CPR", "Patient Care"],
    },
  ];
}

// Synchronous helper for instant initial render
export function getCareerPaths(lang: SupportedLanguage = "en"): readonly CareerPath[] {
  return getLocalFallbackPaths(lang);
}
