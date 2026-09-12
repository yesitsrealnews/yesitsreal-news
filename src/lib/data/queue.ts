import type { QueueItem, Story } from "@/lib/types";
import { REVUE_STORIES } from "@/lib/data/stories-revue";

function revueItem(story: Story): QueueItem {
  const fr = story.copy.fr ?? story.copy.en;
  return {
    id: story.id,
    submittedBy: "Veille · revue de presse",
    submittedAt: story.publishedAt,
    sourceUrl: story.sources[0]!.url,
    pack: {
      confidence: story.confidence,
      claims: story.sources.slice(0, 3).map((s) => ({
        claim: s.title,
        source: s.publisher,
        status: "supported" as const,
      })),
      stillNeeds: [],
      suggestedEdits: ["Relire. Si ça tient, Publier. Ça ne part pas tout seul."],
      dumbnessRationale: fr.whyDumb[0],
    },
    story: { ...story, status: "review", factChecked: true },
  };
}

export const SEED_INBOX: QueueItem[] = REVUE_STORIES.map(revueItem);

export const SEED_REJECTED: QueueItem[] = [];
