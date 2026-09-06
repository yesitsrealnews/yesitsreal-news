import { createFileRoute, Link } from "@tanstack/react-router";
import { useMergedInbox, useMergedRejected } from "@/lib/admin-inbox";
import { publishedStories } from "@/lib/catalog";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const inbox = useMergedInbox();
  const rejected = useMergedRejected();
  const extras = useAppStore((s) => s.extras);
  const published = publishedStories(extras);
  const tiles = [
    { n: inbox.length, l: "In queue", to: "/admin/inbox" },
    { n: published.length, l: "On the paper", to: "/" },
    { n: rejected.length, l: "Rejected", to: "/admin/rejected" },
    { n: extras.length, l: "Desk publishes", to: "/admin/inbox" },
  ];
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Overview</h1>
      <p className="mt-2 text-sm text-ink-muted">The human step is the only required step. Everything else proposes.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.l} to={t.to} className="border border-rule p-4 hover:bg-paper-2">
            <p className="font-serif text-4xl tabular-nums">{t.n}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">{t.l}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="kicker">Pipeline</h2>
        <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm">
          <li>Ingest RSS, gazettes, dockets, reader URLs.</li>
          <li>Triage: real vs satire, dumbness, flags.</li>
          <li>Draft 400–900 words, sources extracted.</li>
          <li>Fact-check pack for the desk.</li>
          <li>You: approve, edit, reject, schedule.</li>
          <li>Translate and push.</li>
        </ol>
      </section>
    </main>
  );
}
