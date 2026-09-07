import { SITE_NAME, SITE_URL, SOCIAL } from "@/lib/brand";
import { coverSrc } from "@/lib/covers";
import type { Story } from "@/lib/types";

export const INDEXNOW_KEY = "a8f3c1e29b704d6ea51c8f2d4b7e90c1";

export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    alternateName: "Yes It's Real",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-stamp.jpg`,
    description:
      "Real news. Unbelievably dumb. A global newsroom that only publishes sourced, fact-checked stories among the dumbest events on Earth. Not satire.",
    foundingDate: "2026",
    sameAs: SOCIAL.filter((s) => s.url.startsWith("http")).map((s) => s.url).slice(0, 8),
    publishingPrinciples: `${SITE_URL}/method`,
    ethicsPolicy: `${SITE_URL}/about`,
    correctionsPolicy: `${SITE_URL}/corrections`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      email: "desk@yesitsreal.news",
      url: `${SITE_URL}/contact`,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["en", "fr"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(story: Story) {
  const c = story.copy.en;
  const img = coverSrc(story.id);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: c.headline,
    description: c.dek,
    datePublished: story.publishedAt,
    dateModified: story.updatedAt || story.publishedAt,
    inLanguage: story.originalLang || "en",
    isAccessibleForFree: true,
    mainEntityOfPage: `${SITE_URL}/story/${story.slug}`,
    image: img ? [img.startsWith("http") ? img : `${SITE_URL}${img}`] : [`${SITE_URL}/og.jpg`],
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-stamp.jpg` },
    },
    articleSection: story.section,
    contentLocation: {
      "@type": "Place",
      name: `${story.location}, ${story.countryName}`,
    },
    citation: story.sources.map((s) => s.url),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "article p"] },
  };
}
