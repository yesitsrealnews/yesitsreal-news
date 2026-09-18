import { commentsToken } from "@/lib/comments-github";
import type { RssHit } from "@/lib/rss-ingest";
import { expandKillKeys, filterRssHits, mergeKilled } from "@/lib/rss-killed";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:rss-inbox";
const KILL_TITLE = "desk:rss-killed";
const LABEL = "desk-rss";
const KILL_LABEL = "desk-rss-killed";
const LABEL_COLOR = "1D4E89";
const KILL_COLOR = "6B0F0F";
const API = "https://api.github.com";
const MAX_HITS = 80;

type IssuePayload = { v: 1 | 2; at: string; hits: RssHit[]; killed?: string[] };
type KillPayload = { v: 1; killed: string[] };
type GhIssue = { number: number; title: string; body?: string | null };
type ParsedRss = { at: string; hits: RssHit[]; killed: string[] };

let mem: { issueNumber: number | null; hits: RssHit[]; killed: string[]; at: string; fetchedAt: number } | null = null;
let killMem: { issueNumber: number | null; killed: string[]; fetchedAt: number } | null = null;
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
      ? json.killed.filter((x): x is string => typeof x === "string" && x.length > 3)
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

function parseKillBody(body?: string | null): string[] {
  if (!body) return [];
  try {
    const json = JSON.parse(body) as KillPayload;
    if (json?.v !== 1 || !Array.isArray(json.killed)) return [];
    return json.killed.filter((x): x is string => typeof x === "string" && x.length > 3);
  } catch {
    return [];
  }
}

function formatBody(at: string, hits: RssHit[], killed: string[]): string {
  const payload: IssuePayload = { v: 2, at, hits: hits.slice(0, MAX_HITS), killed: killed.slice(0, 80) };
  return JSON.stringify(payload);
}

function formatKillBody(killed: string[]): string {
  return JSON.stringify({ v: 1, killed } satisfies KillPayload);
}

async function ensureLabel(token: string, name: string, color: string, description: string): Promise<void> {
  const existing = await gh<{ name: string }>(token, `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(name)}`);
  if (existing.ok) return;
  await gh(token, `/repos/${OWNER}/${REPO}/labels`, {
    method: "POST",
    body: JSON.stringify({ name, color, description }),
  });
}

