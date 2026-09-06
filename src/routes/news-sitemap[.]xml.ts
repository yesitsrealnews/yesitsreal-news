import { createFileRoute } from "@tanstack/react-router";
import { STORIES } from "@/lib/data/stories";
import { SITE_URL } from "@/lib/brand";

export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = STORIES.filter((s) => s.status === "published" && !s.sponsored);
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${items
          .map((s) => {
            const title = s.copy.en.headline.replace(/&/g, "&").replace(/</g, "<");
            return `<url><loc>${SITE_URL}/story/${s.slug}</loc><news:news><news:publication><news:name>YES IT'S REAL</news:name><news:language>en</news:language></news:publication><news:publication_date>${s.publishedAt}</news:publication_date><news:title>${title}</news:title></news:news></url>`;
          })
          .join("")}</urlset>`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
