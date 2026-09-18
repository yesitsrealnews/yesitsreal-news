import { commentsToken } from "@/lib/comments-github";
import type { RssHit } from "@/lib/rss-ingest";
import { expandKillKeys, filterRssHits, mergeKilled } from "@/lib/rss-killed";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:rss-inbox";
const LABEL = "desk-rss";
const LABEL_COLOR = "1D4E89";
const API = "https://api.github.com";
const MAX_HITS = 60;

type IssuePayload = { v: 1 | 2; at: string; hits: RssHit[]; killed?: string[] };
type GhIssue = { number: number; title: string; body?: string | null };
type ParsedRss = { at: string; hits: RssHit[]; killed: string[] };

let mem: { issueNumber: number | null; hits: RssHit[]; killed: string[]; at: string; fetchedAt: number } | null = null;
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

function parseBody(body?: string | null): ParsedRss {
  if (!body) return { at: "", hits: [], killed: [] };
  try {
    const json = JSON.parse(body) as IssuePayload;
    if ((json?.v !== 1 && json?.v !== 2) || !Array.isArray(json.hits)) return { at: "", hits: [], killed: [] };
    const killed = Array.isArray(json.killed)
      ? json.killed.filter((x): x is string => typeof x === "string" && x.length > 3).slice(0, 500)
      : [];
    const hits = filterRssHits(
      json.hits.filter((h) => h && typeof h.url === "string" && typeof h.title === "string"),
      killed,
    ).slice(0, MAX_HITS);
    return { at: typeof json.at === "string" ? json.at : "", hits, killed };
  } catch {
    return { at: "", hits: [], killed: [] };
  }
}

function formatBody(at: string, hits: RssHit[], killed: string[]): string {
  const payload: IssuePayload = { v: 2, at, hits: hits.slice(0, MAX_HITS), killed: killed.slice(0, 500) };
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
      body: formatBody("", [], []),
    }),
  });
  if (!created.ok || !created.data?.number) return null;
  return created.data;
}

function remember(issueNumber: number | null, parsed: ParsedRss): ParsedRss {
  mem = { issueNumber, hits: parsed.hits, killed: parsed.killed, at: parsed.at, fetchedAt: Date.now() };
  return { at: parsed.at, hits: [...parsed.hits], killed: [...parsed.killed] };
}

export async function getStoredRssHits(force = false): Promise<ParsedRss> {
  if (!force && mem && Date.now() - mem.fetchedAt < CACHE_MS) {
    return { at: mem.at, hits: [...mem.hits], killed: [...mem.killed] };
  }
  const token = commentsToken();
  if (!token) {
    mem = { issueNumber: null, hits: [], killed: [], at: "", fetchedAt: Date.now() };
    return { at: "", hits: [], killed: [] };
  }
  try {
    const issue = await findIssue(token);
    if (!issue) {
      mem = { issueNumber: null, hits: [], killed: [], at: "", fetchedAt: Date.now() };
      return { at: "", hits: [], killed: [] };
    }
    return remember(issue.number, parseBody(issue.body));
  } catch {
    return mem ? { at: mem.at, hits: [...mem.hits], killed: [...mem.killed] } : { at: "", hits: [], killed: [] };
  }
}

export async function saveRssHits(hits: RssHit[]): Promise<ParsedRss | null> {
  const token = commentsToken();
  if (!token) return null;
  const issue = await findOrCreateIssue(token);
  if (!issue) return null;
  const prev = parseBody(issue.body);
  const live = filterRssHits([...hits, ...prev.hits], prev.killed).slice(0, MAX_HITS);
  const at = new Date().toISOString();
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(at, live, prev.killed) }),
  });
  if (!patched.ok) return null;
  return remember(issue.number, { at, hits: live, killed: prev.killed });
}

export async function killRssHits(keys: string[]): Promise<ParsedRss | null> {
  const token = commentsToken();
  if (!token) return null;
  const clean = keys.map((k) => k.trim()).filter(Boolean);
  if (!clean.length) return null;
  const issue = await findOrCreateIssue(token);
  if (!issue) return null;
  const prev = parseBody(issue.body);
  const killed = mergeKilled(prev.killed, expandKillKeys(clean, prev.hits));
  const live = filterRssHits(prev.hits, killed);
  const at = new Date().toISOString();
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(at, live, killed) }),
  });
  if (!patched.ok) return null;
  return remember(issue.number, { at, hits: live, killed });
}
