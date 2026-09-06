import { createFileRoute } from "@tanstack/react-router";
import {
  clearDeskCookieHeader,
  codeMatches,
  deskCookieHeader,
  deskTokenOk,
  mintDeskToken,
  readDeskCookie,
} from "@/lib/desk-auth.server";
import {
  clientKey,
  isHoneypotTripped,
  jsonLimited,
  limitedJson,
  rateLimit,
  sanitizeText,
} from "@/lib/security";

function noIndexJson(body: unknown, status: number, extra?: HeadersInit): Response {
  const res = limitedJson(body, status);
  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Cache-Control", "no-store");
  if (extra) new Headers(extra).forEach((v, k) => headers.set(k, v));
  return new Response(res.body, { status: res.status, headers });
}

export const Route = createFileRoute("/api/desk")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const ok = await deskTokenOk(readDeskCookie(request));
        return noIndexJson({ ok }, ok ? 200 : 401);
      },
      POST: async ({ request }) => {
        if (!rateLimit(`desk:${clientKey(request)}`, 5, 15 * 60_000)) {
          return noIndexJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{ code?: string; company_url?: string }>(request, 4000);
        if (!body) return noIndexJson({ ok: false, reason: "payload" }, 413);
        if (isHoneypotTripped(body.company_url)) return noIndexJson({ ok: true }, 200);
        const code = sanitizeText(body.code, 80);
        if (!codeMatches(code)) return noIndexJson({ ok: false }, 401);
        const token = await mintDeskToken();
        return noIndexJson({ ok: true }, 200, {
          "Set-Cookie": deskCookieHeader(token, request),
        });
      },
      DELETE: async () => {
        return noIndexJson({ ok: true }, 200, { "Set-Cookie": clearDeskCookieHeader() });
      },
    },
  },
});
