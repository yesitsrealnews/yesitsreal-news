import { cn } from "@/lib/utils";

/** Honest desk visual when a Commons photo is missing. Not a fake photo of the event. */
export function CoverCard({
  id,
  label,
  className,
}: {
  id: string;
  label?: string;
  className?: string;
}) {
  const title = (label || "Ça s’est vraiment passé").trim();
  const short = title.length > 86 ? `${title.slice(0, 83)}…` : title;
  const hue = [...id].reduce((h, c) => (h * 33 + c.charCodeAt(0)) >>> 0, 7) % 3;
  const bands = ["bg-scream", "bg-signal", "bg-true"] as const;
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-between overflow-hidden bg-ink p-4 text-paper",
        className,
      )}
      role="img"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md border-2 border-paper bg-scream px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-scream-ink">
          TRUE
        </span>
        <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-paper/70">
          YES IT'S REAL NEWS
        </span>
      </div>
      <p className="font-serif text-2xl leading-[0.95] tracking-tight sm:text-3xl">{short}</p>
      <div className="flex items-end justify-between gap-3">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-paper/60">
          Visuel desk
        </span>
        <span className={cn("h-3 w-16 rounded-sm border-2 border-paper", bands[hue])} />
      </div>
    </div>
  );
}
