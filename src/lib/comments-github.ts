import { sanitizeText } from "@/lib/security";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const LABEL = "reader-comments";
const LABEL_COLOR = "B00020";
const MARKER = "<!--yir-comment v1-->";
const API = "https://api.github.com";
const STORY_ID_RE = /^s\d+$/;

const issueCache = new Map<string, number>();

export type ReaderComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export function isValidStoryId(storyId: unknown): storyId is string {
  return typeof storyId === "string" && STORY_ID_RE.test(storyId);
}

export function commentsToken(): string | null {
  const t = process.env.COMMENTS_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  return t && t.trim() ? t.trim() : null;
}

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-comments",
  };
}

async function gh<T>(token: string, path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T | null }> {
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

export function formatCommentBody(author: string, text: string): string {
  return `${MARKER}\nauthor: ${author}\n---\n${text}`;
}

export function parseCommentBody(raw: string): { author: string; body: string } | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith(MARKER)) return null;
  const rest = trimmed.slice(MARKER.length).replace(/^\r?\n/, "");
  const sep = rest.indexOf("\n---\n");
  if (sep < 0) return null;
  const meta = rest.slice(0, sep);
  const body = rest.slice(sep + 5).trim();
  const authorLine = meta.split(/\r?\n/).find((l) => l.toLowerCase().startsWith("author:"));
  const author = sanitizeText(authorLine?.slice(authorLine.indexOf(":") + 1) ?? "", 40) || "Anonyme";
  if (!body) return null;
  return { author, body };
}

async function ensureLabel(token: string): Promise<void> {
  const existing = await gh<{ name: string }>(token, `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(LABEL)}`);
  if (existing.ok) return;
  await gh(token, `/repos/${OWNER}/${REPO}/labels`, {
    method: "POST",
    body: JSON.stringify({
      name: LABEL,
      color: LABEL_COLOR,
      description: "Reader comments thread per story",
    }),
  });
}

type GhIssue = { number: number; title: string };

export async function findIssueNumber(token: string, storyId: string): Promise<number | null> {
  const cached = issueCache.get(storyId);
  if (cached) return cached;

  const title = `comments:${storyId}`;
  const q = encodeURIComponent(`repo:${OWNER}/${REPO} is:issue in:title "${title}"`);
  const search = await gh<{ items?: GhIssue[] }>(token, `/search/issues?q=${q}&per_page=5`);
  const hit = search.data?.items?.find((i) => i.title === title);
  if (hit) {
    issueCache.set(storyId, hit.number);
    return hit.number;
  }

  // Fallback: list open issues with the label (paginated lightly)
  const listed = await gh<GhIssue[]>(
    token,
    `/repos/${OWNER}/${REPO}/issues?labels=${encodeURIComponent(LABEL)}&state=open&per_page=100`,
  );
  const fromList = listed.data?.find((i) => i.title === title);
  if (fromList) {
    issueCache.set(storyId, fromList.number);
    return fromList.number;
  }
  return null;
}

export async function findOrCreateIssue(token: string, storyId: string): Promise<number | null> {
  const existing = await findIssueNumber(token, storyId);
  if (existing) return existing;

  await ensureLabel(token);
  const title = `comments:${storyId}`;
  const created = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title,
      labels: [LABEL],
      body: [
        `## Reader comments thread`,
        ``,
        `- **storyId:** \`${storyId}\``,
        `- **canonical:** \`/story/${storyId}\` (slug may differ; id is stable)`,
        ``,
        `Comments are posted by the YES IT'S REAL site via the GitHub Issues API.`,
        `Do not close this issue; it is the persistence store for this story's reader comments.`,
      ].join("\n"),
    }),
  });
  if (!created.ok || !created.data?.number) return null;
  issueCache.set(storyId, created.data.number);
  return created.data.number;
}

type GhComment = {
  id: number;
  body: string;
  created_at: string;
  user?: { login?: string } | null;
};

export async function listReaderComments(token: string, storyId: string): Promise<ReaderComment[]> {
  const issueNumber = await findIssueNumber(token, storyId);
  if (!issueNumber) return [];

  const out: ReaderComment[] = [];
  let page = 1;
  for (;;) {
    const res = await gh<GhComment[]>(
      token,
      `/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments?per_page=100&page=${page}&direction=asc&sort=created`,
    );
    if (!res.ok || !res.data?.length) break;
    for (const c of res.data) {
      const parsed = parseCommentBody(c.body ?? "");
      if (!parsed) continue;
      out.push({
        id: String(c.id),
        author: parsed.author,
        body: parsed.body,
        createdAt: c.created_at,
      });
    }
    if (res.data.length < 100) break;
    page += 1;
    if (page > 10) break;
  }
  // oldest first
  out.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return out;
}

export async function postReaderComment(
  token: string,
  storyId: string,
  author: string,
  body: string,
): Promise<ReaderComment | null> {
  const issueNumber = await findOrCreateIssue(token, storyId);
  if (!issueNumber) return null;

  const res = await gh<GhComment>(token, `/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body: formatCommentBody(author, body) }),
  });
  if (!res.ok || !res.data) return null;
  return {
    id: String(res.data.id),
    author,
    body,
    createdAt: res.data.created_at,
  };
}
