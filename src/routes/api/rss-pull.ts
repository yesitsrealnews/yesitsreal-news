import { createFileRoute } from "@tanstack/react-router";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import { clientKey, limitedJson, rateLimit } from "@/lib/security";
import { RSS_FEEDS } from "@/lib/rss-feeds";
import { hitToQueueItem, pullRssFeeds } from "@/lib/rss-ingest";
import { getStoredRssHits, saveRssHits } from "@/lib/rss-store";

function noIndex(body: unknown, status: number): Response {
  const res = limitedJson(body, status);
  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, headers });
}

async function runPull() {
  const { hits, scanned, failed } = await pullRssFeeds();
  try {
    await saveRssHits(hits);
  } catch {
    /* persist is best-effort — the desk still gets the live hits */
  }
  return {
    ok: true,
    scanned,
    failed,
    count: hits.length,
    items: hits.map((h) => hitToQueueItem(h)),
  };
}

export const Route = createFileRoute("/api/rss-pull")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const catalog = url.searchParams.get("catalog") === "1";
        if (catalog) {
          return noIndex(
            { ok: true, feeds: RSS_FEEDS.map((f) => ({ name: f.name, domain: f.domain, url: f.url, region: f.region })) },
            200,
          );
        }
        const cron = /vercel-cron/i.test(request.headers.get("user-agent") ?? "") || request.headers.get("x-vercel-cron");
        const desk = await deskTokenOk(readDeskCookie(request));
        if (!desk && !cron) return noIndex({ ok: false, reason: "auth" }, 401);
        if (url.searchParams.get("stored") === "1") {
          const stored = await getStoredRssHits(true);
          return noIndex(
            {
              ok: true,
              stored: true,
              at: stored.at,
              count: stored.hits.length,
              items: stored.hits.map((h) => hitToQueueItem(h)),
            },
            200,
          );
        }
        if (!rateLimit(`rss-pull:${clientKey(request)}`, 4, 60_000)) {
          return noIndex({ ok: false, reason: "rate-limited" }, 429);
        }
        return noIndex(await runPull(), 200);
      },
      POST: async ({ request }) => {
        const desk = await deskTokenOk(readDeskCookie(request));
        if (!desk) return noIndex({ ok: false, reason: "auth" }, 401);
        if (!rateLimit(`rss-pull:${clientKey(request)}`, 4, 60_000)) {
          return noIndex({ ok: false, reason: "rate-limited" }, 429);
        }
        return noIndex(await runPull(), 200);
      },
    },
  },
});
