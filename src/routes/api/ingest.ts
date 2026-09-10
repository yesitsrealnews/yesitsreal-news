import { createFileRoute } from "@tanstack/react-router";
import { looksLikeSatire, detectSensitivity, scoreDumbness } from "@/lib/pipeline";
import {
  clientKey,
  isHoneypotTripped,
  isSafeHttpUrl,
  jsonLimited,
  limitedJson,
  rateLimit,
  sanitizeText,
} from "@/lib/security";
import { isPreferredNewsDomain } from "@/lib/data/regional-press";

export const Route = createFileRoute("/api/ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!rateLimit(`ingest:${clientKey(request)}`, 12)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{ url?: string; notes?: string; company_url?: string }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);
        if (isHoneypotTripped(body.company_url)) return limitedJson({ ok: true, status: "queued" });
        const url = sanitizeText(body.url, 500);
        const notes = sanitizeText(body.notes, 1200);
        if (!isSafeHttpUrl(url)) return limitedJson({ ok: false, reason: "url" }, 400);
        if (looksLikeSatire(url)) return limitedJson({ ok: false, reason: "satire-domain" }, 400);
        if (detectSensitivity(`${notes} ${url}`) === "reject-minors") {
          return limitedJson({ ok: false, reason: "auto-reject" }, 400);
        }
        const score = scoreDumbness(`${notes} ${url}`);
        return limitedJson({
          ok: true,
          status: "queued",
          dumbness: score.score,
          rationale: score.rationale,
          preferred: isPreferredNewsDomain(url),
        });
      },
    },
  },
});
