import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mergeStories, publishedStories, type DeskStatusMap } from "./catalog-core.ts";
import type { Story, StoryCopy } from "./types.ts";

const copy: StoryCopy = {
  headline: "Seed",
  dek: "Dek",
  body: ["Body"],
  whyDumb: ["a", "b", "c"],
  factCheckNote: "note",
};

function fake(partial: Partial<Story> & Pick<Story, "id" | "slug">): Story {
  return {
    section: "faits-divers",
    countryCode: "FR",
    countryName: "France",
    location: "Lyon",
    dumbness: 7,
    sources: [
      {
        title: partial.slug,
        publisher: "Test",
        url: `https://www.leparisien.fr/faits-divers/${partial.slug}`,
        date: "2026-09-17",
        type: "local",
      },
    ],
    factChecked: true,
    confidence: 0.9,
    publishedAt: "2026-09-17T12:00:00.000Z",
    updatedAt: "2026-09-17T12:00:00.000Z",
    status: "published",
    entities: [],
    originalLang: "fr",
    sensitivity: "none",
    copy: { en: copy, fr: { ...copy, headline: partial.slug } },
    slugs: { en: partial.slug, fr: partial.slug },
    ...partial,
  };
}

describe("mergeStories", () => {
  it("never lets extras overwrite a seed id", () => {
    const seed = [fake({ id: "s153", slug: "thizy-linge" })];
    const extras = [fake({ id: "s153", slug: "rss-olympic-crocodiles", publishedAt: "2026-09-17T20:00:00.000Z" })];
    const merged = mergeStories(seed, extras);
    assert.equal(merged.length, 1);
    assert.equal(merged[0]?.slug, "thizy-linge");
  });

  it("keeps extras with fresh ids", () => {
    const seed = [fake({ id: "s153", slug: "thizy-linge" })];
    const extras = [fake({ id: "s164", slug: "new-desk-paper" })];
    const merged = mergeStories(seed, extras);
    assert.deepEqual(merged.map((s) => s.id).sort(), ["s153", "s164"]);
  });

  it("skips extras that reuse a published catalog source URL", () => {
    const seed = [fake({ id: "s140", slug: "latrape-bouc" })];
    const extras = [fake({ id: "s156", slug: "rss-latrape", sources: seed[0]!.sources })];
    const merged = mergeStories(seed, extras);
    assert.equal(merged.length, 1);
    assert.equal(merged[0]?.id, "s140");
  });
});

describe("publishedStories + desk", () => {
  it("still hides a seed marked deleted", () => {
    const seed = [fake({ id: "s153", slug: "thizy-linge" })];
    const desk: DeskStatusMap = { s153: "deleted" };
    assert.equal(publishedStories(seed, [], desk).length, 0);
  });

  it("lists a published seed even if a colliding extra exists", () => {
    const seed = [fake({ id: "s153", slug: "thizy-linge" })];
    const extras = [fake({ id: "s153", slug: "rss-junk" })];
    const desk: DeskStatusMap = { s153: "published" };
    const list = publishedStories(seed, extras, desk);
    assert.equal(list.length, 1);
    assert.equal(list[0]?.slug, "thizy-linge");
  });
});
