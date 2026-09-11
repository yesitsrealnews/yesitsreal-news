import type { ExtractedArticle } from "@/lib/article-extract";
import { fetchArticles } from "@/lib/article-extract";
import { storyWithFrench } from "@/lib/desk-fr";
import { detectSensitivity, guessSection, looksLikeSatire, scoreDumbness } from "@/lib/pipeline";
import { isSafeHttpUrl, sanitizeText } from "@/lib/security";
import type { ClaimRow, FactPack, QueueItem, SectionId, Source, Story, StoryCopy } from "@/lib/types";
import { SECTION_IDS } from "@/lib/types";
import { VOICE_IDS, VOICES, type VoiceId } from "@/lib/voices";
import { canonicalSection } from "@/lib/data/sections";

export type DeskAssignInput = {
  subject: string;
  url?: string;
  extraUrls?: string[];
  notes?: string;
  country?: string;
  section?: string;
  voice?: string;
};

export type DeskAssignResult =
  | { ok: true; item: QueueItem; draftedBy: "grok" | "extract"; warning?: string }
  | { ok: false; reason: string };

const DEATH =
  /\b(dead|died|death|killed|killing|murder|suicide|massacre|tué|tuee|tuerie|décès|deces|\bmort\b|\bmorte\b|guerre|viol\b)\b/i;

const COUNTRY: Record<string, { code: string; name: string }> = {
  france: { code: "FR", name: "France" },
  fr: { code: "FR", name: "France" },
  belgique: { code: "BE", name: "Belgique" },
  be: { code: "BE", name: "Belgique" },
  suisse: { code: "CH", name: "Suisse" },
  ch: { code: "CH", name: "Suisse" },
  canada: { code: "CA", name: "Canada" },
  uk: { code: "GB", name: "Royaume-Uni" },
  "royaume-uni": { code: "GB", name: "Royaume-Uni" },
  angleterre: { code: "GB", name: "Royaume-Uni" },
  usa: { code: "US", name: "États-Unis" },
  us: { code: "US", name: "États-Unis" },
  "états-unis": { code: "US", name: "États-Unis" },
  etatsunis: { code: "US", name: "États-Unis" },
  espagne: { code: "ES", name: "Espagne" },
  es: { code: "ES", name: "Espagne" },
  italie: { code: "IT", name: "Italie" },
  it: { code: "IT", name: "Italie" },
  allemagne: { code: "DE", name: "Allemagne" },
  de: { code: "DE", name: "Allemagne" },
  bresil: { code: "BR", name: "Brésil" },
  brésil: { code: "BR", name: "Brésil" },
  japon: { code: "JP", name: "Japon" },
  thailande: { code: "TH", name: "Thaïlande" },
  thaïlande: { code: "TH", name: "Thaïlande" },
  australie: { code: "AU", name: "Australie" },
  portugal: { code: "PT", name: "Portugal" },
};

type DraftJson = {
  reject?: boolean;
  rejectReason?: string;
  headline?: string;
  dek?: string;
  body?: unknown;
  whyDumb?: unknown;
  factCheckNote?: string;
  headlineEn?: string;
  dekEn?: string;
  bodyEn?: unknown;
  whyDumbEn?: unknown;
  factCheckNoteEn?: string;
  section?: string;
  countryCode?: string;
  countryName?: string;
  location?: string;
  entities?: unknown;
  dumbness?: unknown;
  claims?: unknown;
  stillNeeds?: unknown;
  slugFr?: string;
  slugEn?: string;
  publisher?: string;
  sourceTitle?: string;
  confidence?: unknown;
};

function slugify(raw: string): string {
  const s = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 86);
  return s || "papier-desk";
}

function asVoice(raw?: string): VoiceId {
  const v = (raw || "desk").toLowerCase();
  return (VOICE_IDS as readonly string[]).includes(v) ? (v as VoiceId) : "desk";
}

function asSection(raw: string | undefined, fallback: SectionId): SectionId {
  if (!raw) return fallback;
  const mapped = canonicalSection(raw);
  if (mapped) return mapped;
  if ((SECTION_IDS as readonly string[]).includes(raw)) return raw as SectionId;
  return fallback;
}

