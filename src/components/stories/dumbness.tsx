import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DumbnessScore({
  score,
  lang,
  size = "md",
}: {
  score: number;
  lang: Lang;
  size?: "sm" | "md";
}) {
  const clamped = Math.max(0, Math.min(10, score));
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-sans tabular-nums text-ink",
        size === "sm" ? "text-[0.7rem]" : "text-xs",
      )}
      title={`${t(lang, "dumbness")} ${clamped}/10`}
    >
      <span className="kicker text-[0.6rem] text-ink-muted">{t(lang, "dumbness")}</span>
      <span className="font-semibold">{clamped}</span>
      <span className="flex gap-px" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <i
            key={i}
            className={cn(
              "block h-2 w-1.5",
              i < clamped ? (clamped >= 8 ? "bg-signal" : "bg-ink") : "bg-rule",
            )}
          />
        ))}
      </span>
    </span>
  );
}
