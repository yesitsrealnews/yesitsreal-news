import { createFileRoute } from "@tanstack/react-router";
import { STORIES } from "@/lib/data/stories";
import { SITE_URL } from "@/lib/brand";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = STORIES.filter((s) => s.status === "published" && !s.sponsored)
          .map((s) => {
            const c = s.copy.en;
            return `<item><title><![CDATA[${c.headline}]]></title><link>${SITE_URL}/story/${s.slug}</link><pubDate>${new Date(s.publishedAt).toUTCString()}</pubDate><description><![CDATA[${c.dek} YES IT'S REAL — not satire.]]></description></item>`;
          })
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>YES IT'S REAL</title><link>${SITE_URL}</link><description>Real news. Unbelievably dumb. Verified. Sourced. Unfortunately true.</description>${items}</channel></rss>`;
        return new Response(xml, {
          headers: { "content-type": "application/rss+xml; charset=utf-8" },
        });
      },
    },
  },
});
