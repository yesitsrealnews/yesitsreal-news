import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ShareBar } from "@/components/site/share-bar";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { EMAILS, SITE_NAME, SITE_URL } from "@/lib/brand";
import { ASKING, COMPS, MODEL, PLATFORMS, RISKS, TRACTION, ASSETS, LISTING_FR, LISTING_EN } from "@/lib/invest";

export const Route = createFileRoute("/invest")({
  head: () => ({
    meta: [
      { title: `Investir / acheter — ${SITE_NAME}` },
      {
        name: "description",
        content: "YES IT'S REAL est à vendre, ou ouvre un tour. Data room, prix, actifs, risques. Pas de million inventé.",
      },
      { property: "og:title", content: `Investir / acheter — ${SITE_NAME}` },
      { property: "og:url", content: `${SITE_URL}/invest` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/invest` }],
  }),
  component: InvestPage,
});

function money(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `€${n >= 1000 ? `${Math.round(n / 1000)}k` : n}`;
}

const MAIL = `mailto:${EMAILS.investors}?subject=${encodeURIComponent("YES IT'S REAL — investir / acheter")}`;

function InvestPage() {
  const lang = useAppStore((s) => s.lang);
  const fr = lang === "fr";
  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "forSale")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-none">{t(lang, "invest")}</h1>
        <p className="mt-4 text-lg">{t(lang, "investDek")}</p>
        <p className="mt-3 text-sm">
          {t(lang, "dataRoom")} ·{" "}
          <a className="font-bold underline" href={`mailto:${EMAILS.investors}`}>
            {EMAILS.investors}
          </a>
        </p>
        <ShareBar lang={lang} path="/invest" headline="YES IT'S REAL — for sale / seed" className="mt-5" />

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="border-2 border-ink bg-scream p-5 text-scream-ink">
            <p className="kicker">{fr ? "Tour d’amorçage" : "Seed"}</p>
            <p className="mt-2 font-serif text-4xl uppercase">
              {money(ASKING.seed.amount)} / {ASKING.seed.equity}%
            </p>
            <p className="mt-2 text-sm">{ASKING.seed.note}</p>
          </div>
          <div className="border-2 border-ink bg-ink p-5 text-paper">
            <p className="kicker text-scream">{fr ? "Cession" : "Acquisition"}</p>
            <p className="mt-2 font-serif text-4xl uppercase">
              {money(ASKING.sale.low)}–{money(ASKING.sale.high)}
            </p>
            <p className="mt-2 text-sm text-paper/80">{ASKING.sale.note}</p>
          </div>
        </div>

        <a
          href={MAIL}
          className="mt-8 inline-flex h-12 items-center bg-signal px-5 text-sm font-extrabold uppercase tracking-[0.12em] text-signal-fg"
        >
          {t(lang, "investCta")}
        </a>

        <h2 className="mt-10 font-serif text-3xl uppercase">{fr ? "Pourquoi ça imprime" : "Why this prints"}</h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm">
          <li>
            {fr
              ? "Pas de satire. Le produit, ce sont des faits vrais qui ont l’air inventés. C’est une denrée rare."
              : "Not satire. The product is true events that feel invented. That is a scarce feed."}
          </li>
          <li>
            {fr
              ? "31 langues, Coupe, six emplacements pub, abonnement, merch, kit X — déjà bâtis."
              : "31 languages, Cup flywheel, six ad units, membership, merch, social kit — built."}
          </li>
          <li>
            {fr
              ? "Chaque papier est une capture avec une source. C’est la distribution."
              : "Share-native: every story is a screenshot with a source. That is the distribution."}
          </li>
          <li>
            {fr
              ? "Risque éditorial clôturé : pas de mineurs, pas de morts, pas de citations inventées."
              : "Editorial risk is fenced: no minors, no death beat, no invented quotes."}
          </li>
        </ul>

        <h2 className="mt-10 font-serif text-3xl uppercase">{fr ? "Ce que vous achetez" : "What you buy"}</h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm">
          {ASSETS.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <h2 className="mt-10 font-serif text-3xl uppercase">{fr ? "Traction (produit)" : "Traction (product)"}</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TRACTION.map((row) => (
            <div key={row.k} className="border border-rule p-3">
              <dt className="kicker text-ink-muted">{row.k}</dt>
              <dd className="mt-1 font-serif text-2xl uppercase">{row.v}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-10 font-serif text-3xl uppercase">
          {fr ? "Mix de revenus (thèse an 1)" : "Revenue mix (year 1 thesis)"}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {MODEL.map((m) => (
            <li key={m.line} className="flex justify-between gap-3 border-b border-rule py-2">
              <span>
                <strong>{m.line}</strong> — {m.note}
              </span>
              <span className="font-extrabold tabular-nums">{m.y1}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-serif text-3xl uppercase">Comps</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {COMPS.map((c) => (
            <li key={c.name}>
              <strong>{c.name}.</strong> {c.note}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-serif text-3xl uppercase">{fr ? "Annonces — copier-coller" : "Listings — copy-paste"}</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {fr
            ? "Flippa, Acquire, Leboncoin. À coller le jour où yesitsreal.news répond. On ne demande pas un million."
            : "Flippa, Acquire, Leboncoin. File the day yesitsreal.news answers. Do not ask for a million."}
        </p>
        <h3 className="mt-6 font-serif text-2xl">Français</h3>
        <pre className="mt-2 whitespace-pre-wrap border-2 border-ink bg-paper-2 p-4 text-xs leading-relaxed">{LISTING_FR}</pre>
        <h3 className="mt-6 font-serif text-2xl">English</h3>
        <pre className="mt-2 whitespace-pre-wrap border-2 border-ink bg-paper-2 p-4 text-xs leading-relaxed">{LISTING_EN}</pre>
        <ul className="mt-3 space-y-3 text-sm">
          {PLATFORMS.map((p) => (
            <li key={p.name}>
              <a href={p.url} className="font-bold underline" target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
              — {p.why}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-serif text-3xl uppercase">{fr ? "Risques (dits en public)" : "Risks (said in public)"}</h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm">
          {RISKS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <a
          href={MAIL}
          className="mt-8 inline-flex h-12 items-center bg-signal px-5 text-sm font-extrabold uppercase tracking-[0.12em] text-signal-fg"
        >
          {t(lang, "investCta")}
        </a>
      </main>
    </SiteShell>
  );
}
