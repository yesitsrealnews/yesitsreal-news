import { SITE_NAME, SITE_URL, SOCIAL } from "@/lib/brand";
import { coverSrc } from "@/lib/covers";
import type { Story } from "@/lib/types";
import { getStoryVideo } from "@/lib/videos";

export const INDEXNOW_KEY = "a8f3c1e29b704d6ea51c8f2d4b7e90c1";
export const GOOGLE_SITE_VERIFICATION = "VQZpvyS8_FbId5oVYrLznUobVmavBmH6SAdV2MmQM9E";

export const SEO_FR = {
  title: "YES IT'S REAL — Des infos vraies. Incroyablement bêtes.",
  description:
    "Vérifié. Sourcé. Malheureusement vrai. Un journal mondial qui ne publie que des faits déjà parus, sourcés, parmi les plus bêtes de la Terre. Pas de satire.",
  keywords: "infos, faits divers, pas de satire, news, bizarre, vrai, sourcé, Google Actualités",
} as const;

export function xmlEscape(s: string): string {
  const map: Record<string, string> = {
    "&": "&" + "amp;",
    "<": "&" + "lt;",
    ">": "&" + "gt;",
    '"': "&" + "quot;",
    "'": "&" + "apos;",
  };
  return s.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}

export function storySeoCopy(story: Story) {
  return story.copy.fr ?? story.copy.en;
}

export function storyCanonical(story: Story, slug?: string): string {
  const path = slug || story.slugs.fr || story.slug;
  return `${SITE_URL}/story/${path}`;
}

export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    alternateName: ["Yes It's Real", "Yesitsreal.news"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/logo-stamp.jpg`,
      width: 512,
      height: 512,
    },
    description: SEO_FR.description,
    foundingDate: "2026",
    sameAs: SOCIAL.filter((s) => s.url.startsWith("http")).map((s) => s.url).slice(0, 8),
    publishingPrinciples: `${SITE_URL}/method`,
    ethicsPolicy: `${SITE_URL}/about`,
    correctionsPolicy: `${SITE_URL}/corrections`,
    diversityPolicy: `${SITE_URL}/about`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      email: "desk@yesitsreal.news",
      url: `${SITE_URL}/contact`,
      availableLanguage: ["French", "English", "Spanish"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["fr", "en", "es"],
    description: SEO_FR.description,
    publisher: { "@type": "NewsMediaOrganization", name: SITE_NAME, url: SITE_URL },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function itemListJsonLd(stories: Story[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "À la une — YES IT'S REAL",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: Math.min(stories.length, 12),
    itemListElement: stories.slice(0, 12).map((s, i) => {
      const c = storySeoCopy(s);
      return {
        "@type": "ListItem",
        position: i + 1,
        url: storyCanonical(s),
        name: c.headline,
      };
    }),
  };
}

export function breadcrumbJsonLd(story: Story) {
  const c = storySeoCopy(story);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: story.section,
        item: `${SITE_URL}/${story.section}`,
      },
      { "@type": "ListItem", position: 3, name: c.headline, item: storyCanonical(story) },
    ],
  };
}

export function articleJsonLd(story: Story, slug?: string) {
  const c = storySeoCopy(story);
  const img = coverSrc(story.id);
  const image = img ? (img.startsWith("http") ? img : `${SITE_URL}${img}`) : `${SITE_URL}/og.jpg`;
  const tape = videoObject(story.id);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: c.headline,
    description: c.dek,
    datePublished: story.publishedAt,
    dateModified: story.updatedAt || story.publishedAt,
    inLanguage: story.copy.fr ? "fr" : story.originalLang || "en",
    isAccessibleForFree: true,
    articleBody: c.body.join("\n\n"),
    mainEntityOfPage: storyCanonical(story, slug),
    url: storyCanonical(story, slug),
    image: [image],
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-stamp.jpg`, width: 512, height: 512 },
    },
    articleSection: story.section,
    keywords: ["pas de satire", "faits divers", story.countryName, story.section].join(", "),
    contentLocation: {
      "@type": "Place",
      name: `${story.location}, ${story.countryName}`,
    },
    citation: story.sources.map((s) => s.url),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "article p"] },
    ...(tape ? { associatedMedia: tape } : {}),
  };
}

function videoObject(storyId: string) {
  const v = getStoryVideo(storyId);
  if (!v) return null;
  return {
    "@type": "VideoObject",
    name: v.title,
    description: v.captions.fr ?? v.captions.en ?? v.title,
    embedUrl: v.youtubeId ? `https://www.youtube-nocookie.com/embed/${v.youtubeId}` : undefined,
    contentUrl: v.sourceUrl,
    publisher: { "@type": "Organization", name: v.publisher },
    inLanguage: v.originalLang,
    isFamilyFriendly: true,
  };
}
