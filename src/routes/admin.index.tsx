import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMergedInbox, useMergedRejected } from "@/lib/admin-inbox";
import { publishedStories } from "@/lib/catalog";
import { storyCopy } from "@/lib/format";
import { makeQueueItem } from "@/lib/pipeline";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const inbox = useMergedInbox();
  const rejected = useMergedRejected();
  const extras = useAppStore((s) => s.extras);
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const navigate = useNavigate();
  const published = publishedStories(extras);
  const tiles = [
    { n: inbox.length, l: "À relire", to: "/admin/inbox" },
    { n: published.length, l: "En ligne", to: "/" },
    { n: rejected.length, l: "Refusés", to: "/admin/rejected" },
  ];

  function createPapier() {
    const item = makeQueueItem({
      url: "https://yesitsreal.news/cambuse/brouillon",
      notes: "Brouillon desk — à remplir.",
      country: "",
      name: "La Cambuse",
    });
    upsertInbox(item);
    void navigate({ to: "/admin/story/$id", params: { id: item.id } });
  }

  return (
    <main className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Tableau</h1>
          <p className="mt-2 text-sm text-ink-muted">Les titres ci-dessous sont en français, comme sur le journal.</p>
        </div>
        <Button type="button" onClick={createPapier}>
          Créer un papier
        </Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.l} to={t.to} className="border border-rule p-4 hover:bg-paper-2">
            <p className="font-serif text-4xl tabular-nums">{t.n}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">{t.l}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="kicker">Papiers en ligne</h2>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {published.slice(0, 24).map((s) => {
            const c = storyCopy(s, "fr");
            return (
              <li key={s.id} className="py-3">
                <a href={`/story/${s.slugs.fr || s.slug}`} className="block hover:bg-paper-2">
                  <p className="kicker text-signal">{s.section}</p>
                  <p className="mt-1 font-serif text-lg">{c.headline}</p>
                  <p className="mt-1 text-sm text-ink-muted">{c.dek}</p>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
