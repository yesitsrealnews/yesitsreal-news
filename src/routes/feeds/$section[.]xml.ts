import { createFileRoute } from "@tanstack/react-router";
import { isPublicSectionId } from "@/lib/data/sections";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { coverSrc } from "@/lib/covers";
import { xmlEscape, storySeoCopy } from "@/lib/seo";
import { getDeskStoryStatus } from "@/lib/desk-story-status";
import { inSection } from "@/lib/catalog";

export const Route = createFileRoute("/feeds/$section.xml")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const raw = (params as { section?: string; "section.xml"?: string }).section ?? params["section.xml"] ?? "";
        const section = raw.replace(/\.xml$/i, "");
        if (!isPublicSectionId(section)) {
          return new Response("Not found", { status: 404 });
        }
        const desk = await getDeskStoryStatus();
        const list = inSection([], section)
          .filter((s) => desk[s.id] !== "held" && desk[s.id] !== "deleted")
          .slice(0, 40);
        const items = list
          .map((s) => {
            const c = storySeoCopy(s);
            const slug = s.slugs.fr || s.slug;
            const img = coverSrc(s.id);
            const enclosure = img
              ? `<enclosure url="${xmlEscape(img.startsWith("http") ? img : SITE_URL + img)}" type="image/jpeg" />`
              : "";
            return `<item><title><![CDATA[${c.headline}]]></title><link>${SITE_URL}/story/${xmlEscape(slug)}</link><guid isPermaLink="true">${SITE_URL}/story/${xmlEscape(slug)}</guid><pubDate>${new Date(s.publishedAt).toUTCString()}</pubDate><description><![CDATA[${c.dek} YES IT'S REAL — ça s’est vraiment passé.]]></description>${enclosure}</item>`;
          })
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xmlEscape(SITE_NAME)} — ${xmlEscape(section)}</title><link>${SITE_URL}/${xmlEscape(section)}</link><language>fr</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><ttl>30</ttl><description>Rubrique ${xmlEscape(section)}. Vérifié. Sourcé. Ça s’est vraiment passé.</description><atom:link href="${SITE_URL}/feeds/${xmlEscape(section)}.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
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
