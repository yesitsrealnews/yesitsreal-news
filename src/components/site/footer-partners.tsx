import type { Lang } from "@/lib/types";
import { FOOTER_PARTNERS, partnerCopy } from "@/lib/footer-partners";

export function FooterPartners({ lang }: { lang: Lang }) {
  const label =
    lang === "fr"
      ? "Liens · sites officiels"
      : lang === "es"
        ? "Enlaces · sitios oficiales"
        : "Links · official sites";
  const note =
    lang === "fr"
      ? "Pas un partenariat payé. Cartes maison + URLs officielles — pas leurs bannières marketing (droits / marques)."
      : lang === "es"
        ? "No es un patrocinio pagado. Tarjetas propias + URLs oficiales — no sus banners de marketing."
        : "Not a paid partnership. House cards + official URLs — not their marketing banners (IP / trademarks).";

  return (
    <section
      className="border-t border-rule bg-paper px-4 py-8 sm:px-6"
      aria-label={label}
    >
      <div className="mx-auto max-w-7xl">
        <p className="kicker text-[0.55rem] tracking-[0.18em] text-ink-muted">{label}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {FOOTER_PARTNERS.map((p) => {
            const c = partnerCopy(p, lang);
            return (
              <a
                key={p.id}
                href={p.href}
                rel="noopener noreferrer"
                className="block border border-dashed border-rule bg-ad p-3 text-ad-ink transition-colors hover:bg-paper-2"
              >
                <p className="kicker text-signal">{p.name}</p>
                <p className="mt-1 font-serif text-base leading-tight">{c.tagline}</p>
                <p className="mt-3 inline-flex h-8 items-center bg-ink px-2.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-paper">
                  {c.cta}
                </p>
              </a>
            );
          })}
        </div>
        <p className="mt-4 text-[0.7rem] leading-snug text-ink-muted">{note}</p>
      </div>
    </section>
  );
}
