/** Outbound links to official Musk-company sites.
 *
 * Legal desk note: we do NOT hotlink or reuse their marketing banners/logos
 * without a license or paid media buy. Text cards + official URLs only.
 * Label as unpaid official links (not a paid partnership).
 * Swap a href for a personal Tesla/Starlink referral only if Pierre owns that link.
 */
import type { Lang } from "@/lib/types";

export type FooterPartner = {
  id: string;
  name: string;
  href: string;
  tagline: Record<"en" | "fr" | "es", string>;
  cta: Record<"en" | "fr" | "es", string>;
};

export const FOOTER_PARTNERS: FooterPartner[] = [
  {
    id: "tesla",
    name: "Tesla",
    href: "https://www.tesla.com/",
    tagline: {
      en: "Electric cars. Official site.",
      fr: "Voitures électriques. Site officiel.",
      es: "Coches eléctricos. Sitio oficial.",
    },
    cta: { en: "Visit Tesla", fr: "Voir Tesla", es: "Ver Tesla" },
  },
  {
    id: "spacex",
    name: "SpaceX",
    href: "https://www.spacex.com/",
    tagline: {
      en: "Rockets & Starship. Official site.",
      fr: "Fusées & Starship. Site officiel.",
      es: "Cohetes y Starship. Sitio oficial.",
    },
    cta: { en: "Visit SpaceX", fr: "Voir SpaceX", es: "Ver SpaceX" },
  },
  {
    id: "starlink",
    name: "Starlink",
    href: "https://www.starlink.com/",
    tagline: {
      en: "Satellite internet. Official site.",
      fr: "Internet satellite. Site officiel.",
      es: "Internet satelital. Sitio oficial.",
    },
    cta: { en: "Visit Starlink", fr: "Voir Starlink", es: "Ver Starlink" },
  },
  {
    id: "xai",
    name: "xAI",
    href: "https://x.ai/",
    tagline: {
      en: "Grok & frontier models. Official site.",
      fr: "Grok & modèles. Site officiel.",
      es: "Grok y modelos. Sitio oficial.",
    },
    cta: { en: "Visit xAI", fr: "Voir xAI", es: "Ver xAI" },
  },
  {
    id: "x",
    name: "X",
    href: "https://x.com/",
    tagline: {
      en: "The everything app. Official site.",
      fr: "L’app pour tout. Site officiel.",
      es: "La app de todo. Sitio oficial.",
    },
    cta: { en: "Open X", fr: "Ouvrir X", es: "Abrir X" },
  },
];

export function partnerCopy(p: FooterPartner, lang: Lang) {
  const key = lang === "fr" ? "fr" : lang === "es" ? "es" : "en";
  return { tagline: p.tagline[key], cta: p.cta[key] };
}
