export const SPRINT_MS = 72 * 60 * 60 * 1000;

export type SkuKind = "membership" | "merch" | "tip" | "ads";

export interface SkuCopy {
  name: string;
  dek: string;
}

export interface Sku {
  id: string;
  kind: SkuKind;
  name: string;
  dek: string;
  amount: number;
  listAmount: number;
  period: "once" | "month" | "year";
  image?: string;
  sizes?: boolean;
  copy?: Partial<Record<"fr" | "es", SkuCopy>>;
}

export const TEE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type TeeSize = (typeof TEE_SIZES)[number];

export const SKUS: Sku[] = [
  {
    id: "desk-light",
    kind: "membership",
    name: "Desk Light",
    dek: "Ad-light articles. The briefing at 07:00. Same facts.",
    amount: 6,
    listAmount: 6,
    period: "month",
    copy: {
      fr: { name: "Desk Light", dek: "Moins de pub. Le briefing à 7 h. Les mêmes faits." },
      es: { name: "Desk Light", dek: "Menos anuncios. El briefing a las 7. Los mismos hechos." },
    },
  },
  {
    id: "desk-plus",
    kind: "membership",
    name: "Desk+",
    dek: "Earlier Cup queue. Saturday extra. TRUE stamp wallpaper.",
    amount: 12,
    listAmount: 12,
    period: "month",
    copy: {
      fr: { name: "Desk+", dek: "La file de la Coupe plus tôt. Un extra le samedi. Fond d’écran tampon VRAI." },
      es: { name: "Desk+", dek: "La cola de la Copa antes. Extra el sábado. Fondo del sello CIERTO." },
    },
  },
  {
    id: "desk-patron",
    kind: "membership",
    name: "Patron of the unwell planet",
    dek: "Year. Your name in the colophon. Never on a story.",
    amount: 108,
    listAmount: 108,
    period: "year",
    copy: {
      fr: { name: "Mécène de la planète mal", dek: "L’année. Votre nom au colophon. Jamais sur un papier." },
      es: { name: "Mecenas del planeta enfermo", dek: "El año. Su nombre en el colofón. Nunca en un artículo." },
    },
  },
  {
    id: "pack-desk",
    kind: "merch",
    name: "Desk pack",
    dek: "TRUE stamp tee + today’s print. One order, two objects.",
    amount: 55,
    listAmount: 62,
    period: "once",
    image: "/brand/tee-stamp.jpg",
    sizes: true,
    copy: {
      fr: { name: "Pack desk", dek: "Tee tampon VRAI + print une. Une commande, deux objets." },
      es: { name: "Pack mesa", dek: "Camiseta sello CIERTO + print de portada. Un pedido, dos objetos." },
    },
  },
  {
    id: "tee-true",
    kind: "merch",
    name: "TRUE stamp tee",
    dek: "Heavy black. Red stamp. No slogan long enough to become a memo.",
    amount: 38,
    listAmount: 38,
    period: "once",
    image: "/brand/tee-stamp.jpg",
    sizes: true,
    copy: {
      fr: { name: "Tee tampon VRAI", dek: "Noir lourd. Tampon rouge. Pas de slogan assez long pour devenir un mémo." },
      es: { name: "Camiseta sello CIERTO", dek: "Negra pesada. Sello rojo. Ningún eslogan lo bastante largo para ser un memo." },
    },
  },
  {
    id: "print-card",
    kind: "merch",
    name: "Front-page print",
    dek: "Today’s dumbest, 30×40, newsprint. Ships with the first run.",
    amount: 24,
    listAmount: 24,
    period: "once",
    image: "/brand/logo-box.jpg",
    copy: {
      fr: { name: "Print une", dek: "Le plus bête du jour, 30 × 40, papier journal. Part avec le premier tirage." },
      es: { name: "Print de portada", dek: "Lo más tonto del día, 30 × 40, papel de periódico." },
    },
  },
  {
    id: "tip-3",
    kind: "tip",
    name: "Buy the desk a coffee",
    dek: "The facts stay free. The espresso does not.",
    amount: 3,
    listAmount: 3,
    period: "once",
    copy: {
      fr: { name: "Un café pour le bureau", dek: "Les faits restent gratuits. L’espresso, non." },
      es: { name: "Un café para la mesa", dek: "Los hechos siguen gratis. El espresso, no." },
    },
  },
  {
    id: "tip-7",
    kind: "tip",
    name: "Buy the desk a round",
    dek: "For the night the pigeons won.",
    amount: 7,
    listAmount: 7,
    period: "once",
    copy: {
      fr: { name: "Une tournée pour le bureau", dek: "Pour la nuit où les pigeons ont gagné." },
      es: { name: "Una ronda para la mesa", dek: "Por la noche en que ganaron las palomas." },
    },
  },
  {
    id: "tip-21",
    kind: "tip",
    name: "Keep a stringer in receipts",
    dek: "Goes to the next published bounty.",
    amount: 21,
    listAmount: 21,
    period: "once",
    copy: {
      fr: { name: "Les notes d’un correspondant", dek: "Ça va à la prochaine prime publiée." },
      es: { name: "Los tickets de un corresponsal", dek: "Va a la próxima prima publicada." },
    },
  },
];

export const AD_PACKS: Sku[] = [
  {
    id: "ads-week",
    kind: "ads",
    name: "Opening week — native + in-article",
    dek: "Labeled. Never on the verified kicker.",
    amount: 1480,
    listAmount: 1480,
    period: "once",
    copy: {
      fr: { name: "Semaine native + in-article", dek: "Labellisé. Jamais sur le bandeau vérifié." },
    },
  },
  {
    id: "ads-month",
    kind: "ads",
    name: "30-day run-of-site",
    dek: "Leaderboard, sidebar, mobile anchor. Brand-safe only.",
    amount: 6200,
    listAmount: 6200,
    period: "once",
    copy: {
      fr: { name: "30 jours run-of-site", dek: "Leaderboard, sidebar, ancre mobile. Marques propres seulement." },
    },
  },
  {
    id: "ads-cup",
    kind: "ads",
    name: "World Dumbness Cup — title",
    dek: "Name on the Cup. One brand. The news stays unsold.",
    amount: 25000,
    listAmount: 25000,
    period: "once",
    copy: {
      fr: { name: "Naming Coupe mondiale de la bêtise", dek: "Le nom sur la Coupe. Une marque. L’info reste non vendue." },
    },
  },
];

export function skuById(id: string): Sku | undefined {
  return [...SKUS, ...AD_PACKS].find((s) => s.id === id);
}

export function skuCopy(sku: Sku, lang: string): SkuCopy {
  if (lang === "fr" && sku.copy?.fr) return sku.copy.fr;
  if (lang === "es" && sku.copy?.es) return sku.copy.es;
  return { name: sku.name, dek: sku.dek };
}

export function formatEur(n: number, lang: string): string {
  try {
    return new Intl.NumberFormat(lang === "zh-TW" ? "zh-Hant" : lang, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `€${n}`;
  }
}

export function remaining(endsAt: string | null, now = Date.now()): { ms: number; h: number; m: number; live: boolean } {
  if (!endsAt) return { ms: 0, h: 0, m: 0, live: false };
  const ms = Math.max(0, +new Date(endsAt) - now);
  return { ms, h: Math.floor(ms / 3_600_000), m: Math.floor((ms % 3_600_000) / 60_000), live: ms > 0 };
}

export function discounted(sku: Sku, live: boolean): number {
  return live ? sku.amount : sku.listAmount;
}
