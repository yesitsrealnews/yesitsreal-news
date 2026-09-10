import { createFileRoute } from "@tanstack/react-router";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import {
  deskStatusToken,
  getDeskStoryStatus,
  isValidDeskStoryId,
  setDeskStoryStatus,
  type DeskStoryOverride,
} from "@/lib/desk-story-status";
import { clientKey, jsonLimited, limitedJson, rateLimit } from "@/lib/security";

export const Route = createFileRoute("/api/desk-story-status")({
  server: {
    handlers: {
      GET: async () => {
        const token = deskStatusToken();
        if (!token) {
          return limitedJson({ ok: true, stories: {} });
        }
        try {
          const stories = await getDeskStoryStatus();
          return limitedJson({ ok: true, stories });
        } catch {
          return limitedJson({ ok: true, stories: {} });
        }
      },
      POST: async ({ request }) => {
        if (!rateLimit(`desk-story-status:${clientKey(request)}`, 30)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }

        const deskOk = await deskTokenOk(readDeskCookie(request));
        if (!deskOk) {
          return limitedJson({ ok: false, reason: "unauthorized" }, 401);
        }

        const body = await jsonLimited<{
          storyId?: string;
          status?: string;
        }>(request);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);

        const storyId = typeof body.storyId === "string" ? body.storyId.trim() : "";
        if (!isValidDeskStoryId(storyId)) {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }

        const raw = typeof body.status === "string" ? body.status.trim() : "";
        let next: DeskStoryOverride | null;
        if (raw === "held" || raw === "deleted") {
          next = raw;
        } else if (raw === "published") {
          next = null;
        } else {
          return limitedJson({ ok: false, reason: "invalid" }, 400);
        }

        if (!deskStatusToken()) {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }

        try {
          const stories = await setDeskStoryStatus(storyId, next);
          if (!stories) {
            return limitedJson({ ok: false, reason: "unavailable" }, 503);
          }
          return limitedJson({ ok: true, stories });
        } catch {
          return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }
      },
    },
  },
});
