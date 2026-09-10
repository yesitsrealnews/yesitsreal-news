export const SITE_NAME = "YES IT'S REAL";
export const SITE_DOMAIN = "yesitsreal.news";
export const SITE_URL = `https://www.${SITE_DOMAIN}`;

/** Production compute: Vercel, US East (Washington, D.C.). US company. */
export const HOSTING = {
  provider: "Vercel Inc.",
  country: "United States",
  region: "Washington, D.C. (iad1)",
  city: "San Francisco, California",
  url: "https://vercel.com",
} as const;

export const EMAILS = {
  desk: `desk@${SITE_DOMAIN}`,
  press: `press@${SITE_DOMAIN}`,
  ads: `ads@${SITE_DOMAIN}`,
  advertisers: `advertisers@${SITE_DOMAIN}`,
  investors: `investors@${SITE_DOMAIN}`,
  contest: `contest@${SITE_DOMAIN}`,
  game: `game@${SITE_DOMAIN}`,
  legal: `legal@${SITE_DOMAIN}`,
  security: `security@${SITE_DOMAIN}`,
  jobs: `jobs@${SITE_DOMAIN}`,
} as const;

export type SocialId =
  | "x"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "threads"
  | "bluesky"
  | "telegram"
  | "whatsapp"
  | "linkedin"
  | "rss";

export interface SocialAccount {
  id: SocialId;
  name: string;
  handle: string;
  url: string;
  bio: string;
  cadence: string;
  live?: boolean;
}

export const SOCIAL: SocialAccount[] = [
  {
    id: "x",
    name: "X",
    handle: "@yesitsrealnews",
    url: "https://x.com/yesitsrealnews",
    bio: "Real news. Unbelievably dumb. It really happened. Sources under every post.",
    cadence: "LIVE · Breaking + 6 posts/day",
    live: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@yesitsreal.news",
    url: "https://www.instagram.com/yesitsreal.news",
    bio: "TRUE stamps, source screenshots, the Cup.",
    cadence: "Reels + 1 carousel/day",
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "@yesitsreal",
    url: "https://www.tiktok.com/@yesitsreal",
    bio: "15 seconds. It's real. The ducks are entitled.",
    cadence: "Daily A-roll + text overlay",
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@yesitsreal",
    url: "https://www.youtube.com/@yesitsreal",
    bio: "The briefing, scored. Weekly dumbness recap.",
    cadence: "2 shorts/day + 1 recap/week",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "yesitsreal.news",
    url: "https://www.facebook.com/yesitsreal.news",
    bio: "Share the minute. Shame the committee.",
    cadence: "Link posts + groups",
  },
  {
    id: "threads",
    name: "Threads",
    handle: "@yesitsreal",
    url: "https://www.threads.net/@yesitsreal",
    bio: "The comments are dumber. The news is true.",
    cadence: "Quote the headline, pin the source",
  },
  {
    id: "bluesky",
    name: "Bluesky",
    handle: "@yesitsreal.news",
    url: "https://bsky.app/profile/yesitsreal.news",
    bio: "Verified absurdity. No ragebait fakes.",
    cadence: "Mirror of X, extra sources",
  },
  {
    id: "telegram",
    name: "Telegram",
    handle: "t.me/yesitsreal",
    url: "https://t.me/yesitsreal",
    bio: "One true embarrassment, pushed.",
    cadence: "Push on every publish",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    handle: "YES IT'S REAL",
    url: "https://www.whatsapp.com/channel/yesitsreal",
    bio: "The channel your uncle will forward correctly, for once.",
    cadence: "Daily drop",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "yes-its-real",
    url: "https://www.linkedin.com/company/yes-its-real",
    bio: "For the people who wrote the minutes.",
    cadence: "B2B native + media kit",
  },
  {
    id: "rss",
    name: "RSS",
    handle: "/rss.xml",
    url: "/rss.xml",
    bio: "The original social network.",
    cadence: "Every story",
  },
];

export function socialById(id: SocialId): SocialAccount {
  return SOCIAL.find((s) => s.id === id) ?? SOCIAL[0];
}
