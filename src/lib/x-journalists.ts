/**
 * X watchlist — newsrooms we already source + odd-news desks.
 * We do not invent reporter handles. Cron + Cambuse « Tirer X ».
 */

import { NEWSROOM_X } from "./source-x.ts";
import { scoreHit } from "./rss-keep.ts";
import { isSafeHttpUrl } from "./security.ts";
import { looksLikeSatire } from "./pipeline.ts";

export type XWatchKind = "newsroom" | "desk";

export type XWatch = {
  handle: string;
  name: string;
  countryCode: string;
  kind: XWatchKind;
  priority: 1 | 2;
};

const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;

const UA =
  "Mozilla/5.0 (compatible; YESITSREAL-desk/1.0; +https://www.yesitsreal.news/) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36";

/** Odd-news / faits-divers desks on top of the newsroom map. Public handles only. */
const EXTRA_DESKS: XWatch[] = [
  { handle: "nypmetro", name: "NY Post Metro", countryCode: "US", kind: "desk", priority: 1 },
  { handle: "odditycentral", name: "Oddity Central", countryCode: "US", kind: "desk", priority: 1 },
  { handle: "SoraNews24", name: "SoraNews24", countryCode: "JP", kind: "desk", priority: 1 },
  { handle: "MothershipSG", name: "Mothership", countryCode: "SG", kind: "desk", priority: 1 },
  { handle: "TokyoReporter", name: "Tokyo Reporter", countryCode: "JP", kind: "desk", priority: 1 },
  { handle: "JapanToday", name: "Japan Today", countryCode: "JP", kind: "desk", priority: 1 },
  { handle: "UPI", name: "UPI", countryCode: "US", kind: "desk", priority: 1 },
  { handle: "MetroUK", name: "Metro UK", countryCode: "GB", kind: "desk", priority: 1 },
  { handle: "infobae", name: "Infobae", countryCode: "AR", kind: "desk", priority: 1 },
  { handle: "NationAfrica", name: "Daily Nation", countryCode: "KE", kind: "desk", priority: 1 },
  { handle: "dailymaverick", name: "Daily Maverick", countryCode: "ZA", kind: "desk", priority: 1 },
  { handle: "News24", name: "News24", countryCode: "ZA", kind: "desk", priority: 1 },
  { handle: "ChannelNewsAsia", name: "CNA", countryCode: "SG", kind: "desk", priority: 1 },
  { handle: "SCMPNews", name: "SCMP", countryCode: "HK", kind: "desk", priority: 1 },
  { handle: "rapplerdotcom", name: "Rappler", countryCode: "PH", kind: "desk", priority: 1 },
  { handle: "inquirerdotnet", name: "Inquirer", countryCode: "PH", kind: "desk", priority: 1 },
  { handle: "MobilePunch", name: "Punch", countryCode: "NG", kind: "desk", priority: 1 },
  { handle: "Metropoles", name: "Metrópoles", countryCode: "BR", kind: "desk", priority: 1 },
];

const PRIORITY = new Set(
  [
    "OuestFrance",
    "ladepechedumidi",
    "20Minutes",
    "le_Parisien",
    "ledauphine",
    "franceinfo",
    "nicematin",
    "lavoixdunord",
    "SudOuest",
    "LeProgres",
    "leTelegramme",
    "midilibre",
    "nypost",
    "nypmetro",
    "UPI",
    "odditycentral",
    "SoraNews24",
    "MothershipSG",
    "TokyoReporter",
    "JapanToday",
    "MetroUK",
    "g1",
    "infobae",
    "BBCNews",
    "guardian",
    "WalesOnline",
    "MENnewsdesk",
    "japantimes",
    "dailymaverick",
    "dhbe",
    "sudinfo",
    "rtbf",
    "hlnbe",
    "actudotfr",
    "francebleu",
    "NationAfrica",
    "News24",
    "ChannelNewsAsia",
    "SCMPNews",
    "rapplerdotcom",
    "inquirerdotnet",
    "MobilePunch",
    "Metropoles",
  ].map((h) => h.toLowerCase()),
);

