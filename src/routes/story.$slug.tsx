import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ArticleBody } from "@/components/stories/article-body";
import { JsonLd } from "@/components/site/json-ld";
import { findStory } from "@/lib/catalog";
import { loadPublicDesk, mergeExtras } from "@/lib/desk-public";
import { useAppStore } from "@/lib/store";
import { storyCopy } from "@/lib/format";
import { articleJsonLd, breadcrumbJsonLd, storyCanonical, storySeoCopy } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { coverDisplaySrc, coverSizes, coverSrc, coverSrcSet } from "@/lib/covers";

export const Route = createFileRoute("/story/$slug")({
  loader: async ({ params }) => {
    const publicDesk = await loadPublicDesk();
    const story = findStory(params.slug, publicDesk.extras, publicDesk.desk);
    if (!story) throw notFound();
    return publicDesk;
  },
  component: StoryPage,
  head: ({ params, loaderData }) => {
    const story = findStory(params.slug, loaderData?.extras ?? [], loaderData?.desk);
    if (!story) return {};
    const c = storySeoCopy(story);
    const img = coverSrc(story.id);
    const ogImg = img?.startsWith("http") ? img : `${SITE_URL}${img || "/og.jpg"}`;
    const url = storyCanonical(story, params.slug);
    const enUrl = `${SITE_URL}/story/${story.slug}`;
    const frUrl = story.slugs.fr ? `${SITE_URL}/story/${story.slugs.fr}` : enUrl;
    return {
      title: `${c.headline} — ${SITE_NAME}`,
      meta: [
        { title: `${c.headline} — ${SITE_NAME}` },
        { name: "description", content: `${c.dek} YES IT'S REAL — ça s’est vraiment passé.` },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
        { name: "googlebot-news", content: "index, follow" },
        { name: "news_keywords", content: `${story.countryName}, ${story.section}, faits divers, ça s'est vraiment passé` },
        { name: "geo.placename", content: `${story.location}, ${story.countryName}` },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: c.headline },
        { property: "og:description", content: c.dek },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImg },
        { property: "og:image:alt", content: c.headline },
        { property: "og:locale", content: "fr_FR" },
        { property: "article:published_time", content: story.publishedAt },
        { property: "article:modified_time", content: story.updatedAt || story.publishedAt },
        { property: "article:section", content: story.section },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: c.headline },
        { name: "twitter:description", content: c.dek },
        { name: "twitter:image", content: ogImg },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "fr", href: frUrl },
        { rel: "alternate", hrefLang: "en", href: enUrl },
        { rel: "alternate", hrefLang: "x-default", href: frUrl },
        ...(coverDisplaySrc(story.id)
          ? [
              {
                rel: "preload",
                as: "image",
                href: coverDisplaySrc(story.id)!,
                type: "image/webp",
                imageSrcSet: coverSrcSet(story.id, "webp"),
                imageSizes: coverSizes("article"),
                fetchPriority: "high" as const,
              },
            ]
          : []),
      ],
    };
  },
});

function StoryPage() {
  const { slug } = Route.useParams();
  const loaded = Route.useLoaderData();
  const lang = useAppStore((s) => s.lang);
  const extras = mergeExtras(loaded?.extras ?? [], useAppStore((s) => s.extras));
  const deskStatus = { ...(loaded?.desk ?? {}), ...useAppStore((s) => s.deskStatus) };
  const story = findStory(slug, extras, deskStatus);
  if (!story) {
    throw notFound();
  }
  const copy = storyCopy(story, lang);
  return (
    <SiteShell>
      <title>{`${copy.headline} — YES IT'S REAL`}</title>
      <JsonLd data={articleJsonLd(story, slug)} />
      <JsonLd data={breadcrumbJsonLd(story)} />
      <ArticleBody story={story} lang={lang} extras={extras} />
    </SiteShell>
  );
}
