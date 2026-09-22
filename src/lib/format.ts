import { format, formatDistanceToNow, parseISO, type Locale } from "date-fns";
import { de, enGB, es, fr, it, nl, pt } from "date-fns/locale";
import type { Lang, Story, StoryCopy } from "@/lib/types";
import { LANG_BY_CODE } from "@/lib/i18n/langs";

/** Ship the desk languages. The rest fall back to English dates — saves ~200 kB of date-fns locales. */
const LOCALES: Partial<Record<Lang, Locale>> = {
  en: enGB,
  fr,
  es,
  pt,
  de,
  it,
  nl,
};

export function localeFor(lang: Lang) {
  return LOCALES[lang] ?? enGB;
}

export function formatDate(iso: string, lang: Lang) {
  return format(parseISO(iso), "d MMM yyyy", { locale: localeFor(lang) });
}

export function formatDateTime(iso: string, lang: Lang) {
  return format(parseISO(iso), "d MMM yyyy, HH:mm", { locale: localeFor(lang) });
}

export function fromNow(iso: string, lang: Lang) {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: localeFor(lang) });
}

/** Headlines are baked on the server. Client must not import the headlines tables. */
export function storyCopy(story: Story, lang: Lang): StoryCopy {
  const hit = story.copy?.[lang] ?? story.copy?.en ?? story.copy?.fr;
  if (hit) return hit;
  return {
    headline: story.slug || story.id || "Sans titre",
    dek: "",
    body: [],
    whyDumb: ["", "", ""],
    factCheckNote: "",
  };
}

export function storyBodyPending(story: Story, lang: Lang): boolean {
  const c = story.copy[lang];
  if (!c) return lang !== "en" && lang !== story.originalLang;
  if (lang === "en" || lang === story.originalLang) return false;
  return c.body.length === 0;
}

export function storySlug(story: Story, lang: Lang): string {
  return story.slugs[lang] ?? story.slug;
}

export function storyPath(story: Story, lang: Lang): string {
  return `/story/${storySlug(story, lang)}`;
}

export function langDir(lang: Lang): "ltr" | "rtl" {
  return LANG_BY_CODE[lang].dir;
}

export function flagEmoji(iso2: string): string {
  const cc = iso2.trim().toUpperCase();
  if (cc.length !== 2) return "";
  const a = cc.codePointAt(0);
  const b = cc.codePointAt(1);
  if (!a || !b) return "";
  return String.fromCodePoint(127397 + a, 127397 + b);
}

export function readingMinutes(body: string[]): number {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

/** Named signature when set on the story; else null (caller uses desk i18n). */
export function storyByline(story: Story, lang: Lang): string | null {
  const named = story.bylines?.[lang]?.trim();
  return named || null;
}
