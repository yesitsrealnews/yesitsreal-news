import { createFileRoute } from "@tanstack/react-router";
import { STORIES } from "@/lib/data/stories";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { coverSrc } from "@/lib/covers";
import { xmlEscape } from "@/lib/seo";
import { getDeskStoryStatus } from "@/lib/desk-story-status";

export const Route = createFileRoute("/rss-en.xml")({
  server: {
    handlers: {
      GET: async () => {
        const desk = await getDeskStoryStatus();
        const items = STORIES.filter(
          (s) => s.status === "published" && !s.sponsored && desk[s.id] !== "held" && desk[s.id] !== "deleted",
        )
          .map((s) => {
            const c = s.copy.en;
            const img = coverSrc(s.id);
            const enclosure = img
              ? `<enclosure url="${xmlEscape(img.startsWith("http") ? img : SITE_URL + img)}" type="image/jpeg" />`
              : "";
            return `<item><title><![CDATA[${c.headline}]]></title><link>${SITE_URL}/story/${xmlEscape(s.slug)}</link><guid isPermaLink="true">${SITE_URL}/story/${xmlEscape(s.slug)}</guid><pubDate>${new Date(s.publishedAt).toUTCString()}</pubDate><description><![CDATA[${c.dek} YES IT'S REAL — it really happened.]]></description>${enclosure}</item>`;
          })
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xmlEscape(SITE_NAME)} (EN)</title><link>${SITE_URL}</link><language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><ttl>30</ttl><description>Real news. Unbelievably dumb. Verified. Sourced. Unfortunately true. It really happened.</description><atom:link href="${SITE_URL}/rss-en.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
        return new Response(xml, {
          headers: {
            "content-type": "application/rss+xml; charset=utf-8",
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
