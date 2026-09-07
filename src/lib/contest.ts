import { STORIES } from "@/lib/data/stories";
import { storyCopy } from "@/lib/format";
import type { Lang, Story } from "@/lib/types";

export const CUP = {
  id: "wdc-2026",
  closesAt: "2026-10-31T23:59:59.000Z",
  purse: 250,
} as const;

export interface CupEntry {
  id: string;
  storyId?: string;
  countryCode: string;
  countryName: string;
  headline: string;
  dek: string;
  slug?: string;
  dumbness: number;
  baseVotes: number;
  sourceUrl?: string;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function seedEntries(lang: Lang): CupEntry[] {
  const seen = new Set<string>();
  const out: CupEntry[] = [];
  for (const s of STORIES) {
    if (s.status !== "published" || s.sponsored) continue;
    if (seen.has(s.countryCode)) continue;
    seen.add(s.countryCode);
    const copy = storyCopy(s, lang);
    out.push({
      id: s.id,
      storyId: s.id,
      countryCode: s.countryCode,
      countryName: s.countryName,
      headline: copy.headline,
      dek: copy.dek,
      slug: s.slugs[lang] ?? s.slug,
      dumbness: s.dumbness,
      baseVotes: 2_200 + (hash(s.countryCode) % 18_000),
    });
  }
  return out.sort((a, b) => b.baseVotes - a.baseVotes);
}

export function liveVotes(base: number): number {
  return base;
}

export function cupClosesIn(): { d: number; h: number; m: number } {
  const ms = Math.max(0, +new Date(CUP.closesAt) - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return { d, h, m };
}

export function countryFromStory(story: Story): { code: string; name: string } {
  return { code: story.countryCode, name: story.countryName };
}
