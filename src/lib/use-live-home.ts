import { useEffect, useState } from "react";
import type { DeskStatusMap } from "@/lib/catalog-core";
import type { Story } from "@/lib/types";

export type HomeFeedPayload = {
  latest: Story[];
  sponsored: Story | null;
  extras: Story[];
  desk: DeskStatusMap;
  frontPageIds: string[];
};

/** Stale HTML (CDN) can miss today's une. Refetch a no-store copy after paint. */
export function useLiveHome(loaded: HomeFeedPayload | undefined): HomeFeedPayload | undefined {
  const [live, setLive] = useState(loaded);
  useEffect(() => {
    setLive(loaded);
  }, [loaded]);
  useEffect(() => {
    let cancelled = false;
    void fetch("/api/public-home", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Partial<HomeFeedPayload> & { ok?: boolean }) => {
        if (cancelled || !d?.ok || !Array.isArray(d.latest)) return;
        setLive({
          latest: d.latest,
          sponsored: d.sponsored ?? null,
          extras: Array.isArray(d.extras) ? d.extras : [],
          desk: d.desk && typeof d.desk === "object" ? d.desk : {},
          frontPageIds: Array.isArray(d.frontPageIds) ? d.frontPageIds : [],
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return live ?? loaded;
}
