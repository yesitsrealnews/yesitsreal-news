import type { QueueItem } from "@/lib/types";

export async function fetchStoredRss(): Promise<{
  items: QueueItem[];
  at?: string;
  count: number;
  killed: string[];
} | null> {
  try {
    const res = await fetch("/api/rss-pull?stored=1", { credentials: "include", cache: "no-store" });
    const data = (await res.json()) as {
      ok?: boolean;
      items?: QueueItem[];
      at?: string;
      count?: number;
      killed?: string[];
    };
    if (!res.ok || !data?.ok || !Array.isArray(data.items)) return null;
    return {
      items: data.items,
      at: data.at,
      count: data.count ?? data.items.length,
      killed: Array.isArray(data.killed) ? data.killed.filter((id) => typeof id === "string") : [],
    };
  } catch {
    return null;
  }
}
