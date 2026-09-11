/** Verified public RSS/Atom endpoints (probed 2026-09-11). */

export type RssFeed = {
  name: string;
  domain: string;
  url: string;
  region: string;
  countryCode: string;
};

export const RSS_FEEDS: RssFeed[] = [
  { name: "Ouest-France", domain: "ouest-france.fr", url: "https://www.ouest-france.fr/rss/une", region: "Bretagne / Pays de la Loire / Normandie", countryCode: "FR" },
  { name: "Sud Ouest", domain: "sudouest.fr", url: "https://www.sudouest.fr/rss.xml", region: "Nouvelle-Aquitaine", countryCode: "FR" },
  { name: "Le Télégramme", domain: "letelegramme.fr", url: "https://www.letelegramme.fr/rss.xml", region: "Bretagne", countryCode: "FR" },
  { name: "La Dépêche du Midi", domain: "ladepeche.fr", url: "https://www.ladepeche.fr/rss.xml", region: "Occitanie", countryCode: "FR" },
  { name: "Midi Libre", domain: "midilibre.fr", url: "https://www.midilibre.fr/rss.xml", region: "Occitanie", countryCode: "FR" },
  { name: "L'Indépendant", domain: "lindependant.fr", url: "https://www.lindependant.fr/rss.xml", region: "Occitanie", countryCode: "FR" },
  { name: "Charente Libre", domain: "charentelibre.fr", url: "https://www.charentelibre.fr/rss.xml", region: "Nouvelle-Aquitaine", countryCode: "FR" },
  { name: "Le Progrès", domain: "leprogres.fr", url: "https://www.leprogres.fr/rss", region: "Auvergne-Rhône-Alpes", countryCode: "FR" },
  { name: "Le Dauphiné Libéré", domain: "ledauphine.com", url: "https://www.ledauphine.com/rss", region: "Auvergne-Rhône-Alpes", countryCode: "FR" },
  { name: "L'Est Républicain", domain: "estrepublicain.fr", url: "https://www.estrepublicain.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "Vosges Matin", domain: "vosgesmatin.fr", url: "https://www.vosgesmatin.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "L'Alsace", domain: "lalsace.fr", url: "https://www.lalsace.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "DNA", domain: "dna.fr", url: "https://www.dna.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "Le Républicain Lorrain", domain: "republicain-lorrain.fr", url: "https://www.republicain-lorrain.fr/rss", region: "Grand Est", countryCode: "FR" },
  { name: "Le Bien Public", domain: "bienpublic.com", url: "https://www.bienpublic.com/rss", region: "Bourgogne-Franche-Comté", countryCode: "FR" },
  { name: "Le JSL", domain: "lejsl.com", url: "https://www.lejsl.com/rss", region: "Bourgogne-Franche-Comté", countryCode: "FR" },
  { name: "Nice-Matin", domain: "nicematin.com", url: "https://www.nicematin.com/rss", region: "Provence-Alpes-Côte d'Azur", countryCode: "FR" },
  { name: "Var-Matin", domain: "varmatin.com", url: "https://www.varmatin.com/rss", region: "Provence-Alpes-Côte d'Azur", countryCode: "FR" },
  { name: "Le Monde", domain: "lemonde.fr", url: "https://www.lemonde.fr/rss/une.xml", region: "FR — national", countryCode: "FR" },
  { name: "Libération", domain: "liberation.fr", url: "https://www.liberation.fr/arc/outboundfeeds/rss-all/", region: "FR — national", countryCode: "FR" },
  { name: "Le Figaro", domain: "lefigaro.fr", url: "https://www.lefigaro.fr/rss/figaro_actualites.xml", region: "FR — national", countryCode: "FR" },
  { name: "France 24", domain: "france24.com", url: "https://www.france24.com/fr/rss", region: "FR — world desk", countryCode: "FR" },
  { name: "BBC News", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/rss.xml", region: "UK", countryCode: "GB" },
  { name: "BBC World", domain: "bbc.co.uk", url: "https://feeds.bbci.co.uk/news/world/rss.xml", region: "UK — world", countryCode: "GB" },
  { name: "The Guardian", domain: "theguardian.com", url: "https://www.theguardian.com/uk/rss", region: "UK", countryCode: "GB" },
  { name: "The Guardian World", domain: "theguardian.com", url: "https://www.theguardian.com/world/rss", region: "UK — world", countryCode: "GB" },
  { name: "New York Times World", domain: "nytimes.com", url: "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml", region: "US — world", countryCode: "US" },
  { name: "El País", domain: "elpais.com", url: "https://www.elpais.com/rss/elpais/portada.xml", region: "ES", countryCode: "ES" },
  { name: "El Mundo", domain: "elmundo.es", url: "https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml", region: "ES", countryCode: "ES" },
  { name: "la Repubblica", domain: "repubblica.it", url: "https://www.repubblica.it/rss/homepage/rss2.0.xml", region: "IT", countryCode: "IT" },
  { name: "Deutsche Welle", domain: "dw.com", url: "https://rss.dw.com/rdf/rss-en-all", region: "DE", countryCode: "DE" },
  { name: "ABC News Australia", domain: "abc.net.au", url: "https://www.abc.net.au/news/feed/51120/rss.xml", region: "AU", countryCode: "AU" },
  { name: "Sydney Morning Herald", domain: "smh.com.au", url: "https://www.smh.com.au/rss/feed.xml", region: "AU — Sydney", countryCode: "AU" },
  { name: "Times of India", domain: "timesofindia.indiatimes.com", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", region: "IN", countryCode: "IN" },
  { name: "India Today", domain: "indiatoday.in", url: "https://www.indiatoday.in/rss/home", region: "IN", countryCode: "IN" },
  { name: "g1", domain: "g1.globo.com", url: "https://g1.globo.com/rss/g1/", region: "BR", countryCode: "BR" },
  { name: "Clarín", domain: "clarin.com", url: "https://www.clarin.com/rss/lo-ultimo/", region: "AR", countryCode: "AR" },
  { name: "La Nación", domain: "lanacion.com.ar", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml", region: "AR", countryCode: "AR" },
  { name: "ScienceAlert", domain: "sciencealert.com", url: "https://www.sciencealert.com/feed", region: "Science", countryCode: "AU" },
  { name: "Science News", domain: "sciencenews.org", url: "https://www.sciencenews.org/feed", region: "Science", countryCode: "US" },
  { name: "Phys.org", domain: "phys.org", url: "https://phys.org/rss-feed/", region: "Science", countryCode: "US" },
  { name: "Nature", domain: "nature.com", url: "https://www.nature.com/nature.rss", region: "Science", countryCode: "GB" },
  { name: "The Conversation Europe", domain: "theconversation.com", url: "https://www.theconversation.com/europe/articles.atom", region: "Science / ideas", countryCode: "FR" },
];

export const RSS_BY_DOMAIN: Record<string, string> = Object.fromEntries(
  RSS_FEEDS.map((f) => [f.domain.toLowerCase(), f.url]),
);

export function rssUrlForDomain(domain: string): string | undefined {
  return RSS_BY_DOMAIN[domain.toLowerCase().replace(/^www\./, "")];
}
