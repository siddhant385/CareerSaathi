import type { SupportedLanguage } from "./types";

export interface TranslationDictionary {
  appName: string;
  saveExit: string;
  saveNotice: string;
  back: string;
  continue: string;
  skipLater: string;
  listen: string;
  askSaathi: string;
  saathiGreeting: string;
  whatCanSaathiAccess: string;
  close: string;
  reviewTitle: string;
  reviewSubtitle: string;
  readyTitle: string;
  readySubtitle: string;
  seeOptions: string;
  talkSaathi: string;
  maxSelectionsNote: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: "CareerSaathi",
    saveExit: "Save & Exit",
    saveNotice: "Your progress is kept on this device.",
    back: "Back",
    continue: "Continue",
    skipLater: "Skip / Add Later",
    listen: "Listen",
    askSaathi: "Need help? Ask Saathi",
    saathiGreeting:
      "Hi, I am Saathi. I can explain any question simply in your language.",
    whatCanSaathiAccess: "Saathi accesses only answers you choose to share.",
    close: "Close",
    reviewTitle: "Check Your Answers",
    reviewSubtitle: "You can tap any answer to adjust it before we continue.",
    readyTitle: "Your career conversation is ready!",
    readySubtitle:
      "Saathi will now help you and your family explore trusted vocational options.",
    seeOptions: "See My Starting Options →",
    talkSaathi: "Talk to Saathi First",
    maxSelectionsNote: "You can select up to 5 interests.",
  },
  hi: {
    appName: "करियर साथी",
    saveExit: "सुरक्षित करें और निकलें",
    saveNotice: "आपकी जानकारी इसी फोन पर सुरक्षित है।",
    back: "पीछे जाएं",
    continue: "आगे बढ़ें",
    skipLater: "बाद में जोड़ें",
    listen: "सुनें",
    askSaathi: "मदद चाहिए? साथी से पूछें",
    saathiGreeting:
      "नमस्ते, मैं साथी हूँ। मैं किसी भी सवाल को सरल भाषा में समझा सकता हूँ।",
    whatCanSaathiAccess:
      "साथी सिर्फ उन्हीं जानकारियों का उपयोग करेगा जिन्हें आप साझा करेंगे।",
    close: "बंद करें",
    reviewTitle: "अपने उत्तर जांचें",
    reviewSubtitle:
      "आगे बढ़ने से पहले आप किसी भी उत्तर को आसानी से बदल सकते हैं।",
    readyTitle: "आपकी करियर बातचीत तैयार है!",
    readySubtitle:
      "साथी अब आपको और आपके परिवार को सही वोकेशनल रास्ते चुनने में मदद करेगा।",
    seeOptions: "शुरुआती विकल्प देखें →",
    talkSaathi: "पहले साथी से बात करें",
    maxSelectionsNote: "आप अधिक से अधिक 5 रुचियां चुन सकते हैं।",
  },
};
