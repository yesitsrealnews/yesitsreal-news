import type { Lang, SectionId, Story, StoryStatus } from "@/lib/types";
import { STORIES, getStoryBySlug as seedBySlug } from "@/lib/data/stories";
import { storyCopy } from "@/lib/format";

/** Rolling week for the une. Older copy stays published in rubriques, not on /. */
export const HOME_WINDOW_DAYS = 7;

export type DeskStatusMap = Record<string, "held" | "deleted">;

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

export function mergeStories(extras: Story[]): Story[] {
  const map = new Map<string, Story>();
  for (const s of STORIES) map.set(s.id, s);
  for (const s of extras) map.set(s.id, s);
  return [...map.values()].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

function deskOverride(storyId: string, deskStatus?: DeskStatusMap): "held" | "deleted" | undefined {
  const v = deskStatus?.[storyId];
  return v === "held" || v === "deleted" ? v : undefined;
}

function isPubliclyListed(story: Story, deskStatus?: DeskStatusMap): boolean {
  if (deskOverride(story.id, deskStatus)) return false;
  return story.status === "published" && !story.sponsored;
}

export function publishedStories(extras: Story[], deskStatus?: DeskStatusMap): Story[] {
  return mergeStories(extras).filter((s) => isPubliclyListed(s, deskStatus));
}

/** Admin list: published seeds/extras plus held/deleted overrides (still visible in Cambuse). */
export function deskStories(extras: Story[], deskStatus?: DeskStatusMap): Story[] {
  return mergeStories(extras)
    .filter((s) => {
      if (s.sponsored) return false;
      const o = deskOverride(s.id, deskStatus);
      if (o) return true;
      return s.status === "published";
    })
    .map((s) => {
      const o = deskOverride(s.id, deskStatus);
      if (!o) return s;
      return { ...s, status: o as StoryStatus };
    })
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

/** Une: desk pins first (even outside the week window), then this week’s published list. */
export function homeStories(extras: Story[], deskStatus?: DeskStatusMap, frontIds?: string[]): Story[] {
  const published = publishedStories(extras, deskStatus);
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
    .sort((a, b) => +storyNewsDate(b) - +storyNewsDate(a) || +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return [...pins, ...week];
}

export function sponsoredStory(extras: Story[], deskStatus?: DeskStatusMap): Story | undefined {
  return mergeStories(extras).find(
    (s) => s.sponsored && s.status === "published" && !deskOverride(s.id, deskStatus),
  );
}

export function findStory(slug: string, extras: Story[], deskStatus?: DeskStatusMap): Story | undefined {
  const needle = decodeURIComponent(slug).toLowerCase();
  const all = mergeStories(extras);
  const hit =
    all.find(
      (s) =>
        s.slug === needle ||
        Object.values(s.slugs).some((x) => x?.toLowerCase() === needle),
    ) ?? seedBySlug(needle);
  if (!hit) return undefined;
  if (deskOverride(hit.id, deskStatus)) return undefined;
  return hit;
}

export function inSection(extras: Story[], section: SectionId, deskStatus?: DeskStatusMap): Story[] {
  const all = publishedStories(extras, deskStatus);
  if (section === "world") {
    const own = all.filter((s) => s.section === "world");
    const rest = all.filter((s) => s.section !== "world" && s.section !== "archive" && s.section !== "commentaire" && s.countryCode !== "GB");
    const mixed = [...own, ...rest];
    return mixed.length ? mixed : all;
  }
  return all.filter((s) => s.section === section);
}

export function relatedStories(story: Story, extras: Story[], n = 4, deskStatus?: DeskStatusMap): Story[] {
  return publishedStories(extras, deskStatus)
    .filter((s) => s.id !== story.id)
    .sort((a, b) => {
      const same = Number(b.section === story.section) - Number(a.section === story.section);
      if (same) return same;
      return b.dumbness - a.dumbness;
    })
    .slice(0, n);
}

export function mostRead(extras: Story[], n = 6, pool?: Story[], deskStatus?: DeskStatusMap): Story[] {
  return [...(pool ?? publishedStories(extras, deskStatus))]
    .sort((a, b) => b.dumbness * 10 + b.sources.length - (a.dumbness * 10 + a.sources.length))
    .slice(0, n);
}

export function dumbest(extras: Story[], n = 8, pool?: Story[], deskStatus?: DeskStatusMap): Story[] {
  return [...(pool ?? publishedStories(extras, deskStatus))].sort(
    (a, b) => b.dumbness - a.dumbness || +new Date(b.publishedAt) - +new Date(a.publishedAt),
  ).slice(0, n);
}

export function breaking(extras: Story[], pool?: Story[], deskStatus?: DeskStatusMap): Story | undefined {
  const list = pool ?? publishedStories(extras, deskStatus);
  return list.find((s) => s.breaking) ?? list[0];
}

export function searchStories(extras: Story[], q: string, lang: Lang, deskStatus?: DeskStatusMap): Story[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return publishedStories(extras, deskStatus).filter((s) => {
    const c = storyCopy(s, lang);
    const blob = [c.headline, c.dek, c.body.join(" "), s.location, s.countryName, s.entities.join(" "), s.section].join(" ").toLowerCase();
    return blob.includes(query);
  });
}

export function countriesFrom(stories: Story[]): { code: string; name: string }[] {
  const map = new Map<string, string>();
  for (const s of stories) map.set(s.countryCode, s.countryName);
  return [...map.entries()]
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
