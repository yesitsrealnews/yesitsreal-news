/**
 * Search base for every revue de presse.
 * Agents: call `buildRevueSearchPlan(new Date())` before web_search / X search.
 * France is always heavy. Other clusters rotate so we don't hit the same
 * three US TV affiliates two days in a row.
 */

export type ClusterWeight = "always" | "rotate";

export type SiteCluster = {
  id: string;
  label: string;
  weight: ClusterWeight;
  /** Public hosts, no www. Used as `site:` operators. */
  sites: string[];
};

export type QueryPack = {
  beat: string;
  /** French keywords / phrases (no site:). */
  fr: string[];
  /** English / international keywords. */
  en: string[];
  /** Spanish-language desks (LatAm / Spain). */
  es?: string[];
  /** Portuguese-language desks (Brazil / Portugal). */
  pt?: string[];
};

export const SATIRE_SITE_EXCLUDE = [
  "theonion.com",
  "babylonbee.com",
  "legorafi.fr",
  "nordpresse.be",
  "waterfordwhispersnews.com",
  "dailymash.co.uk",
  "elmundotoday.com",
  "newsthump.com",
  "thepoke.co.uk",
];

/** Geographic desks. `always` = every revue. `rotate` = 2–3 per day. */
export const SITE_CLUSTERS: SiteCluster[] = [
  {
    id: "fr-pqr-ouest",
    label: "PQR Ouest",
    weight: "always",
    sites: [
      "ouest-france.fr",
      "letelegramme.fr",
      "sudouest.fr",
      "charentelibre.fr",
      "larepubliquedespyrenees.fr",
      "dordognelibre.fr",
      "lamanchelibre.fr",
      "tendanceouest.com",
      "paris-normandie.fr",
    ],
  },
  {
    id: "fr-pqr-nord-est",
    label: "PQR Nord / Est",
    weight: "always",
    sites: [
      "lavoixdunord.fr",
      "nordlittoral.fr",
      "courrier-picard.fr",
      "lunion.fr",
      "lardennais.fr",
      "leprogres.fr",
      "ledauphine.com",
      "estrepublicain.fr",
      "dna.fr",
      "lalsace.fr",
      "vosgesmatin.fr",
      "republicain-lorrain.fr",
      "bienpublic.com",
      "lejsl.com",
    ],
  },
  {
    id: "fr-pqr-sud-centre",
    label: "PQR Sud / Centre / Corse",
    weight: "always",
    sites: [
      "ladepeche.fr",
      "midilibre.fr",
      "lindependant.fr",
      "petitbleu.fr",
      "nicematin.com",
      "varmatin.com",
      "laprovence.com",
      "corsematin.com",
      "corsenetinfos.corsica",
      "lamontagne.fr",
      "lepopulaire.fr",
      "leberry.fr",
      "lyonne.fr",
      "lejdc.fr",
      "lanouvellerepublique.fr",
      "lechorepublicain.fr",
      "larep.fr",
      "leveil.fr",
    ],
  },
  {
    id: "fr-national-local",
    label: "FR national + locaux + municipal",
    weight: "always",
    sites: [
      "leparisien.fr",
      "20minutes.fr",
      "francetvinfo.fr",
      "france3-regions.franceinfo.fr",
      "ici.fr",
      "francebleu.fr",
      "actu.fr",
      "bfmtv.com",
      "lefigaro.fr",
      "maire-info.com",
      "lagazettedescommunes.com",
      "geipan.fr",
      "huffingtonpost.fr",
      "clicanoo.re",
      "tahiti-infos.com",
      "lnc.nc",
    ],
  },
  {
    id: "be-ch-qc",
    label: "Belgique / Suisse / Québec",
    weight: "always",
    sites: [
      "dhnet.be",
      "sudinfo.be",
      "rtbf.be",
      "lalibre.be",
      "lesoir.be",
      "lavenir.net",
      "hln.be",
      "nieuwsblad.be",
      "brusselstimes.com",
      "bx1.be",
      "blick.ch",
      "tdg.ch",
      "24heures.ch",
      "20min.ch",
      "lematin.ch",
      "letemps.ch",
      "rts.ch",
      "laliberte.ch",
      "lapresse.ca",
      "journaldemontreal.com",
      "journaldequebec.com",
      "ledevoir.com",
      "radio-canada.ca",
    ],
  },
  {
    id: "uk-ie",
    label: "UK / Irlande",
    weight: "rotate",
    sites: [
      "bbc.co.uk",
      "theguardian.com",
      "metro.co.uk",
      "walesonline.co.uk",
      "manchestereveningnews.co.uk",
      "liverpoolecho.co.uk",
      "birminghammail.co.uk",
      "scotsman.com",
      "dailyrecord.co.uk",
      "irishexaminer.com",
      "thejournal.ie",
      "rte.ie",
      "irishtimes.com",
      "belfasttelegraph.co.uk",
      "standard.co.uk",
    ],
  },
  {
    id: "us-local",
    label: "US locaux / odd desks",
    weight: "rotate",
    sites: [
      "nypost.com",
      "upi.com",
      "oregonlive.com",
      "seattletimes.com",
      "latimes.com",
      "wfla.com",
      "fox5sandiego.com",
      "fox13seattle.com",
      "wtvr.com",
      "wral.com",
      "nbcmiami.com",
      "fox8.com",
      "cleveland19.com",
      "nbcnewyork.com",
      "sandiegouniontribune.com",
      "miamiherald.com",
      "tampabay.com",
      "nola.com",
      "ajc.com",
      "denverpost.com",
      "houstonchronicle.com",
      "dallasnews.com",
      "orlandosentinel.com",
      "azcentral.com",
      "startribune.com",
      "al.com",
    ],
  },
  {
    id: "iberia-pt",
    label: "Espagne / Portugal",
    weight: "rotate",
    sites: [
      "elpais.com",
      "elmundo.es",
      "abc.es",
      "lavanguardia.com",
      "20minutos.es",
      "eldiario.es",
      "elcorreo.com",
      "lavozdegalicia.es",
      "heraldo.es",
      "publico.pt",
      "jn.pt",
      "observador.pt",
      "cmjornal.pt",
    ],
  },
  {
    id: "it-dach-nl",
    label: "Italie / DACH / Pays-Bas",
    weight: "rotate",
    sites: [
      "repubblica.it",
      "corriere.it",
      "ansa.it",
      "lastampa.it",
      "ilmessaggero.it",
      "ilmattino.it",
      "spiegel.de",
      "sueddeutsche.de",
      "faz.net",
      "derstandard.at",
      "orf.at",
      "krone.at",
      "ad.nl",
      "nos.nl",
      "hln.be",
    ],
  },
  {
    id: "nordics",
    label: "Nordiques",
    weight: "rotate",
    sites: [
      "aftenposten.no",
      "nrk.no",
      "vg.no",
      "yle.fi",
      "hs.fi",
      "aftonbladet.se",
      "dn.se",
      "politiken.dk",
      "mbl.is",
    ],
  },
  {
    id: "latam",
    label: "Amérique latine",
    weight: "rotate",
    sites: [
      "g1.globo.com",
      "folha.uol.com.br",
      "clarin.com",
      "lanacion.com.ar",
      "eltiempo.com",
      "eluniversal.com.mx",
      "reforma.com",
      "infobae.com",
      "elespectador.com",
      "eluniverso.com",
      "elpais.com.uy",
      "latercera.com",
      "metropoles.com",
      "estadao.com.br",
    ],
  },
  {
    id: "asia",
    label: "Asie",
    weight: "rotate",
    sites: [
      "japantimes.co.jp",
      "asahi.com",
      "nhk.or.jp",
      "straitstimes.com",
      "bangkokpost.com",
      "nationthailand.com",
      "kompas.com",
      "thejakartapost.com",
      "inquirer.net",
      "koreaherald.com",
      "timesofindia.indiatimes.com",
      "scmp.com",
      "hongkongfp.com",
      "taipeitimes.com",
      "mothership.sg",
      "channelnewsasia.com",
      "rappler.com",
      "thehindu.com",
      "vnexpress.net",
      "koreatimes.co.kr",
      "soranews24.com",
      "japantoday.com",
    ],
  },
  {
    id: "africa-maghreb",
    label: "Afrique / Maghreb",
    weight: "rotate",
    sites: [
      "jeuneafrique.com",
      "rfi.fr",
      "france24.com",
      "punchng.com",
      "telquel.ma",
      "le360.ma",
      "tsa-algerie.com",
      "hespress.com",
      "kapitalis.com",
      "lefaso.net",
      "seneweb.com",
      "nation.africa",
      "standardmedia.co.ke",
      "vanguardngr.com",
      "dailymaverick.co.za",
      "citizen.co.za",
      "mg.co.za",
    ],
  },
  {
    id: "aus-nz",
    label: "Australie / Nouvelle-Zélande",
    weight: "rotate",
    sites: [
      "abc.net.au",
      "smh.com.au",
      "theage.com.au",
      "news.com.au",
      "stuff.co.nz",
      "nzherald.co.nz",
      "odt.co.nz",
    ],
  },
  {
    id: "science-inst",
    label: "Science / institutions",
    weight: "rotate",
    sites: [
      "sciencealert.com",
      "sciencenews.org",
      "phys.org",
      "improbable.com",
      "theconversation.com",
      "nature.com",
      "geipan.fr",
      "maire-info.com",
    ],
  },
];

