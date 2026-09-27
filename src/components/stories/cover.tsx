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
  creditSourceLabel,
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
  credit = true,
  linkCredit = false,
  remote,
  sizes,
}: {
  id: string;
  section: SectionId;
  alt: string;
  className?: string;
  priority?: boolean;
  /**
   * Desk rule: photographer + licence (+ source) printed on the edge of the photo.
   * `true`/"full" everywhere a cover has real size; "compact" on cards; `false` only for tiny thumbs.
   */
  credit?: boolean | "full" | "compact";
  /** Make the credit a link to the source page. Only when the cover is NOT already inside a link. */
  linkCredit?: boolean;
  /** Publisher photo from the originating desk. Not a generated fake. */
  remote?: string;
  sizes?: string;
}) {
  const prod = import.meta.env.PROD;
  const local = coverSrc(id);
  const webp = coverDisplaySrc(id);
  const src = local ? (prod && webp ? webp : local) : remote;
  const variant = credit === "compact" ? "compact" : "full";
  const meta = coverCredit(id);
  const line = !credit
    ? undefined
    : local
      ? coverCreditLine(id, variant)
      : remote
        ? ["Visuel d’origine", creditSourceLabel(remote)].filter(Boolean).join(" · ")
        : undefined;
  const href = local ? meta?.page : undefined;
  const [failed, setFailed] = useState(false);
  const sizeAttr = sizes || coverSizes(priority ? "hero" : "card");

  if (!src || failed) {
    return <CoverCard id={id} label={alt} className={className} />;
  }

  const imgClass = cn("block h-full w-full object-cover", className);
  const img = (
    <img
      src={src}
      alt={alt || line || ""}
      className={imgClass}
      width={COVER_WIDTH}
      height={COVER_HEIGHT}
      sizes={sizeAttr}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
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
  const cls = cn(
    "pointer-events-none absolute bottom-0 right-0 z-[1] m-0 max-w-full truncate bg-black/60 px-1.5 py-0.5 font-sans font-medium text-white/95 [text-shadow:0_1px_1px_rgb(0_0_0/0.6)]",
    variant === "compact" ? "text-[9px] leading-tight sm:text-[10px]" : "text-[10px] leading-tight sm:text-[11px]",
  );
  return (
    <figure className="relative m-0 block h-full w-full">
      {picture}
      <figcaption className={cls} title={line}>
        <span className="sr-only">Photo : </span>
        {linkCredit && href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto underline-offset-2 hover:underline focus-visible:underline"
          >
            {line}
          </a>
        ) : (
          line
        )}
      </figcaption>
    </figure>
  );
}
