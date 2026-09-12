import { STORIES } from "@/lib/data/stories";
import { sanitizeText } from "@/lib/security";
import type { FactPack, QueueItem, Story, StoryCopy } from "@/lib/types";

export type DeskRewriteInput = {
  storyId: string;
  instructions: string;
  /** Client may send the live/extra override when not only in baked STORIES. */
  story?: Story;
};

export type DeskRewriteResult =
  | { ok: true; item: QueueItem; draftedBy: "grok" }
  | { ok: false; reason: string };

function resolveStory(input: DeskRewriteInput): Story | null {
  if (input.story && input.story.id === input.storyId) return input.story;
  return STORIES.find((s) => s.id === input.storyId) ?? null;
}

function frOf(story: Story): StoryCopy {
  return story.copy.fr ?? story.copy.en;
}

function enOf(story: Story): StoryCopy {
  return story.copy.en ?? story.copy.fr ?? frOf(story);
}

async function grokRewrite(system: string, user: string): Promise<{ text: string } | { error: string }> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { error: "unavailable" };
  const body = {
    model: "grok-4.5",
    temperature: 0.4,
    max_tokens: 3200,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  const once = async () =>
    fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(50_000),
    });
  let res = await once();
  if (res.status === 429 || res.status >= 500) {
    await new Promise((r) => setTimeout(r, 800));
    res = await once();
  }
  if (!res.ok) return { error: `xAI ${res.status}` };
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = json.choices?.[0]?.message?.content ?? "";
  if (!text) return { error: "empty" };
  return { text };
}

function parseJson(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function paras(v: unknown, n: number): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => sanitizeText(s, 1200))
    .filter(Boolean)
    .slice(0, n);
}

function triple(v: unknown, fallback: [string, string, string]): [string, string, string] {
  if (!Array.isArray(v) || v.length < 3) return fallback;
  const a = sanitizeText(String(v[0] ?? ""), 240);
  const b = sanitizeText(String(v[1] ?? ""), 240);
  const c = sanitizeText(String(v[2] ?? ""), 240);
  return [a || fallback[0], b || fallback[1], c || fallback[2]];
}

export async function runDeskRewrite(input: DeskRewriteInput): Promise<DeskRewriteResult> {
  const instructions = sanitizeText(input.instructions, 2000);
  if (instructions.length < 8) return { ok: false, reason: "instructions" };
  const story = resolveStory({ ...input, instructions });
  if (!story) return { ok: false, reason: "story" };

  const fr = frOf(story);
  const en = enOf(story);
  const uk =
    story.countryCode === "GB" ||
    /uk|united kingdom|england|britain|angleterre|royaume-uni/i.test(`${story.countryName} ${story.location}`);

  const system = `Tu es la desk de YES IT'S REAL (yesitsreal.news). Tu RÉÉCRIS un papier déjà publié selon les consignes du rédacteur en chef.

Règles absolues :
- Vrai, sourcé, déjà publié. Pas d'invention. Pas de citations inventées.
- Français impeccable : syntaxe française native, idiomatique, typographie FR. JAMAIS un calque de l'anglais.
${uk ? "- Ce papier porte sur un fait britannique / anglais : en VF, monter d'un cran le moqueur (ironie française sèche). Toujours plat, jamais inventé, jamais grief/mineurs.\n" : ""}- Pas de section « pourquoi c'est bête » affichée : tu peux garder whyDumb pour la desk, mais le corps doit se suffire.
- Ne change pas les faits, les noms, les dates, les sources. Tu changes le STYLE et la FORMULATION selon les consignes.
- Réponds UNIQUEMENT un JSON.

JSON :
{
  "headline": "titre FR",
  "dek": "chapô FR",
  "body": ["paragraphes FR"],
  "whyDumb": ["","",""],
  "factCheckNote": "note FR",
  "headlineEn": "optional EN title if consignes demandent aussi l'EN, sinon reprendre l'existant",
  "dekEn": "",
  "bodyEn": [],
  "whyDumbEn": ["","",""],
  "factCheckNoteEn": "",
  "slugFr": "slug-francais-optionnel"
}`;

  const user = `ID: ${story.id}
Pays: ${story.countryName} (${story.countryCode}) — ${story.location}
Rubrique: ${story.section}
Sources: ${story.sources.map((s) => `${s.publisher}: ${s.url}`).join(" | ")}

CONSIGNES DU RÉDACTEUR EN CHEF :
${instructions}

TEXTE FR ACTUEL :
Titre: ${fr.headline}
Chapô: ${fr.dek}
Corps:
${fr.body.map((p, i) => `${i + 1}. ${p}`).join("\n")}
Note: ${fr.factCheckNote}

TEXTE EN ACTUEL (référence ; ne le calque pas pour le FR) :
Titre: ${en.headline}
Chapô: ${en.dek}

Réécris le papier FR selon les consignes. JSON uniquement.`;

  const grok = await grokRewrite(system, user);
  if ("error" in grok) return { ok: false, reason: grok.error === "unavailable" ? "unavailable" : "draft" };
  const draft = parseJson(grok.text);
  if (!draft) return { ok: false, reason: "draft" };

  const nextFr: StoryCopy = {
    headline: sanitizeText(String(draft.headline ?? ""), 160) || fr.headline,
    dek: sanitizeText(String(draft.dek ?? ""), 400) || fr.dek,
    body: paras(draft.body, 8).length ? paras(draft.body, 8) : fr.body,
    whyDumb: triple(draft.whyDumb, fr.whyDumb),
    factCheckNote: sanitizeText(String(draft.factCheckNote ?? ""), 400) || fr.factCheckNote,
  };

  const enBody = paras(draft.bodyEn, 8);
  const nextEn: StoryCopy = {
    headline: sanitizeText(String(draft.headlineEn ?? ""), 160) || en.headline,
    dek: sanitizeText(String(draft.dekEn ?? ""), 400) || en.dek,
    body: enBody.length ? enBody : en.body,
    whyDumb: triple(draft.whyDumbEn, en.whyDumb),
    factCheckNote: sanitizeText(String(draft.factCheckNoteEn ?? ""), 400) || en.factCheckNote,
  };

  const slugFr = sanitizeText(String(draft.slugFr ?? ""), 86)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const now = new Date().toISOString();
  const nextStory: Story = {
    ...story,
    updatedAt: now,
    originalLang: "fr",
    slugs: {
      ...story.slugs,
      en: story.slug,
      ...(slugFr ? { fr: slugFr } : {}),
    },
    copy: {
      ...story.copy,
      fr: nextFr,
      en: nextEn,
    },
  };

  const pack: FactPack = {
    confidence: story.confidence,
    claims: [{ claim: nextFr.headline, source: story.sources[0]?.url || "rewrite", status: "needs-check" }],
    stillNeeds: ["Relire la réécriture avant publication"],
    suggestedEdits: [`Consigne appliquée : ${instructions.slice(0, 180)}`],
    dumbnessRationale: "Réécriture desk sur consignes rédacteur.",
  };

  const item: QueueItem = {
    id: `q-rewrite-${story.id}-${Date.now().toString(36)}`,
    story: { ...nextStory, status: "review" },
    pack,
    submittedBy: `Réécriture · ${story.id}`,
    submittedAt: now,
    sourceUrl: story.sources[0]?.url || `https://www.yesitsreal.news/story/${story.slug}`,
  };

  return { ok: true, item, draftedBy: "grok" };
}
