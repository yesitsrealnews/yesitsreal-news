import type { Lang } from "@/lib/types";

/** Public-interest inventory. House cards + official URLs. Campaign visuals only when the org put them out to relay. */
export type PressOrg = {
  id: string;
  name: string;
  href: string;
  hrefFr?: string;
  title: Record<"en" | "fr" | "es", string>;
  dek: Record<"en" | "fr" | "es", string>;
  cta: Record<"en" | "fr" | "es", string>;
};

export type PressCampaign = {
  id: string;
  partner: string;
  href: string;
  hrefFr?: string;
  image?: string;
  credit: string;
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
    hrefFr: "https://forbiddenstories.org/fr/",
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

/** Campaigns the orgs published for newsrooms to relay. Official donate/campaign URLs. */
export const PRESS_CAMPAIGNS: PressCampaign[] = [
  {
    id: "rsf-km-1",
    partner: "Reporters sans frontières",
    href: "https://donate.rsf.org/",
    hrefFr: "https://donate.rsf.org/?lang=fr_FR",
    image: "/ads/press/rsf-km-1.webp",
    credit: "RSF / The Good Company — campagne « Les Kilomètres ». Visuels mis à disposition par RSF.",
    title: {
      en: "A journalist imprisoned 8,047 km away.",
      fr: "Un journaliste emprisonné à 8 047 km.",
      es: "Un periodista preso a 8.047 km.",
    },
    dek: {
      en: "RSF campaign “Kilometres”. Official visual, meant to be relayed. Donate on their site.",
      fr: "Campagne RSF « Les Kilomètres ». Visuel officiel, à relayer. Don sur leur site.",
      es: "Campaña RSF « Kilómetros ». Visual oficial, para retransmitir.",
    },
    cta: { en: "Donate to RSF", fr: "Faire un don à RSF", es: "Donar a RSF" },
  },
  {
    id: "rsf-km-2",
    partner: "Reporters sans frontières",
    href: "https://donate.rsf.org/",
    hrefFr: "https://donate.rsf.org/?lang=fr_FR",
    image: "/ads/press/rsf-km-2.webp",
    credit: "RSF / The Good Company — campagne « Les Kilomètres ». Visuels mis à disposition par RSF.",
    title: {
      en: "A journalist held hostage 8,047 km away.",
      fr: "Un journaliste otage à 8 047 km.",
      es: "Un periodista rehén a 8.047 km.",
    },
    dek: {
      en: "RSF campaign “Kilometres”. Official visual, meant to be relayed. Donate on their site.",
      fr: "Campagne RSF « Les Kilomètres ». Visuel officiel, à relayer. Don sur leur site.",
      es: "Campaña RSF « Kilómetros ». Visual oficial, para retransmitir.",
    },
    cta: { en: "Donate to RSF", fr: "Faire un don à RSF", es: "Donar a RSF" },
  },
  {
    id: "fs-kill",
    partner: "Forbidden Stories",
    href: "https://forbiddenstories.org/donate/",
    hrefFr: "https://forbiddenstories.org/fr/don/",
    credit: "Forbidden Stories — slogan de campagne publié, à relayer. Pas leurs affiches métro.",
    title: {
      en: "Killing the journalist won’t kill the story.",
      fr: "Tuer le messager ne tuera pas le message.",
      es: "Matar al periodista no matará la historia.",
    },
    dek: {
      en: "Their public campaign line. Donate on the official page. Not a sold ad.",
      fr: "Leur accroche de campagne. Don sur la page officielle. Pas une pub vendue.",
      es: "Su eslogan de campaña. Donación en la página oficial.",
    },
    cta: { en: "Donate", fr: "Faire un don", es: "Donar" },
  },
  {
    id: "wnd",
    partner: "World News Day",
    href: "https://worldnewsday.org/",
    credit: "World News Day / WAN-IFRA — les newsrooms sont invitées à relayer le slogan. Pas un fundraiser.",
    title: {
      en: "Know the facts. Understand what matters. Choose trusted journalism.",
      fr: "Les faits. Ce qui compte. Le journalisme de confiance. C’est votre droit de savoir.",
      es: "Los hechos. Lo que importa. El periodismo de confianza.",
    },
    dek: {
      en: "World News Day, 28 September. A newsroom campaign. Official site.",
      fr: "World News Day, 28 septembre. Campagne des newsrooms. Site officiel.",
      es: "World News Day, 28 de septiembre. Campaña de redacciones. Sitio oficial.",
    },
    cta: { en: "worldnewsday.org", fr: "worldnewsday.org", es: "worldnewsday.org" },
  },
  {
    id: "cpj-give",
    partner: "Committee to Protect Journalists",
    href: "https://cpj.org/donate/",
    credit: "CPJ — appel à don officiel. Pas de kit bannière public ; carte maison.",
    title: {
      en: "Press freedom is your freedom.",
      fr: "La liberté de la presse, c’est la vôtre.",
      es: "La libertad de prensa es tu libertad.",
    },
    dek: {
      en: "CPJ’s line. Donate on their official page. Not a sold ad.",
      fr: "Leur formule. Don sur la page officielle. Pas une pub vendue.",
      es: "Su lema. Donación en la página oficial.",
    },
    cta: { en: "Donate to CPJ", fr: "Faire un don au CPJ", es: "Donar a CPJ" },
  },
];

function loc<T extends Record<"en" | "fr" | "es", string>>(pack: T, lang: Lang) {
  return lang === "fr" ? pack.fr : lang === "es" ? pack.es : pack.en;
}

export function pressCopy(org: PressOrg, lang: Lang) {
  return {
    title: loc(org.title, lang),
    dek: loc(org.dek, lang),
    cta: loc(org.cta, lang),
    href: lang === "fr" ? org.hrefFr ?? org.href : org.href,
  };
}

export function campaignCopy(c: PressCampaign, lang: Lang) {
  return {
    title: loc(c.title, lang),
    dek: loc(c.dek, lang),
    cta: loc(c.cta, lang),
    href: lang === "fr" ? c.hrefFr ?? c.href : c.href,
  };
}
