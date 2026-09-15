import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isDraftCopy, polishPublishedStory, slugFromHeadline } from "./publish-copy.ts";
import type { Story, StoryCopy } from "./types.ts";

const draft: StoryCopy = {
  headline: "Un bouc séquestre un habitant",
  dek: "À Latrape, un bouc en divagation…",
  body: [
    "Selon la source d’origine, un bouc a bloqué un homme. Visuel source : https://images.ladepeche.fr/api/v1/images/view/abc.jpg",
    "YES IT'S REAL n’invente pas de citations. Tant que la desk n’a pas les documents, ce brouillon traite l’URL envoyée comme le reportage d’origine.",
  ],
  whyDumb: ["a", "b", "c"],
  factCheckNote: "Brouillon. Les affirmations ci-dessous sont taguées sur l’URL soumise, pas encore sur des documents indépendants.",
};

const story: Story = {
  id: "q-rss-1e8v7tq",
  slug: "rss-q-rss-1e8v7tq",
  slugs: { fr: "rss-q-rss-1e8v7tq", en: "rss-q-rss-1e8v7tq" },
  section: "animals",
  countryCode: "FR",
  countryName: "France",
  location: "Latrape",
  dumbness: 8,
  sources: [
    {
      title: "Scène insolite",
      publisher: "La Dépêche du Midi",
      url: "https://www.ladepeche.fr/2026/09/15/bouc",
      date: "2026-09-15",
      type: "local",
    },
  ],
  factChecked: false,
  confidence: 0.46,
  publishedAt: "2026-09-15T18:22:00.000Z",
  updatedAt: "2026-09-15T18:22:00.000Z",
  status: "inbox",
  entities: [],
  originalLang: "fr",
  sensitivity: "none",
  copy: { en: draft, fr: draft },
};

describe("publish-copy", () => {
  it("flags RSS drafts", () => {
    assert.equal(isDraftCopy(draft), true);
  });

  it("strips brouillon and writes a public article", () => {
    const out = polishPublishedStory(story);
    assert.equal(out.factChecked, true);
    assert.equal(out.status, "published");
    assert.equal(out.copy.fr && isDraftCopy(out.copy.fr), false);
    assert.match(out.copy.fr?.body[0] || "", /La Dépêche/);
    assert.doesNotMatch(out.copy.fr?.factCheckNote || "", /Brouillon/i);
    assert.doesNotMatch(out.copy.fr?.body.join(" ") || "", /brouillon/i);
    assert.equal(out.coverUrl, "https://images.ladepeche.fr/api/v1/images/view/abc.jpg");
    assert.equal(out.slugs.fr ?? "", "un-bouc-sequestre-un-habitant");
  });

  it("slugifies a French headline", () => {
    assert.equal(slugFromHeadline("À Latrape, un bouc !"), "a-latrape-un-bouc");
  });
});
