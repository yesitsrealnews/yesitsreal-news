import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { HomePage } from "@/components/stories/home-page";
import { JsonLd } from "@/components/site/json-ld";
import { useAppStore } from "@/lib/store";
import { orgJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/brand";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — Real news. Unbelievably dumb.` },
      {
        name: "description",
        content:
          "Verified. Sourced. Unfortunately true. Global newsroom. Only real, fact-checked stories among the dumbest events on Earth. Not satire.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "googlebot-news", content: "index, follow" },
      { name: "bingbot", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: `${SITE_NAME} — Real news. Unbelievably dumb.` },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${SITE_NAME} — Real news. Unbelievably dumb.` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

function Home() {
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const addNewsletter = useAppStore((s) => s.addNewsletter);
  return (
    <SiteShell>
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <HomePage lang={lang} extras={extras} onSubscribe={addNewsletter} />
    </SiteShell>
  );
}
