import type { SupportedLanguage } from "./types";

interface LanguageSelectorProps {
  language: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
}

export function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 border rounded-full p-1 bg-muted/30">
      <button
        type="button"
        onClick={() => onSelect("en")}
        aria-pressed={language === "en"}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
          language === "en"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onSelect("hi")}
        aria-pressed={language === "hi"}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
          language === "hi"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
