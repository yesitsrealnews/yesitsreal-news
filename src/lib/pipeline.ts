import type { FactPack, QueueItem, Story, StoryCopy } from "@/lib/types";

const SATIRE_HOSTS = ["theonion", "babylonbee", "clickhole", "waterfordwhispers"];

export function looksLikeSatire(url: string): boolean {
  const host = url.toLowerCase();
  return SATIRE_HOSTS.some((h) => host.includes(h));
}

export function scoreDumbness(text: string): { score: number; rationale: string } {
  const hay = text.toLowerCase();
  let score = 6;
  const hits: string[] = [];
  const bumps: [string, number, string][] = [
    ["pigeon", 1, "municipal fauna as adversary"],
    ["duck", 1, "waterfowl policy"],
    ["printer", 1, "office equipment treated as a moral agent"],
    ["sues", 1, "litigation against the inanimate"],
    ["ban", 1, "prohibition as first resort"],
    ["urgent", 1, "the word urgent used to forbid the word urgent"],
    ["roundabout", 1, "geometry as ideology"],
    ["goldfish", 1, "pet as tax instrument"],
    ["spreadsheet", 1, "software appointed to a human job"],
  ];
  for (const [k, n, why] of bumps) {
    if (hay.includes(k)) {
      score += n;
      hits.push(why);
    }
  }
  score = Math.min(10, Math.max(4, score));
  return {
    score,
    rationale: hits.length
      ? `Triage noted: ${hits.slice(0, 3).join("; ")}.`
      : "Routine bureaucratic or preventable absurdity. No satire markers.",
  };
}

export function detectSensitivity(text: string): "none" | "reject-minors" | "death" {
  const hay = text.toLowerCase();
  if (/(minor|child sex|underage)/i.test(hay)) return "reject-minors";
  if (/\b(dead|died|killed|suicide)\b/i.test(hay)) return "death";
  return "none";
}

export function draftFromNotes(input: {
  url: string;
  notes: string;
  country: string;
}): { copy: StoryCopy; pack: FactPack; sectionGuess: Story["section"] } {
  const { score, rationale } = scoreDumbness(`${input.notes} ${input.url}`);
  const headline = headlineFromNotes(input.notes);
  const dek = input.notes.split(/[.?!]/)[0]?.trim() || "A documented event that did not need to happen this way.";
  const copy: StoryCopy = {
    headline,
    dek: dek.endsWith(".") ? dek : `${dek}.`,
    body: [
      `According to the originating source, ${input.notes.trim() || "an official body took an action that now requires a straight-faced explanation."}`,
      "YES IT'S REAL does not invent quotations. Until the desk verifies primary documents, this draft treats the submitted URL as the originating report and will not expand it with unnamed officials.",
      "The facts, as submitted, sit in the ordinary register of local government, consumer dispute, or institutional procedure. The selection is the editorial act: it is true, and it is dumb.",
      "Readers should follow the original source links. If the originating outlet later corrects the record, we will match the correction.",
    ],
    whyDumb: [
      "A competent adult, or committee of them, chose this.",
      "The remedy is disproportionate to the nuisance, or the nuisance was imaginary.",
      "It is now on paper, which means it will be cited later as precedent.",
    ],
    factCheckNote: "Draft only. Claims below are tagged against the submitted URL, not yet against independent records.",
  };
  const pack: FactPack = {
    confidence: 0.46,
    claims: [
      { claim: headline, source: input.url, status: "needs-check" },
      { claim: "Event occurred in the stated country", source: input.country || "unspecified", status: "needs-check" },
    ],
    stillNeeds: [
      "Primary document or on-the-record statement",
      "Second independent source",
      "Confirm not satire, not opinion, not a recycled hoax",
    ],
    suggestedEdits: ["Shorten the hed if it overclaims.", "Name the institution, not 'officials'."],
    dumbnessRationale: rationale,
  };
  return { copy, pack, sectionGuess: guessSection(input.notes) };
}

function headlineFromNotes(notes: string): string {
  const clean = notes.trim().replace(/\s+/g, " ");
  if (clean.length < 12) return "Submitted incident awaits verification";
  const sentence = clean.split(/[.?!]/)[0] ?? clean;
  const clipped = sentence.slice(0, 110);
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}

function guessSection(text: string): Story["section"] {
  const h = text.toLowerCase();
  if (/court|sue|sues|judge|tax/.test(h)) return "courts";
  if (/mayor|minister|parliament|law|council/.test(h)) return "politics";
  if (/study|university|scientist/.test(h)) return "science";
  if (/dog|cat|duck|pigeon|otter|animal/.test(h)) return "animals";
  if (/app|ai|printer|software|tech/.test(h)) return "tech";
  if (/match|club|player|coach|goal/.test(h)) return "sports";
  if (/police|raid|arrest|theft/.test(h)) return "crime";
  if (/crash|bump|lane|gps|accident/.test(h)) return "accidents";
  if (/celebrity|star|influencer|red carpet|awards|oscar|grammy/.test(h)) return "stars";
  if (/said|announces|declares|press/.test(h)) return "politics";
  if (/bank|hotel|dating|money|love/.test(h)) return "love-money";
  return "faits-divers";
}

export function makeQueueItem(input: {
  url: string;
  notes: string;
  country: string;
  name: string;
}): QueueItem {
  const { copy, pack, sectionGuess } = draftFromNotes(input);
  const { score } = scoreDumbness(input.notes);
  const id = `q-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const story: Story = {
    id,
    slug: `submitted-${id}`,
    slugs: { en: `submitted-${id}` },
    section: sectionGuess,
    countryCode: "UN",
    countryName: input.country || "Unspecified",
    location: input.country || "Unspecified",
    dumbness: score,
    sources: [
      {
        title: "Submitted originating report",
        publisher: "Reader submission",
        url: input.url,
        date: now.slice(0, 10),
        type: "submission",
      },
    ],
    factChecked: false,
    confidence: pack.confidence,
    publishedAt: now,
    updatedAt: now,
    status: "inbox",
    entities: [],
    originalLang: "en",
    sensitivity: detectSensitivity(input.notes) === "death" ? "death" : "none",
    copy: { en: copy },
  };
  return {
    id,
    story,
    pack,
    submittedBy: input.name || "Anonymous reader",
    submittedAt: now,
    sourceUrl: input.url,
  };
}

export function mockTranslate(copy: StoryCopy, lang: string): StoryCopy {
  if (lang === "en") return copy;
  return {
    ...copy,
    headline: copy.headline,
    dek: copy.dek,
    factCheckNote: `${copy.factCheckNote} [${lang} lock pending]`,
  };
}
