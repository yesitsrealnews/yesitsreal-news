import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { HomePage } from "@/components/stories/home-page";
import { JsonLd } from "@/components/site/json-ld";
import { useAppStore } from "@/lib/store";
import { itemListJsonLd, orgJsonLd, SEO_FR, websiteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { homeStories } from "@/lib/catalog";
import { coverDisplaySrc, coverSizes, coverSrcSet } from "@/lib/covers";
import { loadPublicDesk, mergeExtras } from "@/lib/desk-public";

export const Route = createFileRoute("/")({
  loader: async () => {
    return loadPublicDesk();
  },
  component: Home,
  head: ({ loaderData }) => {
    const latest = homeStories(loaderData?.extras ?? [], loaderData?.desk, loaderData?.frontPageIds);
    const heroId = latest[0]?.id;
    const heroWebp = heroId ? coverDisplaySrc(heroId) : undefined;
    return {
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
      { property: "og:image:alt", content: "YES IT'S REAL — ça s’est vraiment passé" },
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
      ...(heroWebp
        ? [
            {
              rel: "preload",
              as: "image",
              href: heroWebp,
              type: "image/webp",
              imageSrcSet: coverSrcSet(heroId!, "webp"),
              imageSizes: coverSizes("hero"),
              fetchPriority: "high" as const,
            },
          ]
        : []),
    ],
  };
  },
});

function Home() {
  const { frontPageIds: loaderFrontIds, desk: loaderDesk, extras: loaderExtras } = Route.useLoaderData();
  const lang = useAppStore((s) => s.lang);
  const extras = mergeExtras(loaderExtras, useAppStore((s) => s.extras));
  const storeDesk = useAppStore((s) => s.deskStatus);
  const storeFrontIds = useAppStore((s) => s.frontPageIds);
  const setFrontPageIds = useAppStore((s) => s.setFrontPageIds);
  const setDeskStatus = useAppStore((s) => s.setDeskStatus);
  const addNewsletter = useAppStore((s) => s.addNewsletter);

  useEffect(() => {
    if (loaderFrontIds.length) setFrontPageIds(loaderFrontIds);
    if (loaderDesk && Object.keys(loaderDesk).length) {
      setDeskStatus({ ...useAppStore.getState().deskStatus, ...loaderDesk });
    }
  }, [loaderFrontIds, loaderDesk, setFrontPageIds, setDeskStatus]);

  const frontPageIds = storeFrontIds.length ? storeFrontIds : loaderFrontIds;
  const deskStatus = { ...loaderDesk, ...storeDesk };
  const latest = homeStories(extras, deskStatus, frontPageIds);
  return (
    <SiteShell>
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={itemListJsonLd(latest)} />
      <HomePage lang={lang} extras={extras} onSubscribe={addNewsletter} frontPageIds={frontPageIds} />
    </SiteShell>
  );
}
