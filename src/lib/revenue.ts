export const SPRINT_MS = 72 * 60 * 60 * 1000;

export type SkuKind = "membership" | "merch" | "tip" | "ads";

export interface Sku {
  id: string;
  kind: SkuKind;
  name: string;
  dek: string;
  amount: number;
  listAmount: number;
  period: "once" | "month" | "year";
}

export const SKUS: Sku[] = [
  {
    id: "desk-light",
    kind: "membership",
    name: "Desk Light",
    dek: "Ad-light articles. The briefing at 07:00. Same facts.",
    amount: 4,
    listAmount: 6,
    period: "month",
  },
  {
    id: "desk-plus",
    kind: "membership",
    name: "Desk+",
    dek: "Earlier Cup queue. Saturday extra. TRUE stamp wallpaper.",
    amount: 9,
    listAmount: 12,
    period: "month",
  },
  {
    id: "desk-patron",
    kind: "membership",
    name: "Patron of the unwell planet",
    dek: "Year. Your name in the colophon. Never on a story.",
    amount: 79,
    listAmount: 108,
    period: "year",
  },
  {
    id: "tee-true",
    kind: "merch",
    name: "TRUE stamp tee",
    dek: "Heavy black. Red stamp. No slogan long enough to become a memo.",
    amount: 38,
    listAmount: 48,
    period: "once",
  },
  {
    id: "print-card",
    kind: "merch",
    name: "Front-page print",
    dek: "Today’s dumbest, 30×40, newsprint. Ships when the first 100 land.",
    amount: 24,
    listAmount: 32,
    period: "once",
  },
  {
    id: "tip-3",
    kind: "tip",
    name: "Buy the desk a coffee",
    dek: "The facts stay free. The espresso does not.",
    amount: 3,
    listAmount: 3,
    period: "once",
  },
  {
    id: "tip-7",
    kind: "tip",
    name: "Buy the desk a round",
    dek: "For the night the pigeons won.",
    amount: 7,
    listAmount: 7,
    period: "once",
  },
  {
    id: "tip-21",
    kind: "tip",
    name: "Keep a stringer in receipts",
    dek: "Goes to the next published bounty.",
    amount: 21,
    listAmount: 21,
    period: "once",
  },
];

export const AD_PACKS: Sku[] = [
  {
    id: "ads-week",
    kind: "ads",
    name: "Opening week — native + in-article",
    dek: "72-hour rate. Labeled. Never on the verified kicker.",
    amount: 890,
    listAmount: 1480,
    period: "once",
  },
  {
    id: "ads-month",
    kind: "ads",
    name: "30-day run-of-site",
    dek: "Leaderboard, sidebar, mobile anchor. Brand-safe only.",
    amount: 3900,
    listAmount: 6200,
    period: "once",
  },
  {
    id: "ads-cup",
    kind: "ads",
    name: "World Dumbness Cup — title",
    dek: "Name on the Cup. One brand. The news stays unsold.",
    amount: 25000,
    listAmount: 25000,
    period: "once",
  },
];

export function skuById(id: string): Sku | undefined {
  return [...SKUS, ...AD_PACKS].find((s) => s.id === id);
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
  if (!endsAt) return { ms: SPRINT_MS, h: 72, m: 0, live: true };
  const ms = Math.max(0, +new Date(endsAt) - now);
  return { ms, h: Math.floor(ms / 3_600_000), m: Math.floor((ms % 3_600_000) / 60_000), live: ms > 0 };
}

export function discounted(sku: Sku, live: boolean): number {
  return live ? sku.amount : sku.listAmount;
}
