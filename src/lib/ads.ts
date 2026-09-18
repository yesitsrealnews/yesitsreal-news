import type { Lang } from "@/lib/types";
import { PRESS_ORGS, pressCopy } from "@/lib/press-freedom";

/** Sold network slots stay off. Public-interest + house cards show. */
export const ADS_PUBLIC = true;
export const ADS_PAID = false;

export type AdKind = "leaderboard" | "sidebar" | "inarticle" | "anchor" | "native";
export type AdTone = "psa" | "house" | "paid";

export interface Creative {
  id: string;
  kind: AdKind | "any";
  tone: AdTone;
  kicker: string;
  title: string;
  dek: string;
  cta: string;
  href: string;
  image?: string;
  partner: string;
}

const HOUSE: Creative[] = [
  {
    id: "cup",
    kind: "any",
    tone: "house",
    kicker: "The desk",
    title: "A true story already in print. Send it.",
    dek: "Named source, live URL, already published. We check. It really happened.",
    cta: "Send a story",
    href: "/submit",
    image: "/ads/cup.webp",
    partner: "YES IT'S REAL NEWS",
  },
  {
    id: "merch",
    kind: "any",
    tone: "house",
    kicker: "Desk merch",
    title: "The TRUE stamp. Wear the correction.",
    dek: "Heavy black tee. Red stamp. Précommande. No slogan long enough to become a memo.",
    cta: "Get the shirt",
    href: "/shop",
    image: "/ads/merch.webp",
    partner: "YES IT'S REAL Shop",
  },
  {
    id: "jobs",
    kind: "any",
    tone: "house",
    kicker: "The desk is hiring",
    title: "Get paid to notice when civilization glitches.",
    dek: "Stringers in 31 languages. €75–250 a published story. The TRUE stamp is the paycheck.",
    cta: "Open careers",
    href: "/careers",
    partner: "YES IT'S REAL desk",
  },
];

const PSA: Creative[] = PRESS_ORGS.map((org) => {
  const en = pressCopy(org, "en");
  return {
    id: org.id,
    kind: "any" as const,
    tone: "psa" as const,
    kicker: "Public interest",
    title: en.title,
    dek: en.dek,
    cta: en.cta,
    href: en.href,
    partner: org.name,
  };
});

export const CREATIVES: Creative[] = [...PSA, ...HOUSE];

export function creativeFor(slot: AdKind, salt: string): Creative {
  const pool = CREATIVES.filter((c) => {
    if (c.kind !== slot && c.kind !== "any") return false;
    if (c.tone === "paid" && !ADS_PAID) return false;
    return true;
  });
  let h = 0;
  for (let i = 0; i < salt.length; i++) h = (h + salt.charCodeAt(i) * (i + 1)) % Math.max(pool.length, 1);
  return pool[h] ?? PSA[0] ?? CREATIVES[0];
}

type AdText = Pick<Creative, "kicker" | "title" | "dek" | "cta">;

const AD_FR: Record<string, AdText> = {
  cup: {
    kicker: "La desk",
    title: "Un fait vrai déjà paru. Envoyez-le.",
    dek: "Source nommée, URL vive, déjà publié. On vérifie. Ça s’est vraiment passé.",
    cta: "Proposer un fait",
  },
  merch: {
    kicker: "Merch de la desk",
    title: "Le tampon VRAI. Portez la correction.",
    dek: "Tee noir lourd. Tampon rouge. Précommande. Pas de slogan assez long pour devenir un mémo.",
    cta: "Prendre le t-shirt",
  },
  jobs: {
    kicker: "La desk embauche",
    title: "Soyez payé·e pour voir quand la civilisation déraille.",
    dek: "Correspondants en 31 langues. 75–250 € par papier publié. Le tampon VRAI, c’est la paie.",
    cta: "Voir le recrutement",
  },
};

const AD_ES: Record<string, AdText> = {
  cup: {
    kicker: "La mesa",
    title: "Un hecho verdadero ya publicado. Envíelo.",
    dek: "Fuente nombrada, URL viva, ya salió. Comprobamos. De verdad ocurrió.",
    cta: "Enviar un hecho",
  },
  merch: {
    kicker: "Merch de la mesa",
    title: "El sello TRUE. Lleve la corrección.",
    dek: "Camiseta negra. Sello rojo. Precarga. Ningún eslogan lo bastante largo para ser un memo.",
    cta: "La camiseta",
  },
  jobs: {
    kicker: "La mesa contrata",
    title: "Le pagan por notar cuando la civilización falla.",
    dek: "Corresponsales en 31 lenguas. 75–250 € por pieza publicada.",
    cta: "Ver empleos",
  },
};

export function localizedCreative(ad: Creative, lang: Lang): Creative {
  const org = PRESS_ORGS.find((o) => o.id === ad.id);
  if (org) {
    const copy = pressCopy(org, lang);
    const kicker = lang === "fr" ? "Intérêt public" : lang === "es" ? "Interés público" : "Public interest";
    return { ...ad, kicker, ...copy };
  }
  const pack = lang === "fr" ? AD_FR : lang === "es" ? AD_ES : undefined;
  const loc = pack?.[ad.id];
  return loc ? { ...ad, ...loc } : ad;
}
