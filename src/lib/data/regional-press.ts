/** French regional daily press (PQR) + related regional desks for allowlist / search. */

export type RegionalSource = {
  name: string;
  domain: string;
  region: string;
  group?: string;
  rss?: string;
};

/** Comprehensive PQR / locaux + useful regional desks. Domains are public hosts (no www). */
export const REGIONAL_PRESS: RegionalSource[] = [
  // --- SIPA Ouest-France ---
  {
    name: "Ouest-France",
    domain: "ouest-france.fr",
    region: "Bretagne / Pays de la Loire / Normandie",
    group: "SIPA Ouest-France",
    rss: "https://www.ouest-france.fr/rss/une",
  },
  {
    name: "Presse Océan",
    domain: "ouest-france.fr",
    region: "Pays de la Loire",
    group: "SIPA Ouest-France",
  },
  {
    name: "Le Courrier de l'Ouest",
    domain: "ouest-france.fr",
    region: "Pays de la Loire",
    group: "SIPA Ouest-France",
  },
  {
    name: "Le Maine Libre",
    domain: "ouest-france.fr",
    region: "Pays de la Loire",
    group: "SIPA Ouest-France",
  },
  {
    name: "La Presse de la Manche",
    domain: "lpressenormandie.fr",
    region: "Normandie",
    group: "SIPA Ouest-France",
  },
  {
    name: "actu.fr",
    domain: "actu.fr",
    region: "National (réseau local)",
    group: "Groupe Actu / SIPA",
  },

  // --- Le Télégramme ---
  {
    name: "Le Télégramme",
    domain: "letelegramme.fr",
    region: "Bretagne",
    group: "Le Télégramme",
  },

  // --- Groupe Sud Ouest ---
  {
    name: "Sud Ouest",
    domain: "sudouest.fr",
    region: "Nouvelle-Aquitaine",
    group: "Sud Ouest",
  },
  {
    name: "La Charente Libre",
    domain: "charentelibre.fr",
    region: "Nouvelle-Aquitaine",
    group: "Sud Ouest",
  },
  {
    name: "La République des Pyrénées",
    domain: "larepubliquedespyrenees.fr",
    region: "Nouvelle-Aquitaine",
    group: "Sud Ouest",
  },
  {
    name: "Dordogne Libre",
    domain: "dordognelibre.fr",
    region: "Nouvelle-Aquitaine",
    group: "Sud Ouest",
  },
  {
    name: "L'Éclair des Pyrénées",
    domain: "larepubliquedespyrenees.fr",
    region: "Nouvelle-Aquitaine",
    group: "Sud Ouest",
  },

  // --- Rossel La Voix ---
  {
    name: "La Voix du Nord",
    domain: "lavoixdunord.fr",
    region: "Hauts-de-France",
    group: "Rossel",
  },
  {
    name: "Nord Éclair",
    domain: "nordeclair.fr",
    region: "Hauts-de-France",
    group: "Rossel",
  },
  {
    name: "Nord Littoral",
    domain: "nordlittoral.fr",
    region: "Hauts-de-France",
    group: "Rossel",
  },
  {
    name: "Courrier Picard",
    domain: "courrier-picard.fr",
    region: "Hauts-de-France",
    group: "Rossel",
  },
  {
    name: "Paris-Normandie",
    domain: "paris-normandie.fr",
    region: "Normandie",
    group: "Rossel",
  },
  {
    name: "Le Havre Presse",
    domain: "paris-normandie.fr",
    region: "Normandie",
    group: "Rossel",
  },
  {
    name: "L'Union",
    domain: "lunion.fr",
    region: "Grand Est",
    group: "Rossel",
  },
  {
    name: "L'Ardennais",
    domain: "lardennais.fr",
    region: "Grand Est",
    group: "Rossel",
  },
  {
    name: "L'Est Éclair",
    domain: "lest-eclair.fr",
    region: "Grand Est",
    group: "Rossel",
  },
  {
    name: "Libération Champagne",
    domain: "liberation-champagne.fr",
    region: "Grand Est",
    group: "Rossel",
  },

  // --- La Nouvelle République ---
  {
    name: "La Nouvelle République",
    domain: "lanouvellerepublique.fr",
    region: "Centre-Val de Loire / Nouvelle-Aquitaine",
    group: "La Nouvelle République",
  },
  {
    name: "Centre Presse (Vienne)",
    domain: "centre-presse.fr",
    region: "Nouvelle-Aquitaine",
    group: "La Nouvelle République",
  },

  // --- Groupe La Dépêche ---
  {
    name: "La Dépêche du Midi",
    domain: "ladepeche.fr",
    region: "Occitanie",
    group: "La Dépêche",
  },
  {
    name: "Midi Libre",
    domain: "midilibre.fr",
    region: "Occitanie",
    group: "La Dépêche",
  },
  {
    name: "L'Indépendant",
    domain: "lindependant.fr",
    region: "Occitanie",
    group: "La Dépêche",
  },
  {
    name: "Le Petit Bleu",
    domain: "petitbleu.fr",
    region: "Nouvelle-Aquitaine",
    group: "La Dépêche",
  },
  {
    name: "Petit Bleu Lot-et-Garonne",
    domain: "petitbleu.fr",
    region: "Nouvelle-Aquitaine",
    group: "La Dépêche",
  },
  {
    name: "La Nouvelle République des Pyrénées",
    domain: "nrpyrenees.fr",
    region: "Occitanie",
    group: "La Dépêche",
  },
  {
    name: "Centre Presse (Aveyron)",
    domain: "centrepresseaveyron.fr",
    region: "Occitanie",
    group: "La Dépêche",
  },

  // --- Centre France ---
  {
    name: "La Montagne",
    domain: "lamontagne.fr",
    region: "Auvergne-Rhône-Alpes",
    group: "Centre France",
  },
  {
    name: "Le Populaire du Centre",
    domain: "lepopulaire.fr",
    region: "Nouvelle-Aquitaine",
    group: "Centre France",
  },
  {
    name: "L'Yonne Républicaine",
    domain: "lyonne.fr",
    region: "Bourgogne-Franche-Comté",
    group: "Centre France",
  },
  {
    name: "Le Berry Républicain",
    domain: "leberry.fr",
    region: "Centre-Val de Loire",
    group: "Centre France",
  },
  {
    name: "Journal du Centre",
    domain: "lejdc.fr",
    region: "Bourgogne-Franche-Comté",
    group: "Centre France",
  },
  {
    name: "La République du Centre",
    domain: "larep.fr",
    region: "Centre-Val de Loire",
    group: "Centre France",
  },
  {
    name: "L'Écho Républicain",
    domain: "lechorepublicain.fr",
    region: "Centre-Val de Loire",
    group: "Centre France",
  },
  {
    name: "L'Éveil de la Haute-Loire",
    domain: "leveil.fr",
    region: "Auvergne-Rhône-Alpes",
    group: "Centre France",
  },
  {
    name: "Le Pays",
    domain: "le-pays.fr",
    region: "Bourgogne-Franche-Comté",
    group: "Centre France",
  },

  // --- EBRA ---
  {
    name: "Le Progrès",
    domain: "leprogres.fr",
    region: "Auvergne-Rhône-Alpes",
    group: "EBRA",
  },
  {
    name: "Le Dauphiné Libéré",
    domain: "ledauphine.com",
    region: "Auvergne-Rhône-Alpes",
    group: "EBRA",
  },
  {
    name: "Le Bien Public",
    domain: "bienpublic.com",
    region: "Bourgogne-Franche-Comté",
    group: "EBRA",
  },
  {
    name: "Vosges Matin",
    domain: "vosgesmatin.fr",
    region: "Grand Est",
    group: "EBRA",
  },
  {
    name: "L'Alsace",
    domain: "lalsace.fr",
    region: "Grand Est",
    group: "EBRA",
  },
  {
    name: "DNA",
    domain: "dna.fr",
    region: "Grand Est",
    group: "EBRA",
  },
  {
    name: "L'Est Républicain",
    domain: "estrepublicain.fr",
    region: "Grand Est",
    group: "EBRA",
  },
  {
    name: "Le Républicain Lorrain",
    domain: "republicain-lorrain.fr",
    region: "Grand Est",
    group: "EBRA",
  },
  {
    name: "Le Journal de Saône-et-Loire",
    domain: "lejsl.com",
    region: "Bourgogne-Franche-Comté",
    group: "EBRA",
  },
  {
    name: "Le Journal de la Haute-Marne",
    domain: "jhm.fr",
    region: "Grand Est",
    group: "EBRA",
  },

  // --- Nice-Matin Groupe ---
  {
    name: "Nice-Matin",
    domain: "nicematin.com",
    region: "Provence-Alpes-Côte d'Azur",
    group: "Nice-Matin Groupe",
  },
  {
    name: "Var-Matin",
    domain: "varmatin.com",
    region: "Provence-Alpes-Côte d'Azur",
    group: "Nice-Matin Groupe",
  },
  {
    name: "Monaco-Matin",
    domain: "monacomatin.mc",
    region: "Monaco",
    group: "Nice-Matin Groupe",
  },

  // --- Méditerranée / Corse ---
  {
    name: "La Provence",
    domain: "laprovence.com",
    region: "Provence-Alpes-Côte d'Azur",
    group: "La Provence",
  },
  {
    name: "La Marseillaise",
    domain: "lamarseillaise.fr",
    region: "Provence-Alpes-Côte d'Azur",
    group: "La Marseillaise",
  },
  {
    name: "Corse-Matin",
    domain: "corsematin.com",
    region: "Corse",
    group: "Corse-Matin",
  },

  // --- France 3 régions desk ---
  {
    name: "France 3 Régions",
    domain: "france3-regions.franceinfo.fr",
    region: "National (régions)",
    group: "France Télévisions",
  },
];

