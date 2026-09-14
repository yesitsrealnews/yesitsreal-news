import { t } from "@/lib/i18n";
import type { Lang, Story } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Real receipts, not a score. Publisher names are the proof. */
export function SourceProof({
  story,
  lang,
  size = "md",
  names = false,
}: {
  story: Story;
  lang: Lang;
  size?: "sm" | "md";
  names?: boolean;
}) {
  const n = story.sources.length;
  const pubs = story.sources.map((s) => s.publisher).filter(Boolean);
  const shown = names ? pubs.slice(0, 3).join(" · ") : "";
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 font-sans text-ink",
        size === "sm" ? "text-[0.7rem]" : "text-xs",
      )}
      title={pubs.join(" · ")}
    >
      <span className="kicker text-[0.6rem] text-ink-muted">{t(lang, "sources")}</span>
      <span className="font-semibold tabular-nums">{n}</span>
      {shown ? <span className="truncate text-ink-muted">· {shown}</span> : null}
    </span>
  );
}
