import type { Story } from "@/lib/types";
import { STORIES_A } from "@/lib/data/stories-a";
import { STORIES_B } from "@/lib/data/stories-b";
import { STORIES_C } from "@/lib/data/stories-c";
import { DESK_LIVE, REVUE_STORIES } from "@/lib/data/stories-revue";

export const STORIES: Story[] = [...STORIES_A, ...STORIES_B, ...STORIES_C, ...REVUE_STORIES, ...DESK_LIVE];

const CATALOG_IDS = new Set(STORIES.map((s) => s.id));
const CATALOG_SOURCE_URLS = new Set(STORIES.flatMap((s) => s.sources.map((x) => x.url)));

export function isCatalogId(id: string): boolean {
  return CATALOG_IDS.has(id);
}

export function isCatalogSourceUrl(url: string): boolean {
  return CATALOG_SOURCE_URLS.has(url);
}

export function getStoryBySlug(slug: string): Story | undefined {
  const needle = decodeURIComponent(slug).toLowerCase();
  return STORIES.find(
    (s) =>
      s.slug === needle ||
      Object.values(s.slugs).some((x) => x?.toLowerCase() === needle),
  );
}

export function storiesBySection(section: Story["section"]): Story[] {
  return STORIES.filter((s) => s.section === section && s.status === "published");
}
