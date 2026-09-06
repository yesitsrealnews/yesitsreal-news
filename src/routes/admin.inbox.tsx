import { createFileRoute, Link } from "@tanstack/react-router";
import { useMergedInbox } from "@/lib/admin-inbox";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/admin/inbox")({ component: InboxPage });

function InboxPage() {
  const inbox = useMergedInbox();
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Inbox</h1>
      <p className="mt-2 text-sm text-ink-muted">Triage complete. Waiting on a human.</p>
      <ul className="mt-6 divide-y divide-rule border-y border-rule">
        {inbox.map((item) => (
          <li key={item.id} className="py-4">
            <Link to="/admin/story/$id" params={{ id: item.id }} className="block hover:bg-paper-2">
              <p className="kicker text-signal">{item.story.section} · {item.story.status}</p>
              <h2 className="mt-1 font-serif text-xl">{item.story.copy.en.headline}</h2>
              <p className="mt-1 text-sm text-ink-muted">{item.story.copy.en.dek}</p>
              <p className="mt-2 text-xs text-ink-muted">
                Dumbness {item.story.dumbness} · confidence {Math.round(item.pack.confidence * 100)}% ·{" "}
                {item.submittedBy} · {formatDateTime(item.submittedAt, "en")}
              </p>
            </Link>
          </li>
        ))}
        {inbox.length === 0 ? <li className="py-8 text-sm">Queue empty. The planet will refill it.</li> : null}
      </ul>
    </main>
  );
}