function ccFromHost(host: string): string {
  const h = host.toLowerCase().replace(/^www\./, "");
  if (h.endsWith(".co.uk") || h.endsWith(".uk")) return "GB";
  if (h.endsWith(".com.au") || h.endsWith(".au")) return "AU";
  if (h.endsWith(".co.nz") || h.endsWith(".nz")) return "NZ";
  if (h.endsWith(".co.jp") || h.endsWith(".jp")) return "JP";
  if (h.endsWith(".co.za") || h.endsWith(".za")) return "ZA";
  if (h.endsWith(".com.br") || h.endsWith(".br")) return "BR";
  if (h.endsWith(".co.ke") || h.endsWith(".ke")) return "KE";
  if (h.endsWith(".gov") || h.endsWith(".mil") || h.endsWith(".go.com")) return "US";
  const tld = h.split(".").pop() ?? "";
  const tldMap: Record<string, string> = {
    fr: "FR",
    re: "FR",
    nc: "FR",
    yt: "FR",
    be: "BE",
    ch: "CH",
    ca: "CA",
    ie: "IE",
    de: "DE",
    es: "ES",
    it: "IT",
    nl: "NL",
    pt: "PT",
    at: "AT",
    no: "NO",
    se: "SE",
    fi: "FI",
    in: "IN",
    mx: "MX",
    ar: "AR",
    co: "CO",
    cl: "CL",
    pe: "PE",
    uy: "UY",
    ec: "EC",
    ng: "NG",
    ma: "MA",
    dz: "DZ",
    sn: "SN",
    ci: "CI",
    tn: "TN",
    gh: "GH",
    sg: "SG",
    ph: "PH",
    kr: "KR",
    tw: "TW",
    hk: "HK",
    th: "TH",
    vn: "VN",
    mc: "MC",
    us: "US",
  };
  if (tldMap[tld]) return tldMap[tld];
  if (
    /nytimes|washingtonpost|nypost|cnn|npr|reuters|apnews|usatoday|latimes|upi|foxnews|nbcnews|cbsnews|politico/.test(
      h,
    )
  ) {
    return "US";
  }
  return "XX";
}

export function xHref(handle: string): string {
  return `https://x.com/${handle}`;
}

function addWatch(seen: Set<string>, out: XWatch[], w: XWatch): void {
  if (!HANDLE_RE.test(w.handle)) return;
  const k = w.handle.toLowerCase();
  if (seen.has(k)) return;
  seen.add(k);
  out.push({
    ...w,
    priority: PRIORITY.has(k) ? 1 : w.priority,
  });
}

export function xWatches(): XWatch[] {
  const seen = new Set<string>();
  const out: XWatch[] = [];
  for (const extra of EXTRA_DESKS) addWatch(seen, out, extra);
  for (const [host, handle] of Object.entries(NEWSROOM_X)) {
    addWatch(seen, out, {
      handle,
      name: host.replace(/^www\./, ""),
      countryCode: ccFromHost(host),
      kind: "newsroom",
      priority: 2,
    });
  }
  return out.sort((a, b) => a.priority - b.priority || a.handle.localeCompare(b.handle));
}

type RegionKey = "fr" | "us" | "eu" | "asia" | "latam" | "af" | "xx";

function regionOf(cc: string): RegionKey {
  const c = cc.toUpperCase();
  if (c === "FR" || c === "MC") return "fr";
  if (c === "US") return "us";
  if (c === "GB" || c === "IE" || c === "DE" || c === "ES" || c === "IT" || c === "NL" || c === "BE" || c === "CH" || c === "AT" || c === "PT" || c === "NO" || c === "SE" || c === "FI" || c === "DK" || c === "PL")
    return "eu";
  if (c === "JP" || c === "IN" || c === "SG" || c === "PH" || c === "KR" || c === "TH" || c === "ID" || c === "MY" || c === "HK" || c === "CN" || c === "TW" || c === "VN" || c === "AU" || c === "NZ")
    return "asia";
  if (c === "BR" || c === "AR" || c === "MX" || c === "CO" || c === "CL" || c === "PE" || c === "UY" || c === "EC") return "latam";
  if (c === "NG" || c === "ZA" || c === "KE" || c === "MA" || c === "DZ" || c === "SN" || c === "CI" || c === "TN" || c === "GH")
    return "af";
  return "xx";
}

