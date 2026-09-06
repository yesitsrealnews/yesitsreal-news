function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function storyViews(id: string): number {
  return 8_400 + (hash(id) % 92_000);
}

export function storyShares(id: string): number {
  return 180 + (hash(`${id}-sh`) % 4_800);
}

export function liveReaders(now = 1_777_000_000_000): number {
  const hour = new Date(now).getUTCHours();
  return 9_200 + hour * 410;
}

export function formatCount(n: number, lang: string): string {
  try {
    return new Intl.NumberFormat(lang === "zh-TW" ? "zh-Hant" : lang, {
      notation: n >= 10_000 ? "compact" : "standard",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    return String(n);
  }
}
