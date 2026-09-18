import type { Source } from "@/lib/types";

/**
 * Official newsroom X handles, keyed by registrable host (no www).
 * Never invent reporter handles. Unknown host → null.
 */
export const NEWSROOM_X: Record<string, string> = {
  // FR — PQR
  "ouest-france.fr": "OuestFrance",
  "sudouest.fr": "SudOuest",
  "letelegramme.fr": "leTelegramme",
  "ladepeche.fr": "ladepechedumidi",
  "midilibre.fr": "midilibre",
  "lindependant.fr": "lindependant",
  "charentelibre.fr": "charentelibre",
  "leprogres.fr": "LeProgres",
  "ledauphine.com": "ledauphine",
  "estrepublicain.fr": "EstRepublicain",
  "vosgesmatin.fr": "VosgesMatin",
  "lalsace.fr": "lalsace",
  "dna.fr": "dnafr",
  "republicain-lorrain.fr": "republicain",
  "bienpublic.com": "LeBienPublic",
  "lejsl.com": "lejsl",
  "nicematin.com": "nicematin",
  "varmatin.com": "varmatin",
  "monacomatin.mc": "MonacoMatin",
  "lavoixdunord.fr": "lavoixdunord",
  "nordeclair.fr": "lavoixdunord",
  "nordlittoral.fr": "NordLittoral",
  "courrier-picard.fr": "courrierpicard",
  "lunion.fr": "lunion",
  "lardennais.fr": "lardennais",
  "paris-normandie.fr": "ParisNormandie",
  "larepubliquedespyrenees.fr": "LaRepDesPy",
  "actu.fr": "actudotfr",
  "laprovence.com": "LaProvence",
  "leparisien.fr": "le_Parisien",
  "20minutes.fr": "20Minutes",
  // FR — national / broadcast
  "lemonde.fr": "lemondefr",
  "liberation.fr": "libe",
  "lefigaro.fr": "Le_Figaro",
  "francetvinfo.fr": "franceinfo",
  "franceinfo.fr": "franceinfo",
  "france3-regions.franceinfo.fr": "France3tv",
  "ici.fr": "francebleu",
  "francebleu.fr": "francebleu",
  "france24.com": "France24_fr",
  "rfi.fr": "RFI",
  "radiofrance.fr": "franceinter",
  "franceinter.fr": "franceinter",
  "nouvelobs.com": "lobs",
  "lexpress.fr": "lexpress",
  "lepoint.fr": "LePoint",
  "mediapart.fr": "Mediapart",
  "europe1.fr": "Europe1",
  "cnews.fr": "CNEWS",
  "bfmtv.com": "BFMTV",
  "streetpress.com": "StreetPress",
  "bondyblog.fr": "BondyBlog",
  "afp.com": "afpfr",
  "afp.fr": "afpfr",
  // Francophonie
  "lapresse.ca": "lp_lapresse",
  "radio-canada.ca": "RadioCanadaInfo",
  "ledevoir.com": "LeDevoir",
  "journaldemontreal.com": "journaldemtl",
  "journaldequebec.com": "journaldequebec",
  "lesoir.be": "lesoir",
  "lalibre.be": "lalibrebe",
  "dhnet.be": "dhbe",
  "sudinfo.be": "sudinfo",
  "rtbf.be": "rtbf",
  "letemps.ch": "LeTemps",
  "blick.ch": "Blickch",
  // UK / IE
  "bbc.co.uk": "BBCNews",
  "bbc.com": "BBCNews",
  "theguardian.com": "guardian",
  "independent.co.uk": "Independent",
  "telegraph.co.uk": "Telegraph",
  "standard.co.uk": "standardnews",
  "scotsman.com": "TheScotsman",
  "walesonline.co.uk": "WalesOnline",
  "manchestereveningnews.co.uk": "MENnewsdesk",
  "liverpoolecho.co.uk": "LivEchonews",
  "birminghammail.co.uk": "birminghammail",
  "thejournal.ie": "thejournal_ie",
  "rte.ie": "rte",
  // US
  "nytimes.com": "nytimes",
  "latimes.com": "latimes",
  "npr.org": "NPR",
  "nypost.com": "nypost",
  "washingtonpost.com": "washingtonpost",
  "reuters.com": "Reuters",
  "apnews.com": "AP",
  "cnn.com": "CNN",
  "nbcnews.com": "NBCNews",
  "abcnews.go.com": "ABC",
  "cbsnews.com": "CBSNews",
  "usatoday.com": "USATODAY",
  "oregonlive.com": "Oregonian",
  "upi.com": "UPI",
  "foxnews.com": "FoxNews",
  "fox5sandiego.com": "fox5sandiego",
  "nbcsandiego.com": "NBC7SanDiego",
  "seattletimes.com": "seattletimes",
  "fox13seattle.com": "fox13seattle",
  "geekwire.com": "geekwire",
  "fox8.com": "FOX8News",
  "cleveland19.com": "cleveland19",
  "nbcnewyork.com": "NBCNewYork",
  "newsweek.com": "Newsweek",
  "scientificamerican.com": "sciam",
  "chemistryworld.com": "ChemistryWorld",
  "japantimes.co.jp": "japantimes",
  "irishtimes.com": "IrishTimes",
  "itv.com": "ITV",
  // ES / IT / DE / NL
  "elpais.com": "el_pais",
  "elmundo.es": "elmundoes",
  "abc.es": "abc_es",
  "lavanguardia.com": "LaVanguardia",
  "20minutos.es": "20m",
  "repubblica.it": "repubblica",
  "corriere.it": "Corriere",
  "ansa.it": "Agenzia_Ansa",
  "lastampa.it": "LaStampa",
  "tg24.sky.it": "SkyTG24",
  "sky.it": "SkyTG24",
  "dw.com": "dwnews",
  "spiegel.de": "DerSPIEGEL",
  "zeit.de": "zeitonline",
  "sueddeutsche.de": "SZ",
  "faz.net": "faznet",
  "ad.nl": "ADnl",
  "hln.be": "hlnbe",
  "brusselstimes.com": "BrusselsTimes",
  "vtm.be": "VTMNIEUWS",
  // World
  "abc.net.au": "abcnews",
  "smh.com.au": "smh",
  "stuff.co.nz": "Stuff_NZ",
  "timesofindia.indiatimes.com": "timesofindia",
  "indiatoday.in": "IndiaToday",
  "g1.globo.com": "g1",
  "globo.com": "g1",
  "folha.uol.com.br": "folha",
  "clarin.com": "clarincom",
  "lanacion.com.ar": "LANACION",
  "aftenposten.no": "aftenposten",
  "nrk.no": "nrk",
  "vg.no": "vgnett",
  "yle.fi": "YleNews",
  "hs.fi": "hsfi",
  "aftonbladet.se": "Aftonbladet",
  "dn.se": "dn",
  "telquel.ma": "TelQuelOfficiel",
  "hespress.com": "Hespress",
  "sciencealert.com": "ScienceAlert",
  "sciencenews.org": "ScienceNews",
  "phys.org": "physorg",
  "nature.com": "Nature",
  "theconversation.com": "ConversationEDU",
  // FR — extra PQR / municipal / outre-mer
  "lamontagne.fr": "LaMontagneFr",
  "corsematin.com": "CorseMatin",
  "corsenetinfos.corsica": "CorseNetInfos",
  "maire-info.com": "Maire_info",
  "huffingtonpost.fr": "HuffPostFR",
  "tahiti-infos.com": "TahitiInfos",
  // Belgique / Suisse
  "lavenir.net": "lavenir_net",
  "tdg.ch": "tdgch",
  "24heures.ch": "24heuresch",
  "20min.ch": "20minCH",
  "rts.ch": "rtsinfo",
  // World desks added 2026-09-17
  "metro.co.uk": "MetroUK",
  "wfla.com": "WFLA",
  "eldiario.es": "eldiarioes",
  "ilmessaggero.it": "IlMessaggero",
  "publico.pt": "publico",
  "observador.pt": "observadorpt",
  "orf.at": "ORF",
  "derstandard.at": "derStandard",
  "nos.nl": "NOS",
  "nhk.or.jp": "NHK",
  "straitstimes.com": "StraitsTimes",
  "theage.com.au": "theage",
  "jeuneafrique.com": "JeuneAfrique",
  "eltiempo.com": "ELTIEMPO",
  // Odd / world desks — X watch 2026-09-18
  "infobae.com": "infobae",
  "nation.africa": "NationAfrica",
  "dailymaverick.co.za": "dailymaverick",
  "news24.com": "News24",
  "scmp.com": "SCMPNews",
  "rappler.com": "rapplerdotcom",
  "channelnewsasia.com": "ChannelNewsAsia",
  "inquirer.net": "inquirerdotnet",
  "odditycentral.com": "odditycentral",
  "soranews24.com": "SoraNews24",
  "japantoday.com": "JapanToday",
  "tokyoreporter.com": "TokyoReporter",
  "mothership.sg": "MothershipSG",
  "metropoles.com": "Metropoles",
  "punchng.com": "MobilePunch",
};

const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;

function isPlaceholderHost(host: string): boolean {
  return (
    host === "example.com" ||
    host === "example.org" ||
    host.endsWith(".example") ||
    host.endsWith(".example.com") ||
    host.endsWith(".example.org")
  );
}

export function hostFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

function lookupHandle(host: string): string | null {
  if (!host || isPlaceholderHost(host)) return null;
  if (NEWSROOM_X[host]) return NEWSROOM_X[host];
  const parts = host.split(".");
  while (parts.length > 2) {
    parts.shift();
    const cand = parts.join(".");
    if (NEWSROOM_X[cand]) return NEWSROOM_X[cand];
  }
  return null;
}

export type NewsroomX = {
  handle: string;
  href: string;
};

export function newsroomXForUrl(url: string): NewsroomX | null {
  const host = hostFromUrl(url);
  if (!host) return null;
  const raw = lookupHandle(host);
  if (!raw || !HANDLE_RE.test(raw)) return null;
  return { handle: `@${raw}`, href: `https://x.com/${raw}` };
}

export function originSource(sources: Source[]): Source | null {
  return sources.find((s) => {
    const host = hostFromUrl(s.url);
    return Boolean(host && !isPlaceholderHost(host));
  }) ?? null;
}