/** Unique regional domains, lowercase, without www. */
export const REGIONAL_PRESS_DOMAINS: string[] = [
  ...new Set(
    REGIONAL_PRESS.map((s) => s.domain.toLowerCase().replace(/^www\./, "")),
  ),
].sort((a, b) => a.localeCompare(b));

/** National wires / desks useful alongside PQR (not in REGIONAL_PRESS). */
export const NATIONAL_DESK_DOMAINS: string[] = [
  "afp.com",
  "reuters.com",
  "apnews.com",
  "franceinfo.fr",
  "francetvinfo.fr",
  "lemonde.fr",
  "liberation.fr",
  "lefigaro.fr",
  "20minutes.fr",
  "leparisien.fr",
].sort((a, b) => a.localeCompare(b));

/** Real satire / spoof hosts to keep out of the desk allowlist. */
export const DEFAULT_DENY_DOMAINS: string[] = [
  "theonion.com",
  "babylonbee.com",
  "clickhole.com",
  "waterfordwhispersnews.com",
  "legorafi.fr",
  "nordpresse.be",
  "dailymash.co.uk",
  "elmundotoday.com",
  "worldnewsdailyreport.com",
  "huzlers.com",
  "empirenews.net",
  "newsbiscuit.com",
  "thespoof.com",
  "fakingnews.com",
].sort((a, b) => a.localeCompare(b));

function hostFrom(urlOrHost: string): string {
  const raw = urlOrHost.trim().toLowerCase();
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProto).hostname.replace(/^www\./, "");
  } catch {
    return raw.replace(/^www\./, "").split("/")[0] ?? raw;
  }
}

const PREFERRED_SUFFIXES = [
  ...new Set([...REGIONAL_PRESS_DOMAINS, ...NATIONAL_DESK_DOMAINS]),
];

/** True if host ends with a regional PQR domain or a national desk wire. */
export function isPreferredNewsDomain(urlOrHost: string): boolean {
  const host = hostFrom(urlOrHost);
  if (!host) return false;
  return PREFERRED_SUFFIXES.some(
    (d) => host === d || host.endsWith(`.${d}`),
  );
}
