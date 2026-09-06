export const LANG_CODES = [
  "en",
  "fr",
  "es",
  "pt",
  "de",
  "it",
  "nl",
  "pl",
  "sv",
  "no",
  "da",
  "fi",
  "cs",
  "ro",
  "hu",
  "el",
  "tr",
  "ar",
  "he",
  "hi",
  "bn",
  "ur",
  "id",
  "vi",
  "th",
  "ja",
  "ko",
  "zh",
  "zh-TW",
  "uk",
  "ru",
] as const;

export type Lang = (typeof LANG_CODES)[number];

export const SECTION_IDS = [
  "world",
  "accidents",
  "stars",
  "science",
  "faits-divers",
  "crime",
  "politics",
  "animals",
  "tech",
  "sports",
  "love-money",
  "courts",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type StoryStatus = "published" | "inbox" | "review" | "scheduled" | "rejected";

export type SourceType =
  | "wire"
  | "gazette"
  | "court"
  | "university"
  | "local"
  | "official"
  | "submission";

export interface Source {
  title: string;
  publisher: string;
  url: string;
  date: string;
  type: SourceType;
}

export interface StoryCopy {
  headline: string;
  dek: string;
  body: string[];
  whyDumb: [string, string, string];
  factCheckNote: string;
}

export interface Story {
  id: string;
  /** Canonical English slug */
  slug: string;
  /** Localized slugs; missing langs fall back to slug */
  slugs: Partial<Record<Lang, string>>;
  section: SectionId;
  countryCode: string;
  countryName: string;
  location: string;
  dumbness: number;
  sources: Source[];
  factChecked: boolean;
  confidence: number;
  publishedAt: string;
  updatedAt: string;
  breaking?: boolean;
  sponsored?: boolean;
  status: StoryStatus;
  entities: string[];
  originalLang: Lang;
  sensitivity: "none" | "death";
  rejectReason?: string;
  copy: Partial<Record<Lang, StoryCopy>> & { en: StoryCopy };
}

export interface ClaimRow {
  claim: string;
  source: string;
  status: "supported" | "needs-check" | "unsupported";
}

export interface FactPack {
  confidence: number;
  claims: ClaimRow[];
  stillNeeds: string[];
  suggestedEdits: string[];
  dumbnessRationale: string;
}

export interface QueueItem {
  id: string;
  story: Story;
  pack: FactPack;
  submittedBy: string;
  submittedAt: string;
  sourceUrl: string;
}

export interface Submission {
  id: string;
  url: string;
  notes: string;
  country: string;
  name: string;
  createdAt: string;
  status: "received" | "triage" | "draft" | "rejected";
}

export type LeadKind = "membership" | "ads" | "job" | "merch" | "tip" | "sponsor";

export interface Lead {
  id: string;
  kind: LeadKind;
  email: string;
  name: string;
  role?: string;
  sku?: string;
  amount: number;
  notes: string;
  createdAt: string;
}

export type ReactionId = "unreal" | "peak" | "boss" | "there";
