import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ArticleBody } from "@/components/stories/article-body";
import { JsonLd } from "@/components/site/json-ld";
import { findStory } from "@/lib/catalog";
import { useAppStore } from "@/lib/store";
import { storyCopy } from "@/lib/format";
import { articleJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { coverSrc } from "@/lib/covers";

export const Route = createFileRoute("/story/$slug")({
  component: StoryPage,
  head: ({ params }) => {
    const story = findStory(params.slug, []);
    if (!story) return {};
    const c = story.copy.en;
    const img = coverSrc(story.id);
    const url = `${SITE_URL}/story/${story.slug}`;
    return {
      meta: [
        { title: `${c.headline} — ${SITE_NAME}` },
        { name: "description", content: `${c.dek} YES IT'S REAL — not satire.` },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { name: "googlebot-news", content: "index, follow" },
        { property: "og:type", content: "article" },
        { property: "og:title", content: c.headline },
        { property: "og:description", content: c.dek },
        { property: "og:url", content: url },
        { property: "og:image", content: `${SITE_URL}${img || "/og.jpg"}` },
        { property: "article:published_time", content: story.publishedAt },
        { property: "article:modified_time", content: story.updatedAt },
        { property: "article:section", content: story.section },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function StoryPage() {
  const { slug } = Route.useParams();
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const story = findStory(slug, extras);
  if (!story) {
    throw notFound();
  }
  const copy = storyCopy(story, lang);
  return (
    <SiteShell>
      <title>{`${copy.headline} — YES IT'S REAL`}</title>
      <JsonLd data={articleJsonLd(story)} />
      <ArticleBody story={story} lang={lang} extras={extras} />
    </SiteShell>
  );
}
