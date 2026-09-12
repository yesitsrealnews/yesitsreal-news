import type { Lang, Source, Story, StoryCopy, SectionId } from "@/lib/types";

export function src(
  title: string,
  publisher: string,
  url: string,
  date: string,
  type: Source["type"] = "local",
): Source {
  return { title, publisher, url, date, type };
}

export function enCopy(
  headline: string,
  dek: string,
  body: string[],
  whyDumb: [string, string, string],
  factCheckNote: string,
): StoryCopy {
  return { headline, dek, body, whyDumb, factCheckNote };
}

export function story(p: {
  id: string;
  slug: string;
  slugs?: Partial<Record<Lang, string>>;
  section: SectionId;
  countryCode: string;
  countryName: string;
  location: string;
  dumbness: number;
  sources: Source[];
  publishedAt: string;
  updatedAt?: string;
  breaking?: boolean;
  sponsored?: boolean;
  entities: string[];
  originalLang?: Lang;
  bylines?: Story["bylines"];
  confidence?: number;
  copy: Story["copy"];
}): Story {
  return {
    id: p.id,
    slug: p.slug,
    slugs: { en: p.slug, ...p.slugs },
    section: p.section,
    countryCode: p.countryCode,
    countryName: p.countryName,
    location: p.location,
    dumbness: p.dumbness,
    sources: p.sources,
    factChecked: !p.sponsored,
    confidence: p.confidence ?? 0.9,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt ?? p.publishedAt,
    breaking: p.breaking,
    sponsored: p.sponsored,
    status: "published",
    entities: p.entities,
    originalLang: p.originalLang ?? "en",
    bylines: p.bylines,
    sensitivity: "none",
    copy: p.copy,
  };
}