const KW: Record<RegionKey, string> = {
  fr: 'insolite OR "faits divers" OR coq OR voisin OR mairie OR serpent OR cerf OR bouc OR vache OR canard OR pigeon OR arrêté',
  us: 'odd OR bizarre OR raccoon OR python OR emu OR goat OR rooster OR HOA OR council OR "garden gnome" OR wallaby OR capybara',
  eu: 'odd OR bizarre OR insolite OR kurios OR insólito OR fox OR badger OR seagull OR jabalí OR cinghiale OR council',
  asia: "odd OR bizarre OR monkey OR macaque OR boar OR python OR civet OR unusual",
  latam: "insólito OR bizarro OR extraño OR capivara OR capibara OR carpincho OR jacaré OR gallo OR vizinho",
  af: "odd OR bizarre OR baboon OR python OR monkey OR goat OR snake OR unusual",
  xx: "odd OR bizarre OR insolite OR unusual",
};

const GNEWS: Record<RegionKey, { gl: string; hl: string; ceid: string; cc: string; label: string }> = {
  fr: { gl: "FR", hl: "fr", ceid: "FR:fr", cc: "FR", label: "FR" },
  us: { gl: "US", hl: "en-US", ceid: "US:en", cc: "US", label: "USA" },
  eu: { gl: "GB", hl: "en-GB", ceid: "GB:en", cc: "GB", label: "Europe" },
  asia: { gl: "SG", hl: "en-SG", ceid: "SG:en", cc: "SG", label: "Asie" },
  latam: { gl: "BR", hl: "pt-BR", ceid: "BR:pt-419", cc: "BR", label: "LatAm" },
  af: { gl: "ZA", hl: "en-ZA", ceid: "ZA:en", cc: "ZA", label: "Afrique" },
  xx: { gl: "US", hl: "en-US", ceid: "US:en", cc: "US", label: "Monde" },
};

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

/** Morning RSS = all newsrooms. Noon / evening cron = X desks only. */
export function xCronMode(when = new Date()): { quick: boolean; xOnly: boolean } {
  const hour = when.getUTCHours();
  if (hour >= 10) return { quick: false, xOnly: true };
  return { quick: true, xOnly: false };
}

/** Google News RSS: journalist / newsroom handles + editorial keywords. */
export function xJournalistFeeds() {
  const watches = xWatches();
  const feeds: {
    name: string;
    domain: string;
    url: string;
    region: string;
    countryCode: string;
    kind: "insolite";
    priority: 1 | 2;
    via: "x";
  }[] = [];
  const groups = new Map<RegionKey, XWatch[]>();
  for (const w of watches) {
    const r = regionOf(w.countryCode);
    const list = groups.get(r) ?? [];
    list.push(w);
    groups.set(r, list);
  }
  for (const [region, list] of groups) {
    const meta = GNEWS[region];
    const kw = KW[region];
    const batches = chunk(list, 8);
    batches.forEach((batch, i) => {
      const handles = batch.map((w) => `@${w.handle}`).join(" OR ");
      const q = `(${handles}) (${kw}) when:5d`;
      const params = new URLSearchParams({ q, hl: meta.hl, gl: meta.gl, ceid: meta.ceid });
      const morning = region === "fr" || region === "us" || i === 0;
      feeds.push({
        name: `X · ${meta.label}${batches.length > 1 ? ` ${i + 1}` : ""}`,
        domain: "news.google.com",
        url: `https://news.google.com/rss/search?${params.toString()}`,
        region: `X · ${meta.label}`,
        countryCode: meta.cc,
        kind: "insolite",
        priority: morning ? 1 : 2,
        via: "x",
      });
    });
  }
  return feeds;
}

export function xSearchQueries(when = new Date()): string[] {
  const after = new Date(when.getTime() - 5 * 86400000).toISOString().slice(0, 10);
  const watches = xWatches().filter((w) => w.priority === 1);
  const out: string[] = [];
  for (const batch of chunk(watches, 8)) {
    const from = batch.map((w) => `from:${w.handle}`).join(" OR ");
    const r = regionOf(batch[0]?.countryCode ?? "US");
    out.push(`(${from}) (${KW[r]}) since:${after}`);
  }
  return out;
}

