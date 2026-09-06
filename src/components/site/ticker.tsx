import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function Ticker({ lang }: { lang: Lang }) {
  const item = t(lang, "ticker");
  const loop = Array.from({ length: 10 }, () => item);
  return (
    <div className="overflow-hidden border-y border-ink bg-signal text-signal-fg" role="status">
      <div className="ticker-track flex w-max gap-10 py-1.5">
        {[...loop, ...loop].map((text, i) => (
          <span key={i} className="kicker text-[0.65rem] tracking-[0.22em]">
            {text}
            <span className="mx-3 text-scream" aria-hidden>
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
