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
