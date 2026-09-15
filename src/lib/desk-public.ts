import type { DeskStatusMap } from "@/lib/catalog";
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

export function mergeExtras(server: Story[] | undefined, client: Story[]): Story[] {
  if (!server?.length) return client;
  const map = new Map<string, Story>();
  for (const s of server) map.set(s.id, s);
  for (const s of client) {
    const prev = map.get(s.id);
    if (!prev || +new Date(s.updatedAt) >= +new Date(prev.updatedAt)) map.set(s.id, s);
  }
  return [...map.values()];
}
