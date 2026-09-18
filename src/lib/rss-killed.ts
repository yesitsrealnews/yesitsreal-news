import { RSS_FEEDS, feedKind } from "./rss-feeds.ts";
import { scoreHit } from "./rss-keep.ts";

export type RssHitLike = {
  feed: string;
  url: string;
  title: string;
  summary?: string;
};

const KILLED_CAP = 500;

export function rssHitId(url: string): string {
  let h = 2166136261;
  for (let i = 0; i < url.length; i++) h = Math.imul(h ^ url.charCodeAt(i), 16777619);
  return `q-rss-${(h >>> 0).toString(36)}`;
}

export function kindForHit(hit: Pick<RssHitLike, "feed">): ReturnType<typeof feedKind> {
  const feed = RSS_FEEDS.find((f) => f.name === hit.feed);
  return feed ? feedKind(feed) : "general";
}

export function isKilledHit(hit: Pick<RssHitLike, "url">, killed: Set<string>): boolean {
  if (!hit.url) return false;
  return killed.has(hit.url) || killed.has(rssHitId(hit.url));
}

/** Drop desk-killed URLs and anything that no longer matches the editorial keep list. */
export function filterRssHits<T extends RssHitLike>(hits: T[], killed: string[]): T[] {
  const dead = new Set(killed.filter(Boolean));
  const out: T[] = [];
  const seen = new Set<string>();
  for (const hit of hits) {
    if (!hit?.url || seen.has(hit.url) || isKilledHit(hit, dead)) continue;
    const kind = kindForHit(hit);
    if (!scoreHit(hit.title ?? "", hit.summary ?? "", "", kind).keep) continue;
    seen.add(hit.url);
    out.push(hit);
  }
  return out;
}

export function expandKillKeys(keys: string[], hits: RssHitLike[]): string[] {
  const out = new Set<string>();
  for (const key of keys) {
    const clean = key.trim();
    if (!clean) continue;
    out.add(clean);
    for (const hit of hits) {
      if (!hit?.url) continue;
      const id = rssHitId(hit.url);
      if (clean === id || clean === hit.url) {
        out.add(hit.url);
        out.add(id);
      }
    }
  }
  return [...out].slice(0, KILLED_CAP);
}

export function mergeKilled(prev: string[], extra: string[]): string[] {
  return [...new Set([...extra, ...prev].filter(Boolean))].slice(0, KILLED_CAP);
}
