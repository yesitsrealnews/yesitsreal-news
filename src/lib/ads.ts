import type { Lang } from "@/lib/types";

export type AdKind = "leaderboard" | "sidebar" | "inarticle" | "anchor" | "native";

export interface Creative {
  id: string;
  kind: AdKind | "any";
  kicker: string;
  title: string;
  dek: string;
  cta: string;
  href: string;
  image?: string;
  partner: string;
}

export const CREATIVES: Creative[] = [
  {
    id: "cup",
    kind: "any",
    kicker: "World Dumbness Cup",
    title: "Vote. Shame a country. Win the planet.",
    dek: "The only global contest where the prize is being right about how wrong we are.",
    cta: "Enter the Cup",
    href: "/contest",
    image: "/ads/cup.jpg",
    partner: "YES IT'S REAL",
  },
  {
    id: "merch",
    kind: "any",
    kicker: "Desk merch",
    title: "The TRUE stamp. Wear the correction.",
    dek: "Heavy black tee. Red stamp. No slogan long enough to become a memo.",
    cta: "Get the shirt",
    href: "/membership",
    image: "/ads/merch.jpg",
    partner: "YES IT'S REAL Shop",
  },
  {
    id: "vpn",
    kind: "any",
    kicker: "Partner",
    title: "Hide your search history from entitled ducks.",
    dek: "A dummy network slot. Swap this creative for AdSense / Ad Manager.",
    cta: "Media kit",
    href: "/advertise",
    partner: "DummyFill VPN",
  },
  {
    id: "breadlock",
    kind: "native",
    kicker: "Partner",
    title: "BreadLock™ — the feeder they voted to ban.",
    dek: "Native slot. Labeled. The news stays unsold.",
    cta: "Advertise here",
    href: "/advertise",
    partner: "Municipal Snacks Co.",
  },
  {
    id: "deskpass",
    kind: "any",
    kicker: "Membership",
    title: "Ad-light. Queue-early. Same planet.",
    dek: "Optional. The facts do not change if you pay.",
    cta: "Join the desk list",
    href: "/membership",
    partner: "YES IT'S REAL+",
  },
  {
    id: "jobs",
    kind: "any",
    kicker: "The desk is hiring",
    title: "Get paid to notice when civilization glitches.",
    dek: "Stringers in 31 languages. €75–250 a published story. The TRUE stamp is the paycheck.",
    cta: "Open careers",
    href: "/careers",
    partner: "YES IT'S REAL desk",
  },
  {
    id: "shop",
    kind: "any",
    kicker: "72-hour window",
    title: "Membership, merch, tips. The news stays free.",
    dek: "Opening rates. No card charged until Stripe is pasted. The intent is the till.",
    cta: "Open the shop",
    href: "/shop",
    partner: "YES IT'S REAL Shop",
  },
];

export function creativeFor(slot: AdKind, salt: string): Creative {
  const pool = CREATIVES.filter((c) => c.kind === slot || c.kind === "any");
  let h = 0;
  for (let i = 0; i < salt.length; i++) h = (h + salt.charCodeAt(i) * (i + 1)) % pool.length;
  return pool[h] ?? CREATIVES[0];
}

type AdText = Pick<Creative, "kicker" | "title" | "dek" | "cta">;

const AD_FR: Record<string, AdText> = {
  cup: {
    kicker: "Coupe du Monde de la Bêtise",
    title: "Votez. Faites honte à un pays. Gagnez la planète.",
    dek: "Le seul concours où le prix, c’est d’avoir raison sur à quel point on a tort.",
    cta: "Entrer dans la Coupe",
  },
  merch: {
    kicker: "Merch de la desk",
    title: "Le tampon VRAI. Portez la correction.",
    dek: "Tee noir lourd. Tampon rouge. Pas de slogan assez long pour devenir un mémo.",
    cta: "Prendre le t-shirt",
  },
  vpn: {
    kicker: "Partenaire",
    title: "Cachez votre historique aux canards trop sûrs d’eux.",
    dek: "Emplacement factice. À remplacer par AdSense / Ad Manager.",
    cta: "Kit média",
  },
  breadlock: {
    kicker: "Partenaire",
    title: "BreadLock™ — la mangeoire qu’ils ont voté d’interdire.",
    dek: "Emplacement natif. Labellisé. L’info reste non vendue.",
    cta: "Annoncer ici",
  },
  deskpass: {
    kicker: "Abonnement",
    title: "Moins de pub. La file plus tôt. La même planète.",
    dek: "Facultatif. Les faits ne changent pas si vous payez.",
    cta: "Rejoindre la liste",
  },
  jobs: {
    kicker: "La desk embauche",
    title: "Soyez payé·e pour voir quand la civilisation déraille.",
    dek: "Correspondants en 31 langues. 75–250 € par papier publié. Le tampon VRAI, c’est la paie.",
    cta: "Voir le recrutement",
  },
  shop: {
    kicker: "Fenêtre 72 h",
    title: "Abonnement, merch, pourboire. L’info reste gratuite.",
    dek: "Tarifs d’ouverture. Aucune carte débitée tant que Stripe n’est pas collé. L’intention, c’est la caisse.",
    cta: "Ouvrir la boutique",
  },
};

const AD_ES: Record<string, AdText> = {
  cup: {
    kicker: "Copa Mundial de la Tontería",
    title: "Vote. Avergüence a un país. Gane el planeta.",
    dek: "El único concurso cuyo premio es tener razón sobre lo equivocados que estamos.",
    cta: "Entrar en la Copa",
  },
  merch: {
    kicker: "Merch de la mesa",
    title: "El sello TRUE. Lleve la corrección.",
    dek: "Camiseta negra. Sello rojo. Ningún eslogan lo bastante largo para ser un memo.",
    cta: "La camiseta",
  },
  vpn: {
    kicker: "Patrocinio",
    title: "Oculte su historial a los patos demasiado seguros de sí.",
    dek: "Hueco de red de muestra. Sustitúyalo por AdSense / Ad Manager.",
    cta: "Kit de medios",
  },
  breadlock: {
    kicker: "Patrocinio",
    title: "BreadLock™ — el comedero que votaron prohibir.",
    dek: "Hueco nativo. Etiquetado. La noticia no se vende.",
    cta: "Anunciar aquí",
  },
  deskpass: {
    kicker: "Suscripción",
    title: "Menos anuncios. La cola antes. El mismo planeta.",
    dek: "Opcional. Los hechos no cambian si paga.",
    cta: "Unirse a la lista",
  },
  jobs: {
    kicker: "La mesa contrata",
    title: "Le pagan por notar cuando la civilización falla.",
    dek: "Corresponsales en 31 lenguas. 75–250 € por pieza publicada.",
    cta: "Ver empleos",
  },
  shop: {
    kicker: "Ventana 72 h",
    title: "Suscripción, merch, propina. La noticia sigue gratis.",
    dek: "Tarifas de apertura. Hoy no se carga ninguna tarjeta.",
    cta: "Abrir la tienda",
  },
};

export function localizedCreative(ad: Creative, lang: Lang): Creative {
  const pack = lang === "fr" ? AD_FR : lang === "es" ? AD_ES : undefined;
  const loc = pack?.[ad.id];
  return loc ? { ...ad, ...loc } : ad;
}

