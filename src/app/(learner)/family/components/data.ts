import type { ParentSummaryMetric, ParentConcern, CounsellorProfile } from "./types";

export const parentSummaryMetrics: ParentSummaryMetric[] = [
  {
    id: "fees",
    icon: "💰",
    labelEn: "Total Course Cost",
    labelHi: "कोर्स का कुल खर्च",
    valueEn: "₹1,500 Total",
    valueHi: "कुल ₹1,500",
    detailEn: "Govt ITI subsidized fee (Scholarship options available)",
    detailHi: "सरकारी आईटीआई सब्सिडी फीस (छात्रवृत्ति सुविधा उपलब्ध)",
  },
  {
    id: "salary",
    icon: "💵",
    labelEn: "Starting Monthly Pay",
    labelHi: "शुरुआती मासिक वेतन",
    valueEn: "₹14,000 - ₹20,000 / mo",
    valueHi: "₹14,000 - ₹20,000 प्रति माह",
    detailEn: "Grows to ₹28,000+ after 2 years or self-employment",
    detailHi: "2 वर्ष बाद ₹28,000+ या स्वयं की दुकान से कमाई",
  },
  {
    id: "distance",
    icon: "📍",
    labelEn: "Nearest Verified Center",
    labelHi: "नजदीकी सरकारी संस्थान",
    valueEn: "8 km away (Govt ITI)",
    valueHi: "8 किमी दूर (राजकीय आईटीआई)",
    detailEn: "Direct local bus available from main market",
    detailHi: "मुख्य बाजार से सीधी स्थानीय बस उपलब्ध",
  },
  {
    id: "safety",
    icon: "🛡️",
    labelEn: "Safety & Work Environment",
    labelHi: "सुरक्षा एवं कार्य वातावरण",
    valueEn: "100% Safe with PPE Standards",
    valueHi: "मानक सुरक्षा उपकरणों के साथ पूर्णतः सुरक्षित",
    detailEn: "Regulated workshop hours & protective gear mandatory",
    detailHi: "नियमित कार्यशाला समय और सुरक्षा उपकरण अनिवार्य",
  },
];

export const parentConcerns: ParentConcern[] = [
  {
    id: "cost_doubt",
    icon: "💰",
    questionEn: "Is the training fee too expensive for our family?",
    questionHi: "क्या यह कोर्स हमारे परिवार के बजट से बाहर है?",
    answerEn:
      "No. Government ITI fees are strictly regulated (approx ₹1,500 to ₹3,000 for the full year). In addition, government stipends of ₹1,000/month are available for eligible students.",
    answerHi:
      "नहीं। सरकारी आईटीआई की फीस पूरे साल के लिए केवल ₹1,500 से ₹3,000 के बीच होती है। इसके साथ ही पात्र छात्रों को प्रति माह ₹1,000 तक की सरकारी छात्रवृत्ति भी मिलती है।",
    badgeEn: "Verified Govt Fee",
    badgeHi: "सरकारी सब्सिडी प्राप्त",
  },
  {
    id: "safety_doubt",
    icon: "🛡️",
    questionEn: "Is this work safe and respectful?",
    questionHi: "क्या यह काम सुरक्षित और सम्मानजनक है?",
    answerEn:
      "Yes. Solar & electrical technicians work in structured environments with certified safety equipment. It is one of the most respected and high-demand technical professions in local towns.",
    answerHi:
      "हाँ। सोलर और इलेक्ट्रीशियन तकनीशियन का काम आधुनिक सुरक्षा उपकरणों के साथ होता है। यह स्थानीय बाजारों और कस्बों में एक प्रतिष्ठित और हमेशा मांग में रहने वाला तकनीकी पेशा है।",
    badgeEn: "100% Safe Workplace",
    badgeHi: "सुरक्षित पेशा",
  },
  {
    id: "distance_doubt",
    icon: "🚌",
    questionEn: "How will my child travel daily?",
    questionHi: "रोज आने-जाने में कोई परेशानी तो नहीं होगी?",
    answerEn:
      "The nearest verified training institute is 8 km away. Most students use the direct state transport bus with monthly student bus pass concessions.",
    answerHi:
      "नजदीकी केंद्र सिर्फ 8 किमी दूर है जहाँ के लिए सुबह-शाम सीधी बसें चलती हैं। विद्यार्थियों को रियायती बस पास की सुविधा भी मिलती है।",
    badgeEn: "Local Bus Concession",
    badgeHi: "रियायती बस पास",
  },
  {
    id: "future_doubt",
    icon: "📈",
    questionEn: "Will there be permanent job security after 2 years?",
    questionHi: "क्या 2 साल बाद नौकरी और कमाई पक्की रहेगी?",
    answerEn:
      "Electrical and solar maintenance skills never go out of demand. After 2 years of experience, technicians earn ₹25,000+ or open their own electrical services business.",
    answerHi:
      "बिजली और सोलर उपकरणों की मांग कभी कम नहीं होती। 2 साल के अनुभव के बाद कारीगर ₹25,000+ कमाते हैं या अपनी खुद की दुकान शुरू करते हैं।",
    badgeEn: "High Career Growth",
    badgeHi: "स्थायी भविष्य",
  },
];

export const seniorCounsellors: CounsellorProfile[] = [
  {
    id: "c1",
    name: "Priya Sharma (प्रिया शर्मा)",
    titleEn: "Senior Family Vocational Counsellor",
    titleHi: "वरिष्ठ परिवार एवं वोकेशनल काउंसलर",
    experienceEn: "8+ Years in ITI & NSDC Admissions",
    experienceHi: "आईटीआई एवं कौशल विकास में 8+ वर्षों का अनुभव",
    languages: ["हिन्दी (Hindi)", "भोजपुरी (Bhojpuri)", "मैथिली (Maithili)", "English"],
    rating: 4.9,
    familiesGuided: 1420,
    availableSlotEn: "Today: 4:00 PM - 7:00 PM (Free Call)",
    availableSlotHi: "आज: शाम 4:00 बजे से 7:00 बजे तक (निःशुल्क कॉल)",
    phoneNumber: "+91 98765 43210",
  },
  {
    id: "c2",
    name: "Rajeshwar Verma (राजेश्वर वर्मा)",
    titleEn: "Government ITI & Career Advisor",
    titleHi: "राजकीय आईटीआई एवं रोजगार विशेषज्ञ",
    experienceEn: "12+ Years Industry Guidance",
    experienceHi: "12+ वर्षों का तकनीकी एवं सरकारी मार्गदर्शन",
    languages: ["हिन्दी (Hindi)", "मगही (Magahi)", "English"],
    rating: 4.8,
    familiesGuided: 2150,
    availableSlotEn: "Tomorrow: 10:00 AM - 1:00 PM (Free Call)",
    availableSlotHi: "कल: सुबह 10:00 बजे से 1:00 बजे तक (निःशुल्क कॉल)",
    phoneNumber: "+91 98765 43211",
  },
];
