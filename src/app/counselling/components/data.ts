import type { DialogueMessage } from "./types";

export const sampleDialogues: DialogueMessage[] = [
  {
    id: "d1",
    speaker: "saathi",
    textEn:
      "Hello! Based on your 10th/12th qualification and interest in fixing electrical appliances, the Electrician & Solar Technician trade is your strongest local fit.",
    textHi:
      "नमस्ते! आपकी 10वीं/12वीं योग्यता और बिजली के उपकरणों में रुचि के अनुसार, इलेक्ट्रीशियन और सोलर तकनीशियन कोर्स आपके लिए सबसे बेहतरीन विकल्प है।",
    widget: {
      id: "w1",
      type: "trade_spotlight",
      title: "Electrician & Solar Technician",
      subtitle: "Govt ITI & PMKVY Approved",
      badge: "Top 92% Match",
      verified: true,
      metrics: [
        { label: "Starting Pay / शुरुआती वेतन", value: "₹14,000 - ₹20,000 / mo" },
        { label: "Course Duration / कोर्स समय", value: "6 to 12 Months" },
        { label: "Govt ITI Fee / सरकारी फीस", value: "₹1,500 Total" },
      ],
      actionText: "Add to My Path / माय पाथ में जोड़ें",
      actionHref: "/my-path",
    },
  },
  {
    id: "d2",
    speaker: "saathi",
    textEn:
      "There is a verified Government ITI center just 8 km away from your town with direct local bus connectivity.",
    textHi:
      "आपके कस्बे से केवल 8 किमी की दूरी पर राजकीय आईटीआई केंद्र उपलब्ध है, जहाँ के लिए सीधी बस सुविधा भी है।",
    widget: {
      id: "w2",
      type: "nearby_center",
      title: "Government ITI Institute",
      subtitle: "Near Main Highway, 8 km away",
      badge: "Verified Local Center",
      verified: true,
      metrics: [
        { label: "Travel Distance", value: "8 km (15 mins by bus)" },
        { label: "Next Batch", value: "Admissions Open" },
        { label: "Placement Record", value: "84% Local Employment" },
      ],
      actionText: "View Center Details",
      actionHref: "/my-path",
    },
  },
  {
    id: "d3",
    speaker: "saathi",
    textEn:
      "Would you like to send a 1-page WhatsApp summary to your parents explaining safety, course costs, and starting pay?",
    textHi:
      "क्या आप अपने माता-पिता को व्हाट्सएप पर 1 पेज का सरल सारांश भेजना चाहते हैं, जिससे फीस और सुरक्षा की जानकारी मिल सके?",
    widget: {
      id: "w3",
      type: "parent_summary",
      title: "1-Page Parent Summary",
      subtitle: "WhatsApp / SMS Ready (Zero Jargon)",
      badge: "Family Reassurance",
      verified: true,
      metrics: [
        { label: "Safety & Hours", value: "100% Safe with PPE standard" },
        { label: "Net Investment", value: "₹1,500 (Scholarship eligible)" },
        { label: "1st Year Earnings", value: "₹1.6 Lakh+ expected" },
      ],
      actionText: "Send WhatsApp Card / व्हाट्सएप भेजें",
    },
  },
];
