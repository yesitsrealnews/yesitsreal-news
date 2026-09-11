export type ParsedRssItem = {
  title: string;
  url: string;
  summary: string;
  published: string;
};

function cdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function decode(s: string): string {
  return cdata(s)
    .replace(/&nbsp;/gi, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(s: string): string {
  return decode(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inner(block: string, name: string): string {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i");
  const m = block.match(re);
  return m ? stripTags(m[1]) : "";
}

function href(block: string): string {
  const atom = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (atom?.[1]) return atom[1].trim();
  const rss = inner(block, "link");
  if (rss) return rss;
  const about = block.match(/\srdf:about=["']([^"']+)["']/i);
  return about?.[1]?.trim() ?? "";
}

function isoDate(raw: string): string {
  if (!raw) return new Date().toISOString();
  const d = new Date(raw);
  return Number.isNaN(+d) ? new Date().toISOString() : d.toISOString();
}

function blocks(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, "gi");
  return xml.match(re) ?? [];
}

export function parseFeed(xml: string): ParsedRssItem[] {
  const src = xml.slice(0, 900_000);
  const raw = [...blocks(src, "item"), ...blocks(src, "entry")];
  const out: ParsedRssItem[] = [];
  const seen = new Set<string>();
  for (const block of raw.slice(0, 80)) {
    const title = inner(block, "title");
    const url = href(block);
    if (!title || !url) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    const summary = inner(block, "description") || inner(block, "summary") || inner(block, "content");
    const published = inner(block, "pubDate") || inner(block, "updated") || inner(block, "published") || inner(block, "dc:date");
    out.push({ title, url, summary: summary.slice(0, 400), published: isoDate(published) });
  }
  return out;
}
