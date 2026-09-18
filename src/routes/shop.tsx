import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { LeadForm } from "@/components/site/lead-form";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { SKUS, TEE_SIZES, formatEur, skuCopy, type Sku, type TeeSize } from "@/lib/revenue";
import { EMAILS } from "@/lib/brand";
import { stripeLink } from "@/lib/payments";
import type { Lang, LeadKind } from "@/lib/types";

export const Route = createFileRoute("/shop")({ component: ShopPage });

function ShopPage() {
  const lang = useAppStore((s) => s.lang);
  const [picked, setPicked] = useState<Sku | null>(SKUS.find((s) => s.id === "pack-desk") ?? null);
  const [size, setSize] = useState<TeeSize>("M");
  const merch = SKUS.filter((s) => s.kind === "merch");
  const tips = SKUS.filter((s) => s.kind === "tip");
  const membership = SKUS.filter((s) => s.kind === "membership");
  const kind = useMemo<LeadKind>(() => {
    if (picked?.kind === "tip") return "tip";
    if (picked?.kind === "merch") return "merch";
    return "membership";
  }, [picked]);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "shop")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-[0.9] sm:text-7xl">{t(lang, "shop")}</h1>
        <p className="mt-4 max-w-2xl text-lg">{t(lang, "shopDek")}</p>

        <section className="mt-10 border-2 border-ink">
          <figure className="bg-paper">
            <img
              src="/brand/tee-stamp.jpg"
              alt={lang === "fr" ? "Tee tampon VRAI, noir, tampon rouge" : "TRUE stamp tee, black, red stamp"}
              className="aspect-square w-full object-cover sm:aspect-[5/4]"
            />
            <figcaption className="border-t-2 border-ink bg-scream px-4 py-3 text-sm font-medium text-scream-ink">
              {t(lang, "shopHeroCap")}
            </figcaption>
          </figure>
        </section>

        <h2 className="mt-10 font-serif text-3xl uppercase">{t(lang, "preorder")}</h2>
        <p className="mt-2 text-sm text-ink-muted">{t(lang, "shopMerchDek")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {merch.map((s) => (
            <SkuCard key={s.id} sku={s} lang={lang} onPick={setPicked} active={picked?.id === s.id} />
          ))}
        </div>

        <h2 className="mt-10 font-serif text-3xl uppercase">{t(lang, "tipJar")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {tips.map((s) => (
            <SkuCard key={s.id} sku={s} lang={lang} onPick={setPicked} active={picked?.id === s.id} />
          ))}
        </div>

        <h2 className="mt-10 font-serif text-3xl uppercase">{t(lang, "membership")}</h2>
        <p className="mt-2 text-sm text-ink-muted">{t(lang, "shopMemberDek")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {membership.map((s) => (
            <SkuCard key={s.id} sku={s} lang={lang} onPick={setPicked} active={picked?.id === s.id} />
          ))}
        </div>

        <p className="mt-6 text-sm">
          <a className="underline" href={`mailto:${EMAILS.ads}`}>
            {EMAILS.ads}
          </a>
        </p>

        {picked ? (
          <Checkout lang={lang} sku={picked} kind={kind} size={size} onSize={setSize} />
        ) : null}

        <p className="mt-8 text-xs text-ink-muted">{t(lang, "noChargeToday")}</p>
      </main>
    </SiteShell>
  );
}

function Checkout({
  lang,
  sku,
  kind,
  size,
  onSize,
}: {
  lang: Lang;
  sku: Sku;
  kind: LeadKind;
  size: TeeSize;
  onSize: (s: TeeSize) => void;
}) {
  const copy = skuCopy(sku, lang);
  const pay = stripeLink(sku.id);
  const extraNotes = sku.sizes ? `${lang === "fr" ? "Taille" : "Size"} ${size}` : undefined;
  return (
    <section className="mt-10 border-2 border-ink p-6">
      <p className="kicker text-signal">{copy.name}</p>
      <p className="mt-2 font-serif text-3xl uppercase">{formatEur(sku.amount, lang)}</p>
      <p className="mt-2 text-sm text-ink-muted">{copy.dek}</p>
      {sku.sizes ? (
        <div className="mt-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em]">{t(lang, "shopSize")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TEE_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSize(s)}
                className={`inline-flex h-11 min-w-11 items-center justify-center border-2 px-3 text-sm font-extrabold ${
                  size === s ? "border-signal bg-scream text-scream-ink" : "border-ink bg-card"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {pay ? (
        <a
          href={pay}
          className="mt-6 inline-flex h-11 items-center bg-signal px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-signal-fg"
        >
          {t(lang, "joinPaid")} · {formatEur(sku.amount, lang)}
        </a>
      ) : (
        <div className="mt-6">
          <LeadForm
            lang={lang}
            kind={kind}
            sku={sku.id}
            amount={sku.amount}
            extraNotes={extraNotes}
            cta={`${t(lang, "preorder")} · ${formatEur(sku.amount, lang)}`}
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
  onPick,
  active,
}: {
  sku: Sku;
  lang: Lang;
  onPick: (s: Sku) => void;
  active: boolean;
}) {
  const copy = skuCopy(sku, lang);
  const save = sku.listAmount > sku.amount;
  return (
    <button
      type="button"
      onClick={() => onPick(sku)}
      className={`border-2 p-4 text-left ${active ? "border-signal bg-paper-2" : "border-ink bg-card hover:bg-paper-2"}`}
    >
      {sku.image ? (
        <img src={sku.image} alt="" className="mb-3 aspect-square w-full object-cover outline outline-1 -outline-offset-1 outline-black/10" />
      ) : null}
      <p className="font-serif text-2xl uppercase leading-none">{copy.name}</p>
      <p className="mt-2 text-sm text-ink-muted">{copy.dek}</p>
      <p className="mt-3 font-sans text-lg font-extrabold tabular-nums">
        {formatEur(sku.amount, lang)}
        {sku.period === "month" ? (lang === "fr" ? "/mois" : "/mo") : sku.period === "year" ? (lang === "fr" ? "/an" : "/yr") : ""}
        {save ? (
          <span className="ms-2 text-sm font-medium text-ink-muted line-through">{formatEur(sku.listAmount, lang)}</span>
        ) : null}
      </p>
      <span className="mt-3 inline-flex h-11 items-center text-xs font-extrabold uppercase tracking-[0.14em] underline">
        {t(lang, "preorder")}
      </span>
    </button>
  );
}
