import { getStoredAssignments } from "@/lib/desk-assign-store";
import { hitToQueueItem, pullRssFeeds } from "@/lib/rss-ingest";
import { filterRssHits, isKilledHit } from "@/lib/rss-killed";
import { getStoredRssHits, saveRssHits } from "@/lib/rss-store";
import type { QueueItem } from "@/lib/types";

const STALE_MS = 4 * 60 * 60 * 1000;

export type DeskInboxPayload = {
  items: QueueItem[];
  at: string;
  rssAt: string;
};

export async function loadDeskInbox(opts?: { refresh?: boolean }): Promise<DeskInboxPayload> {
  let rss = await getStoredRssHits(true);
  const age = rss.at ? Date.now() - Date.parse(rss.at) : Number.POSITIVE_INFINITY;
  const stale = !Number.isFinite(age) || age > STALE_MS;
  if (opts?.refresh || stale) {
    try {
      const { hits } = await pullRssFeeds({ quick: true });
      const live = filterRssHits(hits, rss.killed);
      const saved = await saveRssHits(live);
      rss = saved ?? { at: new Date().toISOString(), hits: live, killed: rss.killed };
    } catch {
      /* keep stored cache */
    }
  }
  const assign = await getStoredAssignments(true);
  const killed = new Set(rss.killed);
  const rssItems = rss.hits
    .filter((h) => h?.url && !isKilledHit(h, killed))
    .map((h) => hitToQueueItem(h))
    .filter((i) => i.id && !isKilledHit({ url: i.sourceUrl, title: i.story?.copy?.fr?.headline ?? "", id: i.id }, killed));
  const seen = new Set(assign.items.map((i) => i.id));
  const items = [...assign.items, ...rssItems.filter((i) => i.id && !seen.has(i.id))];
  return { items, at: assign.at || rss.at, rssAt: rss.at };
}
