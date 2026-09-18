import type { Lang } from "@/lib/types";

/** Public-interest inventory. House cards + official URLs only — no borrowed logos. */
export type PressOrg = {
  id: string;
  name: string;
  href: string;
  hrefFr?: string;
  title: Record<"en" | "fr" | "es", string>;
  dek: Record<"en" | "fr" | "es", string>;
  cta: Record<"en" | "fr" | "es", string>;
};

export const PRESS_ORGS: PressOrg[] = [
  {
    id: "rsf",
    name: "Reporters sans frontières",
    href: "https://rsf.org/en",
    hrefFr: "https://rsf.org/fr",
    title: {
      en: "Protecting journalists protects your right to know.",
      fr: "Protéger les journalistes, c’est protéger votre droit à l’information.",
      es: "Proteger a los periodistas es proteger tu derecho a saber.",
    },
    dek: {
      en: "Reporters Without Borders. Official site. Not a sold ad.",
      fr: "RSF. Site officiel. Pas une pub vendue.",
      es: "Reporteros Sin Fronteras. Sitio oficial. No es un anuncio vendido.",
    },
    cta: { en: "Visit RSF", fr: "Voir RSF", es: "Ver RSF" },
  },
  {
    id: "cpj",
    name: "Committee to Protect Journalists",
    href: "https://cpj.org/",
    title: {
      en: "Journalism is not a crime.",
      fr: "Le journalisme n’est pas un crime.",
      es: "El periodismo no es un delito.",
    },
    dek: {
      en: "CPJ defends reporters under threat. Official site. Unpaid slot.",
      fr: "Le CPJ défend les reporters menacés. Site officiel. Emplacement non vendu.",
      es: "CPJ defiende a reporteros amenazados. Sitio oficial. Espacio no vendido.",
    },
    cta: { en: "Visit CPJ", fr: "Voir CPJ", es: "Ver CPJ" },
  },
  {
    id: "article19",
    name: "ARTICLE 19",
    href: "https://www.article19.org/",
    title: {
      en: "Freedom of expression is a right, not a mood.",
      fr: "La liberté d’expression n’est pas un luxe.",
      es: "La libertad de expresión no es un lujo.",
    },
    dek: {
      en: "ARTICLE 19. Freedom of expression and information. Official site.",
      fr: "ARTICLE 19. Liberté d’expression et d’information. Site officiel.",
      es: "ARTICLE 19. Libertad de expresión e información. Sitio oficial.",
    },
    cta: { en: "Visit ARTICLE 19", fr: "Voir ARTICLE 19", es: "Ver ARTICLE 19" },
  },
  {
    id: "ifj",
    name: "International Federation of Journalists",
    href: "https://www.ifj.org/",
    hrefFr: "https://www.ifj.org/fr/",
    title: {
      en: "The world’s journalists, one federation.",
      fr: "Les journalistes du monde, une fédération.",
      es: "Los periodistas del mundo, una federación.",
    },
    dek: {
      en: "IFJ. Trade union of the press. Official site. Not a sold ad.",
      fr: "FIJ. Syndicat mondial de la presse. Site officiel. Pas une pub vendue.",
      es: "FIP. Sindicato mundial de la prensa. Sitio oficial.",
    },
    cta: { en: "Visit IFJ", fr: "Voir la FIJ", es: "Ver la FIP" },
  },
  {
    id: "snj",
    name: "Syndicat national des journalistes",
    href: "https://www.snj.fr/",
    title: {
      en: "The union that defends the byline.",
      fr: "Le syndicat qui défend la signature.",
      es: "El sindicato que defiende la firma.",
    },
    dek: {
      en: "SNJ, France. Journalists’ union. Official site.",
      fr: "SNJ. Défense de la profession. Site officiel. Emplacement non vendu.",
      es: "SNJ, Francia. Sindicato de periodistas. Sitio oficial.",
    },
    cta: { en: "Visit SNJ", fr: "Voir le SNJ", es: "Ver el SNJ" },
  },
  {
    id: "mdj",
    name: "Maison des Journalistes",
    href: "https://www.maisondesjournalistes.org/",
    title: {
      en: "A roof for journalists in exile.",
      fr: "Un toit pour les journalistes exilés.",
      es: "Un techo para periodistas en el exilio.",
    },
    dek: {
      en: "Maison des Journalistes, Paris. Official site. Unpaid public-interest slot.",
      fr: "Maison des Journalistes, Paris. Site officiel. Pas une pub vendue.",
      es: "Maison des Journalistes, París. Sitio oficial.",
    },
    cta: { en: "Visit MdJ", fr: "Voir la MdJ", es: "Ver MdJ" },
  },
  {
    id: "forbidden",
    name: "Forbidden Stories",
    href: "https://forbiddenstories.org/",
    title: {
      en: "If they silence the reporter, the story continues.",
      fr: "S’ils font taire le reporter, l’enquête continue.",
      es: "Si silencian al reportero, la historia sigue.",
    },
    dek: {
      en: "Forbidden Stories. Consortium. Official site. Not a sold ad.",
      fr: "Forbidden Stories. Consortium. Site officiel. Pas une pub vendue.",
      es: "Forbidden Stories. Consorcio. Sitio oficial.",
    },
    cta: { en: "Visit Forbidden Stories", fr: "Voir Forbidden Stories", es: "Ver Forbidden Stories" },
  },
  {
    id: "unesco",
    name: "UNESCO",
    href: "https://www.unesco.org/en/world-press-freedom-day",
    hrefFr: "https://www.unesco.org/fr/world-press-freedom-day",
    title: {
      en: "World Press Freedom Day is every day’s job.",
      fr: "La liberté de la presse, ce n’est pas un jour férié.",
      es: "La libertad de prensa no es un día festivo.",
    },
    dek: {
      en: "UNESCO. World Press Freedom. Official site. Unpaid slot.",
      fr: "UNESCO. Liberté de la presse. Site officiel. Emplacement non vendu.",
      es: "UNESCO. Libertad de prensa. Sitio oficial.",
    },
    cta: { en: "Visit UNESCO", fr: "Voir l’UNESCO", es: "Ver UNESCO" },
  },
];

export function pressCopy(org: PressOrg, lang: Lang) {
  const key = lang === "fr" ? "fr" : lang === "es" ? "es" : "en";
  return {
    title: org.title[key],
    dek: org.dek[key],
    cta: org.cta[key],
    href: lang === "fr" ? org.hrefFr ?? org.href : org.href,
  };
}
