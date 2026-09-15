/** Verified public RSS/Atom endpoints (probed 2026-09-11, expanded 2026-09-15). */

import type { RssKind } from "@/lib/rss-keep";

export type RssFeed = {
  name: string;
  domain: string;
  url: string;
  region: string;
  countryCode: string;
  kind?: RssKind;
  /** 1 = cron / file du matin. 2 = tirage desk complet. */
  priority?: 1 | 2;
};

export const RSS_FEEDS: RssFeed[] = [
  // --- PQR / locaux FR (EBRA, SIPA, Sud Ouest, Centre / Est / Nord) ---
  { name: "Ouest-France", domain: "ouest-france.fr", url: "https://www.ouest-france.fr/rss/une", region: "Bretagne / Pays de la Loire / Normandie", countryCode: "FR", priority: 1 },
  { name: "Sud Ouest", domain: "sudouest.fr", url: "https://www.sudouest.fr/rss.xml", region: "Nouvelle-Aquitaine", countryCode: "FR", priority: 1 },
  { name: "Sud Ouest faits-divers", domain: "sudouest.fr", url: "https://www.sudouest.fr/faits-divers/rss.xml", region: "Nouvelle-Aquitaine — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "Le Télégramme", domain: "letelegramme.fr", url: "https://www.letelegramme.fr/rss.xml", region: "Bretagne", countryCode: "FR", priority: 1 },
  { name: "La Dépêche du Midi", domain: "ladepeche.fr", url: "https://www.ladepeche.fr/rss.xml", region: "Occitanie", countryCode: "FR", priority: 1 },
  { name: "La Dépêche insolite", domain: "ladepeche.fr", url: "https://www.ladepeche.fr/insolite/rss.xml", region: "Occitanie — insolite", countryCode: "FR", kind: "insolite", priority: 1 },
  { name: "La Dépêche faits-divers", domain: "ladepeche.fr", url: "https://www.ladepeche.fr/faits-divers/rss.xml", region: "Occitanie — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "Midi Libre", domain: "midilibre.fr", url: "https://www.midilibre.fr/rss.xml", region: "Occitanie", countryCode: "FR", priority: 1 },
  { name: "Midi Libre faits-divers", domain: "midilibre.fr", url: "https://www.midilibre.fr/faits-divers/rss.xml", region: "Occitanie — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "L'Indépendant", domain: "lindependant.fr", url: "https://www.lindependant.fr/rss.xml", region: "Occitanie", countryCode: "FR" },
  { name: "L'Indépendant insolite", domain: "lindependant.fr", url: "https://www.lindependant.fr/insolite/rss.xml", region: "Occitanie — insolite", countryCode: "FR", kind: "insolite", priority: 1 },
  { name: "L'Indépendant faits-divers", domain: "lindependant.fr", url: "https://www.lindependant.fr/faits-divers/rss.xml", region: "Occitanie — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "Charente Libre", domain: "charentelibre.fr", url: "https://www.charentelibre.fr/rss.xml", region: "Nouvelle-Aquitaine", countryCode: "FR", priority: 1 },
  { name: "Charente Libre faits-divers", domain: "charentelibre.fr", url: "https://www.charentelibre.fr/faits-divers/rss.xml", region: "Nouvelle-Aquitaine — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "Le Progrès", domain: "leprogres.fr", url: "https://www.leprogres.fr/rss", region: "Auvergne-Rhône-Alpes", countryCode: "FR", priority: 1 },
  { name: "Le Dauphiné Libéré", domain: "ledauphine.com", url: "https://www.ledauphine.com/rss", region: "Auvergne-Rhône-Alpes", countryCode: "FR", priority: 1 },
  { name: "L'Est Républicain", domain: "estrepublicain.fr", url: "https://www.estrepublicain.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "Vosges Matin", domain: "vosgesmatin.fr", url: "https://www.vosgesmatin.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "L'Alsace", domain: "lalsace.fr", url: "https://www.lalsace.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "DNA", domain: "dna.fr", url: "https://www.dna.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "Le Républicain Lorrain", domain: "republicain-lorrain.fr", url: "https://www.republicain-lorrain.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "Le Bien Public", domain: "bienpublic.com", url: "https://www.bienpublic.com/rss", region: "Bourgogne-Franche-Comté", countryCode: "FR" },
  { name: "Le JSL", domain: "lejsl.com", url: "https://www.lejsl.com/rss", region: "Bourgogne-Franche-Comté", countryCode: "FR" },
  { name: "Nice-Matin", domain: "nicematin.com", url: "https://www.nicematin.com/rss", region: "Provence-Alpes-Côte d'Azur", countryCode: "FR", priority: 1 },
  { name: "Nice-Matin faits-divers", domain: "nicematin.com", url: "https://www.nicematin.com/faits-divers/rss", region: "PACA — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "Var-Matin", domain: "varmatin.com", url: "https://www.varmatin.com/rss", region: "Provence-Alpes-Côte d'Azur", countryCode: "FR" },
  { name: "Monaco-Matin", domain: "monacomatin.mc", url: "https://www.monacomatin.mc/rss", region: "Monaco / PACA", countryCode: "MC" },
  { name: "La Voix du Nord", domain: "lavoixdunord.fr", url: "https://www.lavoixdunord.fr/rss.xml", region: "Hauts-de-France", countryCode: "FR", priority: 1 },
  { name: "Nord Littoral", domain: "nordlittoral.fr", url: "https://www.nordlittoral.fr/rss.xml", region: "Hauts-de-France", countryCode: "FR" },
  { name: "Courrier Picard", domain: "courrier-picard.fr", url: "https://www.courrier-picard.fr/rss.xml", region: "Hauts-de-France", countryCode: "FR" },
  { name: "L'Union", domain: "lunion.fr", url: "https://www.lunion.fr/rss.xml", region: "Grand Est", countryCode: "FR" },
  { name: "L'Ardennais", domain: "lardennais.fr", url: "https://www.lardennais.fr/rss.xml", region: "Grand Est", countryCode: "FR" },
  { name: "L'Est-Éclair", domain: "lest-eclair.fr", url: "https://www.lest-eclair.fr/rss.xml", region: "Grand Est", countryCode: "FR" },
  { name: "Libération Champagne", domain: "liberation-champagne.fr", url: "https://www.liberation-champagne.fr/rss.xml", region: "Grand Est", countryCode: "FR" },
  { name: "Journal de Haute-Marne", domain: "jhm.fr", url: "https://jhm.fr/feed/", region: "Grand Est", countryCode: "FR" },
  { name: "Paris-Normandie", domain: "paris-normandie.fr", url: "https://www.paris-normandie.fr/rss.xml", region: "Normandie", countryCode: "FR" },
  { name: "Dordogne Libre", domain: "dordognelibre.fr", url: "https://www.dordognelibre.fr/rss.xml", region: "Nouvelle-Aquitaine", countryCode: "FR" },
  { name: "La République des Pyrénées", domain: "larepubliquedespyrenees.fr", url: "https://www.larepubliquedespyrenees.fr/rss.xml", region: "Nouvelle-Aquitaine", countryCode: "FR" },
  { name: "La Nouvelle République des Pyrénées", domain: "nrpyrenees.fr", url: "https://www.nrpyrenees.fr/rss.xml", region: "Occitanie", countryCode: "FR" },
  { name: "Le Petit Bleu", domain: "petitbleu.fr", url: "https://www.petitbleu.fr/rss.xml", region: "Nouvelle-Aquitaine", countryCode: "FR" },
  { name: "Le Petit Bleu faits-divers", domain: "petitbleu.fr", url: "https://www.petitbleu.fr/faits-divers/rss.xml", region: "Nouvelle-Aquitaine — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "Centre Presse Aveyron", domain: "centrepresseaveyron.fr", url: "https://www.centrepresseaveyron.fr/rss.xml", region: "Occitanie", countryCode: "FR" },
  { name: "Journal de Millau", domain: "journaldemillau.fr", url: "https://www.journaldemillau.fr/rss.xml", region: "Occitanie", countryCode: "FR" },
  { name: "actu.fr", domain: "actu.fr", url: "https://actu.fr/rss.xml", region: "FR — réseau local", countryCode: "FR" },
  { name: "ICI / France Bleu", domain: "ici.fr", url: "https://www.ici.fr/rss/a-la-une.xml", region: "FR — réseaux locaux", countryCode: "FR" },
  { name: "France 3 Régions", domain: "france3-regions.franceinfo.fr", url: "https://france3-regions.franceinfo.fr/actu/rss", region: "FR — régions", countryCode: "FR" },
  { name: "France 3 faits-divers", domain: "france3-regions.franceinfo.fr", url: "https://france3-regions.franceinfo.fr/faits-divers/rss", region: "FR — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "Clicanoo", domain: "clicanoo.re", url: "https://www.clicanoo.re/rss", region: "FR — La Réunion", countryCode: "FR" },
  { name: "Les Nouvelles Calédoniennes", domain: "lnc.nc", url: "https://www.lnc.nc/rss.xml", region: "FR — Nouvelle-Calédonie", countryCode: "FR" },
  { name: "Marsactu", domain: "marsactu.fr", url: "https://marsactu.fr/feed/", region: "Provence-Alpes-Côte d'Azur", countryCode: "FR" },
  { name: "Mediacités", domain: "mediacites.fr", url: "https://www.mediacites.fr/feed/", region: "FR — enquêtes locales", countryCode: "FR" },
  { name: "Rue89 Lyon", domain: "rue89lyon.fr", url: "https://www.rue89lyon.fr/feed/", region: "Auvergne-Rhône-Alpes", countryCode: "FR" },
  { name: "Rue89 Strasbourg", domain: "rue89strasbourg.com", url: "https://www.rue89strasbourg.com/feed", region: "Grand Est", countryCode: "FR" },
  { name: "Rue89 Bordeaux", domain: "rue89bordeaux.com", url: "https://rue89bordeaux.com/feed/", region: "Nouvelle-Aquitaine", countryCode: "FR" },
  { name: "StreetPress", domain: "streetpress.com", url: "https://www.streetpress.com/rss.xml", region: "FR — local / enquête", countryCode: "FR" },
  { name: "Bondy Blog", domain: "bondyblog.fr", url: "https://www.bondyblog.fr/feed/", region: "Île-de-France", countryCode: "FR" },
  { name: "Toulouse Infos", domain: "toulouseinfos.fr", url: "https://www.toulouseinfos.fr/feed", region: "Occitanie", countryCode: "FR" },

  // --- National FR ---
  { name: "Le Monde", domain: "lemonde.fr", url: "https://www.lemonde.fr/rss/une.xml", region: "FR — national", countryCode: "FR" },
  { name: "Libération", domain: "liberation.fr", url: "https://www.liberation.fr/arc/outboundfeeds/rss-all/", region: "FR — national", countryCode: "FR" },
  { name: "Le Figaro", domain: "lefigaro.fr", url: "https://www.lefigaro.fr/rss/figaro_actualites.xml", region: "FR — national", countryCode: "FR" },
  { name: "Le Parisien", domain: "leparisien.fr", url: "https://feeds.leparisien.fr/leparisien/rss", region: "FR — Île-de-France / national", countryCode: "FR", priority: 1 },
  { name: "Le Parisien faits-divers", domain: "leparisien.fr", url: "https://feeds.leparisien.fr/leparisien/rss/faits-divers", region: "FR — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "20 Minutes", domain: "20minutes.fr", url: "https://www.20minutes.fr/feeds/rss-une.xml", region: "FR — national", countryCode: "FR" },
  { name: "20 Minutes insolite", domain: "20minutes.fr", url: "https://www.20minutes.fr/feeds/rss-insolite.xml", region: "FR — insolite", countryCode: "FR", kind: "insolite", priority: 1 },
  { name: "franceinfo", domain: "francetvinfo.fr", url: "https://www.franceinfo.fr/titres.rss", region: "FR — national", countryCode: "FR" },
  { name: "franceinfo faits-divers", domain: "francetvinfo.fr", url: "https://www.francetvinfo.fr/faits-divers.rss", region: "FR — faits-divers", countryCode: "FR", kind: "faits-divers", priority: 1 },
  { name: "franceinfo animaux", domain: "francetvinfo.fr", url: "https://www.francetvinfo.fr/animaux.rss", region: "FR — animaux", countryCode: "FR", kind: "animaux", priority: 1 },
  { name: "France 24", domain: "france24.com", url: "https://www.france24.com/fr/rss", region: "FR — world desk", countryCode: "FR" },
  { name: "RFI", domain: "rfi.fr", url: "https://www.rfi.fr/fr/rss", region: "FR — world desk", countryCode: "FR" },
  { name: "France Inter", domain: "radiofrance.fr", url: "https://www.radiofrance.fr/franceinter/rss", region: "FR — national", countryCode: "FR" },
  { name: "L'Obs", domain: "nouvelobs.com", url: "https://www.nouvelobs.com/rss.xml", region: "FR — national", countryCode: "FR" },
  { name: "L'Express", domain: "lexpress.fr", url: "https://www.lexpress.fr/arc/outboundfeeds/rss/alaune.xml", region: "FR — national", countryCode: "FR" },
  { name: "Le Point", domain: "lepoint.fr", url: "https://www.lepoint.fr/arc/outboundfeeds/rss/?outputType=xml", region: "FR — national", countryCode: "FR" },
  { name: "Mediapart", domain: "mediapart.fr", url: "https://www.mediapart.fr/articles/feed", region: "FR — national", countryCode: "FR" },
  { name: "Europe 1", domain: "europe1.fr", url: "https://www.europe1.fr/rss.xml", region: "FR — national", countryCode: "FR" },
  { name: "CNews", domain: "cnews.fr", url: "https://www.cnews.fr/rss.xml", region: "FR — national", countryCode: "FR" },
  { name: "BFMTV", domain: "bfmtv.com", url: "https://www.bfmtv.com/rss/news-24-7/", region: "FR — national", countryCode: "FR" },

  // --- Francophonie ---
  { name: "La Presse", domain: "lapresse.ca", url: "https://www.lapresse.ca/actualites/rss", region: "CA — Montréal", countryCode: "CA" },
  { name: "Radio-Canada", domain: "radio-canada.ca", url: "https://ici.radio-canada.ca/info/rss/info/a-la-une", region: "CA — national", countryCode: "CA" },
  { name: "Le Devoir", domain: "ledevoir.com", url: "https://www.ledevoir.com/rss/manchettes.xml", region: "CA — Montréal", countryCode: "CA" },
  { name: "Journal de Montréal", domain: "journaldemontreal.com", url: "https://www.journaldemontreal.com/rss.xml", region: "CA — Montréal", countryCode: "CA" },
  { name: "Journal de Québec", domain: "journaldequebec.com", url: "https://www.journaldequebec.com/rss.xml", region: "CA — Québec", countryCode: "CA" },
  { name: "Le Soir", domain: "lesoir.be", url: "https://www.lesoir.be/rss/categorie/fil-info.xml", region: "BE — Bruxelles", countryCode: "BE" },
  { name: "La Libre", domain: "lalibre.be", url: "https://www.lalibre.be/arc/outboundfeeds/rss/?outputType=xml", region: "BE — Bruxelles", countryCode: "BE" },
  { name: "La Libre Belgique", domain: "lalibre.be", url: "https://www.lalibre.be/arc/outboundfeeds/rss/section/belgique/?outputType=xml", region: "BE — Belgique", countryCode: "BE" },
  { name: "DH", domain: "dhnet.be", url: "https://www.dhnet.be/arc/outboundfeeds/rss/?outputType=xml", region: "BE — Bruxelles", countryCode: "BE", priority: 1 },
  { name: "Sudinfo", domain: "sudinfo.be", url: "https://www.sudinfo.be/rss.xml", region: "BE — Wallonie", countryCode: "BE", priority: 1 },
  { name: "RTBF", domain: "rtbf.be", url: "https://rss.rtbf.be/article/rss/highlight_rtbf_info.xml", region: "BE — national", countryCode: "BE", priority: 1 },
  { name: "Le Temps", domain: "letemps.ch", url: "https://www.letemps.ch/articles.rss", region: "CH — Genève", countryCode: "CH" },
  { name: "Blick", domain: "blick.ch", url: "https://www.blick.ch/rss.xml", region: "CH — Zurich", countryCode: "CH" },
  { name: "Blick FR", domain: "blick.ch", url: "https://www.blick.ch/fr/rss.xml", region: "CH — romand", countryCode: "CH", priority: 1 },

  // --- World desks ---
  { name: "BBC News", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/rss.xml", region: "UK", countryCode: "GB", priority: 1 },
  { name: "BBC World", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/world/rss.xml", region: "UK — world", countryCode: "GB" },
  { name: "BBC England", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/england/rss.xml", region: "UK — England", countryCode: "GB" },
  { name: "BBC Wales", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/wales/rss.xml", region: "UK — Wales", countryCode: "GB" },
  { name: "BBC Scotland", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/scotland/rss.xml", region: "UK — Scotland", countryCode: "GB" },
  { name: "BBC Northern Ireland", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/northern_ireland/rss.xml", region: "UK — Northern Ireland", countryCode: "GB" },
  { name: "The Guardian", domain: "theguardian.com", url: "https://www.theguardian.com/uk/rss", region: "UK", countryCode: "GB", priority: 1 },
  { name: "The Guardian World", domain: "theguardian.com", url: "https://www.theguardian.com/world/rss", region: "UK — world", countryCode: "GB" },
  { name: "The Independent", domain: "independent.co.uk", url: "https://www.independent.co.uk/news/rss", region: "UK", countryCode: "GB" },
  { name: "The Telegraph", domain: "telegraph.co.uk", url: "https://www.telegraph.co.uk/rss.xml", region: "UK", countryCode: "GB" },
  { name: "Evening Standard", domain: "standard.co.uk", url: "https://www.standard.co.uk/rss", region: "UK — London", countryCode: "GB" },
  { name: "The Scotsman", domain: "scotsman.com", url: "https://www.scotsman.com/rss", region: "UK — Scotland", countryCode: "GB" },
  { name: "Wales Online", domain: "walesonline.co.uk", url: "https://www.walesonline.co.uk/?service=rss", region: "UK — Wales", countryCode: "GB", priority: 1 },
  { name: "Manchester Evening News", domain: "manchestereveningnews.co.uk", url: "https://www.manchestereveningnews.co.uk/?service=rss", region: "UK — Greater Manchester", countryCode: "GB", priority: 1 },
  { name: "Liverpool Echo", domain: "liverpoolecho.co.uk", url: "https://www.liverpoolecho.co.uk/?service=rss", region: "UK — Merseyside", countryCode: "GB" },
  { name: "Birmingham Mail", domain: "birminghammail.co.uk", url: "https://www.birminghammail.co.uk/?service=rss", region: "UK — West Midlands", countryCode: "GB" },
  { name: "TheJournal.ie", domain: "thejournal.ie", url: "https://www.thejournal.ie/feed/", region: "Ireland", countryCode: "IE" },
  { name: "RTE", domain: "rte.ie", url: "https://www.rte.ie/news/rss/news-headlines.xml", region: "Ireland", countryCode: "IE" },
  { name: "New York Times World", domain: "nytimes.com", url: "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml", region: "US — world", countryCode: "US" },
  { name: "Los Angeles Times", domain: "latimes.com", url: "https://www.latimes.com/world-nation/rss2.0.xml", region: "US — world", countryCode: "US" },
  { name: "NPR", domain: "npr.org", url: "https://feeds.npr.org/1001/rss.xml", region: "US", countryCode: "US" },
  { name: "OregonLive", domain: "oregonlive.com", url: "https://www.oregonlive.com/arc/outboundfeeds/rss/?outputType=xml", region: "US — Portland", countryCode: "US" },
  { name: "NY Post oddities", domain: "nypost.com", url: "https://nypost.com/oddities/feed/", region: "US — oddities", countryCode: "US", kind: "insolite", priority: 1 },
  { name: "UPI Odd News", domain: "upi.com", url: "https://rss.upi.com/news/odd_news.rss", region: "US — odd news", countryCode: "US", kind: "insolite", priority: 1 },
  { name: "Vancouver Sun", domain: "vancouversun.com", url: "https://vancouversun.com/feed", region: "CA — Vancouver", countryCode: "CA" },
  { name: "El País", domain: "elpais.com", url: "https://www.elpais.com/rss/elpais/portada.xml", region: "ES", countryCode: "ES" },
  { name: "El Mundo", domain: "elmundo.es", url: "https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml", region: "ES", countryCode: "ES" },
  { name: "El Mundo España", domain: "elmundo.es", url: "https://e00-elmundo.uecdn.es/elmundo/rss/espana.xml", region: "ES — España", countryCode: "ES" },
  { name: "ABC España", domain: "abc.es", url: "https://www.abc.es/rss/feeds/abcPortada.xml", region: "ES", countryCode: "ES" },
  { name: "ABC España desk", domain: "abc.es", url: "https://www.abc.es/rss/feeds/abc_EspanaEspana.xml", region: "ES — España", countryCode: "ES" },
  { name: "La Vanguardia", domain: "lavanguardia.com", url: "https://www.lavanguardia.com/rss/home.xml", region: "ES — Catalunya", countryCode: "ES" },
  { name: "La Vanguardia sucesos", domain: "lavanguardia.com", url: "https://www.lavanguardia.com/rss/sucesos.xml", region: "ES — sucesos", countryCode: "ES", kind: "faits-divers", priority: 1 },
  { name: "20 minutos", domain: "20minutos.es", url: "https://www.20minutos.es/rss/", region: "ES", countryCode: "ES" },
  { name: "la Repubblica", domain: "repubblica.it", url: "https://www.repubblica.it/rss/homepage/rss2.0.xml", region: "IT", countryCode: "IT" },
  { name: "la Repubblica cronaca", domain: "repubblica.it", url: "https://www.repubblica.it/rss/cronaca/rss2.0.xml", region: "IT — cronaca", countryCode: "IT", kind: "faits-divers", priority: 1 },
  { name: "Corriere della Sera", domain: "corriere.it", url: "https://xml2.corriereobjects.it/rss/homepage.xml", region: "IT", countryCode: "IT" },
  { name: "Corriere cronache", domain: "corriere.it", url: "https://xml2.corriereobjects.it/rss/cronache.xml", region: "IT — cronache", countryCode: "IT", kind: "faits-divers" },
  { name: "ANSA", domain: "ansa.it", url: "https://www.ansa.it/sito/ansait_rss.xml", region: "IT — wire", countryCode: "IT" },
  { name: "ANSA cronaca", domain: "ansa.it", url: "https://www.ansa.it/sito/notizie/cronaca/cronaca_rss.xml", region: "IT — cronaca", countryCode: "IT", kind: "faits-divers", priority: 1 },
  { name: "Deutsche Welle", domain: "dw.com", url: "https://rss.dw.com/rdf/rss-en-all", region: "DE", countryCode: "DE" },
  { name: "Der Spiegel", domain: "spiegel.de", url: "https://www.spiegel.de/schlagzeilen/index.rss", region: "DE", countryCode: "DE" },
  { name: "Der Spiegel Panorama", domain: "spiegel.de", url: "https://www.spiegel.de/panorama/index.rss", region: "DE — panorama", countryCode: "DE", kind: "faits-divers", priority: 1 },
  { name: "Die Zeit", domain: "zeit.de", url: "https://newsfeed.zeit.de/index", region: "DE", countryCode: "DE" },
  { name: "Süddeutsche Zeitung", domain: "sueddeutsche.de", url: "https://rss.sueddeutsche.de/rss/Topthemen", region: "DE", countryCode: "DE" },
  { name: "Süddeutsche Panorama", domain: "sueddeutsche.de", url: "https://rss.sueddeutsche.de/rss/Panorama", region: "DE — panorama", countryCode: "DE", kind: "faits-divers" },
  { name: "FAZ", domain: "faz.net", url: "https://www.faz.net/rss/aktuell/", region: "DE", countryCode: "DE" },
  { name: "FAZ Gesellschaft", domain: "faz.net", url: "https://www.faz.net/rss/aktuell/gesellschaft/", region: "DE — gesellschaft", countryCode: "DE" },
  { name: "AD.nl", domain: "ad.nl", url: "https://www.ad.nl/home/rss.xml", region: "NL", countryCode: "NL" },
  { name: "HLN", domain: "hln.be", url: "https://www.hln.be/rss.xml", region: "BE — Flandre", countryCode: "BE" },
  { name: "ABC News Australia", domain: "abc.net.au", url: "https://www.abc.net.au/news/feed/51120/rss.xml", region: "AU", countryCode: "AU" },
  { name: "Sydney Morning Herald", domain: "smh.com.au", url: "https://www.smh.com.au/rss/feed.xml", region: "AU — Sydney", countryCode: "AU" },
  { name: "Stuff NZ", domain: "stuff.co.nz", url: "https://www.stuff.co.nz/rss", region: "NZ", countryCode: "NZ" },
  { name: "Times of India", domain: "timesofindia.indiatimes.com", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", region: "IN", countryCode: "IN" },
  { name: "India Today", domain: "indiatoday.in", url: "https://www.indiatoday.in/rss/home", region: "IN", countryCode: "IN" },
  { name: "g1", domain: "g1.globo.com", url: "https://g1.globo.com/rss/g1/", region: "BR", countryCode: "BR" },
  { name: "Folha cotidiano", domain: "folha.uol.com.br", url: "https://feeds.folha.uol.com.br/cotidiano/rss091.xml", region: "BR — cotidiano", countryCode: "BR", kind: "faits-divers" },
  { name: "Clarín", domain: "clarin.com", url: "https://www.clarin.com/rss/lo-ultimo/", region: "AR", countryCode: "AR" },
  { name: "Clarín sociedad", domain: "clarin.com", url: "https://www.clarin.com/rss/sociedad/", region: "AR — sociedad", countryCode: "AR" },
  { name: "La Nación", domain: "lanacion.com.ar", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml", region: "AR", countryCode: "AR" },

  // --- Nordics ---
  { name: "Aftenposten", domain: "aftenposten.no", url: "https://www.aftenposten.no/rss", region: "NO — Oslo", countryCode: "NO" },
  { name: "NRK", domain: "nrk.no", url: "https://www.nrk.no/toppsaker.rss", region: "NO — national", countryCode: "NO" },
  { name: "VG", domain: "vg.no", url: "https://www.vg.no/rss/feed/", region: "NO — Oslo", countryCode: "NO" },
  { name: "Yle", domain: "yle.fi", url: "https://feeds.yle.fi/uutiset/v1/recent.rss?publisherIds=YLE_NEWS", region: "FI", countryCode: "FI" },
  { name: "Helsingin Sanomat", domain: "hs.fi", url: "https://www.hs.fi/rss/tuoreimmat.xml", region: "FI — Helsinki", countryCode: "FI" },
  { name: "Aftonbladet", domain: "aftonbladet.se", url: "https://www.aftonbladet.se/rss.xml", region: "SE — Stockholm", countryCode: "SE" },
  { name: "Dagens Nyheter", domain: "dn.se", url: "https://www.dn.se/rss", region: "SE — Stockholm", countryCode: "SE" },

  // --- Maghreb ---
  { name: "TelQuel", domain: "telquel.ma", url: "https://telquel.ma/feed", region: "MA — Casablanca", countryCode: "MA" },
  { name: "TSA Algérie", domain: "tsa-algerie.com", url: "https://www.tsa-algerie.com/feed/", region: "DZ — Alger", countryCode: "DZ" },
  { name: "Hespress", domain: "hespress.com", url: "https://www.hespress.com/feed", region: "MA — Rabat", countryCode: "MA" },
  { name: "Yabiladi", domain: "yabiladi.com", url: "https://www.yabiladi.com/rss/news.xml", region: "MA — diaspora / local", countryCode: "MA" },

  // --- Science ---
  { name: "ScienceAlert", domain: "sciencealert.com", url: "https://www.sciencealert.com/feed", region: "Science", countryCode: "AU", priority: 1 },
  { name: "Science News", domain: "sciencenews.org", url: "https://www.sciencenews.org/feed", region: "Science", countryCode: "US" },
  { name: "Phys.org", domain: "phys.org", url: "https://phys.org/rss-feed/", region: "Science", countryCode: "US" },
  { name: "Nature", domain: "nature.com", url: "https://www.nature.com/nature.rss", region: "Science", countryCode: "GB" },
  { name: "The Conversation Europe", domain: "theconversation.com", url: "https://www.theconversation.com/europe/articles.atom", region: "Science / ideas", countryCode: "FR" },
];

function inferKind(f: RssFeed): RssKind {
  if (f.kind) return f.kind;
  const blob = `${f.name} ${f.url} ${f.region}`;
  if (/insolite|odd news|oddities|\bweird\b|oddly/i.test(blob)) return "insolite";
  if (/faits-divers|faits divers|cronaca|panorama|sucesos/i.test(blob)) return "faits-divers";
  if (/animaux|animal/i.test(blob)) return "animaux";
  return "general";
}

export function feedKind(f: RssFeed): RssKind {
  return inferKind(f);
}

export function feedPriority(f: RssFeed): 1 | 2 {
  if (f.priority === 1 || f.priority === 2) return f.priority;
  const k = inferKind(f);
  if (k === "insolite" || k === "animaux") return 1;
  return 2;
}

export function priorityFeeds(): RssFeed[] {
  return RSS_FEEDS.filter((f) => feedPriority(f) === 1);
}

export const RSS_BY_DOMAIN: Record<string, string> = {};
for (const f of RSS_FEEDS) {
  const d = f.domain.toLowerCase();
  const kind = inferKind(f);
  if (!RSS_BY_DOMAIN[d] || kind === "general") RSS_BY_DOMAIN[d] = f.url;
}
RSS_BY_DOMAIN["francebleu.fr"] = RSS_BY_DOMAIN["ici.fr"] ?? "https://www.ici.fr/rss/a-la-une.xml";
RSS_BY_DOMAIN["franceinfo.fr"] = RSS_BY_DOMAIN["francetvinfo.fr"] ?? "https://www.franceinfo.fr/titres.rss";
RSS_BY_DOMAIN["franceinter.fr"] = RSS_BY_DOMAIN["radiofrance.fr"] ?? "https://www.radiofrance.fr/franceinter/rss";
RSS_BY_DOMAIN["nordeclair.fr"] = RSS_BY_DOMAIN["lavoixdunord.fr"] ?? "https://www.lavoixdunord.fr/rss.xml";

export function rssUrlForDomain(domain: string): string | undefined {
  return RSS_BY_DOMAIN[domain.toLowerCase().replace(/^www\./, "")];
}