function paras(v: unknown, max = 8): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((p): p is string => typeof p === "string")
    .map((p) => sanitizeText(p, 900))
    .filter(Boolean)
    .slice(0, max);
}

function triple(v: unknown, fallback: [string, string, string]): [string, string, string] {
  const a = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").map((x) => sanitizeText(x, 220)) : [];
  return [a[0] || fallback[0], a[1] || fallback[1], a[2] || fallback[2]];
}

function guessCountry(blob: string, url: string): { code: string; name: string; location: string } {
  const h = blob.toLowerCase();
  for (const [k, v] of Object.entries(COUNTRY)) {
    if (new RegExp(`(?:^|\\b)${k}(?:\\b|$)`, "i").test(h)) {
      return { code: v.code, name: v.name, location: v.name };
    }
  }
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.endsWith(".fr")) return { code: "FR", name: "France", location: "France" };
    if (host.endsWith(".uk") || host.endsWith(".co.uk")) return { code: "GB", name: "Royaume-Uni", location: "Royaume-Uni" };
    if (host.endsWith(".be")) return { code: "BE", name: "Belgique", location: "Belgique" };
    if (host.endsWith(".ch")) return { code: "CH", name: "Suisse", location: "Suisse" };
    if (host.endsWith(".de")) return { code: "DE", name: "Allemagne", location: "Allemagne" };
    if (host.endsWith(".es")) return { code: "ES", name: "Espagne", location: "Espagne" };
    if (host.endsWith(".it")) return { code: "IT", name: "Italie", location: "Italie" };
    if (host.endsWith(".br")) return { code: "BR", name: "Brésil", location: "Brésil" };
    if (host.endsWith(".jp")) return { code: "JP", name: "Japon", location: "Japon" };
    if (host.endsWith(".au")) return { code: "AU", name: "Australie", location: "Australie" };
  } catch {
    /* ignore */
  }
  return { code: "UN", name: "Non précisé", location: "Non précisé" };
}

function collectUrls(input: DeskAssignInput): string[] {
  const out: string[] = [];
  const push = (u?: string) => {
    const clean = sanitizeText(u, 500);
    if (clean && isSafeHttpUrl(clean) && !out.includes(clean)) out.push(clean);
  };
  push(input.url);
  const subject = sanitizeText(input.subject, 800);
  const first = subject.split(/\s+/)[0];
  if (first && isSafeHttpUrl(first)) push(first);
  for (const line of (input.extraUrls ?? []).flatMap((s) => s.split(/[\s,]+/))) push(line);
  const notes = sanitizeText(input.notes, 1500);
  for (const m of notes.matchAll(/https?:\/\/[^\s)]+/g)) push(m[0]);
  return out.slice(0, 5);
}

function sourcesFrom(extracted: ExtractedArticle[], fallbackUrl: string): Source[] {
  const now = new Date().toISOString().slice(0, 10);
  const list = extracted.filter((e) => e.url);
  const rows: Source[] = list.map((e) => ({
    title: (e.title || "Reportage d’origine").slice(0, 180),
    publisher: (e.siteName || "Source nommée").slice(0, 80),
    url: e.url,
    date: (e.published || now).slice(0, 10),
    type: "local",
  }));
  if (rows.length === 0 && fallbackUrl) {
    rows.push({
      title: "Source soumise par la desk",
      publisher: "Commande desk",
      url: fallbackUrl,
      date: now,
      type: "submission",
    });
  }
  return rows;
}

