import { isSafeHttpUrl } from "@/lib/security";

export type ExtractedArticle = {
  url: string;
  title: string;
  description: string;
  siteName: string;
  published: string;
  text: string;
  quotes: string[];
  ok: boolean;
};

const UA =
  "Mozilla/5.0 (compatible; YESITSREAL-desk/1.0; +https://www.yesitsreal.news/) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36";
const FETCH_MS = 5000;
const MAX_HTML = 450_000;

function decode(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(s: string): string {
  return decode(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html: string, key: string): string {
  const re1 = new RegExp(
    `<meta[^>]+(?:property|name|itemprop)=["']${key}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name|itemprop)=["']${key}["']`,
    "i",
  );
  return decode(re1.exec(html)?.[1] || re2.exec(html)?.[1] || "").trim();
}

function tag(html: string, name: string): string {
  const m = html.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? stripTags(m[1]) : "";
}

function hostName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function paragraphs(html: string): string[] {
  const slice =
    html.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ??
    html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ??
    html;
  const cleaned = slice
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside\b[\s\S]*?<\/aside>/gi, " ");
  const ps = [...cleaned.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1] ?? ""));
  const skip =
    /cookie|newsletter|subscribe|abonnement|lire aussi|à lire aussi|publicité|advertisement|suivre .+ sur|partager|javascript/i;
  return ps.filter((p) => p.length > 70 && p.length < 900 && !skip.test(p)).slice(0, 14);
}

function quotesFrom(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (q: string) => {
    const t = q.replace(/\s+/g, " ").trim();
    if (t.length < 24 || t.length > 280) return;
    const k = t.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(t);
  };
  for (const m of text.matchAll(/«\s*([^»]{20,280})\s*»/g)) push(m[1] ?? "");
  for (const m of text.matchAll(/"([^"]{20,280})"/g)) push(m[1] ?? "");
  return out.slice(0, 8);
}

export async function fetchArticle(url: string): Promise<ExtractedArticle> {
  const empty = (): ExtractedArticle => ({
    url,
    title: "",
    description: "",
    siteName: hostName(url),
    published: "",
    text: "",
    quotes: [],
    ok: false,
  });
  if (!isSafeHttpUrl(url)) return empty();
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_MS),
    });
    if (!res.ok) return empty();
    const html = (await res.text()).slice(0, MAX_HTML);
    const title =
      meta(html, "og:title") || meta(html, "twitter:title") || tag(html, "title") || "";
    const description = meta(html, "og:description") || meta(html, "description") || "";
    const siteName = meta(html, "og:site_name") || hostName(url);
    const published =
      meta(html, "article:published_time") || meta(html, "pubdate") || meta(html, "date") || "";
    const paras = paragraphs(html);
    const text = paras.join("\n\n").slice(0, 7000);
    const quotes = quotesFrom(`${title} ${description} ${text}`);
    return {
      url,
      title: title.slice(0, 240),
      description: description.slice(0, 400),
      siteName: siteName.slice(0, 80),
      published: published.slice(0, 40),
      text,
      quotes,
      ok: Boolean(title || text),
    };
  } catch {
    return empty();
  }
}

export async function fetchArticles(urls: string[]): Promise<ExtractedArticle[]> {
  const unique = [...new Set(urls.filter(isSafeHttpUrl))].slice(0, 5);
  return Promise.all(unique.map((u) => fetchArticle(u)));
}
