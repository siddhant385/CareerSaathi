import { createClient } from "@/lib/supabase/client";
import type { SupportedLanguage } from "../../onboarding/components/types";
import type { CareerCategory, EvidenceLevel } from "../../my-path/components/types";

export interface ExtendedTrade {
  id: string;
  category: CareerCategory;
  title: string;
  eligibilityEn: string;
  eligibilityHi: string;
  minQualification: "class_8" | "class_10" | "class_12" | "graduate";
  duration: string;
  govtFee: string;
  privateFee: string;
  startingPay: string;
  payGrowth: string;
  centerTypeEn: string;
  centerTypeHi: string;
  demandEn: string;
  demandHi: string;
  safetyEn: string;
  safetyHi: string;
  descriptionEn: string;
  descriptionHi: string;
  keySkills: string[];
  evidenceLevel: EvidenceLevel;
}

export async function fetchLiveExploreTrades(lang: SupportedLanguage = "en"): Promise<ExtendedTrade[]> {
  const supabase = createClient();

  const { data: trades, error } = await supabase
    .from("vocational_trades")
    .select("*");

  if (error || !trades || trades.length === 0) {
    return [...getAllTrades(lang)];
  }

  const isHi = lang === "hi";

  return trades.map((t) => {
    return {
      id: t.id,
      category: (t.category as CareerCategory) || "electrical",
      title: isHi ? t.title_hi : t.title_en,
      eligibilityEn: `${t.min_qualification === "class_10" ? "Class 10th Pass" : "Class 8th / 10th Pass"}`,
      eligibilityHi: `${t.min_qualification === "class_10" ? "10वीं पास" : "8वीं / 10वीं पास"}`,
      minQualification: (t.min_qualification as "class_8" | "class_10" | "class_12" | "graduate") || "class_10",
      duration: isHi ? `${t.duration_months} महीने (सरकारी ITI)` : `${t.duration_months} Months (Govt ITI)`,
      govtFee: `₹${t.govt_annual_fee?.toLocaleString("en-IN")}`,
      privateFee: `₹${t.private_annual_fee?.toLocaleString("en-IN")}`,
      startingPay: isHi
        ? `₹${t.starting_monthly_pay_min?.toLocaleString("en-IN")} - ₹${t.starting_monthly_pay_max?.toLocaleString("en-IN")} / माह`
        : `₹${t.starting_monthly_pay_min?.toLocaleString("en-IN")} - ₹${t.starting_monthly_pay_max?.toLocaleString("en-IN")} / mo`,
      payGrowth: isHi ? t.pay_growth_2yr_hi : t.pay_growth_2yr_en,
      centerTypeEn: "Govt ITI & PMKK Centers",
      centerTypeHi: "राजकीय आईटीआई एवं पीएमकेके केंद्र",
      demandEn: "High (Industry & State Discoms)",
      demandHi: "अत्यधिक मांग (उद्योग एवं सरकारी डिस्कॉम)",
      safetyEn: t.safety_rating_en,
      safetyHi: t.safety_rating_hi,
      descriptionEn: t.description_en,
      descriptionHi: t.description_hi,
      keySkills: Array.isArray(t.key_skills) ? t.key_skills : ["Practical Training"],
      evidenceLevel: "verified" as const,
    };
  });
}