export const QUERY_PACKS: QueryPack[] = [
  {
    beat: "animaux",
    fr: [
      "insolite animal mairie OR tribunal OR métro OR piscine OR supermarché",
      "sanglier OR sangliers OR renard OR blaireau dans (magasin OR école OR commissariat OR piscine)",
      "coq OR poule OR canard voisinage plainte",
      "serpent OR python OR iguane OR caïman capturé (appartement OR jardin OR égout)",
      "intrusion animal (mairie OR tribunal OR hôpital OR stade)",
    ],
    en: [
      "animal (mall OR school OR courthouse OR subway OR pool) (intrusion OR found OR captured)",
      "bobcat OR coyote OR raccoon OR kangaroo (store OR school OR office)",
      "snake OR python OR caiman (apartment OR toilet OR garden) captured",
      "rooster OR chicken neighbor complaint noise",
    ],
    es: [
      "animal (centro comercial OR colegio OR metro OR piscina) (intrusión OR capturado)",
      "gallo OR gallina OR capibara OR carpincho OR serpiente vecino",
    ],
    pt: [
      "animal (shopping OR escola OR metrô) (invadiu OR capturado)",
      "galo OR capivara OR jacaré OR cobra vizinho",
    ],
  },
  {
    beat: "voisin",
    fr: [
      "guerre de voisin (haie OR clôture OR aboiement OR tondeuse OR barbecue)",
      "copropriété syndic (coq OR chien OR nain de jardin) plainte",
      "nuisances sonores voisinage tribunal OR maire",
    ],
    en: [
      "HOA (gnome OR rooster OR lawn OR fence) dispute",
      "noisy neighbor (chicken OR dog OR hedge) court OR council",
    ],
    es: ["vecino (gallo OR perro OR gnomo) denuncia OR pelea"],
    pt: ["vizinho (galo OR cachorro) briga OR prefeitura"],
  },
  {
    beat: "municipal",
    fr: [
      "arrêté municipal interdit (tondre OR nourrir OR fumer OR marcher OR chanter)",
      "conseil municipal vote (absurde OR insolite OR bizarre) arrêté",
      "maire interdit (nains de jardin OR drapeaux OR poules OR sèche-linge)",
    ],
    en: [
      "town council bans (lawn OR chickens OR garden gnomes OR flags)",
      "bylaw OR ordinance (ridiculous OR bizarre) mayor",
    ],
    es: ["ordenanza municipal prohíbe (césped OR gallinas OR gnomos)"],
    pt: ["prefeitura proíbe (galinha OR gnomo OR capivara)"],
  },
  {
    beat: "travaux",
    fr: [
      "chantier raté (giratoire OR rond-point OR piste cyclable OR lampadaire)",
      "nid-de-poule OR panneau à l'envers OR route peinte",
      "mise à l'eau bateau (coule OR remorque OR cale)",
    ],
    en: [
      "boat launch (sinks OR trailer OR ramp) fail",
      "roundabout OR pothole OR upside-down sign council",
    ],
  },
  {
    beat: "vol-bizarre",
    fr: [
      "voleur (nain de jardin OR culottes OR fromage OR canard OR gnome)",
      "vol insolite (casserole OR mannequin OR tracteur OR sandwich)",
    ],
    en: [
      "stolen (garden gnome OR underwear OR cheese OR lawn ornament)",
      "thief steals (unusual OR bizarre) (statue OR sandwich OR tractor)",
    ],
  },
  {
    beat: "ovni",
    fr: [
      "OVNI signalé (gendarmerie OR police OR préfecture OR GEIPAN)",
      "soucoupe OR ovni (aéroport OR commissariat) témoignage",
    ],
    en: [
      "UFO (police OR airport OR sheriff) report",
      "unidentified aerial (local news OR blotter)",
    ],
  },
  {
    beat: "tribunal",
    fr: [
      "plainte contre (extraterrestre OR pigeon OR arbre OR GPS OR chatbot)",
      "divorce (poisson rouge OR chien OR chat) tribunal",
      "procès absurde (voisin OR syndic OR maire) jugement",
    ],
    en: [
      "sues (city OR neighbor OR tree OR pigeon OR alien)",
      "court (goldfish OR dog custody OR HOA) bizarre",
    ],
  },
  {
    beat: "fetish",
    fr: [
      "voleur de culottes OR sous-vêtements (adulte OR commissariat) -mineur",
      "sex-toy (bagarre OR altercation OR tribunal) adulte",
    ],
    en: [
      "underwear thief (adult) police -teen -child",
      "sex toy (fight OR court) adult bizarre",
    ],
  },
  {
    beat: "science",
    fr: [
      "Ig Nobel OR recherche improbable",
      "étude absurde (imprimante OR canard OR fromage) scientifique",
    ],
    en: [
      "Ig Nobel prize",
      "improbable research (study OR paper) funny",
    ],
  },
];

