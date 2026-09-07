import type { Story } from "@/lib/types";
import { STORIES_A } from "@/lib/data/stories-a";
import { STORIES_B } from "@/lib/data/stories-b";
import { STORIES_C } from "@/lib/data/stories-c";
import { STORIES_ARCHIVE } from "@/lib/data/stories-archive";

export const STORIES: Story[] = [...STORIES_A, ...STORIES_B, ...STORIES_C, ...STORIES_ARCHIVE];

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
