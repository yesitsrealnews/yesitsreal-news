import type { Lang } from "@/lib/types";

export interface LangMeta {
  code: Lang;
  name: string;
  native: string;
  dir: "ltr" | "rtl";
  locale: string;
  hreflang: string;
}

export const LANGS: LangMeta[] = [
  { code: "en", name: "English", native: "English", dir: "ltr", locale: "en-GB", hreflang: "en" },
  { code: "fr", name: "French", native: "Français", dir: "ltr", locale: "fr-FR", hreflang: "fr" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr", locale: "es-ES", hreflang: "es" },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr", locale: "pt-PT", hreflang: "pt" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr", locale: "de-DE", hreflang: "de" },
  { code: "it", name: "Italian", native: "Italiano", dir: "ltr", locale: "it-IT", hreflang: "it" },
  { code: "nl", name: "Dutch", native: "Nederlands", dir: "ltr", locale: "nl-NL", hreflang: "nl" },
  { code: "pl", name: "Polish", native: "Polski", dir: "ltr", locale: "pl-PL", hreflang: "pl" },
  { code: "sv", name: "Swedish", native: "Svenska", dir: "ltr", locale: "sv-SE", hreflang: "sv" },
  { code: "no", name: "Norwegian", native: "Norsk", dir: "ltr", locale: "nb-NO", hreflang: "no" },
  { code: "da", name: "Danish", native: "Dansk", dir: "ltr", locale: "da-DK", hreflang: "da" },
  { code: "fi", name: "Finnish", native: "Suomi", dir: "ltr", locale: "fi-FI", hreflang: "fi" },
  { code: "cs", name: "Czech", native: "Čeština", dir: "ltr", locale: "cs-CZ", hreflang: "cs" },
  { code: "ro", name: "Romanian", native: "Română", dir: "ltr", locale: "ro-RO", hreflang: "ro" },
  { code: "hu", name: "Hungarian", native: "Magyar", dir: "ltr", locale: "hu-HU", hreflang: "hu" },
  { code: "el", name: "Greek", native: "Ελληνικά", dir: "ltr", locale: "el-GR", hreflang: "el" },
  { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr", locale: "tr-TR", hreflang: "tr" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl", locale: "ar", hreflang: "ar" },
  { code: "he", name: "Hebrew", native: "עברית", dir: "rtl", locale: "he-IL", hreflang: "he" },
  { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr", locale: "hi-IN", hreflang: "hi" },
  { code: "bn", name: "Bengali", native: "বাংলা", dir: "ltr", locale: "bn-BD", hreflang: "bn" },
  { code: "ur", name: "Urdu", native: "اردو", dir: "rtl", locale: "ur-PK", hreflang: "ur" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr", locale: "id-ID", hreflang: "id" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr", locale: "vi-VN", hreflang: "vi" },
  { code: "th", name: "Thai", native: "ไทย", dir: "ltr", locale: "th-TH", hreflang: "th" },
  { code: "ja", name: "Japanese", native: "日本語", dir: "ltr", locale: "ja-JP", hreflang: "ja" },
  { code: "ko", name: "Korean", native: "한국어", dir: "ltr", locale: "ko-KR", hreflang: "ko" },
  { code: "zh", name: "Chinese (Simplified)", native: "简体中文", dir: "ltr", locale: "zh-CN", hreflang: "zh-Hans" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", dir: "ltr", locale: "zh-TW", hreflang: "zh-Hant" },
  { code: "uk", name: "Ukrainian", native: "Українська", dir: "ltr", locale: "uk-UA", hreflang: "uk" },
  { code: "ru", name: "Russian", native: "Русский", dir: "ltr", locale: "ru-RU", hreflang: "ru" },
];

export const LANG_BY_CODE: Record<Lang, LangMeta> = Object.fromEntries(
  LANGS.map((l) => [l.code, l]),
) as Record<Lang, LangMeta>;

export const RTL_LANGS = new Set<Lang>(["ar", "he", "ur"]);

export function isLang(value: string | null | undefined): value is Lang {
  return !!value && (LANG_BY_CODE as Record<string, LangMeta>)[value] != null;
}

export function detectBrowserLang(input?: readonly string[]): Lang {
  const list = input ?? (typeof navigator !== "undefined" ? navigator.languages : ["en"]);
  for (const raw of list) {
    const lower = raw.toLowerCase();
    if (lower.startsWith("zh-tw") || lower.startsWith("zh-hant") || lower === "zh-hk") return "zh-TW";
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("nb") || lower.startsWith("nn") || lower.startsWith("no")) return "no";
    const short = lower.slice(0, 2);
    if (isLang(short)) return short;
  }
  return "fr";
}
