import type { DialogueMessage } from "./types";
import type { CareerPath } from "@/app/my-path/components/types";
import type { SupportedLanguage } from "@/app/onboarding/components/types";

export function getCareerDialogues(
  career: CareerPath,
  language: SupportedLanguage
): DialogueMessage[] {
  return [
    {
      id: "d1",
      speaker: "saathi",
      textEn: `Hello! Based on your qualification, the ${career.title} path is your strongest verified fit.`,
      textHi: `नमस्ते! आपकी योग्यता और रुचि के अनुसार, ${career.title} कोर्स आपके लिए सबसे मजबूत और प्रमाणित विकल्प है।`,
      widget: {
        id: "w1",
        type: "trade_spotlight",
        title: career.title,
        subtitle: career.workStyle,
        badge: `${career.matchScore}% Match`,
        verified: career.evidenceLevel === "verified",
        metrics: [
          {
            label: language === "hi" ? "शुरुआती वेतन" : "Starting Pay",
            value: career.startingPay,
          },
          {
            label: language === "hi" ? "कोर्स समय" : "Duration",
            value: career.duration,
          },
          {
            label: language === "hi" ? "कुल फीस" : "Total Fee",
            value: career.totalCost,
          },
        ],
        actionText: language === "hi" ? "माय पाथ में देखें" : "View on My Path",
        actionHref: "/my-path",
      },
    },
    {
      id: "d2",
      speaker: "saathi",
      textEn: `There is a verified training center: ${career.nearestCenter}, located ${career.travelDistance} with ${career.verifiedCentresCount} total centers.`,
      textHi: `आपके पास मान्यता प्राप्त संस्थान ${career.nearestCenter} है जो ${career.travelDistance} पर स्थित है।`,
      widget: {
        id: "w2",
        type: "nearby_center",
        title: career.nearestCenter,
        subtitle: `${career.travelDistance} away`,
        badge: language === "hi" ? "सत्यापित केंद्र" : "Verified Center",
        verified: true,
        metrics: [
          {
            label: language === "hi" ? "दूरी" : "Travel Distance",
            value: career.travelDistance,
          },
          {
            label: language === "hi" ? "वेतन वृद्धि" : "2-Yr Growth",
            value: career.payGrowth,
          },
          {
            label: language === "hi" ? "सुरक्षा रेटिंग" : "Safety Standard",
            value: career.safetyRating,
          },
        ],
        actionText: language === "hi" ? "दस्तावेज चेकलिस्ट देखें" : "View Application Checklist",
        actionHref: "/applications",
      },
    },
    {
      id: "d3",
      speaker: "saathi",
      textEn: `Would you like to share a 1-page summary with your parents explaining safety, course fees, and starting salary?`,
      textHi: `क्या आप अपने माता-पिता को व्हाट्सएप पर 1 पेज का सरल सारांश भेजना चाहते हैं, जिससे फीस और सुरक्षा की पूरी जानकारी मिल सके?`,
      widget: {
        id: "w3",
        type: "parent_summary",
        title: language === "hi" ? "1-पेज पारिवारिक सारांश" : "1-Page Parent Summary",
        subtitle: language === "hi" ? "व्हाट्सएप शेयर हेतु तैयार" : "Ready to share with family",
        badge: language === "hi" ? "परिवार भरोसा" : "Family Trust",
        verified: true,
        metrics: [
          {
            label: language === "hi" ? "माहौल व सुरक्षा" : "Safety & Hours",
            value: career.safetyRating,
          },
          {
            label: language === "hi" ? "कुल फीस" : "Total Cost",
            value: career.totalCost,
          },
          {
            label: language === "hi" ? "अनुमानित वेतन" : "Starting Pay",
            value: career.startingPay,
          },
        ],
        actionText: language === "hi" ? "परिवार पोर्टल खोलें" : "Open Family Portal",
        actionHref: "/family",
      },
    },
  ];
}
