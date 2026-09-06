import type { QueueItem } from "@/lib/types";
import { SEED_INBOX, SEED_REJECTED } from "@/lib/data/queue";
import { useAppStore } from "@/lib/store";

export function useMergedInbox(): QueueItem[] {
  const inbox = useAppStore((s) => s.inbox);
  const rejected = useAppStore((s) => s.rejected);
  const extras = useAppStore((s) => s.extras);
  const gone = new Set([...rejected.map((i) => i.id), ...extras.map((s) => s.id)]);
  const ids = new Set(inbox.map((i) => i.id));
  const seeds = SEED_INBOX.filter((i) => !gone.has(i.id) && !ids.has(i.id));
  return [...inbox, ...seeds];
}

export function useMergedRejected(): QueueItem[] {
  const rejected = useAppStore((s) => s.rejected);
  const ids = new Set(rejected.map((i) => i.id));
  return [...rejected, ...SEED_REJECTED.filter((i) => !ids.has(i.id))];
}
