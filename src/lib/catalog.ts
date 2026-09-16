import type { Lang, SectionId, Story } from "@/lib/types";
import { STORIES, getStoryBySlug as seedBySlug } from "@/lib/data/stories";
import * as core from "@/lib/catalog-core";

export { HOME_WINDOW_DAYS, countriesFrom, isThisWeek, storyNewsDate } from "@/lib/catalog-core";
export type { DeskStatusMap } from "@/lib/catalog-core";

/** Server / admin wrappers — they close over the full catalog. Public pages must not import this file. */

export function mergeStories(extras: Story[]): Story[] {
  return core.mergeStories(STORIES, extras);
}

export function publishedStories(extras: Story[], deskStatus?: core.DeskStatusMap): Story[] {
  return core.publishedStories(STORIES, extras, deskStatus);
}

export function deskStories(extras: Story[], deskStatus?: core.DeskStatusMap): Story[] {
  return core.deskStories(STORIES, extras, deskStatus);
}

export function homeStories(extras: Story[], deskStatus?: core.DeskStatusMap, frontIds?: string[]): Story[] {
  return core.homeStories(STORIES, extras, deskStatus, frontIds);
}

export function sponsoredStory(extras: Story[], deskStatus?: core.DeskStatusMap): Story | undefined {
  return core.sponsoredStory(STORIES, extras, deskStatus);
}

export function findStory(slug: string, extras: Story[], deskStatus?: core.DeskStatusMap): Story | undefined {
  return core.findStory(STORIES, slug, extras, deskStatus, seedBySlug);
}

export function inSection(extras: Story[], section: SectionId, deskStatus?: core.DeskStatusMap): Story[] {
  return core.inSection(STORIES, extras, section, deskStatus);
}

export function relatedStories(story: Story, extras: Story[], n = 4, deskStatus?: core.DeskStatusMap): Story[] {
  return core.relatedStories(STORIES, story, extras, n, deskStatus);
}

export function mostRead(extras: Story[], n = 6, pool?: Story[], deskStatus?: core.DeskStatusMap): Story[] {
  return core.mostRead(STORIES, extras, n, pool, deskStatus);
}

export function dumbest(extras: Story[], n = 8, pool?: Story[], deskStatus?: core.DeskStatusMap): Story[] {
  return core.dumbest(STORIES, extras, n, pool, deskStatus);
}

export function breaking(extras: Story[], pool?: Story[], deskStatus?: core.DeskStatusMap): Story | undefined {
  return core.breaking(STORIES, extras, pool, deskStatus);
}

export function searchStories(extras: Story[], q: string, lang: Lang, deskStatus?: core.DeskStatusMap): Story[] {
  return core.searchStories(STORIES, extras, q, lang, deskStatus);
}
