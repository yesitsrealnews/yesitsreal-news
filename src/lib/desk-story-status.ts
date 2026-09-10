import { commentsToken } from "@/lib/comments-github";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:story-status";
const LABEL = "desk-status";
const LABEL_COLOR = "141414";
const API = "https://api.github.com";
const STORY_ID_RE = /^s\d+$/;

export type DeskStoryOverride = "held" | "deleted";
export type DeskStoryStatusMap = Record<string, DeskStoryOverride>;

type IssuePayload = { v: 1; stories: DeskStoryStatusMap };

type GhIssue = { number: number; title: string; body?: string | null };

let mem: { issueNumber: number | null; stories: DeskStoryStatusMap; at: number } | null = null;
const CACHE_MS = 30_000;

export function isValidDeskStoryId(storyId: unknown): storyId is string {
  return typeof storyId === "string" && STORY_ID_RE.test(storyId);
}

export function deskStatusToken(): string | null {
  return commentsToken();
}

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-desk-status",
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

function parseBody(raw: string | null | undefined): DeskStoryStatusMap {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as Partial<IssuePayload>;
    if (!parsed || typeof parsed !== "object" || !parsed.stories || typeof parsed.stories !== "object") {
      return {};
    }
    const out: DeskStoryStatusMap = {};
    for (const [id, status] of Object.entries(parsed.stories)) {
      if (!isValidDeskStoryId(id)) continue;
      if (status === "held" || status === "deleted") out[id] = status;
    }
    return out;
  } catch {
    return {};
  }
}

function formatBody(stories: DeskStoryStatusMap): string {
  const payload: IssuePayload = { v: 1, stories };
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
      description: "Desk hold/delete overrides for published stories",
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
      body: formatBody({}),
    }),
  });
  if (!created.ok || !created.data?.number) return null;
  return created.data;
}

export async function getDeskStoryStatus(force = false): Promise<DeskStoryStatusMap> {
  if (!force && mem && Date.now() - mem.at < CACHE_MS) {
    return { ...mem.stories };
  }

  const token = deskStatusToken();
  if (!token) {
    mem = { issueNumber: null, stories: {}, at: Date.now() };
    return {};
  }

  try {
    const issue = await findIssue(token);
    if (!issue) {
      mem = { issueNumber: null, stories: {}, at: Date.now() };
      return {};
    }
    const stories = parseBody(issue.body);
    mem = { issueNumber: issue.number, stories, at: Date.now() };
    return { ...stories };
  } catch {
    return mem ? { ...mem.stories } : {};
  }
}

export async function setDeskStoryStatus(
  storyId: string,
  status: DeskStoryOverride | null,
): Promise<DeskStoryStatusMap | null> {
  if (!isValidDeskStoryId(storyId)) return null;
  const token = deskStatusToken();
  if (!token) return null;

  const issue = await findOrCreateIssue(token);
  if (!issue) return null;

  const current = parseBody(issue.body);
  if (status === null) {
    delete current[storyId];
  } else {
    current[storyId] = status;
  }

  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(current) }),
  });
  if (!patched.ok) return null;

  mem = { issueNumber: issue.number, stories: current, at: Date.now() };
  return { ...current };
}

export function invalidateDeskStoryStatusCache(): void {
  mem = null;
}
