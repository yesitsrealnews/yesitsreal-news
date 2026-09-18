import { RSS_FEEDS, feedKind } from "./rss-feeds.ts";
import { scoreHit } from "./rss-keep.ts";

export type RssHitLike = {
  feed: string;
  url: string;
  title: string;
  summary?: string;
  id?: string;
};

const KILLED_CAP = 2000;

function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/** Strip tracking, www, amp, trailing slash — same paper, same kill. */
export function canonicalRssUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return trimmed;
    u.hash = "";
    u.hostname = u.hostname.replace(/^www\./i, "").toLowerCase();
    u.protocol = "https:";
    const drop = /^(utm_|fbclid|gclid|mc_|ns_|ito|ocid|ref|cmp|outputtype|ncid|s?cid)$/i;
    for (const key of [...u.searchParams.keys()]) {
      if (drop.test(key) || key.toLowerCase().startsWith("utm_")) u.searchParams.delete(key);
    }
    u.pathname = u.pathname
      .replace(/\/amp\/?$/i, "/")
      .replace(/\.amp$/i, "")
      .replace(/\/{2,}/g, "/");
    if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, "");
    return u.toString();
  } catch {
    return trimmed;
  }
}

function fnv1a(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return `q-rss-${(h >>> 0).toString(36)}`;
}

export function rssHitId(url: string): string {
  return fnv1a(canonicalRssUrl(url) || url);
}

function urlVariants(raw: string): string[] {
  const trimmed = raw.trim();
  const can = canonicalRssUrl(trimmed);
  const out = new Set<string>([trimmed, can].filter(Boolean));
  try {
    const u = new URL(can || trimmed);
    const host = u.hostname.replace(/^www\./i, "");
    const path = `${u.pathname}${u.search}`;
    out.add(`https://${host}${path}`);
    out.add(`https://www.${host}${path}`);
    out.add(`http://${host}${path}`);
    out.add(`http://www.${host}${path}`);
    if (!path.endsWith("/")) {
      out.add(`https://${host}${path}/`);
      out.add(`https://www.${host}${path}/`);
    }
  } catch {
    /* ignore */
  }
  return [...out];
}

/** Same headline = same piste, even if the feed URL moved. */
export function titleKillKey(title: string): string {
  const t = fold(title)
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .slice(0, 70);
  return t.length >= 12 ? `fp:t:${t}` : "";
}

export function hostKillKey(title: string, url: string): string {
  try {
    const host = new URL(canonicalRssUrl(url) || url).hostname.replace(/^www\./, "");
    const t = titleKillKey(title).replace(/^fp:t:/, "");
    return host && t ? `fp:h:${host}:${t}` : "";
  } catch {
    return "";
  }
}

export function killKeysFor(hit: { url?: string; title?: string; id?: string }): string[] {
  const out = new Set<string>();
  const push = (k?: string) => {
    if (k && k.length > 2) out.add(k);
  };
  push(hit.id);
  if (hit.url) {
    for (const variant of urlVariants(hit.url)) {
      push(variant);
      push(fnv1a(variant));
      push(rssHitId(variant));
    }
  }
  if (hit.title) {
    push(titleKillKey(hit.title));
    if (hit.url) push(hostKillKey(hit.title, hit.url));
  }
  return [...out];
}

export function kindForHit(hit: Pick<RssHitLike, "feed">): ReturnType<typeof feedKind> {
  const feed = RSS_FEEDS.find((f) => f.name === hit.feed);
  return feed ? feedKind(feed) : "general";
}

export function isKilledHit(hit: Pick<RssHitLike, "url" | "title" | "id">, killed: Set<string>): boolean {
  if (!killed.size) return false;
  return killKeysFor(hit).some((k) => killed.has(k));
}

export function itemIsKilled(
  item: {
    id?: string;
    sourceUrl?: string;
    story?: { id?: string; copy?: { fr?: { headline?: string }; en?: { headline?: string } } };
  },
  killed: Set<string>,
): boolean {
  const title = item.story?.copy?.fr?.headline || item.story?.copy?.en?.headline || "";
  if (item.id && killed.has(item.id)) return true;
  if (item.story?.id && killed.has(item.story.id)) return true;
  return isKilledHit({ url: item.sourceUrl || "", title, id: item.id }, killed);
}

/** Drop desk-killed URLs and anything that no longer matches the editorial keep list. */
export function filterRssHits<T extends RssHitLike>(hits: T[], killed: string[]): T[] {
  const dead = new Set(killed.filter(Boolean));
  const out: T[] = [];
  const seen = new Set<string>();
  for (const hit of hits) {
    if (!hit?.url || isKilledHit(hit, dead)) continue;
    const can = canonicalRssUrl(hit.url) || hit.url;
    const fp = titleKillKey(hit.title ?? "");
    if (seen.has(can) || (fp && seen.has(fp))) continue;
    const kind = kindForHit(hit);
    if (!scoreHit(hit.title ?? "", hit.summary ?? "", "", kind).keep) continue;
    seen.add(can);
    if (fp) seen.add(fp);
    out.push(hit);
  }
  return out;
}

export function expandKillKeys(keys: string[], hits: RssHitLike[]): string[] {
  const out = new Set<string>();
  const incoming = keys.map((k) => k.trim()).filter(Boolean);
  for (const clean of incoming) {
    for (const k of killKeysFor({ url: clean, id: clean, title: "" })) out.add(k);
    if (clean.startsWith("fp:")) out.add(clean);
  }
  for (const hit of hits) {
    const hitKeys = killKeysFor(hit);
    if (hitKeys.some((k) => out.has(k) || incoming.includes(k))) {
      for (const k of hitKeys) out.add(k);
    }
  }
  return [...out].slice(0, KILLED_CAP);
}

export function mergeKilled(prev: string[], extra: string[]): string[] {
  return [...new Set([...extra, ...prev].filter(Boolean))].slice(0, KILLED_CAP);
}
