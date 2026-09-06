export type AdKind = "leaderboard" | "sidebar" | "inarticle" | "anchor" | "native";

export interface Creative {
  id: string;
  kind: AdKind | "any";
  kicker: string;
  title: string;
  dek: string;
  cta: string;
  href: string;
  image?: string;
  partner: string;
}

export const CREATIVES: Creative[] = [
  {
    id: "cup",
    kind: "any",
    kicker: "World Dumbness Cup",
    title: "Vote. Shame a country. Win the planet.",
    dek: "The only global contest where the prize is being right about how wrong we are.",
    cta: "Enter the Cup",
    href: "/contest",
    image: "/ads/cup.jpg",
    partner: "YES IT'S REAL",
  },
  {
    id: "merch",
    kind: "any",
    kicker: "Desk merch",
    title: "The TRUE stamp. Wear the correction.",
    dek: "Heavy black tee. Red stamp. No slogan long enough to become a memo.",
    cta: "Get the shirt",
    href: "/membership",
    image: "/ads/merch.jpg",
    partner: "YES IT'S REAL Shop",
  },
  {
    id: "vpn",
    kind: "any",
    kicker: "Partner",
    title: "Hide your search history from entitled ducks.",
    dek: "A dummy network slot. Swap this creative for AdSense / Ad Manager.",
    cta: "Media kit",
    href: "/advertise",
    partner: "DummyFill VPN",
  },
  {
    id: "breadlock",
    kind: "native",
    kicker: "Partner",
    title: "BreadLock™ — the feeder they voted to ban.",
    dek: "Native slot. Labeled. The news stays unsold.",
    cta: "Advertise here",
    href: "/advertise",
    partner: "Municipal Snacks Co.",
  },
  {
    id: "deskpass",
    kind: "any",
    kicker: "Membership",
    title: "Ad-light. Queue-early. Same planet.",
    dek: "Optional. The facts do not change if you pay.",
    cta: "Join the desk list",
    href: "/membership",
    partner: "YES IT'S REAL+",
  },
  {
    id: "jobs",
    kind: "any",
    kicker: "The desk is hiring",
    title: "Get paid to notice when civilization glitches.",
    dek: "Stringers in 31 languages. €75–250 a published story. The TRUE stamp is the paycheck.",
    cta: "Open careers",
    href: "/careers",
    partner: "YES IT'S REAL desk",
  },
  {
    id: "shop",
    kind: "any",
    kicker: "72-hour window",
    title: "Membership, merch, tips. The news stays free.",
    dek: "Opening rates. No card charged until Stripe is pasted. The intent is the till.",
    cta: "Open the shop",
    href: "/shop",
    partner: "YES IT'S REAL Shop",
  },
];

export function creativeFor(slot: AdKind, salt: string): Creative {
  const pool = CREATIVES.filter((c) => c.kind === slot || c.kind === "any");
  let h = 0;
  for (let i = 0; i < salt.length; i++) h = (h + salt.charCodeAt(i) * (i + 1)) % pool.length;
  return pool[h] ?? CREATIVES[0];
}
