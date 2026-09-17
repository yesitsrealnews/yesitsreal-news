import type { Lang, SectionId, Story } from "./types.ts";
import { canonicalSection } from "./data/sections.ts";

/** Rolling week for the une. Older copy stays published in rubriques, not on /. */
export const HOME_WINDOW_DAYS = 7;

export type DeskStatusMap = Record<string, "held" | "deleted" | "published">;

export function storyNewsDate(story: Story): Date {
  const stamps = story.sources.map((s) => s.date).filter(Boolean);
  const raw = stamps.length ? stamps.sort()[0]! : story.publishedAt;
  const d = new Date(raw);
  return Number.isNaN(+d) ? new Date(story.publishedAt) : d;
}

export function isThisWeek(story: Story, now = Date.now()): boolean {
  if (story.section === "archive") return false;
  const t = +storyNewsDate(story);
  if (Number.isNaN(t)) return false;
  const week = HOME_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  return t <= now + 24 * 60 * 60 * 1000 && now - t <= week;
}

export function mergeStories(seed: Story[], extras: Story[]): Story[] {
  const map = new Map<string, Story>();
  for (const s of seed) map.set(s.id, s);
  const seedIds = new Set(map.keys());
  const catalogUrls = new Set(
    seed.filter((s) => s.status === "published").flatMap((s) => s.sources.map((x) => x.url)),
  );
  for (const s of extras) {
    if (seedIds.has(s.id)) continue;
    if (s.sources.some((x) => catalogUrls.has(x.url))) continue;
    map.set(s.id, canonicalizeStory(s));
  }
  return [...map.values()].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}


function canonicalizeStory(s: Story): Story {
  const section = canonicalSection(s.section);
  if (!section || section === s.section) return s;
  return { ...s, section };
}

function inventedHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === "example" ||
      host.endsWith(".example") ||
      host === "example.com" ||
      host.endsWith(".example.com") ||
      host === "example.net" ||
      host.endsWith(".example.net") ||
      host === "example.org" ||
      host.endsWith(".example.org")
    );
  } catch {
    return /(?:^|[/.])example(?:[/.:]|$)/i.test(url);
  }
}

function inventedSources(story: Story): boolean {
  return story.sources.some((s) => inventedHost(s.url));
}

function deskOverride(storyId: string, deskStatus?: DeskStatusMap): "held" | "deleted" | "published" | undefined {
  const v = deskStatus?.[storyId];
  return v === "held" || v === "deleted" || v === "published" ? v : undefined;
}

function isPubliclyListed(story: Story, deskStatus?: DeskStatusMap): boolean {
  const o = deskOverride(story.id, deskStatus);
  if (o === "held" || o === "deleted") return false;
  if (inventedSources(story)) return false;
  if (story.sponsored) return false;
  if (o === "published") return true;
  return story.status === "published";
}

export function publishedStories(seed: Story[], extras: Story[], deskStatus?: DeskStatusMap): Story[] {
  return mergeStories(seed, extras).filter((s) => isPubliclyListed(s, deskStatus));
}

