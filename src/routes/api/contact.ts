import { createFileRoute } from "@tanstack/react-router";
import {
  clientKey,
  isEmail,
  isHoneypotTripped,
  jsonLimited,
  limitedJson,
  rateLimit,
  sanitizeText,
} from "@/lib/security";
import {
  contactInboxToken,
  createContactIssue,
  isContactChannel,
} from "@/lib/contact-inbox";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!rateLimit(`contact:${clientKey(request)}`, 8)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{
          email?: string;
          body?: string;
          channel?: string;
          company_url?: string;
        }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);
        if (isHoneypotTripped(body.company_url)) return limitedJson({ ok: true }, 200);

        const channelRaw = typeof body.channel === "string" ? body.channel.trim().toLowerCase() : "";
        if (!isContactChannel(channelRaw)) {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }

        const email = sanitizeText(body.email, 180);
        const text = sanitizeText(body.body, 2000);
        if (!isEmail(email) || text.length < 8) {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }

        const token = contactInboxToken();
        if (!token) {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }

        try {
          const issue = await createContactIssue(token, channelRaw, email, text);
          if (!issue) {
            return limitedJson({ ok: false, reason: "unavailable" }, 503);
          }
          return limitedJson({ ok: true, queued: true, issue: issue.number });
        } catch {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }
      },
    },
  },
});
