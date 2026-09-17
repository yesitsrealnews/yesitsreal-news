import { createFileRoute } from "@tanstack/react-router";
import { homePayload } from "@/lib/public-feed-rpc";
import { clientKey, rateLimit } from "@/lib/security";

export const Route = createFileRoute("/api/public-home")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!rateLimit(`public-home:${clientKey(request)}`, 30, 60_000)) {
          return new Response(JSON.stringify({ ok: false, reason: "rate-limited" }), {
            status: 429,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "private, no-store",
            },
          });
        }
        const payload = await homePayload();
        return new Response(JSON.stringify({ ok: true, ...payload }), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "private, no-store",
            "cdn-cache-control": "no-store",
            "vercel-cdn-cache-control": "no-store",
          },
        });
      },
    },
  },
});