function fallbackCopy(subject: string, extracted: ExtractedArticle[], notes: string): StoryCopy {
  const primary = extracted.find((e) => e.ok) ?? extracted[0];
  const headline = sanitizeText(primary?.title || subject, 140) || "Fait repéré — à relire";
  const dek =
    sanitizeText(primary?.description || notes.split(/[.?!]/)[0] || subject, 280) ||
    "Un fait déjà paru. La desk le tient pour vrai tant que la source tient.";
  const paras = (primary?.text || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 4);
  const publisher = primary?.siteName || "la source d’origine";
  const body =
    paras.length > 0
      ? [
          `Selon ${publisher}, ${paras[0]}`,
          ...paras.slice(1, 3),
          notes
            ? `Consigne du rédacteur en chef : ${notes}`
            : "YES IT’S REAL n’invente pas de citations. Les phrases ci-dessus viennent du reportage d’origine.",
          "Ça s’est vraiment passé. Relire avant publication. Si le journal d’origine corrige, on corrige.",
        ]
      : [
          `Le rédacteur en chef a demandé un papier sur : ${subject}.`,
          primary?.url
            ? `La source indiquée est ${primary.url}. Le site n’a pas livré un texte extractible. Ne pas inventer la scène.`
            : "Aucune URL n’était jointe. Ne pas inventer la scène.",
          notes ? `Consigne : ${notes}` : "Attendre le document ou une seconde source.",
          "YES IT’S REAL ne publie pas sans source nommée.",
        ];
  return {
    headline: headline.charAt(0).toUpperCase() + headline.slice(1),
    dek: dek.endsWith(".") ? dek : `${dek}.`,
    body,
    whyDumb: [
      "Un adulte compétent, ou un comité, a choisi ça.",
      "Le remède est hors de proportion, ou la nuisance était imaginaire.",
      "C’est maintenant sur le papier, donc ça servira de précédent.",
    ],
    factCheckNote: "Brouillon desk. Les affirmations restent à recouper sur le document d’origine avant le tampon VRAI.",
  };
}

function parseDraft(raw: string): DraftJson | null {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as DraftJson;
  } catch {
    return null;
  }
}

function systemPrompt(voice: VoiceId): string {
  const v = VOICES[voice];
  return `Tu es la desk de YES IT'S REAL (yesitsreal.news), journal prestige de faits VRAIS, déjà parus, absurdes. Pas de satire. Pas d’invention.

Ligne : « Ça a l’air faux. Ça ne l’est pas. » / « Ça s’est vraiment passé. »
Cible : incompétence, vanité, bureaucratie, absurdité évitable. JAMAIS les morts, les mineurs, le crime sexuel, la guerre, la pauvreté comme blague.
Pas de citations inventées. Si une citation n’est pas dans le texte source, tu ne la mets pas.
Français d’abord, journalistique, sec, un peu chauvin quand le fait n’est pas français (en anglais seulement).
Voix demandée : ${v.afterFr}. ${v.noteFr} Les faits restent intacts.

Réponds UNIQUEMENT un JSON :
{
  "reject": false,
  "rejectReason": "",
  "headline": "titre FR, 70-110 signes, factuel, sans point d’exclamation",
  "dek": "chapô FR, une phrase",
  "body": ["4 à 6 paragraphes FR. Attribuer. Pas d’invention."],
  "whyDumb": ["raison 1","raison 2","raison 3"],
  "factCheckNote": "ce qui est étayé / ce qui manque",
  "headlineEn": "",
  "dekEn": "",
  "bodyEn": ["paragraphes EN. Si le pays n’est pas la France, lede légèrement chauvin à la française."],
  "whyDumbEn": ["","",""],
  "factCheckNoteEn": "",
  "section": "world|accidents|stars|science|faits-divers|politics|animals|tech|sports|love-money|courts|commentaire",
  "countryCode": "FR",
  "countryName": "France",
  "location": "ville ou région",
  "entities": ["noms propres"],
  "dumbness": 7,
  "claims": [{"claim":"","source":"URL","status":"supported|needs-check"}],
  "stillNeeds": ["si besoin"],
  "slugFr": "slug-francais",
  "slugEn": "english-slug",
  "publisher": "nom du journal source",
  "sourceTitle": "titre du papier d’origine",
  "confidence": 0.72
}
Si le sujet est un drame, un mort, un mineur, ou de la satire : reject true et rejectReason.`;
}

function userPrompt(input: {
  subject: string;
  notes: string;
  country: string;
  section?: string;
  extracted: ExtractedArticle[];
}): string {
  const blocks = input.extracted.map((e, i) => {
    const quotes = e.quotes.length ? `Citations trouvées dans la page :\n${e.quotes.map((q) => `« ${q} »`).join("\n")}` : "Pas de citation extraite.";
    return `SOURCE ${i + 1}
URL: ${e.url}
Journal: ${e.siteName || "?"}
Titre: ${e.title || "?"}
Date: ${e.published || "?"}
Chapô: ${e.description || "?"}
Texte extractible:
${e.text || "(page illisible ou vide)"}
${quotes}`;
  });
  return `COMMANDE DU RÉDACTEUR EN CHEF
Sujet repéré : ${input.subject}
Consigne : ${input.notes || "(aucune)"}
Pays indiqué : ${input.country || "(à déduire)"}
Rubrique forcée : ${input.section || "(à déduire)"}

${blocks.join("\n\n") || "Aucune URL. Ne pas inventer. Écrire un squelette à relire, claims en needs-check."}

Rédige le papier YES IT'S REAL. JSON uniquement.`;
}

