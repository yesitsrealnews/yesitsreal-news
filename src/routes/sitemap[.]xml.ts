import { createFileRoute } from "@tanstack/react-router";
import { publishedStories } from "@/lib/catalog";
import { SECTIONS } from "@/lib/data/sections";
import { SITE_URL } from "@/lib/brand";
import { xmlEscape } from "@/lib/seo";
import { getDeskStoryStatus } from "@/lib/desk-story-status";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const desk = await getDeskStoryStatus();
        const pages = [
          { loc: "/", lastmod: undefined as string | undefined, changefreq: "hourly", priority: "1.0" },
          { loc: "/today", lastmod: undefined, changefreq: "hourly", priority: "0.9" },
          { loc: "/rankings", lastmod: undefined, changefreq: "daily", priority: "0.6" },
          { loc: "/about", lastmod: undefined, changefreq: "weekly", priority: "0.6" },
          { loc: "/method", lastmod: undefined, changefreq: "weekly", priority: "0.5" },
          { loc: "/contact", lastmod: undefined, changefreq: "monthly", priority: "0.4" },
          { loc: "/submit", lastmod: undefined, changefreq: "weekly", priority: "0.5" },
          { loc: "/social", lastmod: undefined, changefreq: "daily", priority: "0.4" },
          { loc: "/shop", lastmod: undefined, changefreq: "weekly", priority: "0.3" },
          ...SECTIONS.map((s) => ({ loc: s.path, lastmod: undefined as string | undefined, changefreq: "hourly", priority: "0.8" })),
        ];
        const pageXml = pages
          .map(
            (u) =>
              `<url><loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ""}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
          )
          .join("");
        const storyXml = publishedStories([], desk)
          .map((s) => {
            const en = `${SITE_URL}/story/${xmlEscape(s.slug)}`;
            const frSlug = s.slugs.fr;
            const fr = frSlug ? `${SITE_URL}/story/${xmlEscape(frSlug)}` : en;
            const last = (s.updatedAt || s.publishedAt).slice(0, 10);
            const alts = `<xhtml:link rel="alternate" hreflang="fr" href="${fr}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${fr}"/>`;
            const frUrl = `<url><loc>${fr}</loc><lastmod>${last}</lastmod><changefreq>daily</changefreq><priority>0.9</priority>${alts}</url>`;
            if (!frSlug || frSlug === s.slug) return frUrl;
            return `${frUrl}<url><loc>${en}</loc><lastmod>${last}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority>${alts}</url>`;
          })
          .join("");
        const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pageXml}${storyXml}</urlset>`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=60, must-revalidate",
          },
        });
      },
    },
  },
});
