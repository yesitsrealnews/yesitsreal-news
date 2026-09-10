import { createFileRoute } from "@tanstack/react-router";
import {
  clientKey,
  isHoneypotTripped,
  jsonLimited,
  limitedJson,
  rateLimit,
  sanitizeText,
} from "@/lib/security";
import {
  commentsToken,
  isValidStoryId,
  listReaderComments,
  postReaderComment,
} from "@/lib/comments-github";

export const Route = createFileRoute("/api/comments")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const storyId = url.searchParams.get("storyId") ?? "";
        if (!isValidStoryId(storyId)) {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }
        const token = commentsToken();
        if (!token) {
          return limitedJson({ ok: true, comments: [], disabled: true });
        }
        try {
          const comments = await listReaderComments(token, storyId);
          return limitedJson({ ok: true, comments });
        } catch {
          return limitedJson({ ok: true, comments: [], disabled: true });
        }
      },
      POST: async ({ request }) => {
        if (!rateLimit(`comments:${clientKey(request)}`, 8)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = await jsonLimited<{
          storyId?: string;
          author?: string;
          body?: string;
          company_url?: string;
        }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);
        if (isHoneypotTripped(body.company_url)) return limitedJson({ ok: true });

        const storyId = typeof body.storyId === "string" ? body.storyId.trim() : "";
        if (!isValidStoryId(storyId)) {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }

        const author = sanitizeText(body.author, 40) || "Anonyme";
        const text = sanitizeText(body.body, 1200);
        if (text.length < 8 || text.length > 1200) {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }

        const token = commentsToken();
        if (!token) {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }

        try {
          const comment = await postReaderComment(token, storyId, author, text);
          if (!comment) {
            return limitedJson({ ok: false, reason: "unavailable" }, 503);
          }
          return limitedJson({ ok: true, comment });
        } catch {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }
      },
    },
  },
});
