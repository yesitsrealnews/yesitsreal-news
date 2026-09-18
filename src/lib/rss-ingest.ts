import type { QueueItem } from "@/lib/types";
import { looksLikeSatire, makeQueueItem } from "@/lib/pipeline";
import { isSafeHttpUrl } from "@/lib/security";
import { RSS_FEEDS, feedKind, feedPriority, type RssFeed } from "@/lib/rss-feeds";
import { parseFeed, type ParsedRssItem } from "@/lib/rss-parse";
import { scoreHit } from "@/lib/rss-keep";
import { rssHitId } from "@/lib/rss-killed";

const UA =
  "Mozilla/5.0 (compatible; YESITSREAL-desk/1.0; +https://www.yesitsreal.news/) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36";
const FETCH_MS = 2800;
const POOL = 12;
const MAX_HITS = 18;

export type RssHit = {
  feed: string;
  domain: string;
  title: string;
  url: string;
  summary: string;
  published: string;
  countryCode: string;
  keep: boolean;
  score?: number;
  beat?: string;
  image?: string;
};

export { rssHitId } from "@/lib/rss-killed";

function hashId(url: string): string {
  return rssHitId(url);
}

export function shouldKeep(title: string, summary: string, feed: RssFeed): boolean {
  return scoreHit(title, summary, feed.region, feedKind(feed)).keep;
}

async function fetchFeedXml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(FETCH_MS),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!/<rss|<feed|<rdf/i.test(text.slice(0, 2500))) return null;
    return text;
  } catch {
    return null;
  }
}

async function mapPool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += n) {
    const chunk = await Promise.all(items.slice(i, i + n).map(fn));
    out.push(...chunk);
  }
  return out;
}

export async function pullRssFeeds(opts?: { quick?: boolean }): Promise<{ hits: RssHit[]; scanned: number; failed: string[] }> {
  const feeds = opts?.quick ? RSS_FEEDS.filter((f) => feedPriority(f) === 1) : RSS_FEEDS;
  const failed: string[] = [];
  const hits: RssHit[] = [];
  const seen = new Set<string>();

  const xmls = await mapPool(feeds, POOL, (f) => fetchFeedXml(f.url));
  feeds.forEach((feed, idx) => {
    const xml = xmls[idx];
    if (!xml) {
      failed.push(feed.name);
      return;
    }
    let items: ParsedRssItem[] = [];
    try {
      items = parseFeed(xml);
    } catch {
      failed.push(feed.name);
      return;
    }
    for (const item of items) {
      if (!isSafeHttpUrl(item.url) || looksLikeSatire(item.url)) continue;
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      const scored = scoreHit(item.title, item.summary, feed.region, feedKind(feed));
      if (!scored.keep) continue;
      hits.push({
        feed: feed.name,
        domain: feed.domain,
        title: item.title,
        url: item.url,
        summary: item.summary,
        published: item.published,
        countryCode: feed.countryCode,
        keep: true,
        score: scored.score,
        beat: scored.beat,
        ...(item.image && isSafeHttpUrl(item.image) ? { image: item.image } : {}),
      });
    }
  });

  hits.sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || +new Date(b.published) - +new Date(a.published));
  return { hits: hits.slice(0, MAX_HITS), scanned: feeds.length, failed };
}

export function hitToQueueItem(hit: RssHit): QueueItem {
  const visuel = hit.image ? ` Visuel source : ${hit.image}` : "";
  const beat = hit.beat && hit.beat !== "insolite-feed" ? ` Beat : ${hit.beat}.` : "";
  const item = makeQueueItem({
    url: hit.url,
    notes: `${hit.title}. ${hit.summary}${beat}${visuel}`.slice(0, 1100),
    country: hit.countryCode,
    name: `RSS · ${hit.feed}`,
  });
  const id = hashId(hit.url);
  item.id = id;
  item.story.id = id;
  item.story.slug = `rss-${id}`;
  item.story.slugs = { fr: `rss-${id}`, en: `rss-${id}` };
  item.story.countryCode = hit.countryCode;
  item.story.sources = [
    {
      title: hit.title,
      publisher: hit.feed,
      url: hit.url,
      date: hit.published.slice(0, 10),
      type: "local",
    },
  ];
  const fr = item.story.copy.fr ?? item.story.copy.en;
  item.story.copy.fr = { ...fr, headline: hit.title, dek: hit.summary || fr.dek };
  item.story.copy.en = { ...item.story.copy.en, headline: hit.title, dek: hit.summary || item.story.copy.en.dek };
  item.submittedAt = hit.published;
  item.submittedBy = `Veille · ${hit.feed}`;
  item.sourceUrl = hit.url;
  if (hit.image && isSafeHttpUrl(hit.image)) {
    item.leadImage = hit.image;
    item.story.coverUrl = hit.image;
  }
  return item;
}
