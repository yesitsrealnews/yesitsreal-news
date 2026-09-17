import type { QueueItem } from "@/lib/types";

export async function fetchStoredRss(): Promise<{ items: QueueItem[]; at?: string; count: number } | null> {
  try {
    const res = await fetch("/api/rss-pull?stored=1", { credentials: "include", cache: "no-store" });
    const data = (await res.json()) as { ok?: boolean; items?: QueueItem[]; at?: string; count?: number };
    if (!res.ok || !data?.ok || !Array.isArray(data.items)) return null;
    return { items: data.items, at: data.at, count: data.count ?? data.items.length };
  } catch {
    return null;
  }
}
