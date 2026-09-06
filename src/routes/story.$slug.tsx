import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ArticleBody } from "@/components/stories/article-body";
import { findStory } from "@/lib/catalog";
import { useAppStore } from "@/lib/store";
import { storyCopy } from "@/lib/format";

export const Route = createFileRoute("/story/$slug")({
  component: StoryPage,
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
      <ArticleBody story={story} lang={lang} extras={extras} />
    </SiteShell>
  );
}
