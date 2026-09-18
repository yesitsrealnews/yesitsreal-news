import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { HomePage } from "@/components/stories/home-page";
import { JsonLd } from "@/components/site/json-ld";
import { useAppStore } from "@/lib/store";
import { itemListJsonLd, orgJsonLd, SEO_FR, websiteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { coverDisplaySrc, coverSizes, coverSrcSet } from "@/lib/covers";
import { composePublicHome, mergeExtras, overlayDesk, overlaySponsored } from "@/lib/public-feed";
import { loadHomeFeed } from "@/lib/public-feed-rpc";
import { useLiveHome } from "@/lib/use-live-home";

export const Route = createFileRoute("/")({
  loader: async () => loadHomeFeed(),
  component: Home,
  head: ({ loaderData }) => {
    const heroId = loaderData?.latest?.[0]?.id;
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
      { property: "og:image:alt", content: `${SITE_NAME} — ça s’est vraiment passé` },
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
  const loaded = useLiveHome(Route.useLoaderData());
  const lang = useAppStore((s) => s.lang);
  const extras = mergeExtras(loaded?.extras, useAppStore((s) => s.extras));
  const storeDesk = useAppStore((s) => s.deskStatus);
  const setFrontPageIds = useAppStore((s) => s.setFrontPageIds);
  const setDeskStatus = useAppStore((s) => s.setDeskStatus);
  const addNewsletter = useAppStore((s) => s.addNewsletter);

  useEffect(() => {
    if (loaded?.frontPageIds?.length) setFrontPageIds(loaded.frontPageIds);
    if (loaded?.desk && Object.keys(loaded.desk).length) {
      setDeskStatus({ ...useAppStore.getState().deskStatus, ...loaded.desk });
    }
  }, [loaded?.frontPageIds, loaded?.desk, setFrontPageIds, setDeskStatus]);

  const deskStatus = overlayDesk(loaded?.desk, storeDesk);
  const latest = composePublicHome(loaded?.latest ?? [], extras, deskStatus);
  const sponsored = overlaySponsored(loaded?.sponsored ? [loaded.sponsored] : [], extras, deskStatus) ?? loaded?.sponsored ?? undefined;

  return (
    <SiteShell>
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={itemListJsonLd(latest)} />
      <HomePage lang={lang} stories={latest} sponsored={sponsored} onSubscribe={addNewsletter} />
    </SiteShell>
  );
}
