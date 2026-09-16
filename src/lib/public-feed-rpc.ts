import { createServerFn } from "@tanstack/react-start";
import { isSectionId } from "@/lib/data/sections";
import { slimCard, slimFull } from "@/lib/public-feed";
import type { Lang, Story } from "@/lib/types";

const BAKE_LANGS: Lang[] = ["fr", "es", "de"];

async function deskAndCatalog() {
  const [{ loadPublicDesk }, catalog, { localizedCopy }] = await Promise.all([
    import("@/lib/desk-public"),
    import("@/lib/catalog"),
    import("@/lib/data/headlines"),
  ]);
  const desk = await loadPublicDesk();
  function bake(story: Story): Story {
    const copy = { ...story.copy };
    for (const lang of BAKE_LANGS) {
      if (copy[lang]) continue;
      const loc = localizedCopy(story, lang);
      if (loc.copy.headline !== story.copy.en.headline) copy[lang] = loc.copy;
    }
    return { ...story, copy };
  }
  return { desk, catalog, bake };
}

async function homePayload() {
  const { desk, catalog, bake } = await deskAndCatalog();
  const latest = catalog.homeStories(desk.extras, desk.desk, desk.frontPageIds).map((s) => slimCard(bake(s)));
  const sponsored = catalog.sponsoredStory(desk.extras, desk.desk);
  return {
    latest,
    sponsored: sponsored ? slimCard(bake(sponsored)) : null,
    extras: desk.extras.map((s) => slimCard(bake(s))),
    desk: desk.desk,
    frontPageIds: desk.frontPageIds,
  };
}

export const loadHomeFeed = createServerFn({ method: "GET" }).handler(async () => homePayload());

export const loadTodayFeed = createServerFn({ method: "GET" }).handler(async () => {
  const home = await homePayload();
  return { ...home, latest: home.latest.slice(0, 5) };
});

export const loadStoryFeed = createServerFn({ method: "GET" })
  .validator((d: unknown) => ({ slug: String((d as { slug?: string })?.slug ?? "") }))
  .handler(async ({ data }) => {
    const { desk, catalog, bake } = await deskAndCatalog();
    const story = catalog.findStory(data.slug, desk.extras, desk.desk);
    if (!story) {
      return {
        story: null as Story | null,
        related: [] as Story[],
        extras: desk.extras.map((s) => slimCard(bake(s))),
        desk: desk.desk,
      };
    }
    const baked = bake(story);
    const related = catalog.relatedStories(baked, desk.extras, 4, desk.desk).map((s) => slimCard(bake(s)));
    return {
      story: slimFull(baked),
      related,
      extras: desk.extras.map((s) => slimCard(bake(s))),
      desk: desk.desk,
    };
  });

export const loadSectionFeed = createServerFn({ method: "GET" })
  .validator((d: unknown) => ({ section: String((d as { section?: string })?.section ?? "") }))
  .handler(async ({ data }) => {
    const { desk, catalog, bake } = await deskAndCatalog();
    if (!isSectionId(data.section)) {
      return { stories: [] as Story[], extras: [] as Story[], desk: desk.desk, section: data.section };
    }
    const stories = catalog.inSection(desk.extras, data.section, desk.desk).map((s) => slimCard(bake(s)));
    return {
      stories,
      extras: desk.extras.map((s) => slimCard(bake(s))),
      desk: desk.desk,
      section: data.section,
    };
  });

export const searchFeed = createServerFn({ method: "GET" })
  .validator((d: unknown) => ({ q: String((d as { q?: string })?.q ?? "").slice(0, 200) }))
  .handler(async ({ data }) => {
    const { desk, catalog, bake } = await deskAndCatalog();
    if (!data.q.trim()) return { results: [] as Story[] };
    const results = catalog
      .searchStories(desk.extras, data.q, "fr", desk.desk)
      .slice(0, 40)
      .map((s) => slimCard(bake(s)));
    return { results };
  });
