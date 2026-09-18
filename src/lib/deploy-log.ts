import { commentsToken } from "@/lib/comments-github";
import { sanitizeText } from "@/lib/security";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:deploy-log";
const LABEL = "desk-deploy";
const LABEL_COLOR = "111111";
const API = "https://api.github.com";
const MAX_EVENTS = 20;

export type DeployEvent = {
  eventId: string;
  type: string;
  target: string;
  url: string;
  deploymentId: string;
  error: string;
  at: string;
};

type IssuePayload = { v: 1; at: string; events: DeployEvent[] };
type GhIssue = { number: number; title: string; body?: string | null };

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-deploy-log",
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

function parseBody(body?: string | null): DeployEvent[] {
  if (!body) return [];
  try {
    const json = JSON.parse(body) as IssuePayload;
    if (json?.v !== 1 || !Array.isArray(json.events)) return [];
    return json.events.filter((e) => e && typeof e.eventId === "string").slice(0, MAX_EVENTS);
  } catch {
    return [];
  }
}

async function findOrCreateIssue(token: string): Promise<GhIssue | null> {
  const q = encodeURIComponent(`repo:${OWNER}/${REPO} is:issue in:title "${ISSUE_TITLE}"`);
  const search = await gh<{ items?: GhIssue[] }>(token, `/search/issues?q=${q}&per_page=5`);
  const hit = search.data?.items?.find((i) => i.title === ISSUE_TITLE);
  if (hit) {
    const full = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${hit.number}`);
    return full.ok && full.data ? full.data : hit;
  }
  const existing = await gh<{ name: string }>(
    token,
    `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(LABEL)}`,
  );
  if (!existing.ok) {
    await gh(token, `/repos/${OWNER}/${REPO}/labels`, {
      method: "POST",
      body: JSON.stringify({
        name: LABEL,
        color: LABEL_COLOR,
        description: "Production deploy log (desk only)",
      }),
    });
  }
  const created = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title: ISSUE_TITLE,
      labels: [LABEL],
      body: JSON.stringify({ v: 1, at: "", events: [] }, null, 2),
    }),
  });
  if (!created.ok || !created.data?.number) return null;
  return created.data;
}

export function sanitizeDeployEvent(input: Partial<DeployEvent> & { eventId: string; type: string }): DeployEvent {
  return {
    eventId: sanitizeText(input.eventId, 80),
    type: sanitizeText(input.type, 80),
    target: sanitizeText(input.target || "", 40) || "unknown",
    url: sanitizeText(input.url || "", 240),
    deploymentId: sanitizeText(input.deploymentId || "", 80),
    error: sanitizeText(input.error || "", 400),
    at: input.at && !Number.isNaN(Date.parse(input.at)) ? input.at : new Date().toISOString(),
  };
}

/** Append a production deploy event. Returns null if duplicate or persist failed. */
export async function appendDeployEvent(event: DeployEvent): Promise<{ duplicate: boolean; events: DeployEvent[] } | null> {
  const token = commentsToken();
  if (!token) return null;
  const issue = await findOrCreateIssue(token);
  if (!issue) return null;
  const prev = parseBody(issue.body);
  if (prev.some((e) => e.eventId === event.eventId || (e.deploymentId && e.deploymentId === event.deploymentId && e.type === event.type))) {
    return { duplicate: true, events: prev };
  }
  const events = [event, ...prev].slice(0, MAX_EVENTS);
  const at = event.at;
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({
      body: JSON.stringify({ v: 1, at, events } satisfies IssuePayload, null, 2),
    }),
  });
  if (!patched.ok) return null;
  return { duplicate: false, events };
}
