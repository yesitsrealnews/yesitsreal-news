import { createFileRoute } from "@tanstack/react-router";
import { scoreDumbness } from "@/lib/pipeline";
import { clientKey, jsonLimited, limitedJson, rateLimit, sanitizeText } from "@/lib/security";

export const Route = createFileRoute("/api/score")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!rateLimit(`score:${clientKey(request)}`, 30)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{ text?: string }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);
        return limitedJson(scoreDumbness(sanitizeText(body.text, 4000)));
      },
    },
  },
});
