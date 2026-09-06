import { Link } from "@tanstack/react-router";
import type { Lang } from "@/lib/types";
import { EMAILS } from "@/lib/brand";
import { adsenseReady, STRIPE_PAYMENT_LINKS } from "@/lib/payments";

const COPY = {
  en: {
    kicker: "To collect real money",
    title: "What you must do. The site is already the till.",
    intro:
      "This preview cannot open a bank account for you. It can take the order. You connect the pipes.",
    steps: [
      "Register a company (SASU / auto-entrepreneur). You need a legal person to invoice, to Stripe, and to Google Ads.",
      "Buy yesitsreal.news. Point DNS. Create mailbox ads@, desk@, jobs@ — MX on Google Workspace or ImprovMX.",
      "Stripe: identity + IBAN. Create Payment Links for each SKU (Desk Light, Desk+, tee, tips, Cup title). Paste the buy.stripe.com URLs into src/lib/payments.ts.",
      "Legal pages: update Privacy / Terms with SIRET, host, and Stripe as processor. Cookie banner already splits necessary vs ads.",
      "AdSense or Google Ad Manager: apply with the live domain, 2–14 days. Replace pub-000… in ads.txt. Paste ca-pub-… into payments.ts. Direct deals (Cup title, native) do not wait for AdSense — invoice from ads@.",
      "First 72 hours of cash is not display ads. It is: 1) Stripe memberships/tips/merch 2) one brand on the Cup 3) stringer applications (cost down, not cash in).",
    ],
    statusOn: "Connected",
    statusOff: "Not connected yet",
    stripe: "Stripe Payment Links",
    adsense: "AdSense publisher ID",
  },
  fr: {
    kicker: "Pour encaisser pour de vrai",
    title: "Ce que tu dois faire. Le site est déjà la caisse.",
    intro:
      "Cet aperçu ne peut pas ouvrir un compte bancaire à ta place. Il peut prendre la commande. Tu branches les tuyaux.",
    steps: [
      "Créer une structure (SASU / micro). Il faut une personne morale pour facturer, pour Stripe, et pour Google.",
      "Acheter yesitsreal.news. DNS. Boîtes ads@, desk@, jobs@ — MX via Google Workspace ou ImprovMX.",
      "Stripe : identité + IBAN. Crée un Payment Link par SKU (Desk Light, Desk+, tee, tips, naming Coupe). Colle les URL buy.stripe.com dans src/lib/payments.ts.",
      "Mentions légales : SIRET, hébergeur, Stripe comme sous-traitant dans Confidentialité / CGU. Le bandeau cookies sépare déjà nécessaire et pub.",
      "AdSense ou Ad Manager : candidature sur le domaine live, 2 à 14 jours. Remplace pub-000… dans ads.txt. Colle ca-pub-… dans payments.ts. Les deals directs (Coupe, natif) n’attendent pas AdSense — facture depuis ads@.",
      "Les 72 premières heures d’argent ce n’est pas la régie display. C’est : 1) abonnements / tips / merch Stripe 2) une marque sur la Coupe 3) les stringers (ça baisse le coût, ça n’encaisse pas).",
    ],
    statusOn: "Branché",
    statusOff: "Pas encore branché",
    stripe: "Liens de paiement Stripe",
    adsense: "ID éditeur AdSense",
  },
} as const;

export function GoLive({ lang }: { lang: Lang }) {
  const c = lang === "fr" ? COPY.fr : COPY.en;
  const stripeN = Object.values(STRIPE_PAYMENT_LINKS).filter((u) => u.startsWith("https://")).length;
  const adsOn = adsenseReady();
  return (
    <section className="mt-10 border-2 border-ink bg-paper-2 p-5">
      <p className="kicker text-signal">{c.kicker}</p>
      <h2 className="mt-2 font-serif text-3xl uppercase">{c.title}</h2>
      <p className="mt-3 text-sm">{c.intro}</p>
      <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm">
        {c.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <ul className="mt-5 space-y-1 text-sm">
        <li>
          {c.stripe}: {stripeN}/11 {stripeN ? c.statusOn : c.statusOff}
        </li>
        <li>
          {c.adsense}: {adsOn ? c.statusOn : c.statusOff}
        </li>
        <li>
          {EMAILS.ads} · {EMAILS.jobs} · {EMAILS.desk}
        </li>
      </ul>
      <p className="mt-4 text-xs">
        <Link to="/shop" className="underline">
          /shop
        </Link>
        {" · "}
        <Link to="/advertise" className="underline">
          /advertise
        </Link>
        {" · "}
        <Link to="/careers" className="underline">
          /careers
        </Link>
      </p>
    </section>
  );
}
