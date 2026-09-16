import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { REACTIONS } from "@/lib/viral";
import { useAppStore } from "@/lib/store";
import { formatCount } from "@/lib/engagement";
import { cn } from "@/lib/utils";

export function ReactionBar({ storyId, lang }: { storyId: string; lang: Lang }) {
  const extra = useAppStore((s) => s.reactions[storyId]);
  const mine = useAppStore((s) => s.myReactions[storyId]);
  const react = useAppStore((s) => s.react);

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t(lang, "share")}>
      {REACTIONS.map((r) => {
        const n = extra?.[r.id] ?? 0;
        const on = mine === r.id;
        return (
          <button
            key={r.id}
            type="button"
            disabled={Boolean(mine)}
            onClick={() => react(storyId, r.id)}
            className={cn(
              "inline-flex h-11 items-center gap-2 border px-3 text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-transform duration-150 active:scale-95",
              on ? "border-ink bg-scream text-scream-ink" : "border-rule bg-card text-ink hover:bg-paper-2",
            )}
          >
            {t(lang, r.key)}
            {n > 0 ? <span className="tabular-nums text-ink-muted">{formatCount(n, lang)}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
