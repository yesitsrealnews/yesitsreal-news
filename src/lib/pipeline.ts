import type { FactPack, QueueItem, Story, StoryCopy } from "@/lib/types";
import { storyWithFrench } from "@/lib/desk-fr";

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
  const dek = input.notes.split(/[.?!]/)[0]?.trim() || "Un fait documenté qui n’avait pas besoin d’arriver comme ça.";
  const copy: StoryCopy = {
    headline,
    dek: dek.endsWith(".") ? dek : `${dek}.`,
    body: [
      `Selon la source d’origine, ${input.notes.trim() || "une institution a fait un geste qui exige maintenant une explication à visage découvert."}`,
      "YES IT'S REAL n’invente pas de citations. Tant que la desk n’a pas les documents, ce brouillon traite l’URL envoyée comme le reportage d’origine.",
      "Les faits, tels que soumis, relèvent du registre ordinaire d’une mairie, d’un litige ou d’une procédure. Le choix éditorial, c’est ça : c’est vrai, et c’est bête.",
      "Suivre les liens sources. Si le journal d’origine corrige, on corrige.",
    ],
    whyDumb: [
      "Un adulte compétent, ou un comité d’adultes, a choisi ça.",
      "Le remède est hors de proportion, ou la nuisance était imaginaire.",
      "C’est maintenant sur le papier, donc ça servira de précédent.",
    ],
    factCheckNote: "Brouillon. Les affirmations ci-dessous sont taguées sur l’URL soumise, pas encore sur des documents indépendants.",
  };
  const pack: FactPack = {
    confidence: 0.46,
    claims: [
      { claim: headline, source: input.url, status: "needs-check" },
      { claim: "L’événement a eu lieu dans le pays indiqué", source: input.country || "non précisé", status: "needs-check" },
    ],
    stillNeeds: [
      "Document primaire ou déclaration on the record",
      "Seconde source indépendante",
      "Confirmer : pas satire, pas opinion, pas un canular recyclé",
    ],
    suggestedEdits: ["Raccourcir le titre s’il en promet trop.", "Nommer l’institution, pas « des officiels »."],
    dumbnessRationale: rationale,
  };
  return { copy, pack, sectionGuess: guessSection(input.notes) };
}

function headlineFromNotes(notes: string): string {
  const clean = notes.trim().replace(/\s+/g, " ");
  if (clean.length < 12) return "Fait soumis — à vérifier";
  const sentence = clean.split(/[.?!]/)[0] ?? clean;
  const clipped = sentence.slice(0, 110);
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}

export function guessSection(text: string): Story["section"] {
  const h = text.toLowerCase();
  if (/court|sue|sues|judge|tax|tribunal|plainte|procureur|justice|huissier/.test(h)) return "courts";
  if (/mayor|minister|parliament|law|council|maire|arrêté|arrete|préfet|prefet|macron|élection|election/.test(h))
    return "politics";
  if (/study|university|scientist|étude|etude|ig nobel|biochar|béton|beton/.test(h)) return "science";
  if (/dog|cat|duck|pigeon|otter|animal|chien|chat|canard|vache|cerf/.test(h)) return "animals";
  if (/app|ai|printer|software|tech|imprimante|application/.test(h)) return "tech";
  if (/match|club|player|coach|goal|football|rugby|olymp/.test(h)) return "sports";
  if (/police|raid|arrest|theft|voleur|braqu|gendarme|cambriol/.test(h)) return "crime";
  if (/crash|bump|lane|accident|toit|camion|voiturette/.test(h)) return "accidents";
  if (/celebrity|star|influencer|red carpet|awards|oscar|grammy|south park/.test(h)) return "stars";
  if (/said|announces|declares|press|déclare|communique/.test(h)) return "politics";
  if (/bank|hotel|dating|money|love|arnaque|escro/.test(h)) return "love-money";
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
    slug: `soumis-${id}`,
    slugs: { en: `submitted-${id}`, fr: `soumis-${id}` },
    section: sectionGuess,
    countryCode: "UN",
    countryName: input.country || "Non précisé",
    location: input.country || "Non précisé",
    dumbness: score,
    sources: [
      {
        title: "Reportage d’origine soumis",
        publisher: "Proposition lecteur",
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
    originalLang: "fr",
    sensitivity: detectSensitivity(input.notes) === "death" ? "death" : "none",
    copy: { en: copy, fr: copy },
  };
  return {
    id,
    story: storyWithFrench(story),
    pack,
    submittedBy: input.name || "Lecteur anonyme",
    submittedAt: now,
    sourceUrl: input.url,
  };
}

export function mockTranslate(copy: StoryCopy, lang: string): StoryCopy {
  if (lang === "en") return copy;
  return copy;
}
