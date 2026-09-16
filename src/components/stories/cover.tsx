import { useState } from "react";
import { CoverCard } from "@/components/stories/cover-card";
import {
  COVER_HEIGHT,
  COVER_WIDTH,
  coverCredit,
  coverCreditLine,
  coverDisplaySrc,
  coverSizes,
  coverSrc,
  coverSrcFallback,
  coverSrcSet,
} from "@/lib/covers";
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
  remote,
  sizes,
}: {
  id: string;
  section: SectionId;
  alt: string;
  className?: string;
  priority?: boolean;
  credit?: boolean;
  /** Publisher photo from the originating desk. Not a generated fake. */
  remote?: string;
  sizes?: string;
}) {
  const local = coverSrc(id);
  const webp = coverDisplaySrc(id);
  const src = local || remote;
  const line = credit && local ? coverCreditLine(id) : credit && remote ? "Visuel d’origine · source" : undefined;
  const meta = coverCredit(id);
  const [failed, setFailed] = useState(false);
  const sizeAttr = sizes || coverSizes(priority ? "hero" : "card");
  const prod = import.meta.env.PROD;

  if (!src || failed) {
    return <CoverCard id={id} label={alt} className={className} />;
  }

  const imgClass = cn("h-full w-full object-cover", className);
  const img = (
    <img
      src={src}
      alt={alt || line || ""}
      className={imgClass}
      width={COVER_WIDTH}
      height={COVER_HEIGHT}
      sizes={sizeAttr}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
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

  const picture =
    prod && local && webp ? (
      <picture>
        <source type="image/avif" srcSet={coverSrcSet(id, "avif")} sizes={sizeAttr} />
        <source type="image/webp" srcSet={coverSrcSet(id, "webp")} sizes={sizeAttr} />
        {img}
      </picture>
    ) : (
      img
    );

  if (!line) return picture;
  const cls =
    "absolute bottom-0 inset-x-0 bg-ink/70 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.08em] text-paper/90";
  return (
    <span className="relative block h-full w-full">
      {picture}
      {meta?.page ? (
        <a href={meta.page} className={`${cls} hover:underline`} rel="noopener noreferrer">
          {line}
        </a>
      ) : (
        <span className={cls}>{line}</span>
      )}
    </span>
  );
}
