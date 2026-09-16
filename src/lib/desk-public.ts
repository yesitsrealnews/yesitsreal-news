import type { DeskStatusMap } from "@/lib/catalog-core";
import { getFrontPageIds } from "@/lib/desk-front-page";
import { getPublishedExtras } from "@/lib/desk-published";
import { getDeskStoryStatus } from "@/lib/desk-story-status";
import type { Story } from "@/lib/types";

export type PublicDesk = {
  extras: Story[];
  desk: DeskStatusMap;
  frontPageIds: string[];
};

export async function loadPublicDesk(): Promise<PublicDesk> {
  const [extras, desk, frontPageIds] = await Promise.all([
    getPublishedExtras().catch(() => [] as Story[]),
    getDeskStoryStatus(true).catch(() => ({} as DeskStatusMap)),
    getFrontPageIds(true).catch(() => [] as string[]),
  ]);
  return { extras, desk, frontPageIds };
}
