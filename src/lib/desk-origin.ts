import type { Lang, SectionId, Story } from "./types.ts";
import { RSS_FEEDS } from "./rss-feeds.ts";
import { hostFromUrl, originSource } from "./source-x.ts";
import type { SectionDef } from "./data/sections.ts";

export type OriginDesk = "france" | "usa" | "world";

const DOMAIN_COUNTRY: Record<string, string> = {};
for (const f of RSS_FEEDS) {
  const d = f.domain.toLowerCase().replace(/^www\./, "");
  if (d) DOMAIN_COUNTRY[d] = f.countryCode.toUpperCase();
}

const US_HOSTS = new Set([
  "nytimes.com",
  "washingtonpost.com",
  "wsj.com",
  "usatoday.com",
  "latimes.com",
  "chicagotribune.com",
  "nypost.com",
  "cnn.com",
  "foxnews.com",
  "nbcnews.com",
  "abcnews.go.com",
  "cbsnews.com",
  "npr.org",
  "apnews.com",
  "politico.com",
  "thehill.com",
  "houstonchronicle.com",
  "miamiherald.com",
  "boston.com",
  "seattletimes.com",
  "sfchronicle.com",
  "dallasnews.com",
  "denverpost.com",
  "ajc.com",
  "startribune.com",
  "oregonlive.com",
  "cleveland.com",
  "nj.com",
  "sfgate.com",
  "ksl.com",
  "ksat.com",
  "wfaa.com",
  "local10.com",
]);

const FR_HOSTS = new Set([
  "lemonde.fr",
  "lefigaro.fr",
  "liberation.fr",
  "leparisien.fr",
  "francetvinfo.fr",
  "franceinfo.fr",
  "france24.com",
  "bfmtv.com",
  "cnews.fr",
  "lci.fr",
  "europe1.fr",
  "rtl.fr",
  "rfi.fr",
  "ina.fr",
  "senat.fr",
  "assemblee-nationale.fr",
  "legifrance.gouv.fr",
  "service-public.fr",
]);

function registrable(host: string): string {
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  return parts.slice(-2).join(".");
}

function countryFromHost(host: string): string | null {
  if (DOMAIN_COUNTRY[host]) return DOMAIN_COUNTRY[host];
  const parts = host.split(".");
  while (parts.length > 2) {
    parts.shift();
    const cand = parts.join(".");
    if (DOMAIN_COUNTRY[cand]) return DOMAIN_COUNTRY[cand];
  }
  const root = registrable(host);
  if (US_HOSTS.has(host) || US_HOSTS.has(root)) return "US";
  if (FR_HOSTS.has(host) || FR_HOSTS.has(root)) return "FR";
  if (host.endsWith(".gov") || host.endsWith(".mil")) return "US";
  const tld = host.split(".").pop() ?? "";
  const tldMap: Record<string, string> = {
    fr: "FR",
    re: "FR",
    yt: "FR",
    pm: "FR",
    wf: "FR",
    tf: "FR",
    us: "US",
    uk: "GB",
    de: "DE",
    it: "IT",
    es: "ES",
    pt: "PT",
    be: "BE",
    ch: "CH",
    ca: "CA",
    au: "AU",
    nz: "NZ",
    jp: "JP",
    br: "BR",
    mx: "MX",
    ar: "AR",
    nl: "NL",
    ie: "IE",
    se: "SE",
    no: "NO",
    dk: "DK",
    fi: "FI",
    pl: "PL",
    at: "AT",
    cz: "CZ",
    gr: "GR",
    tr: "TR",
    in: "IN",
    za: "ZA",
    kr: "KR",
    cn: "CN",
    ru: "RU",
    ua: "UA",
    qc: "CA",
  };
  return tldMap[tld] ?? null;
}

/** Country of the first named publication — not the dateline. */
export function originCountry(story: Pick<Story, "sources" | "countryCode">): string {
  const origin = originSource(story.sources);
  const host = origin ? hostFromUrl(origin.url) : null;
  if (host) {
    const fromHost = countryFromHost(host);
    if (fromHost) return fromHost;
  }
  return (story.countryCode || "").toUpperCase() || "XX";
}

export function originDesk(story: Pick<Story, "sources" | "countryCode">): OriginDesk {
  const cc = originCountry(story);
  if (cc === "FR") return "france";
  if (cc === "US") return "usa";
  return "world";
}

/** Public rubric for this language. EN: USA / World. FR: France / Monde. */
export function publicDesk(story: Pick<Story, "sources" | "countryCode">, lang: Lang): "france" | "usa" | "monde" | "world" {
  const desk = originDesk(story);
  if (lang === "fr") return desk === "france" ? "france" : "monde";
  return desk === "usa" ? "usa" : "world";
}

export function deskNav(lang: Lang): SectionDef[] {
  if (lang === "fr") {
    return [
      { id: "france", path: "/france", kicker: "FRANCE" },
      { id: "monde", path: "/monde", kicker: "MONDE" },
    ];
  }
  return [
    { id: "usa", path: "/usa", kicker: "USA" },
    { id: "world", path: "/world", kicker: "WORLD" },
  ];
}

export function isDeskListing(section: string): boolean {
  return section === "france" || section === "usa" || section === "monde" || section === "world";
}

export function storyInDeskListing(story: Pick<Story, "sources" | "countryCode">, section: SectionId): boolean {
  const desk = originDesk(story);
  if (section === "france") return desk === "france";
  if (section === "usa") return desk === "usa";
  if (section === "monde") return desk !== "france";
  if (section === "world") return desk !== "usa";
  return false;
}
