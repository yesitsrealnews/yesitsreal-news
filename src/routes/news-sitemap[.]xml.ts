import { createFileRoute } from "@tanstack/react-router";
import { publishedStories } from "@/lib/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { storySeoCopy, xmlEscape } from "@/lib/seo";
import { getDeskStoryStatus } from "@/lib/desk-story-status";

export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const desk = await getDeskStoryStatus();
        const live = publishedStories([], desk);
        const cutoff = Date.now() - 48 * 60 * 60 * 1000;
        const items = live.filter(
          (s) => +new Date(s.publishedAt) >= cutoff || +new Date(s.updatedAt || s.publishedAt) >= cutoff,
        );
        const listed = items.length ? items : live.slice(0, 20);
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${listed
          .map((s) => {
            const c = storySeoCopy(s);
            const slug = s.slugs.fr || s.slug;
            return `<url><loc>${SITE_URL}/story/${xmlEscape(slug)}</loc><news:news><news:publication><news:name>${xmlEscape(SITE_NAME)}</news:name><news:language>fr</news:language></news:publication><news:publication_date>${xmlEscape(s.publishedAt)}</news:publication_date><news:title>${xmlEscape(c.headline)}</news:title></news:news></url>`;
          })
          .join("")}</urlset>`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
