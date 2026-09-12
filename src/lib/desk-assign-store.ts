import { commentsToken } from "@/lib/comments-github";
import type { QueueItem } from "@/lib/types";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:assignments";
const LABEL = "desk-assign";
const LABEL_COLOR = "8B1E3F";
const API = "https://api.github.com";
const MAX_ITEMS = 24;

type IssuePayload = { v: 1; at: string; items: QueueItem[] };
type GhIssue = { number: number; title: string; body?: string | null };

let mem: { issueNumber: number | null; items: QueueItem[]; at: string; fetchedAt: number } | null = null;
const CACHE_MS = 20_000;

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-desk-assign",
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

function parseBody(body?: string | null): { at: string; items: QueueItem[] } {
  if (!body) return { at: "", items: [] };
  try {
    const json = JSON.parse(body) as IssuePayload;
    if (json?.v !== 1 || !Array.isArray(json.items)) return { at: "", items: [] };
    const items = json.items.filter((i) => i && typeof i.id === "string" && i.story).slice(0, MAX_ITEMS);
    return { at: typeof json.at === "string" ? json.at : "", items };
  } catch {
    return { at: "", items: [] };
  }
}

/** GitHub issue body hard limit ~65536. Never silently keep only 4. */
const BODY_LIMIT = 58_000;

function compactItem(item: QueueItem): QueueItem {
  const story = item.story;
  const copy = { ...story.copy };
  for (const lang of Object.keys(copy) as (keyof typeof copy)[]) {
    const c = copy[lang];
    if (!c) continue;
    copy[lang] = {
      ...c,
      body: (c.body ?? []).slice(0, 6).map((p) => (p.length > 900 ? `${p.slice(0, 897)}…` : p)),
      dek: c.dek.length > 320 ? `${c.dek.slice(0, 317)}…` : c.dek,
      headline: c.headline.length > 140 ? `${c.headline.slice(0, 137)}…` : c.headline,
    };
  }
  return {
    ...item,
    story: {
      ...story,
      copy,
      sources: (story.sources ?? []).slice(0, 6),
      entities: (story.entities ?? []).slice(0, 12),
    },
    pack: {
      ...item.pack,
      claims: (item.pack?.claims ?? []).slice(0, 4),
      stillNeeds: (item.pack?.stillNeeds ?? []).slice(0, 4),
      suggestedEdits: (item.pack?.suggestedEdits ?? []).slice(0, 3),
    },
  };
}

function formatBody(at: string, items: QueueItem[]): string {
  let list = items.slice(0, MAX_ITEMS).map(compactItem);
  let body = JSON.stringify({ v: 1, at, items: list } as IssuePayload);
  while (body.length > BODY_LIMIT && list.length > 1) {
    list = list.slice(0, -1); // drop oldest (end of list — newest are prepended)
    body = JSON.stringify({ v: 1, at, items: list } as IssuePayload);
  }
  return body;
}

async function ensureLabel(token: string): Promise<void> {
  const existing = await gh<{ name: string }>(token, `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(LABEL)}`);
  if (existing.ok) return;
  await gh(token, `/repos/${OWNER}/${REPO}/labels`, {
    method: "POST",
    body: JSON.stringify({
      name: LABEL,
      color: LABEL_COLOR,
      description: "Desk commissioned drafts (not published)",
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

export async function getStoredAssignments(force = false): Promise<{ at: string; items: QueueItem[] }> {
  if (!force && mem && Date.now() - mem.fetchedAt < CACHE_MS) {
    return { at: mem.at, items: [...mem.items] };
  }
  const token = commentsToken();
  if (!token) {
    mem = { issueNumber: null, items: [], at: "", fetchedAt: Date.now() };
    return { at: "", items: [] };
  }
  try {
    const issue = await findIssue(token);
    if (!issue) {
      mem = { issueNumber: null, items: [], at: "", fetchedAt: Date.now() };
      return { at: "", items: [] };
    }
    const parsed = parseBody(issue.body);
    mem = { issueNumber: issue.number, items: parsed.items, at: parsed.at, fetchedAt: Date.now() };
    return { at: parsed.at, items: [...parsed.items] };
  } catch {
    return mem ? { at: mem.at, items: [...mem.items] } : { at: "", items: [] };
  }
}

export async function saveAssignment(item: QueueItem): Promise<{ at: string; items: QueueItem[] } | null> {
  const token = commentsToken();
  if (!token) return null;
  const issue = await findOrCreateIssue(token);
  if (!issue) return null;
  const prev = parseBody(issue.body);
  const merged = [item, ...prev.items.filter((i) => i.id !== item.id)].slice(0, MAX_ITEMS);
  const at = new Date().toISOString();
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(at, merged) }),
  });
  if (!patched.ok) return null;
  mem = { issueNumber: issue.number, items: merged, at, fetchedAt: Date.now() };
  return { at, items: [...merged] };
}

export async function removeAssignment(id: string): Promise<{ at: string; items: QueueItem[] } | null> {
  const token = commentsToken();
  if (!token) return null;
  const clean = id.trim();
  if (!clean) return null;
  const issue = await findOrCreateIssue(token);
  if (!issue) return null;
  const prev = parseBody(issue.body);
  const merged = prev.items.filter((i) => i.id !== clean && i.story?.id !== clean);
  const at = new Date().toISOString();
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(at, merged) }),
  });
  if (!patched.ok) return null;
  mem = { issueNumber: issue.number, items: merged, at, fetchedAt: Date.now() };
  return { at, items: [...merged] };
}

