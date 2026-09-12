import { createFileRoute } from "@tanstack/react-router";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import { runDeskRewrite } from "@/lib/desk-rewrite";
import { saveAssignment } from "@/lib/desk-assign-store";
import { clientKey, jsonLimited, limitedJson, rateLimit, sanitizeText } from "@/lib/security";
import type { Story } from "@/lib/types";

function noIndex(body: unknown, status: number): Response {
  const res = limitedJson(body, status);
  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, headers });
}

const REASONS: Record<string, string> = {
  instructions: "Écris comment réécrire (au moins une phrase).",
  story: "Papier introuvable.",
  auth: "Session cambuse expirée.",
  payload: "Formulaire trop lourd.",
  unavailable: "Rédaction auto indisponible (clé xAI).",
  draft: "La desk n’a pas pu réécrire. Réessaie.",
};

export const Route = createFileRoute("/api/desk-rewrite")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const desk = await deskTokenOk(readDeskCookie(request));
        if (!desk) return noIndex({ ok: false, reason: "auth" }, 401);
        if (!rateLimit(`desk-rewrite:${clientKey(request)}`, 4, 10 * 60_000)) {
          return noIndex({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{
          storyId?: string;
          instructions?: string;
          story?: Story;
        }>(request, 80_000);
        if (!body) return noIndex({ ok: false, reason: "payload" }, 413);
        const storyId = sanitizeText(body.storyId, 40);
        const result = await runDeskRewrite({
          storyId,
          instructions: body.instructions ?? "",
          story: body.story,
        });
        if (!result.ok) {
          return noIndex(
            { ok: false, reason: result.reason, message: REASONS[result.reason] || "Refus desk." },
            result.reason === "auth" ? 401 : 400,
          );
        }
        try {
          await saveAssignment(result.item);
        } catch {
          /* best-effort */
        }
        return noIndex({ ok: true, draftedBy: result.draftedBy, item: result.item }, 200);
      },
    },
  },
});
