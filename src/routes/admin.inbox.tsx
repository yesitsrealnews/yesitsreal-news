import { createFileRoute, Link } from "@tanstack/react-router";
import { useMergedInbox } from "@/lib/admin-inbox";
import { formatDateTime, storyCopy } from "@/lib/format";

export const Route = createFileRoute("/admin/inbox")({ component: InboxPage });

function InboxPage() {
  const inbox = useMergedInbox();
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">File d’attente</h1>
      <p className="mt-2 text-sm text-ink-muted">À relire avant publication. Titres en français.</p>
      <ul className="mt-6 divide-y divide-rule border-y border-rule">
        {inbox.map((item) => {
          const c = storyCopy(item.story, "fr");
          return (
            <li key={item.id} className="py-4">
              <Link to="/admin/story/$id" params={{ id: item.id }} className="block hover:bg-paper-2">
                <p className="kicker text-signal">
                  {item.story.section} · {item.story.status}
                </p>
                <h2 className="mt-1 font-serif text-xl">{c.headline}</h2>
                <p className="mt-1 text-sm text-ink-muted">{c.dek}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  Bêtise {item.story.dumbness} · confiance {Math.round(item.pack.confidence * 100)} % ·{" "}
                  {formatDateTime(item.submittedAt, "fr")}
                </p>
              </Link>
            </li>
          );
        })}
        {inbox.length === 0 ? (
          <li className="py-8 text-sm">File vide. Les papiers déjà en ligne sont dans Tableau.</li>
        ) : null}
      </ul>
    </main>
  );
}
