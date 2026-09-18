import type { Story, StoryCopy } from "./types";
import { isClosingLecture, stripClosingLecture } from "./article-close.ts";

function isSafeHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const DRAFT_MARK =
  /brouillon|pas encore sur des documents|tant que la desk n[’']a pas les documents|selon la source d[’']origine|fait soumis|à vérifier|tagged against the submitted url|draft\./i;

export function isDraftCopy(copy: StoryCopy): boolean {
  return DRAFT_MARK.test(`${copy.factCheckNote}\n${copy.body.join("\n")}`);
}

export function extractLeadImage(text: string): string | undefined {
  const m = text.match(/Visuel source\s*:\s*(https?:\/\/[^\s<>"]+)/i);
  if (!m?.[1]) return undefined;
  const url = m[1].replace(/[),.;]+$/g, "");
  return isSafeHttpUrl(url) ? url : undefined;
}

export function slugFromHeadline(headline: string): string {
  const slug = headline
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "fait";
}

function stripVisuel(text: string): string {
  return text.replace(/\s*Visuel source\s*:\s*https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
}

function polishLang(story: Story, copy: StoryCopy, lang: "fr" | "en"): StoryCopy {
  if (!isDraftCopy(copy) && copy.body.length >= 2 && !/^selon la source d[’']origine/i.test(copy.body[0] || "")) {
    return {
      ...copy,
      body: stripClosingLecture(copy.body.map(stripVisuel).filter(Boolean)),
      factCheckNote: /brouillon/i.test(copy.factCheckNote)
        ? copy.factCheckNote.replace(/brouillon\.?\s*/i, "")
        : copy.factCheckNote,
    };
  }
  const src0 = story.sources[0];
  const pubs = story.sources.map((s) => s.publisher).filter(Boolean).join(" · ");
  const dek = stripVisuel((copy.dek || "").replace(/\s*(\.{3}|…)\s*$/, "").trim());
  const where = [story.location, story.countryName].filter(Boolean).join(", ");
  const date = src0?.date || "";
  const paper = src0?.publisher || (lang === "fr" ? "La source" : "The source");
  const lead = `${paper}${date ? `, ${date}` : ""}. ${where}. ${dek || copy.headline}`;
  const kept = copy.body
    .map(stripVisuel)
    .filter(Boolean)
    .filter((p) => !DRAFT_MARK.test(p) && !isClosingLecture(p));
  return {
    headline: copy.headline,
    dek: dek || copy.headline,
    body: stripClosingLecture([lead, ...kept.filter((p) => p !== lead)]),
    whyDumb: copy.whyDumb[0]
      ? copy.whyDumb
      : lang === "fr"
        ? ["C’est arrivé.", "Quelqu’un a dû s’en occuper.", "C’est maintenant au dossier."]
        : ["It happened.", "Someone had to deal with it.", "It is now on the record."],
    factCheckNote: `${pubs}${date ? `, ${date}` : ""}.`,
  };
}

/** Turn a Cambuse RSS draft into a public article: no "brouillon", no closing lecture. */
export function polishPublishedStory(story: Story): Story {
  const blob = `${story.copy.fr?.body.join(" ") ?? ""} ${story.copy.en.body.join(" ")} ${story.copy.fr?.dek ?? ""}`;
  const coverUrl = (story.coverUrl && isSafeHttpUrl(story.coverUrl) ? story.coverUrl : extractLeadImage(blob)) || undefined;
  const fr = story.copy.fr ? polishLang(story, story.copy.fr, "fr") : undefined;
  const en = polishLang(story, story.copy.en, "en");
  const next: Story = {
    ...story,
    factChecked: true,
    status: "published",
    copy: { ...story.copy, en, ...(fr ? { fr } : {}) },
    ...(coverUrl ? { coverUrl } : {}),
  };
  if (/^(rss-|soumis-|submitted-)/.test(story.slug) || /^(q-|q-rss-)/.test(story.id)) {
    const nice = slugFromHeadline(fr?.headline || en.headline);
    next.slugs = { ...story.slugs, fr: nice, en: story.slugs.en || story.slug };
  }
  return next;
}
