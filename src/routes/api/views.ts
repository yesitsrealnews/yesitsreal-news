import { createFileRoute } from "@tanstack/react-router";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import { isBotUserAgent, isCountableStoryId, utcDay } from "@/lib/views-core";
import { adjustViews, readViewsSummary, recordView, viewsStoreAvailable } from "@/lib/views-store.server";
import { clientKey, jsonLimited, limitedJson, rateLimit } from "@/lib/security";

function sameSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  if (!origin) return true;
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function noContent(): Response {
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}

export const Route = createFileRoute("/api/views")({
  server: {
    handlers: {
      // Public beacon: { id: "s123" }. Always 204 — never leaks counts.
      POST: async ({ request }) => {
        const ua = request.headers.get("user-agent") || "";
        const ip = clientKey(request);
        if (!sameSite(request) || isBotUserAgent(ua)) return noContent();
        if (!rateLimit(`views:${ip}`, 60)) return noContent();
        const body = await jsonLimited<{ id?: unknown }>(request, 512);
        if (!body || !isCountableStoryId(body.id)) return noContent();
        // The desk reading its own papers does not count.
        if (await deskTokenOk(readDeskCookie(request))) return noContent();
        if (viewsStoreAvailable()) recordView(body.id, ip, ua);
        return noContent();
      },
      // Desk only: counts for La Cambuse.
      GET: async ({ request }) => {
        if (!(await deskTokenOk(readDeskCookie(request)))) {
          return limitedJson({ ok: false, reason: "unauthorized" }, 401);
        }
        const fresh = new URL(request.url).searchParams.get("fresh") === "1";
        try {
          const summary = await readViewsSummary(fresh);
          if (!summary) return limitedJson({ ok: false, reason: "unavailable" });
          return limitedJson({ ok: true, ...summary });
        } catch {
          return limitedJson({ ok: false, reason: "unavailable" });
        }
      },
      // Desk only: correction, e.g. { id, views: -1, uniques: -1, day? } to remove test hits.
      PATCH: async ({ request }) => {
        if (!(await deskTokenOk(readDeskCookie(request)))) {
          return limitedJson({ ok: false, reason: "unauthorized" }, 401);
        }
        const body = await jsonLimited<{ id?: unknown; views?: unknown; uniques?: unknown; day?: unknown }>(request, 1024);
        const views = Number(body?.views ?? 0);
        const uniques = Number(body?.uniques ?? 0);
        const day = typeof body?.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.day) ? body.day : utcDay();
        if (!body || !isCountableStoryId(body.id) || !Number.isInteger(views) || !Number.isInteger(uniques)) {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }
        const ok = await adjustViews(body.id, day, views, uniques);
        if (!ok) return limitedJson({ ok: false, reason: "unavailable" }, 503);
        const summary = await readViewsSummary(true);
        return limitedJson({ ok: true, ...summary });
      },
    },
  },
});
