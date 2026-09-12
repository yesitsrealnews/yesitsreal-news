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

function formatBody(at: string, items: QueueItem[]): string {
  const payload: IssuePayload = { v: 1, at, items: items.slice(0, MAX_ITEMS) };
  let body = JSON.stringify(payload, null, 2);
  if (body.length > 60_000) {
    const slim = items.slice(0, 4);
    body = JSON.stringify({ v: 1, at, items: slim }, null, 2);
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