async function grokDraft(system: string, user: string): Promise<{ text: string } | { error: string }> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { error: "unavailable" };
  const body = {
    model: "grok-4.5",
    temperature: 0.35,
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
      signal: AbortSignal.timeout(45_000),
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

function itemFromDraft(args: {
  draft: DraftJson | null;
  subject: string;
  notes: string;
  extracted: ExtractedArticle[];
  urls: string[];
  sectionHint?: string;
  countryHint?: string;
  draftedBy: "grok" | "extract";
}): QueueItem {
  const { draft, subject, notes, extracted, urls, sectionHint, countryHint, draftedBy } = args;
  const blob = `${subject} ${notes} ${extracted.map((e) => `${e.title} ${e.text}`).join(" ")}`;
  const guessed = guessCountry(`${countryHint || ""} ${blob}`, urls[0] || "");
  const section = asSection(draft?.section || sectionHint, guessSection(blob));
  const { score, rationale } = scoreDumbness(blob);
  const fallback = fallbackCopy(subject, extracted, notes);
  const frBody = paras(draft?.body, 8);
  const enBody = paras(draft?.bodyEn, 8);
  const fr: StoryCopy = {
    headline: sanitizeText(draft?.headline, 160) || fallback.headline,
    dek: sanitizeText(draft?.dek, 400) || fallback.dek,
    body: frBody.length ? frBody : fallback.body,
    whyDumb: triple(draft?.whyDumb, fallback.whyDumb),
    factCheckNote: sanitizeText(draft?.factCheckNote, 400) || fallback.factCheckNote,
  };
  const en: StoryCopy = {
    headline: sanitizeText(draft?.headlineEn, 160) || fr.headline,
    dek: sanitizeText(draft?.dekEn, 400) || fr.dek,
    body: enBody.length ? enBody : fr.body,
    whyDumb: triple(draft?.whyDumbEn, fr.whyDumb),
    factCheckNote: sanitizeText(draft?.factCheckNoteEn, 400) || fr.factCheckNote,
  };
  const id = `q-desk-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const slugFr = slugify(draft?.slugFr || fr.headline);
  const slugEn = slugify(draft?.slugEn || en.headline);
  const countryCode = sanitizeText(draft?.countryCode, 4).toUpperCase() || guessed.code;
  const countryName = sanitizeText(draft?.countryName, 60) || guessed.name;
  const location = sanitizeText(draft?.location, 80) || guessed.location;
  const dumbness = Math.min(10, Math.max(4, Number(draft?.dumbness) || score));
  const confidence = Math.min(0.95, Math.max(0.2, Number(draft?.confidence) || (draftedBy === "grok" ? 0.62 : 0.4)));
  const claims: ClaimRow[] = Array.isArray(draft?.claims)
    ? draft.claims
        .map((c): ClaimRow | null => {
          if (!c || typeof c !== "object") return null;
          const row = c as { claim?: unknown; source?: unknown; status?: unknown };
          if (typeof row.claim !== "string") return null;
          const status: ClaimRow["status"] =
            row.status === "supported" || row.status === "unsupported" ? row.status : "needs-check";
          return {
            claim: sanitizeText(row.claim, 240),
            source: sanitizeText(typeof row.source === "string" ? row.source : "", 400) || urls[0] || "commande",
            status,
          };
        })
        .filter((c): c is ClaimRow => c !== null)
        .slice(0, 8)
    : [{ claim: fr.headline, source: urls[0] || "commande desk", status: "needs-check" }];
  const stillNeeds = Array.isArray(draft?.stillNeeds)
    ? draft.stillNeeds.filter((s): s is string => typeof s === "string").map((s) => sanitizeText(s, 200)).filter(Boolean).slice(0, 6)
    : ["Relire le document d’origine", "Pas de citation hors source"];
  const pack: FactPack = {
    confidence,
    claims,
    stillNeeds: stillNeeds.length ? stillNeeds : ["Relire avant publication"],
    suggestedEdits: ["Vérifier les noms propres.", "Couper le titre s’il promet trop."],
    dumbnessRationale: rationale,
  };
  const srcs = sourcesFrom(extracted, urls[0] || "https://yesitsreal.news/cambuse");
  if (draft?.publisher && srcs[0]) srcs[0] = { ...srcs[0], publisher: sanitizeText(draft.publisher, 80) || srcs[0].publisher };
  if (draft?.sourceTitle && srcs[0]) srcs[0] = { ...srcs[0], title: sanitizeText(draft.sourceTitle, 180) || srcs[0].title };
  const entities = Array.isArray(draft?.entities)
    ? draft.entities.filter((e): e is string => typeof e === "string").map((e) => sanitizeText(e, 60)).filter(Boolean).slice(0, 8)
    : [];
  const story: Story = {
    id,
    slug: slugEn,
    slugs: { en: slugEn, fr: slugFr },
    section,
    countryCode,
    countryName,
    location,
    dumbness,
    sources: srcs,
    factChecked: false,
    confidence,
    publishedAt: now,
    updatedAt: now,
    status: "inbox",
    entities,
    originalLang: "fr",
    sensitivity: detectSensitivity(blob) === "death" ? "death" : "none",
    copy: { en, fr },
  };
  return {
    id,
    story: storyWithFrench(story),
    pack,
    submittedBy: "Commande desk",
    submittedAt: now,
    sourceUrl: urls[0] || "https://yesitsreal.news/cambuse",
  };
}

export async function runDeskAssign(input: DeskAssignInput): Promise<DeskAssignResult> {
  const subject = sanitizeText(input.subject, 800);
  const notes = sanitizeText(input.notes, 1500);
  const country = sanitizeText(input.country, 80);
  if (subject.length < 8 && !input.url) return { ok: false, reason: "subject" };
  const urls = collectUrls(input);
  if (urls.some((u) => looksLikeSatire(u))) return { ok: false, reason: "satire" };
  const blob = `${subject} ${notes} ${urls.join(" ")}`;
  if (detectSensitivity(blob) === "reject-minors") return { ok: false, reason: "minors" };
  if (DEATH.test(blob) || detectSensitivity(blob) === "death") return { ok: false, reason: "death" };

  const extracted = urls.length ? await fetchArticles(urls) : [];
  const sourceBlob = extracted.map((e) => `${e.title} ${e.text}`).join(" ");
  if (detectSensitivity(sourceBlob) === "reject-minors") return { ok: false, reason: "minors" };
  if (DEATH.test(sourceBlob)) return { ok: false, reason: "death" };

  const voice = asVoice(input.voice);
  const grok = await grokDraft(
    systemPrompt(voice),
    userPrompt({
      subject: subject || urls[0] || "sujet",
      notes,
      country,
      section: input.section,
      extracted,
    }),
  );

  if ("text" in grok) {
    const draft = parseDraft(grok.text);
    if (draft?.reject) {
      const why = sanitizeText(draft.rejectReason, 200) || "reject";
      if (/mort|death|mineur|minor|satire|guerre|war/i.test(why)) return { ok: false, reason: "reject" };
      return { ok: false, reason: "reject" };
    }
    const item = itemFromDraft({
      draft,
      subject: subject || extracted[0]?.title || "Sujet desk",
      notes,
      extracted,
      urls,
      sectionHint: input.section,
      countryHint: country,
      draftedBy: "grok",
    });
    return { ok: true, item, draftedBy: "grok" };
  }

  const item = itemFromDraft({
    draft: null,
    subject: subject || extracted[0]?.title || "Sujet desk",
    notes,
    extracted,
    urls,
    sectionHint: input.section,
    countryHint: country,
    draftedBy: "extract",
  });
  const warning =
    grok.error === "unavailable"
      ? "Grok n’est pas branché sur ce serveur. Brouillon mécanique à partir de la source."
      : "Grok n’a pas répondu. Brouillon mécanique à partir de la source.";
  return { ok: true, item, draftedBy: "extract", warning };
}
