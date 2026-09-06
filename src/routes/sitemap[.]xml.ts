import { createFileRoute } from "@tanstack/react-router";
import { STORIES } from "@/lib/data/stories";
import { SECTIONS } from "@/lib/data/sections";
import { SITE_URL } from "@/lib/brand";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls: { loc: string; lastmod?: string; changefreq: string; priority: string }[] = [
          { loc: "/", changefreq: "hourly", priority: "1.0" },
          { loc: "/today", changefreq: "hourly", priority: "0.9" },
          { loc: "/rankings", changefreq: "daily", priority: "0.8" },
          { loc: "/about", changefreq: "weekly", priority: "0.6" },
          { loc: "/method", changefreq: "weekly", priority: "0.5" },
          { loc: "/contact", changefreq: "monthly", priority: "0.4" },
          { loc: "/submit", changefreq: "weekly", priority: "0.5" },
          { loc: "/contest", changefreq: "daily", priority: "0.6" },
          { loc: "/social", changefreq: "daily", priority: "0.5" },
          { loc: "/careers", changefreq: "weekly", priority: "0.3" },
          { loc: "/membership", changefreq: "weekly", priority: "0.4" },
          ...SECTIONS.map((s) => ({ loc: s.path, changefreq: "hourly", priority: "0.8" })),
          ...STORIES.filter((s) => s.status === "published").map((s) => ({
            loc: `/story/${s.slug}`,
            lastmod: s.updatedAt || s.publishedAt,
            changefreq: "daily",
            priority: "0.9",
          })),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
          .map(
            (u) =>
              `<url><loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ""}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
          )
          .join("")}</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