function foldTitle(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function titleKey(title: string): string {
  const t = foldTitle(title)
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .slice(0, 70);
  return t.length >= 12 ? `fp:t:${t}` : "";
}

function cleanUrl(raw: string): string {
  const trimmed = raw.trim();
  try {
    const u = new URL(trimmed);
    u.hash = "";
    u.hostname = u.hostname.replace(/^www\./i, "").toLowerCase();
    return u.toString();
  } catch {
    return trimmed;
  }
}

const ARTICLE_HOST_SKIP = /(?:^|\.)(x\.com|twitter\.com|t\.co|nitter\.|fxtwitter\.|vxtwitter\.)$/i;

function articleUrls(text: string): string[] {
  const out: string[] = [];
  const re = /https?:\/\/[^\s<>"')\]]+/gi;
  for (const raw of text.match(re) ?? []) {
    const cleaned = raw.replace(/[.,;:!?]+$/, "");
    const can = cleanUrl(cleaned) || cleaned;
    if (!isSafeHttpUrl(can) || looksLikeSatire(can)) continue;
    try {
      const host = new URL(can).hostname.replace(/^www\./i, "");
      if (ARTICLE_HOST_SKIP.test(host)) continue;
      out.push(can);
    } catch {
      /* skip */
    }
  }
  return [...new Set(out)];
}

type TimelinePost = { text: string; at: string; handle: string };

function postsFromSyndication(html: string, handle: string): TimelinePost[] {
  const posts: TimelinePost[] = [];
  const jsonBlocks = html.match(/\{[^{}]{0,200}"(?:full_text|text)"\s*:\s*"(?:\\.|[^"\\]){12,}"[^{}]{0,400}\}/g) ?? [];
  for (const block of jsonBlocks.slice(0, 24)) {
    const textM = block.match(/"(?:full_text|text)"\s*:\s*"((?:\\.|[^"\\])*)"/);
    if (!textM?.[1]) continue;
    const text = textM[1]
      .replace(/\\n/g, " ")
      .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\"/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    if (text.length < 24) continue;
    const created = block.match(/"created_at"\s*:\s*"([^"]+)"/);
    const at = created?.[1] ? new Date(created[1]).toISOString() : new Date().toISOString();
    posts.push({ text, at: Number.isNaN(+new Date(at)) ? new Date().toISOString() : at, handle });
  }
  return posts;
}

async function fetchTimeline(handle: string): Promise<TimelinePost[]> {
  const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${encodeURIComponent(handle)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(2800),
      redirect: "follow",
    });
    if (!res.ok) return [];
    const html = await res.text();
    if (html.length < 400) return [];
    return postsFromSyndication(html, handle);
  } catch {
    return [];
  }
}

async function mapPool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += n) {
    const chunked = await Promise.all(items.slice(i, i + n).map(fn));
    out.push(...chunked);
  }
  return out;
}

/** Best-effort: public syndication of priority desks. Silent if X rate-limits. */
export async function pullXTimelines(limit = 16) {
  const handles = xWatches()
    .filter((w) => w.priority === 1)
    .slice(0, Math.max(1, limit));
  const timelines = await mapPool(handles, 4, (w) => fetchTimeline(w.handle));
  const hits: {
    feed: string;
    domain: string;
    title: string;
    url: string;
    summary: string;
    published: string;
    countryCode: string;
    keep: boolean;
    score: number;
    beat: string;
  }[] = [];
  const seen = new Set<string>();
  handles.forEach((w, i) => {
    for (const post of timelines[i] ?? []) {
      const urls = articleUrls(post.text);
      if (!urls.length) continue;
      const url = urls[0]!;
      const fp = titleKey(post.text);
      if (seen.has(url) || (fp && seen.has(fp))) continue;
      const scored = scoreHit(post.text, post.text, "X · desk", "insolite");
      if (!scored.keep) continue;
      seen.add(url);
      if (fp) seen.add(fp);
      let domain = w.name;
      try {
        domain = new URL(url).hostname.replace(/^www\./i, "");
      } catch {
        /* keep */
      }
      hits.push({
        feed: `X · @${w.handle}`,
        domain,
        title: post.text.slice(0, 180),
        url,
        summary: `Post @${w.handle}. ${post.text}`.slice(0, 400),
        published: post.at,
        countryCode: w.countryCode === "XX" ? "US" : w.countryCode,
        keep: true,
        score: scored.score + 1,
        beat: scored.beat,
      });
    }
  });
  return hits;
}
