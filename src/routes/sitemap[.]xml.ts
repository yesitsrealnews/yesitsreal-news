import { createFileRoute } from "@tanstack/react-router";
import { STORIES } from "@/lib/data/stories";
import { SECTIONS } from "@/lib/data/sections";
import { SITE_URL } from "@/lib/brand";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = [
          "/",
          "/rankings",
          "/submit",
          "/about",
          "/method",
          "/search",
          "/contest",
          "/social",
          "/invest",
          "/advertise",
          "/contact",
          "/membership",
          "/shop",
          "/careers",
          "/today",
          ...SECTIONS.map((s) => s.path),
          ...STORIES.filter((s) => s.status === "published").map((s) => `/story/${s.slug}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
          .map((u) => `<url><loc>${SITE_URL}${u}</loc></url>`)
          .join("")}</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
