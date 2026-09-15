import type { QueueItem } from "@/lib/types";
import { SEED_INBOX } from "@/lib/data/queue";
import { queueWithFrench } from "@/lib/desk-fr";
import { publishedStories } from "@/lib/catalog";
import { useAppStore } from "@/lib/store";

export function useMergedInbox(): QueueItem[] {
  const inbox = useAppStore((s) => s.inbox);
  const extras = useAppStore((s) => s.extras);
  const purgedIds = useAppStore((s) => s.purgedIds);
  const deskStatus = useAppStore((s) => s.deskStatus);
  const live = new Set(publishedStories(extras, deskStatus).map((s) => s.id));
  const publishedExtraIds = extras
    .filter((s) => s.status === "published" || deskStatus[s.id] === "published")
    .map((s) => s.id);
  const gone = new Set([...purgedIds, ...publishedExtraIds, ...live]);
  const alive = inbox.filter((i) => !gone.has(i.id) && !gone.has(i.story?.id));
  const ids = new Set(alive.map((i) => i.id));
  const seeds = SEED_INBOX.filter((i) => !gone.has(i.id) && !gone.has(i.story?.id) && !ids.has(i.id));
  return [...alive, ...seeds]
    .map(queueWithFrench)
    .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
}