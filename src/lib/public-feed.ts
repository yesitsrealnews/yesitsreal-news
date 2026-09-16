import type { Story, StoryCopy } from "@/lib/types";
import {
  findStory as findFromSeed,
  homeStories as homeFromSeed,
  inSection as sectionFromSeed,
  relatedStories as relatedFromSeed,
  sponsoredStory as sponsoredFromSeed,
  type DeskStatusMap,
} from "@/lib/catalog-core";
import type { SectionId } from "@/lib/types";

const EMPTY_WHY: StoryCopy["whyDumb"] = ["", "", ""];

function stripCopy(copy: StoryCopy, keepBody: boolean): StoryCopy {
  return {
    headline: copy.headline,
    dek: copy.dek,
    whyDumb: keepBody ? copy.whyDumb : EMPTY_WHY,
    factCheckNote: keepBody ? copy.factCheckNote : "",
    body: keepBody ? copy.body : [],
  };
}

/** Listing card — headline/dek only. Keeps the home JS payload small. */
export function slimCard(story: Story): Story {
  const copy = Object.fromEntries(
    Object.entries(story.copy).map(([lang, c]) => [lang, stripCopy(c, false)]),
  ) as Story["copy"];
  return { ...story, copy, dumbness: 0 };
}

/** Article payload — keep bodies, drop unused locale copies except en/fr/original. */
export function slimFull(story: Story): Story {
  const keep = new Set(["en", "fr", story.originalLang, ...Object.keys(story.copy)]);
  const copy = Object.fromEntries(
    Object.entries(story.copy)
      .filter(([lang]) => keep.has(lang))
      .map(([lang, c]) => [lang, stripCopy(c, true)]),
  ) as Story["copy"];
  return { ...story, copy, dumbness: 0 };
}

export function overlayHome(
  seed: Story[],
  extras: Story[],
  deskStatus?: DeskStatusMap,
  frontIds?: string[],
): Story[] {
  return homeFromSeed(seed, extras, deskStatus, frontIds);
}

export function overlaySection(
  seed: Story[],
  extras: Story[],
  section: SectionId,
  deskStatus?: DeskStatusMap,
): Story[] {
  return sectionFromSeed(seed, extras, section, deskStatus);
}

export function overlaySponsored(seed: Story[], extras: Story[], deskStatus?: DeskStatusMap): Story | undefined {
  return sponsoredFromSeed(seed, extras, deskStatus);
}

export function overlayFind(
  seed: Story[],
  slug: string,
  extras: Story[],
  deskStatus?: DeskStatusMap,
): Story | undefined {
  return findFromSeed(seed, slug, extras, deskStatus);
}

export function overlayRelated(
  seed: Story[],
  story: Story,
  extras: Story[],
  n = 4,
  deskStatus?: DeskStatusMap,
): Story[] {
  return relatedFromSeed(seed, story, extras, n, deskStatus);
}

export function mergeExtras(server: Story[] | undefined, client: Story[]): Story[] {
  if (!server?.length) return client;
  const map = new Map<string, Story>();
  for (const s of server) map.set(s.id, s);
  for (const s of client) {
    const prev = map.get(s.id);
    if (!prev || +new Date(s.updatedAt) >= +new Date(prev.updatedAt)) map.set(s.id, s);
  }
  return [...map.values()];
}

export { countriesFrom } from "@/lib/catalog-core";
export type { DeskStatusMap };
