import { useState } from "react";
import { CoverCard } from "@/components/stories/cover-card";
import { coverCredit, coverCreditLine, coverSrc, coverSrcFallback } from "@/lib/covers";
import type { SectionId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Photo when we have one. Otherwise an honest desk card — never an empty hole. */
export function StoryCover({
  id,
  section: _section,
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
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <CoverCard id={id} label={alt} className={className} />;
  }

  const img = (
    <img
      src={src}
      alt={alt || line || ""}
      className={cn("h-full w-full object-cover", className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const fb = coverSrcFallback(id);
        if (fb && e.currentTarget.src !== fb) {
          e.currentTarget.src = fb;
          return;
        }
        setFailed(true);
      }}
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
