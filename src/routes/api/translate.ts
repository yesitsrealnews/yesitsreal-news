import { createFileRoute } from "@tanstack/react-router";
import { mockTranslate } from "@/lib/pipeline";
import type { StoryCopy } from "@/lib/types";
import { clientKey, jsonLimited, limitedJson, rateLimit, sanitizeText } from "@/lib/security";

export const Route = createFileRoute("/api/translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!rateLimit(`translate:${clientKey(request)}`, 12)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{ copy?: StoryCopy; lang?: string }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);
        const incoming = body.copy;
        const copy: StoryCopy = {
          headline: sanitizeText(incoming?.headline, 240),
          dek: sanitizeText(incoming?.dek, 400),
          body: Array.isArray(incoming?.body) ? incoming.body.slice(0, 12).map((p) => sanitizeText(p, 800)) : [],
          whyDumb: [
            sanitizeText(incoming?.whyDumb?.[0], 240),
            sanitizeText(incoming?.whyDumb?.[1], 240),
            sanitizeText(incoming?.whyDumb?.[2], 240),
          ] as [string, string, string],
          factCheckNote: sanitizeText(incoming?.factCheckNote, 400),
        };
        const lang = sanitizeText(body.lang, 12) || "en";
        return limitedJson({ lang, copy: mockTranslate(copy, lang) });
      },
    },
  },
});
