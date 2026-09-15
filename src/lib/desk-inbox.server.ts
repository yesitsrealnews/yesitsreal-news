import { getStoredAssignments } from "@/lib/desk-assign-store";
import { hitToQueueItem, pullRssFeeds } from "@/lib/rss-ingest";
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
  const stale = !Number.isFinite(age) || age > STALE_MS || rss.hits.length === 0;
  if (opts?.refresh || stale) {
    try {
      const { hits } = await pullRssFeeds({ quick: true });
      const saved = await saveRssHits(hits);
      rss = saved ?? { at: new Date().toISOString(), hits };
    } catch {
      /* keep stored cache */
    }
  }
  const assign = await getStoredAssignments(true);
  const rssItems = rss.hits.map((h) => hitToQueueItem(h));
  const seen = new Set(assign.items.map((i) => i.id));
  const items = [...assign.items, ...rssItems.filter((i) => i.id && !seen.has(i.id))];
  return { items, at: assign.at || rss.at, rssAt: rss.at };
}
