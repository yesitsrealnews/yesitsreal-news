import type { SectionId } from "@/lib/types";

export interface SectionDef {
  id: SectionId;
  path: string;
  kicker: string;
}

export const SECTIONS: SectionDef[] = [
  { id: "world", path: "/world", kicker: "WORLD" },
  { id: "accidents", path: "/accidents", kicker: "ACCIDENTS" },
  { id: "stars", path: "/stars", kicker: "STARS" },
  { id: "science", path: "/science", kicker: "SCIENCE" },
  { id: "faits-divers", path: "/faits-divers", kicker: "FAITS DIVERS" },
  { id: "politics", path: "/politics", kicker: "POLITICS" },
  { id: "animals", path: "/animals", kicker: "ANIMALS" },
  { id: "tech", path: "/tech", kicker: "TECH" },
  { id: "sports", path: "/sports", kicker: "SPORTS" },
  { id: "love-money", path: "/love-money", kicker: "LOVE & MONEY" },
  { id: "courts", path: "/courts", kicker: "JUSTICE" },
  { id: "commentaire", path: "/commentaire", kicker: "COMMENTAIRE" },
];

/** Built, not on the public masthead. Wake it when the desk says so. */
export const DORMANT_SECTIONS: SectionDef[] = [
  { id: "archive", path: "/archive", kicker: "ARCHIVE" },
];

/** Retired masthead paths that still resolve. */
export const SECTION_ALIASES: Record<string, SectionId> = {
  crime: "courts",
  declarations: "politics",
};

export const SECTION_BY_ID: Record<SectionId, SectionDef> = Object.fromEntries(
  [...SECTIONS, ...DORMANT_SECTIONS].map((s) => [s.id, s]),
) as Record<SectionId, SectionDef>;

export function isSectionId(value: string): value is SectionId {
  return value in SECTION_BY_ID;
}

export function isPublicSectionId(value: string): value is SectionId {
  return SECTIONS.some((s) => s.id === value);
}

export function canonicalSection(value: string): SectionId | null {
  const alias = SECTION_ALIASES[value];
  if (alias) return alias;
  return isSectionId(value) ? value : null;
}