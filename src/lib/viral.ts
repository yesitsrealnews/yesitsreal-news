import { t } from "@/lib/i18n";
import type { Lang, ReactionId } from "@/lib/types";
import { SITE_URL } from "@/lib/brand";

export const REACTIONS: { id: ReactionId; key: "reactUnreal" | "reactPeak" | "reactBoss" | "reactThere" }[] = [
  { id: "unreal", key: "reactUnreal" },
  { id: "peak", key: "reactPeak" },
  { id: "boss", key: "reactBoss" },
  { id: "there", key: "reactThere" },
];

export function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function shareCopy(lang: Lang, headline: string, path: string): string {
  return `${headline}\n\n${t(lang, "tagline2")}\n${t(lang, "shareNote")}\n${absUrl(path)}`;
}

export async function nativeShare(payload: { title: string; text: string; url: string }): Promise<boolean> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") return false;
  try {
    await navigator.share(payload);
    return true;
  } catch {
    return false;
  }
}

export function seedReactions(id: string): Record<ReactionId, number> {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = Math.abs(h >>> 0);
  return {
    unreal: 120 + (n % 1800),
    peak: 80 + (n % 960),
    boss: 40 + (n % 420),
    there: 12 + (n % 90),
  };
}
