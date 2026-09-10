import { commentsToken } from "@/lib/comments-github";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:front-page";
const LABEL = "desk-front";
const LABEL_COLOR = "B00020";
const API = "https://api.github.com";
const STORY_ID_RE = /^s\d+$/;
export const MAX_FRONT_PAGE_IDS = 20;

export type FrontPageIds = string[];

type IssuePayload = { v: 1; ids: string[] };

type GhIssue = { number: number; title: string; body?: string | null };

let mem: { issueNumber: number | null; ids: FrontPageIds; at: number } | null = null;
const CACHE_MS = 30_000;

export function isValidFrontStoryId(storyId: unknown): storyId is string {
  return typeof storyId === "string" && STORY_ID_RE.test(storyId);
}

export function frontPageToken(): string | null {
  return commentsToken();
}

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-desk-front",
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

function sanitizeIds(raw: unknown): FrontPageIds {
  if (!Array.isArray(raw)) return [];
  const out: FrontPageIds = [];
  const seen = new Set<string>();
  for (const id of raw) {
    if (!isValidFrontStoryId(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= MAX_FRONT_PAGE_IDS) break;
  }
  return out;
}

function parseBody(raw: string | null | undefined): FrontPageIds {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as Partial<IssuePayload>;
    if (!parsed || typeof parsed !== "object") return [];
    return sanitizeIds(parsed.ids);
  } catch {
    return [];
  }
}

function formatBody(ids: FrontPageIds): string {
  const payload: IssuePayload = { v: 1, ids };
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
      description: "Desk ordered front-page (une) story pins",
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
      body: formatBody([]),
    }),
  });
  if (!created.ok || !created.data?.number) return null;
  return created.data;
}

export async function getFrontPageIds(force = false): Promise<FrontPageIds> {
  if (!force && mem && Date.now() - mem.at < CACHE_MS) {
    return [...mem.ids];
  }

  const token = frontPageToken();
  if (!token) {
    mem = { issueNumber: null, ids: [], at: Date.now() };
    return [];
  }

  try {
    const issue = await findIssue(token);
    if (!issue) {
      mem = { issueNumber: null, ids: [], at: Date.now() };
      return [];
    }
    const ids = parseBody(issue.body);
    mem = { issueNumber: issue.number, ids, at: Date.now() };
    return [...ids];
  } catch {
    return mem ? [...mem.ids] : [];
  }
}

export async function setFrontPageIds(ids: string[]): Promise<FrontPageIds | null> {
  const next = sanitizeIds(ids);
  const token = frontPageToken();
  if (!token) return null;

  const issue = await findOrCreateIssue(token);
  if (!issue) return null;

  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(next) }),
  });
  if (!patched.ok) return null;

  mem = { issueNumber: issue.number, ids: next, at: Date.now() };
  return [...next];
}

export async function pinFrontPageId(storyId: string): Promise<FrontPageIds | null> {
  if (!isValidFrontStoryId(storyId)) return null;
  const current = await getFrontPageIds(true);
  const without = current.filter((id) => id !== storyId);
  return setFrontPageIds([storyId, ...without]);
}

export async function unpinFrontPageId(storyId: string): Promise<FrontPageIds | null> {
  if (!isValidFrontStoryId(storyId)) return null;
  const current = await getFrontPageIds(true);
  if (!current.includes(storyId)) return [...current];
  return setFrontPageIds(current.filter((id) => id !== storyId));
}

export async function moveFrontPageId(storyId: string, toIndex: number): Promise<FrontPageIds | null> {
  if (!isValidFrontStoryId(storyId)) return null;
  const current = await getFrontPageIds(true);
  if (!current.includes(storyId)) return null;
  const without = current.filter((id) => id !== storyId);
  const idx = Math.max(0, Math.min(toIndex, without.length));
  without.splice(idx, 0, storyId);
  return setFrontPageIds(without);
}

export function invalidateFrontPageCache(): void {
  mem = null;
}
