import { createFileRoute } from "@tanstack/react-router";
import { clientKey, jsonLimited, limitedJson, rateLimit, sanitizeText } from "@/lib/security";

export const Route = createFileRoute("/api/publish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!rateLimit(`publish:${clientKey(request)}`, 8)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{ id?: string }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);
        return limitedJson({
          ok: true,
          id: sanitizeText(body.id, 80) || null,
          publishedAt: new Date().toISOString(),
          note: "Dummy publish endpoint. The desk gate writes to the client store in this preview.",
        });
      },
    },
  },
});
