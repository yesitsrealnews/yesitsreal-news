import { createFileRoute } from "@tanstack/react-router";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import { runDeskAssign } from "@/lib/desk-assign";
import { getStoredAssignments, saveAssignment } from "@/lib/desk-assign-store";
import { clientKey, jsonLimited, limitedJson, rateLimit, sanitizeText } from "@/lib/security";

function noIndex(body: unknown, status: number): Response {
  const res = limitedJson(body, status);
  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, headers });
}

const REASONS: Record<string, string> = {
  subject: "Il faut un sujet, ou une URL.",
  satire: "Domaine satirique. On n’ingère pas ça.",
  minors: "Refusé. La desk ne traite pas ce matériau.",
  death: "Refusé. Pas de rubrique mort.",
  reject: "La desk a refusé le sujet (ligne éditoriale).",
  auth: "Session cambuse expirée.",
  payload: "Formulaire trop lourd.",
};

export const Route = createFileRoute("/api/desk-assign")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const desk = await deskTokenOk(readDeskCookie(request));
        if (!desk) return noIndex({ ok: false, reason: "auth" }, 401);
        const stored = await getStoredAssignments(true);
        return noIndex({ ok: true, at: stored.at, count: stored.items.length, items: stored.items }, 200);
      },
      POST: async ({ request }) => {
        const desk = await deskTokenOk(readDeskCookie(request));
        if (!desk) return noIndex({ ok: false, reason: "auth" }, 401);
        if (!rateLimit(`desk-assign:${clientKey(request)}`, 6, 10 * 60_000)) {
          return noIndex({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{
          subject?: string;
          url?: string;
          extraUrls?: string;
          notes?: string;
          country?: string;
          section?: string;
          voice?: string;
        }>(request, 12_000);
        if (!body) return noIndex({ ok: false, reason: "payload" }, 413);
        const extra = sanitizeText(body.extraUrls, 2000)
          .split(/\n+/)
          .map((l) => l.trim())
          .filter(Boolean);
        const result = await runDeskAssign({
          subject: body.subject ?? "",
          url: body.url,
          extraUrls: extra,
          notes: body.notes,
          country: body.country,
          section: body.section,
          voice: body.voice,
        });
        if (!result.ok) {
          return noIndex({ ok: false, reason: result.reason, message: REASONS[result.reason] || "Refus desk." }, 400);
        }
        try {
          await saveAssignment(result.item);
        } catch {
          /* persist is best-effort */
        }
        return noIndex(
          {
            ok: true,
            draftedBy: result.draftedBy,
            warning: result.warning ?? null,
            item: result.item,
          },
          200,
        );
      },
    },
  },
});
