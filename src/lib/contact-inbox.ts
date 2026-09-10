import { sanitizeText } from "@/lib/security";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const LABEL = "contact-inbox";
const LABEL_COLOR = "0E8A16";
const MARKER = "<!--yir-contact v1-->";
const API = "https://api.github.com";

export const CONTACT_CHANNELS = [
  "press",
  "investors",
  "game",
  "advertisers",
  "desk",
  "ads",
  "contest",
  "security",
  "other",
] as const;

export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

export function isContactChannel(value: unknown): value is ContactChannel {
  return typeof value === "string" && (CONTACT_CHANNELS as readonly string[]).includes(value);
}

export function contactInboxToken(): string | null {
  const t = process.env.COMMENTS_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  return t && t.trim() ? t.trim() : null;
}

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-contact",
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

async function ensureLabel(token: string): Promise<void> {
  const existing = await gh<{ name: string }>(
    token,
    `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(LABEL)}`,
  );
  if (existing.ok) return;
  await gh(token, `/repos/${OWNER}/${REPO}/labels`, {
    method: "POST",
    body: JSON.stringify({
      name: LABEL,
      color: LABEL_COLOR,
      description: "Contact form inbox (one issue per message)",
    }),
  });
}

export function formatContactIssueBody(input: {
  channel: ContactChannel;
  from: string;
  message: string;
  at?: string;
}): string {
  const at = input.at ?? new Date().toISOString();
  return [
    MARKER,
    `## Contact · ${input.channel}`,
    ``,
    `- **channel:** \`${input.channel}\``,
    `- **from:** ${input.from}`,
    `- **at:** \`${at}\``,
    ``,
    `### Message`,
    ``,
    input.message,
  ].join("\n");
}

type GhIssue = { number: number; html_url?: string };

export async function createContactIssue(
  token: string,
  channel: ContactChannel,
  fromEmail: string,
  message: string,
): Promise<{ number: number; url?: string } | null> {
  const from = sanitizeText(fromEmail, 180);
  const text = sanitizeText(message, 2000);
  if (!from || text.length < 8) return null;

  await ensureLabel(token);
  const title = `contact:${channel} — ${from}`;
  const created = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title,
      labels: [LABEL],
      body: formatContactIssueBody({ channel, from, message: text }),
    }),
  });
  if (!created.ok || !created.data?.number) return null;
  return { number: created.data.number, url: created.data.html_url };
}
