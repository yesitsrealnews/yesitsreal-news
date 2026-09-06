import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cupClosesIn } from "@/lib/contest";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { Trophy } from "lucide-react";

export function ContestBanner({ lang }: { lang: Lang }) {
  const [clock, setClock] = useState<{ d: number; h: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const c = cupClosesIn();
      setClock({ d: c.d, h: c.h });
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <Link
      to="/contest"
      className="flex items-center justify-between gap-3 bg-scream px-4 py-2.5 text-scream-ink sm:px-6"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Trophy className="size-4 shrink-0" />
        <span className="truncate font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.08em] sm:text-sm">
          {t(lang, "contestTitle")} — {t(lang, "contestCta")}
        </span>
      </span>
      <span className="shrink-0 font-sans text-[0.65rem] font-bold uppercase tracking-[0.14em]">
        {clock ? `${clock.d}d ${clock.h}h` : t(lang, "contestLive")}
      </span>
    </Link>
  );
}
