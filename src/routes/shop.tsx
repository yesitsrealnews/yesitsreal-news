import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { LeadForm } from "@/components/site/lead-form";
import { GoLive } from "@/components/site/go-live";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { AD_PACKS, SKUS, discounted, formatEur, remaining, type Sku } from "@/lib/revenue";
import { EMAILS } from "@/lib/brand";
import { stripeLink } from "@/lib/payments";
import type { Lang, LeadKind } from "@/lib/types";

export const Route = createFileRoute("/shop")({ component: ShopPage });

function ShopPage() {
  const lang = useAppStore((s) => s.lang);
  const ends = useAppStore((s) => s.sprintEndsAt);
  const clock = remaining(ends);
  const [picked, setPicked] = useState<Sku | null>(null);
  const membership = SKUS.filter((s) => s.kind === "membership");
  const merch = SKUS.filter((s) => s.kind === "merch");
  const tips = SKUS.filter((s) => s.kind === "tip");
  const kind = useMemo<LeadKind>(() => {
    if (picked?.kind === "ads") return "ads";
    if (picked?.kind === "tip") return "tip";
    if (picked?.kind === "merch") return "merch";
    return "membership";
  }, [picked]);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{clock.live ? t(lang, "sprintKicker") : t(lang, "shop")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-[0.9] sm:text-7xl">{t(lang, "shop")}</h1>
        <p className="mt-4 max-w-2xl text-lg">{t(lang, "shopDek")}</p>
        {clock.live ? (
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-signal">
            {clock.h}h {clock.m}m · {t(lang, "openingRate")}
          </p>
        ) : null}

        <section className="mt-10 border-2 border-ink">
          <div className="grid gap-0 md:grid-cols-2">
            <figure className="border-b-2 border-ink bg-paper md:border-b-0 md:border-e-2">
              <img src="/brand/logo-box.svg" alt="YES IT'S REAL box logo" className="w-full" />
              <figcaption className="border-t border-rule px-4 py-3 text-xs font-extrabold uppercase tracking-[0.14em]">
                The box — chest print
              </figcaption>
            </figure>
            <figure className="bg-paper">
              <img src="/brand/tee-stamp.jpg" alt="TRUE stamp tee" className="aspect-square w-full object-cover" />
              <figcaption className="border-t border-rule px-4 py-3 text-xs font-extrabold uppercase tracking-[0.14em]">
                The stamp — the tee that forwards
              </figcaption>
            </figure>
          </div>
          <div className="grid grid-cols-2 border-t-2 border-ink">
            <img src="/brand/logo-stamp.svg" alt="TRUE stamp lockup" className="w-full border-e-2 border-ink bg-paper" />
            <img src="/brand/logo-seal.jpg" alt="YES IT'S REAL seal" className="aspect-square w-full object-cover" />
          </div>
          <p className="border-t-2 border-ink bg-scream px-4 py-3 text-sm font-medium text-scream-ink">
            Pavé rouge + tampon TRUE. C’est le logo. Personne d’autre n’a ce dessin — garde les SVG.
          </p>
        </section>

        <h2 className="mt-10 font-serif text-3xl uppercase">{t(lang, "membership")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {membership.map((s) => (
            <SkuCard key={s.id} sku={s} lang={lang} live={clock.live} onPick={setPicked} active={picked?.id === s.id} />
          ))}
        </div>

        <h2 className="mt-10 font-serif text-3xl uppercase">{t(lang, "preorder")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {merch.map((s) => (
            <SkuCard key={s.id} sku={s} lang={lang} live={clock.live} onPick={setPicked} active={picked?.id === s.id} />
          ))}
        </div>

        <h2 className="mt-10 font-serif text-3xl uppercase">{t(lang, "tipJar")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {tips.map((s) => (
            <SkuCard key={s.id} sku={s} lang={lang} live={clock.live} onPick={setPicked} active={picked?.id === s.id} />
          ))}
        </div>

        <p className="mt-6 text-sm">
          <Link to="/advertise" className="underline">
            {t(lang, "advertise")}
          </Link>
          {" · "}
          <a className="underline" href={`mailto:${EMAILS.ads}`}>
            {EMAILS.ads}
          </a>
        </p>

        {picked ? (
          <Checkout lang={lang} sku={picked} live={clock.live} kind={kind} />
        ) : null}

        <p className="mt-8 text-xs text-ink-muted">{t(lang, "noChargeToday")}</p>
        <p className="mt-2 text-xs text-ink-muted">{AD_PACKS[0].dek}</p>
        <GoLive lang={lang} />
      </main>
    </SiteShell>
  );
}

function Checkout({
  lang,
  sku,
  live,
  kind,
}: {
  lang: Lang;
  sku: Sku;
  live: boolean;
  kind: LeadKind;
}) {
  const price = discounted(sku, live);
  const pay = stripeLink(sku.id);
  return (
    <section className="mt-10 border-2 border-ink p-6">
      <p className="kicker text-signal">{sku.name}</p>
      <p className="mt-2 font-serif text-3xl uppercase">{formatEur(price, lang)}</p>
      {pay ? (
        <a
          href={pay}
          className="mt-6 inline-flex h-11 items-center bg-signal px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-signal-fg"
        >
          {t(lang, "joinPaid")} · {formatEur(price, lang)}
        </a>
      ) : (
        <div className="mt-6">
          <LeadForm
            lang={lang}
            kind={kind}
            sku={sku.id}
            amount={price}
            cta={`${t(lang, "joinPaid")} · ${formatEur(price, lang)}`}
            thanks={t(lang, "shopThanks")}
          />
        </div>
      )}
    </section>
  );
}

function SkuCard({
  sku,
  lang,
  live,
  onPick,
  active,
}: {
  sku: Sku;
  lang: Lang;
  live: boolean;
  onPick: (s: Sku) => void;
  active: boolean;
}) {
  const price = discounted(sku, live);
  return (
    <button
      type="button"
      onClick={() => onPick(sku)}
      className={`border-2 p-4 text-left ${active ? "border-signal bg-paper-2" : "border-ink bg-card hover:bg-paper-2"}`}
    >
      {live && price < sku.listAmount ? <Badge tone="scream">{t(lang, "openingRate")}</Badge> : null}
      <p className="mt-2 font-serif text-2xl uppercase leading-none">{sku.name}</p>
      <p className="mt-2 text-sm text-ink-muted">{sku.dek}</p>
      <p className="mt-3 font-sans text-lg font-extrabold tabular-nums">
        {formatEur(price, lang)}
        {sku.period === "month" ? "/mo" : sku.period === "year" ? "/yr" : ""}
        {live && price < sku.listAmount ? (
          <span className="ms-2 text-sm font-medium text-ink-muted line-through">{formatEur(sku.listAmount, lang)}</span>
        ) : null}
      </p>
      <span className="mt-3 inline-flex h-11 items-center text-xs font-extrabold uppercase tracking-[0.14em] underline">
        {t(lang, "shopCta")}
      </span>
    </button>
  );
}
