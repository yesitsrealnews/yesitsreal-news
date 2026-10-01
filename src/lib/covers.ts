/** Desk rule: every published story must have PHOTO_CREDITS + /covers/{id}.jpg (Commons/CC or cleared mugshot). No painted placeholder on the live site. */
import type { SectionId } from "./types";
import credits from "./cover-credits.json";
import ogImages from "./og-images.json";

export type CoverCredit = {
  file: string;
  artist: string;
  license: string;
  page: string;
  /** Official booking / judicial ID photo (public record or Commons PD/CC). */
  kind?: "mugshot" | "campaign-poster";
};

export const PHOTO_CREDITS = credits as Record<string, CoverCredit>;

export const COVER_WIDTH = 960;
export const COVER_HEIGHT = 720;

/** Cover key for a story: its explicit `coverId` (Pre Pub photo carried over at Publier) when that file exists, else its own id. */
export function storyCoverId(story: { id: string; coverId?: string }): string {
  return story.coverId && PHOTO_CREDITS[story.coverId] ? story.coverId : story.id;
}

export function hasCoverPhoto(id: string): boolean {
  return Boolean(PHOTO_CREDITS[id]);
}

/** JPEG kept for Open Graph / crawlers that still prefer it. */
export function coverSrc(id: string): string | undefined {
  if (!PHOTO_CREDITS[id]) return undefined;
  return `/covers/${id}.jpg${coverVersionQuery(id)}`;
}

/**
 * `?v=<hash of photo + credit>` (same hash as og-images.json) on every local cover URL. /covers/* is served
 * `immutable` for a year, so an unversioned URL that was requested before its photo was deployed (e.g. a Pre
 * Pub thumb in Cambuse → 404) or whose photo was later replaced would stay stale in browsers. A new photo →
 * new hash → new URL.
 */
function coverVersionQuery(id: string): string {
  const v = (ogImages as Record<string, string>)[id];
  return v ? `?v=${v}` : "";
}

/**
 * Share visual (og:image / twitter:image): /og/{id}.jpg = the cover at 1200×630 with the credit line
 * burned into the bottom edge (scripts/make-og-images.mjs, run by `npm run build`). `?v=` busts social
 * caches when the photo or credit changes. Undefined when not generated → caller falls back to /og.jpg.
 */
export function coverShareSrc(id: string): string | undefined {
  const v = (ogImages as Record<string, string>)[id];
  if (!PHOTO_CREDITS[id] || !v) return undefined;
  return `/og/${id}.jpg?v=${v}`;
}

/** Display URL — WebP on the Vercel CDN after the build step. */
export function coverDisplaySrc(id: string): string | undefined {
  if (!PHOTO_CREDITS[id]) return undefined;
  return `/covers/${id}.webp${coverVersionQuery(id)}`;
}

/** Remote publisher photo via Vercel Image Optimization CDN. Local covers stay static AVIF/WebP. */
export function optimizedRemoteSrc(url: string | undefined, width = 960): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/") || url.startsWith("data:")) return url;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
  } catch {
    return undefined;
  }
  if (!import.meta.env.PROD) return url;
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=70`;
}

export function coverSrcSet(id: string, format: "webp" | "avif"): string | undefined {
  if (!PHOTO_CREDITS[id]) return undefined;
  const q = coverVersionQuery(id);
  return `/covers/${id}-480.${format}${q} 480w, /covers/${id}-960.${format}${q} 960w`;
}

export function coverSizes(kind: "hero" | "article" | "card" = "card"): string {
  if (kind === "hero") return "(min-width: 1024px) 60vw, 100vw";
  if (kind === "article") return "(min-width: 768px) 768px, 100vw";
  return "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw";
}

export function coverSrcFallback(id: string): string | undefined {
  const c = PHOTO_CREDITS[id];
  if (!c?.file) return undefined;
  if ((c.kind === "mugshot" || c.kind === "campaign-poster") && !/^File:/i.test(c.file)) return undefined;
  const file = c.file.replace(/^File:/i, "").replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=960`;
}

export function coverCredit(id: string): CoverCredit | undefined {
  return PHOTO_CREDITS[id];
}

/**
 * Scraped Commons "Artist" fields can carry boilerplate — keep just the name.
 * Strips: HTML entities, "( talk )" / "(talk)" / trailing "talk" link text, "(contribs)", "( Flickr )",
 * "de:Benutzer:" / "User:" prefixes, "(www.site)" URLs, " at English Wikipedia", Flickr " from City, Country",
 * "Name (Name)" duplicates, LoC "Last, First, 1922-2016, photographer" → "First Last".
 * Keep scripts/fetch-covers.py clean_artist() in step.
 */
