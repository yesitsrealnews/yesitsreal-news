import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ar, bn, cs, da, de, el, enGB, es, fi, fr, he, hi, hu, id, it, ja, ko, nb, nl, pl, pt, ro, ru, sv, th, tr, uk, vi, zhCN, zhTW } from "date-fns/locale";
import type { Lang } from "@/lib/types";
import type { Story, StoryCopy } from "@/lib/types";
import { LANG_BY_CODE } from "@/lib/i18n/langs";
import { localizedCopy } from "@/lib/data/headlines";

const LOCALES = {
  en: enGB,
  fr,
  es,
  pt,
  de,
  it,
  nl,
  pl,
  sv,
  no: nb,
  da,
  fi,
  cs,
  ro,
  hu,
  el,
  tr,
  ar,
  he,
  hi,
  bn,
  ur: ar,
  id,
  vi,
  th,
  ja,
  ko,
  zh: zhCN,
  "zh-TW": zhTW,
  uk,
  ru,
} as const;

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

export function storyCopy(story: Story, lang: Lang): StoryCopy {
  return localizedCopy(story, lang).copy;
}

export function storyBodyPending(story: Story, lang: Lang): boolean {
  return localizedCopy(story, lang).bodyPending;
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
