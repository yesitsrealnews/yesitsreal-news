/** Desk rule: every published story must have PHOTO_CREDITS + /covers/{id}.jpg (Commons/CC). No painted placeholder on the live site. */
import type { SectionId } from "@/lib/types";
import credits from "./cover-credits.json";

export type CoverCredit = {
  file: string;
  artist: string;
  license: string;
  page: string;
};

export const PHOTO_CREDITS = credits as Record<string, CoverCredit>;

export function coverSrc(id: string): string | undefined {
  if (!PHOTO_CREDITS[id]) return undefined;
  // Hosted on GitHub — Vercel was 404ing /covers/*.jpg after s38.
  return `https://cdn.jsdelivr.net/gh/yesitsrealnews/yesitsreal-news@main/public/covers/${id}.jpg`;
}

export function coverSrcFallback(id: string): string | undefined {
  const c = PHOTO_CREDITS[id];
  if (!c?.file) return undefined;
  const file = c.file.replace(/^File:/i, "").replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1400`;
}

export function coverCredit(id: string): CoverCredit | undefined {
  return PHOTO_CREDITS[id];
}

export function coverCreditLine(id: string): string | undefined {
  const c = PHOTO_CREDITS[id];
  if (!c) return undefined;
  const who = c.artist || "Wikimedia Commons";
  return `${who} · ${c.license} · Wikimedia`;
}

export const SECTION_INK: Record<SectionId, { a: string; b: string; c: string }> = {
  world: { a: "#e10600", b: "#111111", c: "#ffe400" },
  accidents: { a: "#e10600", b: "#3a0a0a", c: "#f4f1ea" },
  stars: { a: "#8a5a12", b: "#111111", c: "#ffe400" },
  science: { a: "#143d66", b: "#111111", c: "#ffe400" },
  "faits-divers": { a: "#0f7a4a", b: "#111111", c: "#ffe400" },
  crime: { a: "#5a1020", b: "#e10600", c: "#f4f1ea" },
  politics: { a: "#e10600", b: "#1a1a1a", c: "#ffe400" },
  animals: { a: "#0f7a4a", b: "#143d66", c: "#ffe400" },
  tech: { a: "#143d66", b: "#e10600", c: "#f4f1ea" },
  sports: { a: "#e10600", b: "#0f7a4a", c: "#ffe400" },
  "love-money": { a: "#8a5a12", b: "#111111", c: "#ffe400" },
  courts: { a: "#2b2b2b", b: "#e10600", c: "#f4f1ea" },
};

export function coverSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) >>> 0;
  return h;
}
