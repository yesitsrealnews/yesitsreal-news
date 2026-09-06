import { SOCIAL } from "@/lib/brand";
import { STORIES } from "@/lib/data/stories";

export interface DeskPost {
  id: string;
  network: string;
  handle: string;
  time: string;
  text: string;
  href: string;
  faves: number;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function deskFeed(now = Date.UTC(2026, 7, 28, 12, 0, 0)): DeskPost[] {
  const published = STORIES.filter((s) => s.status === "published" && !s.sponsored).slice(0, 12);
  const nets = SOCIAL.filter((s) => s.id !== "rss");
  return published.map((s, i) => {
    const net = nets[i % nets.length];
    const copy = s.copy.en;
    const ageH = 1 + (hash(s.id) % 18);
    return {
      id: `p-${s.id}-${net.id}`,
      network: net.name,
      handle: net.handle,
      time: new Date(now - ageH * 3600_000).toISOString(),
      text: `${copy.headline}\n\nIt's real. ${s.sources.length} sources. Dumbness ${s.dumbness}/10.`,
      href: `/story/${s.slug}`,
      faves: 120 + (hash(s.id + net.id) % 8400),
    };
  });
}

export const CONTENT_CALENDAR = [
  { slot: "07:00", item: "Overnight dumbness — one sourced post on X + Telegram" },
  { slot: "09:30", item: "TikTok A-roll: read the minute, smash cut to the duck" },
  { slot: "12:00", item: "Instagram carousel: headline / source / why-dumb" },
  { slot: "15:00", item: "Cup vote prompt. Country vs country." },
  { slot: "18:00", item: "YouTube short + LinkedIn for the people who filed it" },
  { slot: "21:00", item: "Most-read recap. Ask for submissions with a URL." },
];