export function getAllTrades(lang: SupportedLanguage = "en"): readonly ExtendedTrade[] {
  if (lang === "hi") {
    return [
      {
        id: "electrician",
        category: "electrical",
        title: "इलेक्ट्रीशियन (वायरमैन एवं सोलर)",
        eligibilityEn: "Class 10th Pass",
        eligibilityHi: "10वीं पास",
        minQualification: "class_10",
        duration: "24 महीने (Govt ITI)",
        govtFee: "₹1,500",
        privateFee: "₹38,000",
        startingPay: "₹14,000 - ₹24,000 / माह",
        payGrowth: "2 वर्ष बाद ₹28,000 से ₹38,000 प्रति माह",
        centerTypeEn: "Government ITI & PMKK",
        centerTypeHi: "राजकीय आईटीआई एवं पीएमकेके",
        demandEn: "High (Solar & Housing)",
        demandHi: "अत्यधिक मांग (सोलर एवं हाउसिंग)",
        safetyEn: "High Safety Standard (Govt NCVT Verified)",
        safetyHi: "उच्च सुरक्षा मानक (सरकारी NCVT प्रमाणित)",
        descriptionEn: "Master industrial wiring, transformer maintenance, and rooftop solar installation.",
        descriptionHi: "औद्योगिक वायरिंग, ट्रांसफार्मर रखरखाव और सोलर पैनल स्थापना का संपूर्ण प्रशिक्षण।",
        keySkills: ["Wiring", "Solar Inverter", "Circuit Diagnosis"],
        evidenceLevel: "verified",
      },
      {
        id: "auto_ev_mechanic",
        category: "auto",
        title: "ईवी और ऑटो मैकेनिक (इलेक्ट्रिक मोबिलिटी)",
        eligibilityEn: "Class 10th Pass",
        eligibilityHi: "10वीं पास",
        minQualification: "class_10",
        duration: "24 महीने (NCVT ITI)",
        govtFee: "₹1,800",
        privateFee: "₹45,000",
        startingPay: "₹15,000 - ₹26,000 / माह",
        payGrowth: "ईवी फ्लीट में 2 वर्ष बाद ₹30,000 से ₹45,000",
        centerTypeEn: "Govt ITI & Auto Skill Council",
        centerTypeHi: "राजकीय आईटीआई एवं ऑटो स्किल काउंसिल",
        demandEn: "High (EV & 2-Wheeler)",
        demandHi: "उच्च मांग (ईवी व दोपहिया)",
        safetyEn: "High Safety Standard (Govt NCVT Verified)",
        safetyHi: "उच्च सुरक्षा मानक (सरकारी NCVT प्रमाणित)",
        descriptionEn: "Diagnostics and repair of Lithium-ion batteries, electric motors, and powertrain systems.",
        descriptionHi: "लिथियम-आयन बैटरी डायग्नोस्टिक्स, बीएलडीसी मोटर और आधुनिक वाहनों की मरम्मत।",
        keySkills: ["Battery Diagnostic", "Motor Winding", "OBD-II Scanning"],
        evidenceLevel: "verified",
      },
      {
        id: "digital_design_cad",
        category: "digital",
        title: "डिजिटल डिजाइन एवं 3D ड्राफ्टिंग (CAD/CAM)",
        eligibilityEn: "Class 10th Pass",
        eligibilityHi: "10वीं पास",
        minQualification: "class_10",
        duration: "12 महीने (PMKK / ITI)",
        govtFee: "₹2,000",
        privateFee: "₹32,000",
        startingPay: "₹16,000 - ₹28,000 / माह",
        payGrowth: "इंडस्ट्रियल ड्राफ्ट्समैन में ₹35,000 से ₹50,000",
        centerTypeEn: "PMKK & IT Center",
        centerTypeHi: "पीएमकेके एवं आईटी सेंटर",
        demandEn: "High (Manufacturing & Architecture)",
        demandHi: "उच्च मांग (विनिर्माण एवं आर्किटेक्चर)",
        safetyEn: "Desk & Lab Environment",
        safetyHi: "डेस्क एवं कंप्यूटर लैब वातावरण",
        descriptionEn: "Design precision machine parts and architectural blueprints using AutoCAD and SolidWorks.",
        descriptionHi: "ऑटोकैड और सॉलिडवर्क्स का उपयोग करके मशीनरी और निर्माण ब्लूप्रिंट डिजाइन करना।",
        keySkills: ["AutoCAD 2D/3D", "SolidWorks", "CNC Programming"],
        evidenceLevel: "verified",
      },
      {
        id: "healthcare_gda",
        category: "healthcare",
        title: "जनरल ड्यूटी असिस्टेंट (स्वास्थ्य सेवा)",
        eligibilityEn: "Class 10th Pass",
        eligibilityHi: "10वीं पास",
        minQualification: "class_10",
        duration: "12 महीने (Govt Polytechnic)",
        govtFee: "₹1,200",
        privateFee: "₹28,000",
        startingPay: "₹13,000 - ₹20,000 / माह",
        payGrowth: "मल्टी-स्पेशियलिटी अस्पतालों में ₹22,000 से ₹32,000",
        centerTypeEn: "Govt Women Polytechnic",
        centerTypeHi: "राजकीय महिला पॉलिटेक्निक",
        demandEn: "Very High (Hospitals & Clinics)",
        demandHi: "अत्यधिक मांग (अस्पताल एवं नर्सिंग होम)",
        safetyEn: "Safe Clinical Environment",
        safetyHi: "सुरक्षित अस्पताल वातावरण",
        descriptionEn: "Patient vital monitoring, emergency hospital assistance, and clinical care support.",
        descriptionHi: "मरीजों की देखभाल, वाइटल साइन मॉनिटरिंग और अस्पताल आपातकालीन सहायता।",
        keySkills: ["Vital Monitoring", "First Aid & CPR", "Patient Care"],
        evidenceLevel: "verified",
      },
    ];
  }

  return [
    {
      id: "electrician",
      category: "electrical",
      title: "Electrician (Wireman & Solar)",
      eligibilityEn: "Class 10th Pass",
      eligibilityHi: "10वीं पास",
      minQualification: "class_10",
      duration: "24 Months (Govt ITI)",
      govtFee: "₹1,500",
      privateFee: "₹38,000",
      startingPay: "₹14,000 - ₹24,000 / mo",
      payGrowth: "₹28,000 to ₹38,000/mo after 2 years with Discom/Solar license",
      centerTypeEn: "Government ITI & PMKK",
      centerTypeHi: "राजकीय आईटीआई एवं पीएमकेके",
      demandEn: "High (Solar & Housing)",
      demandHi: "अत्यधिक मांग (सोलर एवं हाउसिंग)",
      safetyEn: "High Safety Standard (Govt NCVT Verified)",
      safetyHi: "उच्च सुरक्षा मानक (सरकारी NCVT प्रमाणित)",
      descriptionEn: "Master industrial wiring, transformer maintenance, and rooftop solar installation.",
      descriptionHi: "औद्योगिक वायरिंग, ट्रांसफार्मर रखरखाव और सोलर पैनल स्थापना का संपूर्ण प्रशिक्षण।",
      keySkills: ["Wiring", "Solar Inverter", "Circuit Diagnosis"],
      evidenceLevel: "verified",
    },
    {
      id: "auto_ev_mechanic",
      category: "auto",
      title: "EV & Auto Mechanic (Electric Mobility)",
      eligibilityEn: "Class 10th Pass",
      eligibilityHi: "10वीं पास",
      minQualification: "class_10",
      duration: "24 Months (NCVT ITI)",
      govtFee: "₹1,800",
      privateFee: "₹45,000",
      startingPay: "₹15,000 - ₹26,000 / mo",
      payGrowth: "₹30,000 to ₹45,000/mo in EV Fleet & Service Centers",
      centerTypeEn: "Govt ITI & Auto Skill Council",
      centerTypeHi: "राजकीय आईटीआई एवं ऑटो स्किल काउंसिल",
      demandEn: "High (EV & 2-Wheeler)",
      demandHi: "उच्च मांग (ईवी व दोपहिया)",
      safetyEn: "High Safety Standard (Govt NCVT Verified)",
      safetyHi: "उच्च सुरक्षा मानक (सरकारी NCVT प्रमाणित)",
      descriptionEn: "Diagnostics and repair of Lithium-ion batteries, electric motors, and powertrain systems.",
      descriptionHi: "लिथियम-आयन बैटरी डायग्नोस्टिक्स, बीएलडीसी मोटर और आधुनिक वाहनों की मरम्मत।",
      keySkills: ["Battery Diagnostic", "Motor Winding", "OBD-II Scanning"],
      evidenceLevel: "verified",
    },
    {
      id: "digital_design_cad",
      category: "digital",
      title: "Digital Design & 3D Drafting (CAD/CAM)",
      eligibilityEn: "Class 10th Pass",
      eligibilityHi: "10वीं पास",
      minQualification: "class_10",
      duration: "12 Months (PMKK / ITI)",
      govtFee: "₹2,000",
      privateFee: "₹32,000",
      startingPay: "₹16,000 - ₹28,000 / mo",
      payGrowth: "₹35,000 to ₹50,000/mo as Industrial Draftsman",
      centerTypeEn: "PMKK & IT Center",
      centerTypeHi: "पीएमकेके एवं आईटी सेंटर",
      demandEn: "High (Manufacturing & Architecture)",
      demandHi: "उच्च मांग (विनिर्माण एवं आर्किटेक्चर)",
      safetyEn: "Desk & Lab Environment",
      safetyHi: "डेस्क एवं कंप्यूटर लैब वातावरण",
      descriptionEn: "Design precision machine parts and architectural blueprints using AutoCAD and SolidWorks.",
      descriptionHi: "ऑटोकैड और सॉलिडवर्क्स का उपयोग करके मशीनरी और निर्माण ब्लूप्रिंट डिजाइन करना।",
      keySkills: ["AutoCAD 2D/3D", "SolidWorks", "CNC Programming"],
      evidenceLevel: "verified",
    },
    {
      id: "healthcare_gda",
      category: "healthcare",
      title: "General Duty Assistant (Healthcare)",
      eligibilityEn: "Class 10th Pass",
      eligibilityHi: "10वीं पास",
      minQualification: "class_10",
      duration: "12 Months (Govt Polytechnic)",
      govtFee: "₹1,200",
      privateFee: "₹28,000",
      startingPay: "₹13,000 - ₹20,000 / mo",
      payGrowth: "₹22,000 to ₹32,000/mo in multi-specialty hospitals",
      centerTypeEn: "Govt Women Polytechnic",
      centerTypeHi: "राजकीय महिला पॉलिटेक्निक",
      demandEn: "Very High (Hospitals & Clinics)",
      demandHi: "अत्यधिक मांग (अस्पताल एवं नर्सिंग होम)",
      safetyEn: "Safe Clinical Environment",
      safetyHi: "सुरक्षित अस्पताल वातावरण",
      descriptionEn: "Patient vital monitoring, emergency hospital assistance, and clinical care support.",
      descriptionHi: "मरीजों की देखभाल, वाइटल साइन मॉनिटरिंग और अस्पताल आपातकालीन सहायता।",
      keySkills: ["Vital Monitoring", "First Aid & CPR", "Patient Care"],
      evidenceLevel: "verified",
    },
  ];
}