async function findIssueByTitle(token: string, title: string, label: string, cachedNumber: number | null): Promise<GhIssue | null> {
  if (cachedNumber) {
    const cached = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${cachedNumber}`);
    if (cached.ok && cached.data && cached.data.title === title) return cached.data;
  }
  const q = encodeURIComponent(`repo:${OWNER}/${REPO} is:issue in:title "${title}"`);
  const search = await gh<{ items?: GhIssue[] }>(token, `/search/issues?q=${q}&per_page=5`);
  const hit = search.data?.items?.find((i) => i.title === title);
  if (hit) {
    const full = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${hit.number}`);
    return full.ok && full.data ? full.data : hit;
  }
  const listed = await gh<GhIssue[]>(
    token,
    `/repos/${OWNER}/${REPO}/issues?labels=${encodeURIComponent(label)}&state=open&per_page=50`,
  );
  const fromList = listed.data?.find((i) => i.title === title);
  if (fromList) {
    const full = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${fromList.number}`);
    return full.ok && full.data ? full.data : fromList;
  }
  return null;
}

async function findOrCreateIssue(
  token: string,
  title: string,
  label: string,
  color: string,
  description: string,
  body: string,
  cachedNumber: number | null,
): Promise<GhIssue | null> {
  const existing = await findIssueByTitle(token, title, label, cachedNumber);
  if (existing) return existing;
  await ensureLabel(token, label, color, description);
  const created = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, labels: [label], body }),
  });
  if (!created.ok || !created.data?.number) return null;
  return created.data;
}

function remember(issueNumber: number | null, parsed: ParsedRss): ParsedRss {
  mem = { issueNumber, hits: parsed.hits, killed: parsed.killed, at: parsed.at, fetchedAt: Date.now() };
  return { at: parsed.at, hits: [...parsed.hits], killed: [...parsed.killed] };
}

async function loadKilled(token: string): Promise<string[]> {
  if (killMem && Date.now() - killMem.fetchedAt < CACHE_MS) return [...killMem.killed];
  const issue = await findOrCreateIssue(
    token,
    KILL_TITLE,
    KILL_LABEL,
    KILL_COLOR,
    "Desk RSS kill list — never clobbered by a pull",
    formatKillBody([]),
    killMem?.issueNumber ?? null,
  );
  const fromIssue = parseKillBody(issue?.body);
  const fromHits = mem?.killed ?? [];
  const killed = mergeKilled(fromIssue, fromHits);
  killMem = { issueNumber: issue?.number ?? null, killed, fetchedAt: Date.now() };
  return [...killed];
}

async function persistKilled(token: string, killed: string[]): Promise<string[] | null> {
  const issue = await findOrCreateIssue(
    token,
    KILL_TITLE,
    KILL_LABEL,
    KILL_COLOR,
    "Desk RSS kill list — never clobbered by a pull",
    formatKillBody(killed),
    killMem?.issueNumber ?? null,
  );
  if (!issue) return null;
  const prev = parseKillBody(issue.body);
  const next = mergeKilled(killed, prev);
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatKillBody(next) }),
  });
  if (!patched.ok) return null;
  killMem = { issueNumber: issue.number, killed: next, fetchedAt: Date.now() };
  return next;
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
    const issue = await findIssueByTitle(token, ISSUE_TITLE, LABEL, mem?.issueNumber ?? null);
    if (!issue) {
      const killed = await loadKilled(token);
      mem = { issueNumber: null, hits: [], killed, at: "", fetchedAt: Date.now() };
      return { at: "", hits: [], killed: [...killed] };
    }
    const parsed = parseBody(issue.body);
    const killed = mergeKilled(await loadKilled(token), parsed.killed);
    const hits = filterRssHits(parsed.hits, killed);
    return remember(issue.number, { at: parsed.at, hits, killed });
  } catch {
    return mem ? { at: mem.at, hits: [...mem.hits], killed: [...mem.killed] } : { at: "", hits: [], killed: [] };
  }
}

export async function saveRssHits(hits: RssHit[]): Promise<ParsedRss | null> {
  const token = commentsToken();
  if (!token) return null;
  const issue = await findOrCreateIssue(
    token,
    ISSUE_TITLE,
    LABEL,
    LABEL_COLOR,
    "Desk RSS ingest cache (not published)",
    formatBody("", [], []),
    mem?.issueNumber ?? null,
  );
  if (!issue) return null;
  const prev = parseBody(issue.body);
  const killed = mergeKilled(await loadKilled(token), mergeKilled(prev.killed, mem?.killed ?? []));
  const live = filterRssHits([...hits, ...prev.hits], killed).slice(0, MAX_HITS);
  const at = new Date().toISOString();
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(at, live, killed) }),
  });
  if (!patched.ok) return null;
  return remember(issue.number, { at, hits: live, killed });
}

export async function killRssHits(keys: string[]): Promise<ParsedRss | null> {
  const token = commentsToken();
  if (!token) return null;
  const clean = keys.map((k) => k.trim()).filter(Boolean);
  if (!clean.length) return null;
  const prev = await getStoredRssHits(true);
  const killed = mergeKilled(prev.killed, expandKillKeys(clean, prev.hits));
  const persisted = await persistKilled(token, killed);
  if (!persisted) return null;
  const live = filterRssHits(prev.hits, persisted);
  const issue = await findOrCreateIssue(
    token,
    ISSUE_TITLE,
    LABEL,
    LABEL_COLOR,
    "Desk RSS ingest cache (not published)",
    formatBody("", [], []),
    mem?.issueNumber ?? null,
  );
  const at = new Date().toISOString();
  if (issue) {
    await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
      method: "PATCH",
      body: JSON.stringify({ body: formatBody(at, live, persisted) }),
    });
    return remember(issue.number, { at, hits: live, killed: persisted });
  }
  return remember(mem?.issueNumber ?? null, { at, hits: live, killed: persisted });
}
