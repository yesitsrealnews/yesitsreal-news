import { createHash } from "node:crypto";
import { waitUntil } from "@vercel/functions";
import { commentsToken } from "@/lib/comments-github";
import {
  addToDelta,
  applyDelta,
  formatViewsDoc,
  parseViewsDoc,
  SITE_KEY,
  summarize,
  utcDay,
  type ViewsDelta,
  type ViewsDoc,
  type ViewsSummary,
} from "@/lib/views-core";

/**
 * First-party view counter persisted in ONE GitHub issue body (`desk:views`),
 * like the other desk stores. Hits are buffered in memory and flushed in batches
 * (at most one GET + one PATCH per warm instance per FLUSH_MS), so traffic never
 * maps 1:1 to GitHub API calls. Issue-body edits do not notify watchers.
 *
 * Privacy: no cookies, no IPs stored. Uniques use sha256(daily salt + IP + UA)
 * kept only in memory for the current UTC day.
 */
const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:views";
const LABEL = "desk-views";
const API = "https://api.github.com";
const FLUSH_MS = 60_000;
const READ_CACHE_MS = 30_000;
const MAX_SEEN = 60_000;

type GhIssue = { number: number; title: string; body?: string | null };

const g = globalThis as typeof globalThis & {
  __yirViews__?: {
    pending: ViewsDelta;
    seenDay: string;
    seen: Set<string>;
    lastFlush: number;
    flushing: Promise<void> | null;
    scheduled: boolean;
    issueNumber: number | null;
    cache: { doc: ViewsDoc; at: number } | null;
  };
};
const state = (g.__yirViews__ ??= {
  pending: new Map(),
  seenDay: "",
  seen: new Set(),
  lastFlush: 0,
  flushing: null,
  scheduled: false,
  issueNumber: null,
  cache: null,
});

async function gh<T>(token: string, path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      "User-Agent": "yesitsreal-news-views",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  const data = res.status === 204 ? null : ((await res.json().catch(() => null)) as T | null);
  return { ok: res.ok, status: res.status, data };
}

async function findIssue(token: string, create: boolean): Promise<GhIssue | null> {
  if (state.issueNumber) {
    const hit = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${state.issueNumber}`);
    if (hit.ok && hit.data?.title === ISSUE_TITLE) return hit.data;
    state.issueNumber = null;
  }
  const q = encodeURIComponent(`repo:${OWNER}/${REPO} is:issue in:title "${ISSUE_TITLE}"`);
  const search = await gh<{ items?: GhIssue[] }>(token, `/search/issues?q=${q}&per_page=5`);
  const found = search.data?.items?.find((i) => i.title === ISSUE_TITLE);
  if (found) {
    state.issueNumber = found.number;
    const full = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${found.number}`);
    return full.ok && full.data ? full.data : found;
  }
  if (!create) return null;
  const label = await gh(token, `/repos/${OWNER}/${REPO}/labels/${LABEL}`);
  if (!label.ok) {
    await gh(token, `/repos/${OWNER}/${REPO}/labels`, {
      method: "POST",
      body: JSON.stringify({ name: LABEL, color: "1F6FEB", description: "Desk store: article view counters (do not edit)" }),
    });
  }
  const created = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title: ISSUE_TITLE,
      labels: [LABEL],
      body: formatViewsDoc(parseViewsDoc(null)),
    }),
  });
  if (!created.ok || !created.data) return null;
  state.issueNumber = created.data.number;
  return created.data;
}

function salt(day: string): string {
  return `${day}:${process.env.DESK_SECRET || process.env.CAMBUSE_SECRET || "yir-views"}`;
}

function rememberUnique(day: string, key: string): boolean {
  if (state.seenDay !== day) {
    state.seenDay = day;
    state.seen = new Set();
  }
  if (state.seen.has(key)) return false;
  if (state.seen.size >= MAX_SEEN) state.seen.clear();
  state.seen.add(key);
  return true;
}

export function viewsStoreAvailable(): boolean {
  return Boolean(commentsToken());
}

/** Count one public article view. Returns immediately; persistence is batched. */
export function recordView(storyId: string, ip: string, ua: string, now = new Date()): void {
  const day = utcDay(now);
  const visitor = createHash("sha256").update(`${salt(day)}|${ip}|${ua}`).digest("base64url").slice(0, 16);
  const siteNew = rememberUnique(day, visitor);
  const storyNew = rememberUnique(day, `${visitor}:${storyId}`);
  addToDelta(state.pending, day, storyId, 1, storyNew ? 1 : 0);
  addToDelta(state.pending, day, SITE_KEY, 1, siteNew ? 1 : 0);
  scheduleFlush();
}

/** Desk correction (e.g. remove test hits). Negative numbers subtract. */
export async function adjustViews(storyId: string, day: string, views: number, uniques: number): Promise<boolean> {
  addToDelta(state.pending, day, storyId, views, uniques);
  addToDelta(state.pending, day, SITE_KEY, views, uniques);
  return flushNow();
}

function scheduleFlush() {
  if (!viewsStoreAvailable()) return;
  const wait = state.lastFlush + FLUSH_MS - Date.now();
  if (wait <= 0 && !state.flushing) {
    waitUntil(flushNow());
    return;
  }
  if (state.scheduled) return;
  state.scheduled = true;
  waitUntil(
    new Promise<void>((resolve) => setTimeout(resolve, Math.max(1_000, wait))).then(async () => {
      state.scheduled = false;
      await flushNow();
    }),
  );
}

export async function flushNow(): Promise<boolean> {
  if (state.flushing) await state.flushing.catch(() => undefined);
  if (![...state.pending.values()].some((r) => r.size)) return true;
  const token = commentsToken();
  if (!token) return false;
  const batch = state.pending;
  state.pending = new Map();
  state.lastFlush = Date.now();
  let ok = false;
  const run = (async () => {
    const issue = await findIssue(token, true);
    if (!issue) throw new Error("no issue");
    const next = applyDelta(parseViewsDoc(issue.body), batch, new Date().toISOString());
    const body = formatViewsDoc(next);
    const res = await gh(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
    if (!res.ok) throw new Error(`patch ${res.status}`);
    state.cache = { doc: next, at: Date.now() };
    ok = true;
  })().catch(() => {
    // Put the batch back so the next flush retries it.
    for (const [day, rows] of batch) for (const [k, [v, u]] of rows) addToDelta(state.pending, day, k, v, u);
  });
  state.flushing = run;
  await run;
  state.flushing = null;
  return ok;
}

export async function readViewsSummary(force = false): Promise<ViewsSummary | null> {
  const token = commentsToken();
  if (!token) return null;
  if ([...state.pending.values()].some((r) => r.size)) await flushNow();
  if (!force && state.cache && Date.now() - state.cache.at < READ_CACHE_MS) return summarize(state.cache.doc);
  const issue = await findIssue(token, false);
  const doc = parseViewsDoc(issue?.body);
  state.cache = { doc, at: Date.now() };
  return summarize(doc);
}
