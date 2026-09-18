import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { PRESS_CAMPAIGNS, PRESS_ORGS, campaignCopy, pressCopy } from "@/lib/press-freedom";

export function PressFreedomStrip({ lang }: { lang: Lang }) {
  const label =
    lang === "fr"
      ? "Publicité · intérêt public"
      : lang === "es"
        ? "Publicidad · interés público"
        : "Advertising · public interest";
  const posters = PRESS_CAMPAIGNS.filter((c) => c.image);
  const lines = PRESS_CAMPAIGNS.filter((c) => !c.image);

  return (
    <section className="border-b border-rule bg-paper px-4 py-8 sm:px-6" aria-label={label}>
      <div className="mx-auto max-w-7xl">
        <p className="kicker text-[0.55rem] tracking-[0.18em] text-signal">{label}</p>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          {lang === "fr"
            ? "Campagnes mises à disposition par les organisations. On les relaie comme des pubs. Le don va sur leur site, pas le nôtre."
            : lang === "es"
              ? "Campañas cedidas por las organizaciones. Las retransmitimos como anuncios. El donativo va a su sitio."
              : "Campaigns the organisations put out to relay. We run them as ads. Donations go to their site, not ours."}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {posters.map((c) => {
            const copy = campaignCopy(c, lang);
            const webp = c.image!.replace(/\.jpe?g$/i, ".webp");
            return (
              <a
                key={c.id}
                href={copy.href}
                rel="noopener noreferrer"
                target="_blank"
                className="block border border-dashed border-rule bg-ad text-ad-ink transition-colors hover:bg-paper-2"
              >
                <img
                  src={webp}
                  alt={`${copy.title} — ${c.partner}`}
                  width={480}
                  height={670}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[200/280] w-full object-cover"
                  onError={(e) => {
                    if (c.image && e.currentTarget.src !== c.image) e.currentTarget.src = c.image;
                  }}
                />
                <div className="flex items-center justify-between gap-3 p-3">
                  <p className="kicker text-[0.55rem] tracking-[0.18em] text-ad-ink">
                    {t(lang, "adsPublicInterest")} · {c.partner}
                  </p>
                  <p className="inline-flex h-9 shrink-0 items-center bg-ink px-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-paper">
                    {copy.cta}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {lines.map((c) => {
            const copy = campaignCopy(c, lang);
            return (
              <a
                key={c.id}
                href={copy.href}
                rel="noopener noreferrer"
                target="_blank"
                className="block border border-dashed border-rule bg-ad p-4 text-ad-ink transition-colors hover:bg-paper-2"
              >
                <p className="kicker text-[0.55rem] tracking-[0.18em] text-ad-ink">
                  {t(lang, "adsPublicInterest")} · {c.partner}
                </p>
                <p className="mt-2 font-serif text-xl leading-tight">{copy.title}</p>
                <p className="mt-2 text-xs leading-snug">{copy.dek}</p>
                <p className="mt-3 inline-flex h-9 items-center bg-ink px-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-paper">
                  {copy.cta}
                </p>
              </a>
            );
          })}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
