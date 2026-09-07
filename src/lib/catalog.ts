import type { Lang, SectionId, Story } from "@/lib/types";
import { STORIES, getStoryBySlug as seedBySlug } from "@/lib/data/stories";
import { storyCopy } from "@/lib/format";

/** Rolling week for the une. Older copy stays published in rubriques, not on /. */
export const HOME_WINDOW_DAYS = 7;

export function storyNewsDate(story: Story): Date {
  const stamps = story.sources.map((s) => s.date).filter(Boolean);
  const raw = stamps.length ? stamps.sort()[0]! : story.publishedAt;
  const d = new Date(raw);
  return Number.isNaN(+d) ? new Date(story.publishedAt) : d;
}

export function isThisWeek(story: Story, now = Date.now()): boolean {
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

export function publishedStories(extras: Story[]): Story[] {
  return mergeStories(extras).filter((s) => s.status === "published" && !s.sponsored);
}

/** Une only: news dated in the last seven days. Archive remains live on section and article URLs. */
export function homeStories(extras: Story[]): Story[] {
  return publishedStories(extras)
    .filter((s) => isThisWeek(s))
    .sort((a, b) => +storyNewsDate(b) - +storyNewsDate(a) || +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function sponsoredStory(extras: Story[]): Story | undefined {
  return mergeStories(extras).find((s) => s.sponsored && s.status === "published");
}

export function findStory(slug: string, extras: Story[]): Story | undefined {
  const needle = decodeURIComponent(slug).toLowerCase();
  const all = mergeStories(extras);
  return (
    all.find(
      (s) =>
        s.slug === needle ||
        Object.values(s.slugs).some((x) => x?.toLowerCase() === needle),
    ) ?? seedBySlug(needle)
  );
}

export function inSection(extras: Story[], section: SectionId): Story[] {
  const all = publishedStories(extras);
  if (section === "world") {
    const own = all.filter((s) => s.section === "world");
    const rest = all.filter((s) => s.section !== "world" && s.countryCode !== "GB");
    const mixed = [...own, ...rest];
    return mixed.length ? mixed : all;
  }
  return all.filter((s) => s.section === section);
}

export function relatedStories(story: Story, extras: Story[], n = 4): Story[] {
  return publishedStories(extras)
    .filter((s) => s.id !== story.id)
    .sort((a, b) => {
      const same = Number(b.section === story.section) - Number(a.section === story.section);
      if (same) return same;
      return b.dumbness - a.dumbness;
    })
    .slice(0, n);
}

export function mostRead(extras: Story[], n = 6, pool?: Story[]): Story[] {
  return [...(pool ?? publishedStories(extras))]
    .sort((a, b) => b.dumbness * 10 + b.sources.length - (a.dumbness * 10 + a.sources.length))
    .slice(0, n);
}

export function dumbest(extras: Story[], n = 8, pool?: Story[]): Story[] {
  return [...(pool ?? publishedStories(extras))].sort(
    (a, b) => b.dumbness - a.dumbness || +new Date(b.publishedAt) - +new Date(a.publishedAt),
  ).slice(0, n);
}

export function breaking(extras: Story[], pool?: Story[]): Story | undefined {
  const list = pool ?? publishedStories(extras);
  return list.find((s) => s.breaking) ?? list[0];
}

export function searchStories(extras: Story[], q: string, lang: Lang): Story[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return publishedStories(extras).filter((s) => {
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
