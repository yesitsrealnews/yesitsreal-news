import { coverCredit, coverCreditLine, coverSeed, coverSrc, SECTION_INK } from "@/lib/covers";
import type { SectionId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StoryCover({
  id,
  section,
  alt,
  className,
  priority = false,
  credit = false,
}: {
  id: string;
  section: SectionId;
  alt: string;
  className?: string;
  priority?: boolean;
  credit?: boolean;
}) {
  const src = coverSrc(id);
  const line = credit ? coverCreditLine(id) : undefined;
  const meta = coverCredit(id);
  if (src) {
    const img = (
      <img
        src={src}
        alt={alt || line || ""}
        className={cn("h-full w-full object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
    if (!line) return img;
    return (
      <span className="relative block h-full w-full">
        {img}
        <a
          href={meta?.page}
          className="absolute bottom-0 inset-x-0 bg-ink/70 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.08em] text-paper/90 hover:underline"
          rel="noopener noreferrer"
        >
          {line}
        </a>
      </span>
    );
  }
  return <PaintedCover id={id} section={section} className={className} />;
}

function PaintedCover({
  id,
  section,
  className,
}: {
  id: string;
  section: SectionId;
  className?: string;
}) {
  const ink = SECTION_INK[section];
  const s = coverSeed(id);
  const rot = (s % 28) - 14;
  const x = 20 + (s % 55);
  const y = 18 + ((s >> 5) % 50);
  return (
    <svg viewBox="0 0 800 500" className={cn("h-full w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={ink.a} />
          <stop offset="55%" stopColor={ink.b} />
          <stop offset="100%" stopColor={ink.c} />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#g-${id})`} />
      <g opacity="0.22" transform={`translate(${x} ${y}) rotate(${rot} 400 250)`}>
        <circle cx="420" cy="210" r="160" fill="#fff" />
        <rect x="80" y="280" width="540" height="28" fill="#000" />
        <rect x="140" y="330" width="380" height="14" fill="#000" />
      </g>
      <text
        x="40"
        y="460"
        fill="#fff"
        fontFamily="Oswald, Impact, sans-serif"
        fontSize="48"
        fontWeight="700"
        letterSpacing="4"
      >
        TRUE
      </text>
    </svg>
  );
}
