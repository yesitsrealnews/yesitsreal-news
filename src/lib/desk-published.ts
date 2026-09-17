import { commentsToken } from "@/lib/comments-github";
import { STORIES, isCatalogId, isCatalogSourceUrl } from "@/lib/data/stories";
import { polishPublishedStory } from "@/lib/publish-copy";
import { isSafeHttpUrl } from "@/lib/security";
import { SECTION_IDS, type Lang, type SectionId, type Source, type Story, type StoryCopy } from "@/lib/types";

const OWNER = "yesitsrealnews";
const REPO = "yesitsreal-news";
const ISSUE_TITLE = "desk:published";
const LABEL = "desk-published";
const LABEL_COLOR = "C6FF3D";
const API = "https://api.github.com";
const MAX_ITEMS = 24;
const BODY_LIMIT = 58_000;

type IssuePayload = { v: 1; stories: Story[] };
type GhIssue = { number: number; title: string; body?: string | null };

let mem: { issueNumber: number | null; stories: Story[]; at: number } | null = null;
const CACHE_MS = 4_000;

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "User-Agent": "yesitsreal-news-desk-published",
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

function asCopy(raw: unknown): StoryCopy | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Partial<StoryCopy>;
  if (typeof c.headline !== "string" || typeof c.dek !== "string") return null;
  const body = Array.isArray(c.body) ? c.body.filter((p): p is string => typeof p === "string").slice(0, 8) : [];
  const why = Array.isArray(c.whyDumb) ? c.whyDumb.filter((p): p is string => typeof p === "string") : [];
  const whyDumb: [string, string, string] = [why[0] || "", why[1] || "", why[2] || ""];
  return {
    headline: c.headline.slice(0, 180),
    dek: c.dek.slice(0, 400),
    body: body.map((p) => (p.length > 900 ? `${p.slice(0, 897)}…` : p)),
    whyDumb,
    factCheckNote: typeof c.factCheckNote === "string" ? c.factCheckNote.slice(0, 400) : "",
  };
}

export function sanitizeDeskStory(raw: unknown): Story | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<Story>;
  if (typeof s.id !== "string" || !s.id.trim()) return null;
  if (typeof s.slug !== "string" || !s.slug.trim()) return null;
  if (!s.copy || typeof s.copy !== "object") return null;
  const en = asCopy(s.copy.en);
  if (!en) return null;
  const copy: Story["copy"] = { en };
  for (const [k, v] of Object.entries(s.copy)) {
    if (k === "en") continue;
    const c = asCopy(v);
    if (c) copy[k as Lang] = c;
  }
  const section = SECTION_IDS.includes(s.section as SectionId) ? (s.section as SectionId) : "faits-divers";
  const sources: Source[] = Array.isArray(s.sources)
    ? s.sources
        .filter((x): x is Source => !!x && typeof x.url === "string" && typeof x.title === "string")
        .slice(0, 8)
        .map((x) => ({
          title: String(x.title).slice(0, 180),
          publisher: String(x.publisher || "Source").slice(0, 80),
          url: String(x.url).slice(0, 400),
          date: String(x.date || "").slice(0, 12),
          type: x.type || "local",
        }))
    : [];
  if (!sources.length) return null;
  const slugs = s.slugs && typeof s.slugs === "object" ? { ...s.slugs, en: s.slugs.en || s.slug, fr: s.slugs.fr || s.slug } : { en: s.slug, fr: s.slug };
  const built: Story = {
    id: s.id.trim().slice(0, 40),
    slug: s.slug.trim().slice(0, 96),
    slugs,
    section,
    countryCode: String(s.countryCode || "UN").slice(0, 4).toUpperCase(),
    countryName: String(s.countryName || "Non précisé").slice(0, 60),
    location: String(s.location || s.countryName || "Non précisé").slice(0, 80),
    dumbness: Math.min(10, Math.max(4, Number(s.dumbness) || 6)),
    sources,
    factChecked: true,
    confidence: Math.min(0.99, Math.max(0.2, Number(s.confidence) || 0.6)),
    publishedAt: typeof s.publishedAt === "string" ? s.publishedAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    breaking: Boolean(s.breaking),
    status: "published",
    entities: Array.isArray(s.entities) ? s.entities.filter((e): e is string => typeof e === "string").slice(0, 12) : [],
    originalLang: (s.originalLang as Lang) || "fr",
    bylines: s.bylines,
    sensitivity: s.sensitivity === "death" ? "death" : "none",
    copy,
    ...(typeof s.coverUrl === "string" && isSafeHttpUrl(s.coverUrl) ? { coverUrl: s.coverUrl.slice(0, 400) } : {}),
  };
  return polishPublishedStory(built);
}

