/**
 * First-party article view counter — pure data model (no I/O).
 *
 * Stored as one JSON document (GitHub issue body `desk:views`):
 *   s: per-story all-time [views, uniques]
 *   d: per-UTC-day { storyId | "_" (site) : [views, uniques] }, last DAYS_KEPT days
 *   t: site all-time [views, uniques]
 * "uniques" = distinct visitor-days (a daily-rotating hash of IP+UA, never stored).
 */
export type Pair = [number, number];
export type ViewsDoc = {
  v: 1;
  at: string;
  t: Pair;
  s: Record<string, Pair>;
  d: Record<string, Record<string, Pair>>;
};
/** Pending increments: day -> key ("_" = whole site) -> [views, uniques]. */
export type ViewsDelta = Map<string, Map<string, Pair>>;

export const SITE_KEY = "_";
export const DAYS_KEPT = 8;
export const VIEWS_BODY_LIMIT = 58_000;
const STORY_RE = /^s\d{1,6}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isCountableStoryId(id: unknown): id is string {
  return typeof id === "string" && STORY_RE.test(id);
}

export function utcDay(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function emptyDoc(): ViewsDoc {
  return { v: 1, at: "", t: [0, 0], s: {}, d: {} };
}

function pair(raw: unknown): Pair | null {
  if (!Array.isArray(raw) || raw.length < 2) return null;
  const a = Number(raw[0]);
  const b = Number(raw[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return [Math.max(0, Math.round(a)), Math.max(0, Math.round(b))];
}

export function parseViewsDoc(body: string | null | undefined): ViewsDoc {
  if (!body) return emptyDoc();
  try {
    const raw = JSON.parse(body) as Partial<ViewsDoc>;
    if (!raw || raw.v !== 1) return emptyDoc();
    const doc = emptyDoc();
    doc.at = typeof raw.at === "string" ? raw.at : "";
    doc.t = pair(raw.t) ?? [0, 0];
    for (const [id, p] of Object.entries(raw.s ?? {})) {
      const v = pair(p);
      if (v && isCountableStoryId(id)) doc.s[id] = v;
    }
    for (const [day, rows] of Object.entries(raw.d ?? {})) {
      if (!DAY_RE.test(day) || !rows || typeof rows !== "object") continue;
      const out: Record<string, Pair> = {};
      for (const [id, p] of Object.entries(rows)) {
        const v = pair(p);
        if (v && (id === SITE_KEY || isCountableStoryId(id))) out[id] = v;
      }
      doc.d[day] = out;
    }
    return doc;
  } catch {
    return emptyDoc();
  }
}

export function addToDelta(delta: ViewsDelta, day: string, key: string, views: number, uniques: number) {
  let rows = delta.get(day);
  if (!rows) {
    rows = new Map();
    delta.set(day, rows);
  }
  const prev = rows.get(key) ?? [0, 0];
  rows.set(key, [prev[0] + views, prev[1] + uniques]);
}

export function deltaSize(delta: ViewsDelta): number {
  let n = 0;
  for (const rows of delta.values()) for (const p of rows.values()) n += p[0];
  return n;
}

const clamp = (n: number) => Math.max(0, n);

/** Merge pending increments (may be negative for desk corrections) into a doc. */
export function applyDelta(doc: ViewsDoc, delta: ViewsDelta, nowIso: string): ViewsDoc {
  const next: ViewsDoc = {
    v: 1,
    at: nowIso,
    t: [...doc.t] as Pair,
    s: Object.fromEntries(Object.entries(doc.s).map(([k, p]) => [k, [...p] as Pair])),
    d: Object.fromEntries(
      Object.entries(doc.d).map(([day, rows]) => [
        day,
        Object.fromEntries(Object.entries(rows).map(([k, p]) => [k, [...p] as Pair])),
      ]),
    ),
  };
  for (const [day, rows] of delta) {
    const dayRows = (next.d[day] ??= {});
    for (const [key, [v, u]] of rows) {
      const cur = dayRows[key] ?? [0, 0];
      dayRows[key] = [clamp(cur[0] + v), clamp(cur[1] + u)];
      if (key === SITE_KEY) {
        next.t = [clamp(next.t[0] + v), clamp(next.t[1] + u)];
      } else {
        const all = next.s[key] ?? [0, 0];
        next.s[key] = [clamp(all[0] + v), clamp(all[1] + u)];
      }
    }
  }
  const days = Object.keys(next.d).sort().reverse();
  for (const old of days.slice(DAYS_KEPT)) delete next.d[old];
  return next;
}

export function formatViewsDoc(doc: ViewsDoc): string {
  let body = JSON.stringify(doc);
  const days = Object.keys(doc.d).sort();
  while (body.length > VIEWS_BODY_LIMIT && days.length > 1) {
    delete doc.d[days.shift() as string];
    body = JSON.stringify(doc);
  }
  return body;
}

export type StoryViewStats = { views: number; uniques: number; views7d: number; uniques7d: number };
export type ViewsSummary = {
  at: string;
  site: StoryViewStats;
  today: Pair;
  stories: Record<string, StoryViewStats>;
};

function lastDays(now: Date, n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i += 1) out.push(utcDay(new Date(now.getTime() - i * 86_400_000)));
  return out;
}

export function summarize(doc: ViewsDoc, now = new Date()): ViewsSummary {
  const week = lastDays(now, 7);
  const stories: Record<string, StoryViewStats> = {};
  const site: StoryViewStats = { views: doc.t[0], uniques: doc.t[1], views7d: 0, uniques7d: 0 };
  for (const [id, [v, u]] of Object.entries(doc.s)) {
    stories[id] = { views: v, uniques: u, views7d: 0, uniques7d: 0 };
  }
  for (const day of week) {
    const rows = doc.d[day];
    if (!rows) continue;
    for (const [key, [v, u]] of Object.entries(rows)) {
      if (key === SITE_KEY) {
        site.views7d += v;
        site.uniques7d += u;
        continue;
      }
      const st = (stories[key] ??= { views: 0, uniques: 0, views7d: 0, uniques7d: 0 });
      st.views7d += v;
      st.uniques7d += u;
    }
  }
  const today = doc.d[week[0]]?.[SITE_KEY] ?? [0, 0];
  return { at: doc.at, site, today: [...today] as Pair, stories };
}

const BOT_UA =
  /bot|crawl|spider|slurp|scrap|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl\/|wget|python|httpclient|go-http|java\/|okhttp|axios|node-fetch|undici|libwww|phantom|selenium|playwright|puppeteer|vercel-screenshot/i;

export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || ua.length < 20) return true;
  return BOT_UA.test(ua);
}
