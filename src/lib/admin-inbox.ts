import type { QueueItem } from "@/lib/types";
import { queueWithFrench } from "@/lib/desk-fr";
import { publishedStories } from "@/lib/catalog";
import { itemIsKilled } from "@/lib/rss-killed";
import { useAppStore } from "@/lib/store";

/** À relire = desk-assign Pre Pubs (+ local drafts). Never RSS / revue seeds. */
function isDeskQueueItem(item: QueueItem): boolean {
  const by = (item.submittedBy ?? "").trim();
  if (by.startsWith("Veille ·")) return false;
  return true;
}

export function useMergedInbox(): QueueItem[] {
  const inbox = useAppStore((s) => s.inbox);
  const extras = useAppStore((s) => s.extras);
  const purgedIds = useAppStore((s) => s.purgedIds);
  const deskStatus = useAppStore((s) => s.deskStatus);
  const live = new Set(publishedStories(extras, deskStatus).map((s) => s.id));
  const publishedExtraIds = extras
    .filter((s) => s.status === "published" || deskStatus[s.id] === "published")
    .map((s) => s.id);
  const killed = new Set(
    Object.entries(deskStatus)
      .filter(([, v]) => v === "deleted")
      .map(([id]) => id),
  );
  const gone = new Set([...purgedIds, ...publishedExtraIds, ...live, ...killed]);
  const alive = inbox.filter((i) => isDeskQueueItem(i) && !itemIsKilled(i, gone));
  return alive.map(queueWithFrench).sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
}