export function cleanCreditArtist(raw: string | undefined): string {
  let a = (raw || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
  const assumed = a.match(/No machine-readable author provided\.\s*(.+?)\s+assumed/i);
  if (assumed) a = assumed[1];
  const userPrefix = /^(?:[a-z]{2,3}:)?(?:User|Benutzer|Utilisateur|Usuario|Utente|Gebruiker):/i;
  if (userPrefix.test(a)) a = a.replace(userPrefix, "").replace(/_/g, " ");
  a = a
    .replace(/~commonswiki$/i, "")
    .replace(/\s*\((?:[a-z-]+:)?User:[^)]*\)/gi, "")
    .replace(/\s*[([]\s*(?:talk|contribs?|discussion|diskussion|flickr)\s*[)\]]/gi, "")
    .replace(/(?:\s*[·|•,-])?\s+(?:talk|contribs)$/i, "")
    .replace(/\s*\((?:https?:\/\/|www\.)[^)]*\)/gi, "")
    .replace(/\s+at\s+[A-Z][a-z]+\s+Wikipedia$/, "")
    .replace(/\s+from\s+[A-Z][^,()[\]]*(?:,\s*[^,()[\]]+)*(?:\s*\[[^\]]*\])?$/, "")
    .trim();
  const dup = a.match(/^(.+?)\s*\(\s*(.+?)\s*\)$/);
  if (dup && dup[1] === dup[2]) a = dup[1];
  const loc = a.match(/^([^,]+),\s*([^,]+),\s*\d{4}-(?:\d{4})?(?:,\s*photographer)?$/i);
  if (loc) a = `${loc[2]} ${loc[1]}`;
  if (/^own work$/i.test(a) || /^https?:\/\//i.test(a)) return "";
  return a.length > 60 ? `${a.slice(0, 57).trimEnd()}…` : a;
}

/** Human label of where the photo lives (Wikimedia Commons, Flickr, agency site…). */
export function creditSourceLabel(page: string | undefined): string | undefined {
  if (!page) return undefined;
  try {
    const host = new URL(page).hostname.replace(/^www\./, "");
    if (host.endsWith("wikimedia.org") || host.endsWith("wikipedia.org")) return "Wikimedia Commons";
    if (host.endsWith("flickr.com")) return "Flickr";
    if (host.endsWith("unsplash.com")) return "Unsplash";
    if (host.endsWith("pexels.com")) return "Pexels";
    return host;
  } catch {
    return undefined;
  }
}

/** Short licence tag for compact credits: "CC BY-SA 4.0" → "CC BY-SA". */
function shortLicense(l: string): string {
  return l.replace(/^(CC (?:BY(?:-SA)?|0))\s+[\d.]+(?:\s+\w+)?$/i, "$1");
}

/**
 * Credit printed on the edge of the photo (desk rule: photographer + licence + source, always).
 * `compact` = "© Author · CC BY-SA" for small cards.
 */
export function coverCreditLine(id: string, variant: "full" | "compact" = "full"): string | undefined {
  const c = PHOTO_CREDITS[id];
  if (!c) return undefined;
  const artist = cleanCreditArtist(c.artist);
  let who: string;
  let lic: string;
  let tail: string | undefined;
  if (c.kind === "mugshot") {
    who = artist || "Agency";
    lic = c.license || "Public record";
    tail = "booking photo";
  } else if (c.kind === "campaign-poster") {
    who = artist || "Campaign";
    lic = c.license || "Campaign material";
    tail = "campaign poster";
  } else {
    who = artist || "Wikimedia Commons";
    lic = c.license || "";
    tail = creditSourceLabel(c.page);
    if (tail && tail === who) tail = undefined;
  }
  if (variant === "compact") {
    const sign = /public domain|cc0|public record/i.test(lic) ? "" : "© ";
    return [`${sign}${who}`, shortLicense(lic)].filter(Boolean).join(" · ");
  }
  return [who, lic, tail].filter(Boolean).join(" · ");
}

export const SECTION_INK: Record<SectionId, { a: string; b: string; c: string }> = {
  france: { a: "#e10600", b: "#111111", c: "#ffe400" },
  usa: { a: "#e10600", b: "#143d66", c: "#ffe400" },
  monde: { a: "#e10600", b: "#111111", c: "#ffe400" },
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
