import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { HomePage } from "@/components/stories/home-page";
import { JsonLd } from "@/components/site/json-ld";
import { useAppStore } from "@/lib/store";
import { itemListJsonLd, orgJsonLd, SEO_FR, websiteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { publishedStories } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: SEO_FR.title },
      { name: "description", content: SEO_FR.description },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "googlebot-news", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: SEO_FR.title },
      { property: "og:description", content: SEO_FR.description },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { property: "og:image:alt", content: "YES IT'S REAL — pas de satire" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_FR.title },
      { name: "twitter:description", content: SEO_FR.description },
      { name: "twitter:image", content: `${SITE_URL}/og.jpg` },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", hrefLang: "fr", href: SITE_URL },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL },
    ],
  }),
});

function Home() {
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const addNewsletter = useAppStore((s) => s.addNewsletter);
  const latest = publishedStories(extras);
  return (
    <SiteShell>
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={itemListJsonLd(latest)} />
      <HomePage lang={lang} extras={extras} onSubscribe={addNewsletter} />
    </SiteShell>
  );
}
