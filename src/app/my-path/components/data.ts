import type { CareerPath } from "./types";
import type { SupportedLanguage } from "../../onboarding/components/types";

export function getCareerPaths(lang: SupportedLanguage = "en"): readonly CareerPath[] {
  if (lang === "hi") {
    return [
      {
        id: "electrician",
        title: "इलेक्ट्रीशियन और सोलर तकनीशियन",
        matchScore: 92,
        workStyle: "व्यावहारिक एवं तकनीकी कार्य · 6–12 महीने प्रशिक्षण",
        duration: "6 महीने से 1 साल",
        totalCost: "सरकारी आईटीआई: ₹1,500 - ₹3,000 | प्राइवेट: ₹12,000",
        startingPay: "₹14,000 - ₹20,000 प्रति माह",
        payGrowth: "2 वर्ष के अनुभव के बाद ₹28,000+ प्रति माह या स्वयं का काम",
        verifiedCentresCount: 3,
        nearestCenter: "राजकीय औद्योगिक प्रशिक्षण संस्थान (Govt ITI)",
        travelDistance: "8 किमी दूर (स्थानीय बस उपलब्ध)",
        safetyRating: "सुरक्षा उपकरणों (हेलमेट, दस्ताने) के साथ सुरक्षित",
        dayInTheLife:
          "घरेलू और औद्योगिक बिजली वायरिंग, सोलर पैनल इंस्टॉलेशन, और फॉल्ट रिपेयरिंग।",
        whyFit:
          "आपकी बिजली और व्यावहारिक उपकरणों में रुचि और 10वीं/12वीं योग्यता के अनुकूल।",
        questionsAnswered: "परिवार के 5 में से 4 सवालों के जवाब उपलब्ध",
        evidenceLevel: "verified",
        keySkills: ["वायरिंग", "सर्किट जांच", "सोलर पैनल रखरखाव"],
      },
      {
        id: "auto_technician",
        title: "ऑटोमोबाइल एवं ईवी मैकेनिक",
        matchScore: 85,
        workStyle: "गाड़ियों की मरम्मत एवं डायग्नोस्टिक्स · 1 साल कोर्स",
        duration: "1 वर्ष (ITI / PMKVY)",
        totalCost: "सरकारी संस्थान: ₹2,000 | प्राइवेट: ₹15,000",
        startingPay: "₹13,000 - ₹18,000 प्रति माह",
        payGrowth: "ईवी सर्विसिंग में 3 साल बाद ₹30,000+ तक अवसर",
        verifiedCentresCount: 2,
        nearestCenter: "प्रधानमंत्री कौशल केंद्र (PMKK Center)",
        travelDistance: "12 किमी दूर",
        safetyRating: "कार्यशाला में मानक सुरक्षा नियमों के साथ काम",
        dayInTheLife:
          "दोपहिया एवं चार पहिया वाहनों का इंजन काम, सर्विसिंग एवं इलेक्ट्रॉनिक जांच।",
        whyFit: "वाहनों और औजारों के साथ व्यावहारिक काम करने की इच्छा के अनुकूल।",
        questionsAnswered: "परिवार के 5 में से 3 सवालों के जवाब उपलब्ध",
        evidenceLevel: "verified",
        keySkills: ["इंजन मरम्मत", "ब्रेक और सस्पेंशन", "इलेक्ट्रिक व्हीकल बेसिक्स"],
      },
      {
        id: "data_entry_accounts",
        title: "कंप्यूटर ऑपरेटर एवं जूनियर अकाउंटेंट",
        matchScore: 78,
        workStyle: "कार्यालय/दफ्तर का काम · 3–6 महीने डिप्लोमा",
        duration: "3 से 6 महीने (Tally + Office)",
        totalCost: "₹4,000 - ₹8,000 (स्कॉलरशिप उपलब्ध)",
        startingPay: "₹12,000 - ₹16,000 प्रति माह",
        payGrowth: "अकाउंटेंसी और जीएसटी ज्ञान के साथ ₹25,000+",
        verifiedCentresCount: 4,
        nearestCenter: "जिला कंप्यूटर प्रशिक्षण केंद्र",
        travelDistance: "4 किमी दूर (कस्बा मुख्य बाजार)",
        safetyRating: "सुरक्षित इनडोर कार्यालय वातावरण",
        dayInTheLife:
          "दैनिक बिलिंग, एक्सेल में रिकॉर्ड संधारण, डाटा एंट्री और ग्राहक सहायता।",
        whyFit: "कार्यालय आधारित काम और स्नातक/12वीं पृष्ठभूमि के अनुकूल।",
        questionsAnswered: "परिवार के 5 में से 5 सवालों के जवाब उपलब्ध",
        evidenceLevel: "guidance",
        keySkills: ["एमएस एक्सेल", "टैली / जीएसटी बिलिंग", "टाइपिंग कौशल"],
      },
    ];
  }

  return [
    {
      id: "electrician",
      title: "Electrician & Solar Technician",
      matchScore: 92,
      workStyle: "Hands-on & Technical · 6–12 months training",
      duration: "6 to 12 months",
      totalCost: "Govt ITI: ₹1,500 - ₹3,000 | Private: ₹12,000",
      startingPay: "₹14,000 - ₹20,000 / month",
      payGrowth: "₹28,000+ after 2 years or start own electrical services",
      verifiedCentresCount: 3,
      nearestCenter: "Government ITI Institute",
      travelDistance: "8 km away (Direct bus available)",
      safetyRating: "Safe with standard PPE (gloves, insulated tools)",
      dayInTheLife:
        "Wiring installations, home appliance diagnostics, solar panel mounting and circuit repair.",
      whyFit:
        "Matches your interest in fixing tools & electrical wiring with local job demand.",
      questionsAnswered: "4 of 5 family questions answered",
      evidenceLevel: "verified",
      keySkills: ["Wiring & Circuits", "Safety Testing", "Solar Maintenance"],
    },
    {
      id: "auto_technician",
      title: "Automobile & EV Service Mechanic",
      matchScore: 85,
      workStyle: "Vehicle repair & workshop · 1 year course",
      duration: "1 Year (ITI / PMKVY)",
      totalCost: "Govt center: ₹2,000 | Private: ₹15,000",
      startingPay: "₹13,000 - ₹18,000 / month",
      payGrowth: "Up to ₹30,000+ with EV diagnostic specialization",
      verifiedCentresCount: 2,
      nearestCenter: "Pradhan Mantri Kaushal Kendra (PMKK)",
      travelDistance: "12 km away",
      safetyRating: "Standard workshop safety protocols",
      dayInTheLife:
        "Servicing two-wheelers and four-wheelers, brake tuning, oil changes, and EV battery testing.",
      whyFit: "Matches your preference for mechanical and workshop-based work.",
      questionsAnswered: "3 of 5 family questions answered",
      evidenceLevel: "verified",
      keySkills: ["Engine Diagnostics", "Braking Systems", "EV Basics"],
    },
    {
      id: "data_entry_accounts",
      title: "Computer Operator & Office Assistant",
      matchScore: 78,
      workStyle: "Office-based work · 3–6 months diploma",
      duration: "3 to 6 months (Tally + Office suite)",
      totalCost: "₹4,000 - ₹8,000 (Fee subsidy available)",
      startingPay: "₹12,000 - ₹16,000 / month",
      payGrowth: "₹25,000+ with GST and bookkeeping experience",
      verifiedCentresCount: 4,
      nearestCenter: "District Skill Center",
      travelDistance: "4 km away (Town center)",
      safetyRating: "Completely safe indoor office environment",
      dayInTheLife:
        "Daily billing, record keeping in spreadsheets, customer support and document filing.",
      whyFit: "Good fit for office preference and secondary/college qualification.",
      questionsAnswered: "5 of 5 family questions answered",
      evidenceLevel: "guidance",
      keySkills: ["MS Excel", "Tally / GST", "Data Verification"],
    },
  ];
}
