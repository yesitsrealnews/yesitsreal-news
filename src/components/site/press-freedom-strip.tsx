import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { PRESS_ORGS, pressCopy } from "@/lib/press-freedom";

export function PressFreedomStrip({ lang }: { lang: Lang }) {
  const label =
    lang === "fr"
      ? "Liberté de la presse · journalistes · expression"
      : lang === "es"
        ? "Libertad de prensa · periodistas · expresión"
        : "Press freedom · journalists · expression";

  return (
    <section className="border-b border-rule bg-paper px-4 py-8 sm:px-6" aria-label={label}>
      <div className="mx-auto max-w-7xl">
        <p className="kicker text-[0.55rem] tracking-[0.18em] text-signal">{label}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRESS_ORGS.map((org) => {
            const c = pressCopy(org, lang);
            return (
              <a
                key={org.id}
                href={c.href}
                rel="noopener noreferrer"
                target="_blank"
                className="block border border-dashed border-rule bg-ad p-3 text-ad-ink transition-colors hover:bg-paper-2"
              >
                <p className="kicker text-signal">{org.name}</p>
                <p className="mt-1 font-serif text-base leading-tight">{c.title}</p>
                <p className="mt-3 inline-flex h-8 items-center bg-ink px-2.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-paper">
                  {c.cta}
                </p>
              </a>
            );
          })}
        </div>
        <p className="mt-4 text-[0.7rem] leading-snug text-ink-faint">{t(lang, "adsPublicNote")}</p>
      </div>
    </section>
  );
}
