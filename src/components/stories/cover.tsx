import { coverCredit, coverCreditLine, coverSrc, coverSrcFallback } from "@/lib/covers";
import type { SectionId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Photos only. Never drawings, gradients, or the old TRUE SVG. */
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

  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-end bg-ink px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-paper/80",
          className,
        )}
        role="img"
        aria-label={alt || "Photo manquante"}
      >
        Photo manquante
      </div>
    );
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
        e.currentTarget.style.display = "none";
        const parent = e.currentTarget.parentElement;
        if (parent && !parent.querySelector("[data-missing-photo]")) {
          const miss = document.createElement("div");
          miss.dataset.missingPhoto = "1";
          miss.className =
            "flex h-full w-full items-end bg-ink px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-paper/80";
          miss.textContent = "Photo manquante";
          parent.appendChild(miss);
        }
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
