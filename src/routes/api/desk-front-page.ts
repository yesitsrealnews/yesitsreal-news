import { createFileRoute } from "@tanstack/react-router";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import {
  frontPageToken,
  getFrontPageIds,
  isValidFrontStoryId,
  MAX_FRONT_PAGE_IDS,
  pinFrontPageId,
  setFrontPageIds,
  unpinFrontPageId,
} from "@/lib/desk-front-page";
import { clientKey, jsonLimited, limitedJson, rateLimit } from "@/lib/security";

export const Route = createFileRoute("/api/desk-front-page")({
  server: {
    handlers: {
      GET: async () => {
        const token = frontPageToken();
        if (!token) {
          return limitedJson({ ok: true, ids: [] as string[] });
        }
        try {
          const ids = await getFrontPageIds();
          return limitedJson({ ok: true, ids });
        } catch {
          return limitedJson({ ok: true, ids: [] as string[] });
        }
      },
      POST: async ({ request }) => {
        if (!rateLimit(`desk-front-page:${clientKey(request)}`, 30)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }

        const deskOk = await deskTokenOk(readDeskCookie(request));
        if (!deskOk) {
          return limitedJson({ ok: false, reason: "unauthorized" }, 401);
        }

        const body = await jsonLimited<{
          action?: string;
          ids?: unknown;
          storyId?: string;
        }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);

        if (!frontPageToken()) {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }

        const action = typeof body.action === "string" ? body.action.trim() : "";

        try {
          if (action === "set") {
            if (!Array.isArray(body.ids)) {
              return limitedJson({ ok: false, reason: "invalid" }, 400);
            }
            if (body.ids.length > MAX_FRONT_PAGE_IDS) {
              return limitedJson({ ok: false, reason: "too-many" }, 400);
            }
            for (const id of body.ids) {
              if (!isValidFrontStoryId(id)) {
                return limitedJson({ ok: false, reason: "invalid" }, 400);
              }
            }
            const ids = await setFrontPageIds(body.ids as string[]);
            if (!ids) return limitedJson({ ok: false, reason: "unavailable" }, 503);
            return limitedJson({ ok: true, ids });
          }

          if (action === "pin" || action === "unpin") {
            const storyId = typeof body.storyId === "string" ? body.storyId.trim() : "";
            if (!isValidFrontStoryId(storyId)) {
              return limitedJson({ ok: false, reason: "invalid" }, 400);
            }
            const ids =
              action === "pin" ? await pinFrontPageId(storyId) : await unpinFrontPageId(storyId);
            if (!ids) return limitedJson({ ok: false, reason: "unavailable" }, 503);
            return limitedJson({ ok: true, ids });
          }

          return limitedJson({ ok: false, reason: "invalid" }, 400);
        } catch {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }
      },
    },
  },
});
