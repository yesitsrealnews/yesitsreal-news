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
  return `${headline}\n\n${t(lang, "tagline2")}\n${t(lang, "shareNote")} @yesitsrealnews\n${absUrl(path)}`;
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

export function shareToMessenger(url: string): void {
  if (typeof window === "undefined") return;
  const encoded = encodeURIComponent(url);
  const desktopDialog =
    "https://www.facebook.com/dialog/send?app_id=966242223397117&link=" +
    encoded +
    "&redirect_uri=" +
    encodeURIComponent("https://www.facebook.com/");
  const isMobile = /Android|iPhone|iPad|iPod|webOS|Mobile/i.test(navigator.userAgent || "");
  if (isMobile) {
    window.location.href = "fb-messenger://share/?link=" + encoded;
    // Soft fallback: deep link may no-op if Messenger is not installed.
    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.open(desktopDialog, "_blank", "noopener,noreferrer");
      }
    }, 1800);
    return;
  }
  window.open(desktopDialog, "_blank", "noopener,noreferrer");
}
