import { creativeFor, type AdKind } from "@/lib/ads";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AdSlot({
  lang,
  slot,
  salt = slot,
  className,
}: {
  lang: Lang;
  slot: AdKind;
  salt?: string;
  className?: string;
}) {
  const ad = creativeFor(slot, salt);
  const label = slot === "native" ? t(lang, "adNative") : slot === "sidebar" ? t(lang, "adSidebar") : t(lang, "adsLabel");
  return (
    <a
      href={ad.href}
      aria-label={label}
      rel={ad.href.startsWith("http") ? "noopener noreferrer sponsored" : undefined}
      className={cn(
        "block border border-dashed border-rule bg-ad p-3 text-ad-ink transition-colors hover:bg-paper-2",
        slot === "leaderboard" && "min-h-[90px]",
        slot === "sidebar" && "min-h-[280px]",
        slot === "inarticle" && "min-h-[180px]",
        slot === "anchor" && "min-h-[56px]",
        slot === "native" && "min-h-[96px]",
        className,
      )}
    >
      <span className="kicker text-[0.55rem] tracking-[0.18em] text-ad-ink">
        {label} · {ad.partner}
      </span>
      <div className={cn("mt-2 flex gap-3", slot === "sidebar" && "flex-col")}>
        {ad.image && slot !== "anchor" ? (
          <img
            src={ad.image}
            alt=""
            className={cn(
              "object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10",
              slot === "sidebar" ? "h-40 w-full" : "h-16 w-24 shrink-0 sm:h-20 sm:w-28",
              slot === "leaderboard" && "hidden sm:block",
              slot === "inarticle" && "h-28 w-full sm:h-32",
              slot === "native" && "h-20 w-28",
            )}
          />
        ) : null}
        <div className="min-w-0">
          <p className="kicker text-signal">{ad.kicker}</p>
          <p className="mt-1 font-serif text-lg leading-tight sm:text-xl">{ad.title}</p>
          {slot !== "anchor" ? <p className="mt-1 text-xs leading-snug text-ad-ink">{ad.dek}</p> : null}
          <p className="mt-2 inline-flex h-9 items-center bg-ink px-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-paper">
            {ad.cta}
          </p>
        </div>
      </div>
    </a>
  );
}

export function MobileAnchorAd({ lang }: { lang: Lang }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-ad md:hidden pb-[env(safe-area-inset-bottom)]">
      <AdSlot lang={lang} slot="anchor" className="border-0" />
    </div>
  );
}
