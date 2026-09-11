import type { QueueItem } from "@/lib/types";
import { detectSensitivity, looksLikeSatire, makeQueueItem, scoreDumbness } from "@/lib/pipeline";
import { isSafeHttpUrl } from "@/lib/security";
import { RSS_FEEDS, type RssFeed } from "@/lib/rss-feeds";
import { parseFeed, type ParsedRssItem } from "@/lib/rss-parse";

const UA = "YESITSREAL-desk/1.0 (https://www.yesitsreal.news/; desk@yesitsreal.news)";
const FETCH_MS = 2000;

const SKIP =
  /\b(dead|died|death|killed|killing|murder|suicide|massacre|war in|rape|tué|tuee|tuerie|décès|deces|\bmort\b|\bmorte\b|guerre|viol\b|mineur|underage|child sex)\b/i;

const KEEP =
  /arrêté|arrete|mairie|maire|canard|pigeon|boa|moustique|touriste|basque|tribunal|amende|huissier|interdit|survol|bizarre|fail|goldfish|poisson rouge|biochar|béton|beton|caca|seau|voiturette|imprimante|ig nobel|cerf|deer|roundabout|copropriét|municipal|oddly|weird|absurd|rubber duck|faecal|fecal|poop|concrete|tourist office|office de tourisme|insolite|incroyable|étrange|etrange|ridicule|préfet|prefet|gendarme|arrêté municipal|by-law|bylaw/i;

export type RssHit = {
  feed: string;
  domain: string;
  title: string;
  url: string;
  summary: string;
  published: string;
  countryCode: string;
  keep: boolean;
};

function hashId(url: string): string {
  let h = 2166136261;
  for (let i = 0; i < url.length; i++) h = Math.imul(h ^ url.charCodeAt(i), 16777619);
  return `q-rss-${(h >>> 0).toString(36)}`;
}

export function shouldKeep(title: string, summary: string, feed: RssFeed): boolean {
  const blob = `${title} ${summary}`;
  if (SKIP.test(blob)) return false;
  if (detectSensitivity(blob) === "reject-minors") return false;
  if (KEEP.test(blob)) return true;
  if (/science/i.test(feed.region) && scoreDumbness(blob).score >= 7) return true;
  return scoreDumbness(blob).score >= 8;
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

export async function pullRssFeeds(): Promise<{ hits: RssHit[]; scanned: number; failed: string[] }> {
  const feeds = RSS_FEEDS;
  const failed: string[] = [];
  const hits: RssHit[] = [];
  const seen = new Set<string>();

  const xmls = await Promise.all(feeds.map((f) => fetchFeedXml(f.url)));
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
      const keep = shouldKeep(item.title, item.summary, feed);
      if (!keep) continue;
      hits.push({
        feed: feed.name,
        domain: feed.domain,
        title: item.title,
        url: item.url,
        summary: item.summary,
        published: item.published,
        countryCode: feed.countryCode,
        keep: true,
      });
    }
  });

  hits.sort((a, b) => +new Date(b.published) - +new Date(a.published));
  return { hits: hits.slice(0, 50), scanned: feeds.length, failed };
}

export function hitToQueueItem(hit: RssHit): QueueItem {
  const item = makeQueueItem({
    url: hit.url,
    notes: `${hit.title}. ${hit.summary}`.slice(0, 1100),
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
  item.sourceUrl = hit.url;
  return item;
}
