import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { AdSlot } from "@/components/site/ad-slot";
import { LeadForm } from "@/components/site/lead-form";
import { GoLive } from "@/components/site/go-live";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { EMAILS } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { AD_PACKS, formatEur, remaining } from "@/lib/revenue";
import { stripeLink } from "@/lib/payments";

export const Route = createFileRoute("/advertise")({ component: AdvertisePage });

const UNITS = [
  { name: "Header leaderboard", size: "728×90 / fluid", id: "yir_leaderboard", cpm: "€8–18" },
  { name: "In-article", size: "300×250 / fluid", id: "yir_inarticle", cpm: "€12–24" },
  { name: "Sidebar sticky", size: "300×600", id: "yir_sidebar", cpm: "€10–20" },
  { name: "Native recommended", size: "fluid", id: "yir_native", cpm: "€18–32" },
  { name: "Mobile anchor", size: "320×50", id: "yir_anchor", cpm: "€6–14" },
  { name: "Cup title sponsor", size: "brand", id: "yir_cup", cpm: "from €25k" },
];

function AdvertisePage() {
  const lang = useAppStore((s) => s.lang);
  const ends = useAppStore((s) => s.sprintEndsAt);
  const clock = remaining(ends);
  const week = AD_PACKS[0];
  const pay = stripeLink(week.id);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "mediaKit")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase">{t(lang, "advertise")}</h1>
        <p className="mt-4 text-lg">{t(lang, "advertiseDek")}</p>
        <p className="mt-3 text-sm">
          <a className="font-bold underline" href={`mailto:${EMAILS.ads}`}>
            {EMAILS.ads}
          </a>
        </p>
        {clock.live ? (
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-signal">
            {t(lang, "sprintKicker")} · {clock.h}h {clock.m}m · {t(lang, "openingRate")}
          </p>
        ) : null}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-2 border-ink text-left text-sm">
            <thead className="bg-scream text-scream-ink">
              <tr>
                <th className="p-3">Slot</th>
                <th className="p-3">Size</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Guide</th>
              </tr>
            </thead>
            <tbody>
              {UNITS.map((u) => (
                <tr key={u.id} className="border-t border-rule">
                  <td className="p-3 font-semibold">{u.name}</td>
                  <td className="p-3">{u.size}</td>
                  <td className="p-3 font-mono text-xs">{u.id}</td>
                  <td className="p-3">{u.cpm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-10 border-2 border-ink p-6">
          <p className="kicker text-signal">{week.name}</p>
          <p className="mt-2 font-serif text-4xl uppercase">{formatEur(clock.live ? week.amount : week.listAmount, lang)}</p>
          <p className="mt-2 text-sm">{week.dek}</p>
          {pay ? (
            <Button className="mt-6" variant="signal" asChild>
              <a href={pay}>{t(lang, "bookSlot")}</a>
            </Button>
          ) : (
            <div className="mt-6">
              <LeadForm
                lang={lang}
                kind="ads"
                sku={week.id}
                amount={clock.live ? week.amount : week.listAmount}
                cta={t(lang, "bookSlot")}
                thanks={t(lang, "bookThanks")}
              />
            </div>
          )}
        </section>

        <p className="mt-4 text-xs text-ink-muted">{t(lang, "noChargeToday")}</p>
        <div className="mt-8 space-y-6">
          <AdSlot lang={lang} slot="leaderboard" salt="kit-lead" />
          <AdSlot lang={lang} slot="native" salt="kit-native" />
        </div>
        <Button className="mt-8" variant="outline" asChild>
          <a href={`mailto:${EMAILS.ads}?subject=YES%20IT%27S%20REAL%20—%20media%20kit`}>{EMAILS.ads}</a>
        </Button>
        <GoLive lang={lang} />
      </main>
    </SiteShell>
  );
}