function parseBody(raw?: string | null): Story[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as Partial<IssuePayload>;
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.stories)) return [];
    return parsed.stories.map(sanitizeDeskStory).filter((s): s is Story => Boolean(s)).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function formatBody(stories: Story[]): string {
  let list = stories.slice(0, MAX_ITEMS);
  let body = JSON.stringify({ v: 1, stories: list } as IssuePayload);
  while (body.length > BODY_LIMIT && list.length > 1) {
    list = list.slice(0, -1);
    body = JSON.stringify({ v: 1, stories: list } as IssuePayload);
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
      description: "Desk-published stories not in the static catalog",
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
    `/repos/${OWNER}/${REPO}/issues?labels=${encodeURIComponent(LABEL)}&state=open&per_page=20`,
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
    body: JSON.stringify({ title: ISSUE_TITLE, labels: [LABEL], body: formatBody([]) }),
  });
  if (!created.ok || !created.data?.number) return null;
  return created.data;
}

export function nextStoryId(...idLists: string[][]): string {
  let max = 0;
  for (const s of STORIES) {
    const n = Number(/^s(\d+)$/.exec(s.id)?.[1] || 0);
    if (n > max) max = n;
  }
  for (const list of idLists) {
    for (const id of list) {
      const n = Number(/^s(\d+)$/.exec(id)?.[1] || 0);
      if (n > max) max = n;
    }
  }
  return `s${max + 1}`;
}

export function isCatalogStory(id: string): boolean {
  return isCatalogId(id);
}

export function dropCatalogCollisions(stories: Story[]): Story[] {
  return stories.filter((s) => !isCatalogId(s.id) && !s.sources.some((x) => isCatalogSourceUrl(x.url)));
}

export async function getPublishedExtras(force = false): Promise<Story[]> {
  if (!force && mem && Date.now() - mem.at < CACHE_MS) return dropCatalogCollisions(mem.stories);
  const token = commentsToken();
  if (!token) {
    mem = { issueNumber: null, stories: mem?.stories ?? [], at: Date.now() };
    return dropCatalogCollisions(mem.stories ?? []);
  }
  try {
    const issue = await findIssue(token);
    if (!issue) {
      mem = { issueNumber: null, stories: [], at: Date.now() };
      return [];
    }
    const stories = dropCatalogCollisions(parseBody(issue.body));
    mem = { issueNumber: issue.number, stories, at: Date.now() };
    return [...stories];
  } catch {
    return mem ? dropCatalogCollisions(mem.stories) : [];
  }
}

export async function upsertPublishedStory(story: Story): Promise<Story[] | null> {
  const token = commentsToken();
  if (!token) return null;
  const issue = await findOrCreateIssue(token);
  if (!issue) return null;
  const current = dropCatalogCollisions(parseBody(issue.body));
  const incoming = dropCatalogCollisions([story])[0];
  const next = incoming
    ? [incoming, ...current.filter((s) => s.id !== incoming.id)].slice(0, MAX_ITEMS)
    : current.slice(0, MAX_ITEMS);
  const patched = await gh<GhIssue>(token, `/repos/${OWNER}/${REPO}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body: formatBody(next) }),
  });
  if (!patched.ok) return null;
  mem = { issueNumber: issue.number, stories: next, at: Date.now() };
  return [...next];
}

export function invalidatePublishedExtrasCache(): void {
  mem = null;
}
