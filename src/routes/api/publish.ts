import { createFileRoute } from "@tanstack/react-router";
import { STORIES } from "@/lib/data/stories";
import { removeAssignment } from "@/lib/desk-assign-store";
import { killRssHits } from "@/lib/rss-store";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import { pinFrontPageId } from "@/lib/desk-front-page";
import {
  getPublishedExtras,
  isCatalogStory,
  nextStoryId,
  sanitizeDeskStory,
  upsertPublishedStory,
} from "@/lib/desk-published";
import { commentsToken } from "@/lib/comments-github";
import { getDeskStoryStatus, setDeskStoryStatus } from "@/lib/desk-story-status";
import { clientKey, jsonLimited, limitedJson, rateLimit } from "@/lib/security";
import type { Story } from "@/lib/types";

export const Route = createFileRoute("/api/publish")({
  server: {
    handlers: {
      GET: async () => {
        const stories = await getPublishedExtras();
        return limitedJson({ ok: true, stories });
      },
      POST: async ({ request }) => {
        if (!rateLimit(`publish:${clientKey(request)}`, 20)) {
          return limitedJson({ ok: false, reason: "rate-limited" }, 429);
        }
        const deskOk = await deskTokenOk(readDeskCookie(request));
        if (!deskOk) return limitedJson({ ok: false, reason: "unauthorized" }, 401);

        const body = await jsonLimited<{ story?: unknown; storyId?: string }>(request, 80_000);
        if (!body) return limitedJson({ ok: false, reason: "payload" }, 413);

        const catalogId = typeof body.storyId === "string" ? body.storyId.trim() : "";
        let incoming = sanitizeDeskStory(body.story);
        if (!incoming && /^s\d+$/.test(catalogId) && isCatalogStory(catalogId)) {
          const seed = STORIES.find((s) => s.id === catalogId);
          incoming = seed ? { ...seed, status: "published", factChecked: true, updatedAt: new Date().toISOString() } : null;
        }
        if (!incoming) return limitedJson({ ok: false, reason: "invalid" }, 400);

        const extras = await getPublishedExtras(true);
        const statusMap = await getDeskStoryStatus(true);
        let story: Story = {
          ...incoming,
          status: "published",
          factChecked: true,
          publishedAt: incoming.publishedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const known = isCatalogStory(story.id) || extras.some((s) => s.id === story.id);
        if (!/^s\d+$/.test(story.id) || !known) {
          story = {
            ...story,
            id: nextStoryId(
              extras.map((s) => s.id),
              Object.keys(statusMap),
            ),
          };
        }

        const token = commentsToken();
        if (!token) {
          return limitedJson({
            ok: true,
            story,
            stories: { ...statusMap, [story.id]: "published" },
            ids: [story.id],
            extras: extras.some((s) => s.id === story.id) ? extras : [story, ...extras],
            reason: "local",
          });
        }

        if (!isCatalogStory(story.id)) {
          const saved = await upsertPublishedStory(story);
          if (!saved) return limitedJson({ ok: false, reason: "unavailable" }, 503);
        }

        const nextStatus = await setDeskStoryStatus(story.id, "published");
        if (!nextStatus) return limitedJson({ ok: false, reason: "unavailable" }, 503);

        const ids = (await pinFrontPageId(story.id)) ?? [story.id];
        await removeAssignment(incoming.id).catch(() => null);
        if (story.id !== incoming.id) await removeAssignment(story.id).catch(() => null);
        const sourceUrl = incoming.sources?.[0]?.url;
        await killRssHits([incoming.id, story.id, sourceUrl].filter((x): x is string => Boolean(x))).catch(() => null);

        const publishedExtras = await getPublishedExtras(true);
        return limitedJson({ ok: true, story, stories: nextStatus, ids, extras: publishedExtras });
      },
    },
  },
});