const EXCLUDE_TAIL = SATIRE_SITE_EXCLUDE.map((d) => `-site:${d}`).join(" ");

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(d: Date, n: number): Date {
  return new Date(d.getTime() - n * 86400000);
}

function dayIndex(d: Date): number {
  return Math.floor(d.getTime() / 86400000);
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function siteClause(sites: string[]): string {
  return `(${sites.map((s) => `site:${s}`).join(" OR ")})`;
}

export function alwaysClusters(): SiteCluster[] {
  return SITE_CLUSTERS.filter((c) => c.weight === "always");
}

export function rotateClusters(when: Date, take = 5): SiteCluster[] {
  const rot = SITE_CLUSTERS.filter((c) => c.weight === "rotate");
  const start = dayIndex(when) % rot.length;
  const ordered = [...rot.slice(start), ...rot.slice(0, start)];
  return ordered.slice(0, take);
}

export type RevueSearchPlan = {
  date: string;
  after: string;
  clusters: string[];
  queries: string[];
  xQueries: string[];
};

const FR_NEWSROOM_X = [
  "OuestFrance",
  "leTelegramme",
  "SudOuest",
  "ladepechedumidi",
  "midilibre",
  "LeProgres",
  "ledauphine",
  "EstRepublicain",
  "lavoixdunord",
  "nicematin",
  "LaProvence",
  "le_Parisien",
  "20Minutes",
  "franceinfo",
  "francebleu",
  "dhbe",
  "sudinfo",
  "rtbf",
];

function packForDay(when: Date): QueryPack[] {
  const start = dayIndex(when) % QUERY_PACKS.length;
  const ordered = [...QUERY_PACKS.slice(start), ...QUERY_PACKS.slice(0, start)];
  return ordered;
}

export function buildRevueSearchPlan(when: Date = new Date()): RevueSearchPlan {
  const after = ymd(daysAgo(when, 10));
  const date = ymd(when);
  const always = alwaysClusters();
  const rotated = rotateClusters(when, 5);
  const selected = [...always, ...rotated];
  const packs = packForDay(when);
  const queries: string[] = [];

  // France-wide, no site: — catches PQR titles the allowlist already trusts.
  for (const pack of packs.slice(0, 5)) {
    const q = pack.fr[0];
    if (q) queries.push(`${q} (faits-divers OR insolite) after:${after} ${EXCLUDE_TAIL}`);
  }

  // Open world queries — no site: so we catch papers the allowlist missed.
  queries.push(
    `(monkey OR macaque OR "wild boar" OR python) (mall OR school OR subway OR temple) (Tokyo OR Osaka OR Bangkok OR Jakarta OR Manila OR Mumbai OR Seoul) after:${after} ${EXCLUDE_TAIL}`,
    `(capivara OR capybara OR jacaré OR "carpincho" OR gallo) (insólito OR bizarro OR extraño) after:${after} ${EXCLUDE_TAIL}`,
    `(baboon OR python OR monkey OR goat) ("Cape Town" OR Lagos OR Nairobi OR Accra OR Johannesburg) (police OR market) after:${after} ${EXCLUDE_TAIL}`,
    `(raccoon OR python OR alligator OR rooster OR "garden gnome") (Florida OR Texas OR Ohio OR "New York") (police OR HOA) after:${after} ${EXCLUDE_TAIL}`,
    `(Wildschwein OR Waschbär OR cinghiale OR jabalí) (Stadt OR città OR ciudad OR Nachbar) after:${after} ${EXCLUDE_TAIL}`,
  );

  // Cluster × beat, sites chunked (search engines cap OR lists).
  for (const cluster of selected) {
    const pack = packs[selected.indexOf(cluster) % packs.length]!;
    const lang =
      cluster.id === "latam" || cluster.id === "iberia-pt"
        ? pack.es ?? pack.pt ?? pack.en
        : cluster.id.startsWith("fr") || cluster.id === "be-ch-qc"
          ? pack.fr
          : pack.en;
    const phrase = lang[dayIndex(when) % lang.length] ?? lang[0]!;
    for (const group of chunk(cluster.sites, 8)) {
      queries.push(`${phrase} ${siteClause(group)} after:${after} ${EXCLUDE_TAIL}`);
    }
  }

  // One extra FR municipal / GEIPAN pass every run.
  queries.push(
    `(arrêté municipal OR GEIPAN OR "conseil municipal") (insolite OR interdit) after:${after} (site:maire-info.com OR site:geipan.fr OR site:actu.fr OR site:ladepeche.fr) ${EXCLUDE_TAIL}`,
  );

  const xQueries = [
    `(${FR_NEWSROOM_X.slice(0, 8).map((h) => `from:${h}`).join(" OR ")}) (insolite OR faits-divers OR animal OR coq OR sanglier)`,
    `(${FR_NEWSROOM_X.slice(8).map((h) => `from:${h}`).join(" OR ")}) (insolite OR arrêté OR voisin OR vol)`,
  ];

  return {
    date,
    after,
    clusters: selected.map((c) => c.id),
    queries,
    xQueries,
  };
}

export function allRevueSites(): string[] {
  return [...new Set(SITE_CLUSTERS.flatMap((c) => c.sites))].sort((a, b) => a.localeCompare(b));
}
