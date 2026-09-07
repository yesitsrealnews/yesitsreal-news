import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { remaining } from "@/lib/revenue";
import { useAppStore } from "@/lib/store";
import { Timer } from "lucide-react";

export function SprintBanner({ lang }: { lang: Lang }) {
  const ends = useAppStore((s) => s.sprintEndsAt);
  const ensure = useAppStore((s) => s.ensureSprint);
  const [clock, setClock] = useState(() => remaining(ends));

  useEffect(() => {
    ensure();
    const tick = () => setClock(remaining(useAppStore.getState().sprintEndsAt));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [ensure]);

  if (!clock.live) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-paper sm:px-6">
      <span className="flex min-w-0 items-center gap-2">
        <Timer className="size-4 shrink-0 text-scream" />
        <span className="truncate font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.08em] sm:text-sm">
          {t(lang, "sprintKicker")} — {clock.h}{t(lang, "hoursAbbr")} {clock.m}{t(lang, "minutesAbbr")}
        </span>
      </span>
      <span className="flex shrink-0 gap-3 text-[0.65rem] font-bold uppercase tracking-[0.12em]">
        <Link to="/shop" className="text-scream hover:underline">
          {t(lang, "shop")}
        </Link>
        <Link to="/advertise" className="hover:underline">
          {t(lang, "sprintCta")}
        </Link>
        <Link to="/contest" className="hidden sm:inline hover:underline">
          {t(lang, "contest")}
        </Link>
      </span>
    </div>
  );
}
