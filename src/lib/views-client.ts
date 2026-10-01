import { useEffect, useState } from "react";
import type { StoryViewStats, ViewsSummary } from "@/lib/views-core";

let lastSent = { id: "", at: 0 };

/** Public story page: one beacon per view (client navigations included). No cookies. */
export function useStoryViewBeacon(storyId: string | undefined) {
  useEffect(() => {
    if (!storyId || !/^s\d+$/.test(storyId) || typeof window === "undefined") return;
    if (navigator.webdriver) return;
    const path = window.location.pathname;
    if (!path.startsWith("/story/")) return;
    const now = Date.now();
    if (lastSent.id === storyId && now - lastSent.at < 5_000) return;
    lastSent = { id: storyId, at: now };
    try {
      void fetch("/api/views", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: storyId }),
      }).catch(() => undefined);
    } catch {
      /* never break the article */
    }
  }, [storyId]);
}

export type DeskViews = ViewsSummary & { ok: true };

/** La Cambuse: per-article counters (desk cookie required). */
export function useDeskViews(): { data: DeskViews | null; error: string } {
  const [data, setData] = useState<DeskViews | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    void fetch("/api/views", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d: DeskViews | { ok: false; reason?: string }) => {
        if (!live) return;
        if (d.ok) setData(d);
        else setError(d.reason || "unavailable");
      })
      .catch(() => live && setError("network"));
    return () => {
      live = false;
    };
  }, []);
  return { data, error };
}

const nf = new Intl.NumberFormat("fr-FR");
export function fmtViews(n: number | undefined): string {
  return nf.format(n ?? 0);
}

export function statsFor(data: DeskViews | null, id: string | undefined): StoryViewStats {
  return (id && data?.stories[id]) || { views: 0, uniques: 0, views7d: 0, uniques7d: 0 };
}
