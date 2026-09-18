import { createFileRoute } from "@tanstack/react-router";
import { deskTokenOk, readDeskCookie } from "@/lib/desk-auth.server";
import { clientKey, limitedJson, rateLimit } from "@/lib/security";
import { RSS_FEEDS, feedKind, feedPriority } from "@/lib/rss-feeds";
import { hitToQueueItem, pullRssFeeds } from "@/lib/rss-ingest";
import { filterRssHits } from "@/lib/rss-killed";
import { getStoredRssHits, saveRssHits } from "@/lib/rss-store";

function noIndex(body: unknown, status: number): Response {
  const res = limitedJson(body, status);
  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, headers });
}

async function runPull(quick: boolean, xOnly = false) {
  const stored = await getStoredRssHits(true).catch(() => ({ at: "", hits: [], killed: [] as string[] }));
  const { hits, scanned, failed } = await pullRssFeeds({ quick, xOnly });
  const live = filterRssHits(hits, stored.killed);
  try {
    await saveRssHits(live);
  } catch {
    /* persist is best-effort — the desk still gets the live hits */
  }
  return {
    ok: true,
    scanned,
    failed,
    count: live.length,
    killed: stored.killed,
    items: live.map((h) => hitToQueueItem(h)),
  };
}

export const Route = createFileRoute("/api/rss-pull")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("catalog") === "1") {
          const { xWatches } = await import("@/lib/x-journalists");
          return noIndex(
            {
              ok: true,
              feeds: RSS_FEEDS.map((f) => ({
                name: f.name,
                domain: f.domain,
                url: f.url,
                region: f.region,
                kind: feedKind(f),
                priority: feedPriority(f),
                via: f.via ?? null,
              })),
              journalists: xWatches().map((w) => ({
                handle: w.handle,
                href: `https://x.com/${w.handle}`,
                name: w.name,
                countryCode: w.countryCode,
                kind: w.kind,
                priority: w.priority,
              })),
            },
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
              killed: stored.killed,
              items: stored.hits.map((h) => hitToQueueItem(h)),
            },
            200,
          );
        }
        if (!rateLimit(`rss-pull:${clientKey(request)}`, 4, 60_000)) {
          return noIndex({ ok: false, reason: "rate-limited" }, 429);
        }
        const { xCronMode } = await import("@/lib/x-journalists");
        const cronMode = cron ? xCronMode() : { quick: url.searchParams.get("quick") === "1", xOnly: url.searchParams.get("x") === "1" };
        return noIndex(await runPull(cronMode.quick, cronMode.xOnly), 200);
      },
      POST: async ({ request }) => {
        const desk = await deskTokenOk(readDeskCookie(request));
        if (!desk) return noIndex({ ok: false, reason: "auth" }, 401);
        if (!rateLimit(`rss-pull:${clientKey(request)}`, 4, 60_000)) {
          return noIndex({ ok: false, reason: "rate-limited" }, 429);
        }
        const body = (await request.json().catch(() => ({}))) as { x?: boolean; quick?: boolean };
        return noIndex(await runPull(Boolean(body.quick), Boolean(body.x)), 200);
      },
    },
  },
});
