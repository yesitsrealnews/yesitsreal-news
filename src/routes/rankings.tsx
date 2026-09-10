import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { StoryCard } from "@/components/stories/story-card";
import { publishedStories } from "@/lib/catalog";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/rankings")({ component: RankingsPage });

function RankingsPage() {
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const deskStatus = useAppStore((s) => s.deskStatus);
  const [range, setRange] = useState<"today" | "week" | "all">("week");
  const list = useMemo(() => {
    const all = publishedStories(extras, deskStatus);
    const now = Date.now();
    const cut =
      range === "today" ? now - 36 * 3600 * 1000 : range === "week" ? now - 8 * 24 * 3600 * 1000 : 0;
    return all
      .filter((s) => (cut ? +new Date(s.publishedAt) >= cut : true))
      .sort((a, b) => b.dumbness - a.dumbness || +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [extras, deskStatus, range]);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="kicker text-signal">{t(lang, "rankings")}</p>
        <h1 className="mt-2 font-serif text-4xl">{t(lang, "rankings")}</h1>
        <p className="mt-3 text-sm text-ink-muted">{t(lang, "rankingsDek")}</p>
        <div className="mt-6 flex gap-2">
          {(["today", "week", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`h-11 px-4 text-xs font-semibold uppercase tracking-[0.12em] ${range === r ? "bg-ink text-paper" : "border border-rule"}`}
            >
              {r === "today" ? t(lang, "today") : r === "week" ? t(lang, "thisWeek") : t(lang, "allTime")}
            </button>
          ))}
        </div>
        <ol className="mt-8 space-y-6">
          {list.map((s, i) => (
            <li key={s.id} className="flex gap-4 border-t border-rule pt-4">
              <span className="font-serif text-3xl text-gold tabular-nums">{i + 1}</span>
              <StoryCard story={s} lang={lang} />
            </li>
          ))}
        </ol>
      </main>
    </SiteShell>
  );
}
