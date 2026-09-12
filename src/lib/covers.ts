/** Desk rule: every published story must have PHOTO_CREDITS + /covers/{id}.jpg (Commons/CC or cleared mugshot). No painted placeholder on the live site. */
import type { SectionId } from "@/lib/types";
import credits from "./cover-credits.json";

export type CoverCredit = {
  file: string;
  artist: string;
  license: string;
  page: string;
  /** Official booking / judicial ID photo (public record or Commons PD/CC). */
  kind?: "mugshot" | "campaign-poster";
};

export const PHOTO_CREDITS = credits as Record<string, CoverCredit>;

export function hasCoverPhoto(id: string): boolean {
  return Boolean(PHOTO_CREDITS[id]);
}

export function coverSrc(id: string): string | undefined {
  if (!PHOTO_CREDITS[id]) return undefined;
  // Same-origin public/covers — updates on every deploy (jsDelivr @main stayed stale for mugshots).
  return `/covers/${id}.jpg`;
}

export function coverSrcFallback(id: string): string | undefined {
  const c = PHOTO_CREDITS[id];
  if (!c?.file) return undefined;
  if ((c.kind === "mugshot" || c.kind === "campaign-poster") && !/^File:/i.test(c.file)) return undefined;
  const file = c.file.replace(/^File:/i, "").replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1400`;
}

export function coverCredit(id: string): CoverCredit | undefined {
  return PHOTO_CREDITS[id];
}

export function coverCreditLine(id: string): string | undefined {
  const c = PHOTO_CREDITS[id];
  if (!c) return undefined;
  if (c.kind === "mugshot") {
    const who = c.artist || "Agency";
    const lic = c.license || "Public record";
    return `${who} · ${lic} · booking photo`;
  }
  if (c.kind === "campaign-poster") {
    const who = c.artist || "Campaign";
    const lic = c.license || "Campaign material";
    return `${who} · ${lic} · campaign poster`;
  }
  const who = c.artist || "Wikimedia Commons";
  return `${who} · ${c.license} · Wikimedia`;
}

export const SECTION_INK: Record<SectionId, { a: string; b: string; c: string }> = {
  world: { a: "#e10600", b: "#111111", c: "#ffe400" },
  accidents: { a: "#e10600", b: "#3a0a0a", c: "#f4f1ea" },
  stars: { a: "#8a5a12", b: "#111111", c: "#ffe400" },
  science: { a: "#143d66", b: "#111111", c: "#ffe400" },
  "faits-divers": { a: "#0f7a4a", b: "#111111", c: "#ffe400" },
  politics: { a: "#e10600", b: "#1a1a1a", c: "#ffe400" },
  animals: { a: "#0f7a4a", b: "#143d66", c: "#ffe400" },
  tech: { a: "#143d66", b: "#e10600", c: "#f4f1ea" },
  sports: { a: "#e10600", b: "#0f7a4a", c: "#ffe400" },
  "love-money": { a: "#8a5a12", b: "#111111", c: "#ffe400" },
  courts: { a: "#2b2b2b", b: "#e10600", c: "#f4f1ea" },
  commentaire: { a: "#8a5a12", b: "#1a120c", c: "#f4f1ea" },
  archive: { a: "#5c4030", b: "#1a120c", c: "#e8d5a3" },
};

export function coverSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) >>> 0;
  return h;
}
