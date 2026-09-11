import { commentsToken } from "@/lib/comments-github";
import type { RssHit } from "@/lib/rss-ingest";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:rss-inbox";
const LABEL = "desk-rss";
const LABEL_COLOR = "1D4E89";
const API = "https://api.github.com";
const MAX_HITS = 50;

type IssuePayload = { v: 1; at: string; hits: RssHit[] };
type GhIssue = { number: number; title: string; body?: string | null };

let mem: { issueNumber: number | null; hits: RssHit[]; at: string; fetchedAt: number } | null = null;
const CACHE_MS = 30_000;

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-desk-rss",
  };
}

async function gh<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...ghHeaders(token),
      ...(init?.headers ?? {}),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (res.status === 204) return { ok: res.ok, status: res.status, data: null };
  const data = (await res.json().catch(() => null)) as T | null;
  return { ok: res.ok, status: res.status, data };
}

function parseBody(body?: string | null): { at: string; hits: RssHit[] } {
  if (!body) return { at: "", hits: [] };
  try {
    const json = JSON.parse(body) as IssuePayload;
    if (json?.v !== 1 || !Array.isArray(json.hits)) return { at: "", hits: [] };
    const hits = json.hits.filter((h) => h && typeof h.url === "string" && typeof h.title === "string").slice(0, MAX_HITS);
    return { at: typeof json.at === "string" ? json.at : "", hits };
  } catch {
    return { at: "", hits: [] };
  }
}

function formatBody(at: string, hits: RssHit[]): string {
  const payload: IssuePayload = { v: 1, at, hits: hits.slice(0, MAX_HITS) };
  return JSON.stringify(payload, null, 2);
}

async function ensureLabel(token: string): Promise<void> {
  const existing = await gh<{ name: string }>(token, `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(LABEL)}`);
  if (existing.ok) return;
  await gh(token, `/repos/${OWNER}/${REPO}/labels`, {
    method: "POST",
    body: JSON.stringify({
      name: LABEL,
      color: LABEL_COLOR,
      description: "Desk RSS ingest cache (not published)",
    }),
  });
}

async function findIssue(token: string): Promise<GhIssue | null> {
  if (mem?.issueNumber) {
    const cached = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${mem.issueNumber}`);
    if (cached.ok && cached.data && cached.data.title === ISSUE_TITLE) return cached.data;
  }
  const q = encodeURIComponent(`repo:${OWNER}/${REPO} is:issue in:title "${ISSUE_TITLE}"`);
  const search = await gh<{ items?: GhIssue[] }>(token, `/search/issues?q=${q}&per_page=5`);
  const hit = search.data?.items?.find((i) => i.title === ISSUE_TITLE);
  if (hit) {
    const full = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${hit.number}`);
    return full.ok && full.data ? full.data : hit;
  }
  const listed = await gh<GhIssue[]>(
    token,
    `/repos/${OWNER}/${REPO}/issues?labels=${encodeURIComponent(LABEL)}&state=open&per_page=50`,
  );
  const fromList = listed.data?.find((i) => i.title === ISSUE_TITLE);
  if (fromList) {
    const full = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${fromList.number}`);
    return full.ok && full.data ? full.data : fromList;
  }
  return null;
}

async function findOrCreateIssue(token: string): Promise<GhIssue | null> {
  const existing = await findIssue(token);
  if (existing) return existing;
  await ensureLabel(token);
  const created = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title: ISSUE_TITLE,
      labels: [LABEL],
      body: formatBody("", []),
    }),
  });
  if (!created.ok || !created.data?.number) return null;
  return created.data;
}

export async function getStoredRssHits(force = false): Promise<{ at: string; hits: RssHit[] }> {
  if (!force && mem && Date.now() - mem.fetchedAt < CACHE_MS) {
    return { at: mem.at, hits: [...mem.hits] };
  }
  const token = commentsToken();
  if (!token) {
    mem = { issueNumber: null, hits: [], at: "", fetchedAt: Date.now() };
    return { at: "", hits: [] };
  }
  try {
    const issue = await findIssue(token);
    if (!issue) {
      mem = { issueNumber: null, hits: [], at: "", fetchedAt: Date.now() };
      return { at: "", hits: [] };
    }
    const parsed = parseBody(issue.body);
    mem = { issueNumber: issue.number, hits: parsed.hits, at: parsed.at, fetchedAt: Date.now() };
    return { at: parsed.at, hits: [...parsed.hits] };
  } catch {
    return mem ? { at: mem.at, hits: [...mem.hits] } : { at: "", hits: [] };
  }
}

export async function saveRssHits(hits: RssHit[]): Promise<{ at: string; hits: RssHit[] } | null> {
  const token = commentsToken();
  if (!token) return null;
  const issue = await findOrCreateIssue(token);
  if (!issue) return null;
  const prev = parseBody(issue.body);
  const seen = new Set<string>();
  const merged: RssHit[] = [];
  for (const h of [...hits, ...prev.hits]) {
    if (!h?.url || seen.has(h.url)) continue;
    seen.add(h.url);
    merged.push(h);
    if (merged.length >= MAX_HITS) break;
  }
  const at = new Date().toISOString();
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(at, merged) }),
  });
  if (!patched.ok) return null;
  mem = { issueNumber: issue.number, hits: merged, at, fetchedAt: Date.now() };
  return { at, hits: [...merged] };
}
