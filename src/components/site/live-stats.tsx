import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

/** Live-reader gauge retired — it was a hash, not a count. */
export function LiveStats({ lang }: { lang: Lang }) {
  return (
    <p className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
      {t(lang, "live")}
    </p>
  );
}