export function deskStories(seed: Story[], extras: Story[], deskStatus?: DeskStatusMap): Story[] {
  return mergeStories(seed, extras)
    .filter((s) => {
      if (s.sponsored) return false;
      if (s.status === "deleted") return false;
      const o = deskOverride(s.id, deskStatus);
      if (o === "deleted") return false;
      if (o === "held" || o === "published") return true;
      return s.status === "published" || s.status === "review" || s.status === "held";
    })
    .map((s): Story => {
      const o = deskOverride(s.id, deskStatus);
      if (o === "held" || o === "deleted") return { ...s, status: o };
      if (o === "published") return { ...s, status: "published" };
      return s;
    })
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function homeStories(
  seed: Story[],
  extras: Story[],
  deskStatus?: DeskStatusMap,
  frontIds?: string[],
): Story[] {
  const published = publishedStories(seed, extras, deskStatus);
  const byId = new Map(published.map((s) => [s.id, s]));
  const pins: Story[] = [];
  const pinned = new Set<string>();
  for (const id of frontIds ?? []) {
    const s = byId.get(id);
    if (!s || pinned.has(id)) continue;
    pins.push(s);
    pinned.add(id);
  }
  const week = published
    .filter((s) => !pinned.has(s.id) && isThisWeek(s))
    .sort((a, b) => {
      const br = Number(!!b.breaking) - Number(!!a.breaking);
      if (br) return br;
      return +new Date(b.publishedAt) - +new Date(a.publishedAt) || +storyNewsDate(b) - +storyNewsDate(a);
    });
  return [...pins, ...week];
}

/** Public une: keep the server-ordered list, then append desk extras the HTML missed. */
export function appendToHome(serverLatest: Story[], extras: Story[], deskStatus?: DeskStatusMap): Story[] {
  const seen = new Set<string>();
  const out: Story[] = [];
  for (const s of serverLatest) {
    if (!s?.id || seen.has(s.id) || !isPubliclyListed(s, deskStatus)) continue;
    seen.add(s.id);
    out.push(s);
  }
  const extraListed = extras
    .filter((s) => s?.id && !seen.has(s.id) && isPubliclyListed(s, deskStatus) && isThisWeek(s))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  for (const s of extraListed) {
    seen.add(s.id);
    out.push(s);
  }
  return out;
}

export function sponsoredStory(seed: Story[], extras: Story[], deskStatus?: DeskStatusMap): Story | undefined {
  return mergeStories(seed, extras).find(
    (s) =>
      s.sponsored &&
      s.status === "published" &&
      deskOverride(s.id, deskStatus) !== "held" &&
      deskOverride(s.id, deskStatus) !== "deleted",
  );
}

export function findStory(
  seed: Story[],
  slug: string,
  extras: Story[],
  deskStatus?: DeskStatusMap,
  seedBySlug?: (slug: string) => Story | undefined,
): Story | undefined {
  const needle = decodeURIComponent(slug).toLowerCase();
  const all = mergeStories(seed, extras);
  const match = (s: Story) =>
    s.id.toLowerCase() === needle ||
    s.slug === needle ||
    Object.values(s.slugs).some((x) => x?.toLowerCase() === needle);
  let hit = all.find(match) ?? seedBySlug?.(needle);
  if (!hit) {
    const extra = extras.find(match);
    if (extra) {
      const urls = new Set(extra.sources.map((s) => s.url));
      hit = seed.find((s) => s.sources.some((x) => urls.has(x.url)));
    }
  }
  if (!hit) return undefined;
  if (!isPubliclyListed(hit, deskStatus)) return undefined;
  return hit;
}

export function inSection(
  seed: Story[],
  extras: Story[],
  section: SectionId,
  deskStatus?: DeskStatusMap,
): Story[] {
  const all = publishedStories(seed, extras, deskStatus);
  if (section === "world") {
    const own = all.filter((s) => s.section === "world");
    const rest = all.filter(
      (s) => s.section !== "world" && s.section !== "archive" && s.section !== "commentaire" && s.countryCode !== "GB",
    );
    const mixed = [...own, ...rest];
    return mixed.length ? mixed : all;
  }
  return all.filter((s) => s.section === section);
}

export function relatedStories(
  seed: Story[],
  story: Story,
  extras: Story[],
  n = 4,
  deskStatus?: DeskStatusMap,
): Story[] {
  return publishedStories(seed, extras, deskStatus)
    .filter((s) => s.id !== story.id)
    .sort((a, b) => {
      const same = Number(b.section === story.section) - Number(a.section === story.section);
      if (same) return same;
      return b.sources.length - a.sources.length || +new Date(b.publishedAt) - +new Date(a.publishedAt);
    })
    .slice(0, n);
}

export function mostRead(seed: Story[], extras: Story[], n = 6, pool?: Story[], deskStatus?: DeskStatusMap): Story[] {
  return [...(pool ?? publishedStories(seed, extras, deskStatus))]
    .sort((a, b) => b.sources.length - a.sources.length || +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, n);
}

export function dumbest(seed: Story[], extras: Story[], n = 8, pool?: Story[], deskStatus?: DeskStatusMap): Story[] {
  return [...(pool ?? publishedStories(seed, extras, deskStatus))]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, n);
}

export function breaking(seed: Story[], extras: Story[], pool?: Story[], deskStatus?: DeskStatusMap): Story | undefined {
  const list = pool ?? publishedStories(seed, extras, deskStatus);
  return list.find((s) => s.breaking) ?? list[0];
}

function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function tokenVariants(t: string): string[] {
  const out = [t];
  if (t.endsWith("es") && t.length > 4) out.push(t.slice(0, -2));
  else if (t.endsWith("s") && t.length > 3) out.push(t.slice(0, -1));
  return out;
}

function fieldHits(field: string, variants: string[]): boolean {
  return variants.some((v) => field.includes(v));
}

export function searchStories(
  seed: Story[],
  extras: Story[],
  q: string,
  _lang: Lang,
  deskStatus?: DeskStatusMap,
): Story[] {
  const raw = q.trim();
  if (!raw) return [];
  const tokens = fold(raw)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 2);
  if (!tokens.length) return [];
  const ranked: { story: Story; score: number }[] = [];
  for (const s of publishedStories(seed, extras, deskStatus)) {
    const copies = Object.values(s.copy);
    const headline = fold(copies.map((c) => c.headline).join(" "));
    const dek = fold(copies.map((c) => c.dek).join(" "));
    const sources = fold(s.sources.flatMap((src) => [src.title, src.publisher]).join(" "));
    const rest = fold(
      [
        ...copies.flatMap((c) => [c.body.join(" "), c.whyDumb.join(" "), c.factCheckNote]),
        s.location,
        s.countryName,
        s.countryCode,
        s.section,
        s.entities.join(" "),
        s.slug,
        ...Object.values(s.slugs ?? {}),
        ...s.sources.map((src) => src.url),
      ].join(" "),
    );
    let score = 0;
    let miss = false;
    for (const t of tokens) {
      const vars = tokenVariants(t);
      if (fieldHits(headline, vars)) score += 8;
      else if (fieldHits(dek, vars)) score += 4;
      else if (fieldHits(sources, vars)) score += 3;
      else if (fieldHits(rest, vars)) score += 1;
      else {
        miss = true;
        break;
      }
    }
    if (miss || score === 0) continue;
    ranked.push({ story: s, score });
  }
  return ranked
    .sort((a, b) => b.score - a.score || +new Date(b.story.publishedAt) - +new Date(a.story.publishedAt))
    .map((r) => r.story);
}

export function countriesFrom(stories: Story[]): { code: string; name: string }[] {
  const map = new Map<string, string>();
  for (const s of stories) map.set(s.countryCode, s.countryName);
  return [...map.entries()]
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
