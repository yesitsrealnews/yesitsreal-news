import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMergedInbox, useMergedRejected } from "@/lib/admin-inbox";
import { deskStories, publishedStories } from "@/lib/catalog";
import { storyCopy } from "@/lib/format";
import { makeQueueItem } from "@/lib/pipeline";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function statusBadge(status: string) {
  if (status === "held") return <span className="ms-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">Attente</span>;
  if (status === "deleted") return <span className="ms-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-800">Supprimé</span>;
  return <span className="ms-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">En ligne</span>;
}

function uneBadge(rank: number) {
  return (
    <span className="ms-2 rounded bg-signal/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-signal">
      Une #{rank}
    </span>
  );
}

function AdminHome() {
  const inbox = useMergedInbox();
  const rejected = useMergedRejected();
  const extras = useAppStore((s) => s.extras);
  const deskStatus = useAppStore((s) => s.deskStatus);
  const frontPageIds = useAppStore((s) => s.frontPageIds);
  const applyStoryDeskStatus = useAppStore((s) => s.applyStoryDeskStatus);
  const pinToFront = useAppStore((s) => s.pinToFront);
  const unpinFromFront = useAppStore((s) => s.unpinFromFront);
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const navigate = useNavigate();
  const published = publishedStories(extras, deskStatus);
  const online = deskStories(extras, deskStatus);
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
        <p className="mt-1 text-xs text-ink-muted">La une suit l’ordre des pastilles Une (#1 = hero).</p>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {online.slice(0, 40).map((s) => {
            const c = storyCopy(s, "fr");
            const override = deskStatus[s.id];
            const rowStatus = override ?? (s.status === "held" || s.status === "deleted" ? s.status : "published");
            const pinIndex = frontPageIds.indexOf(s.id);
            const isPinned = pinIndex >= 0;
            const isFirstPin = pinIndex === 0;
            const canPin = /^s\d+$/.test(s.id) && rowStatus !== "deleted";
            return (
              <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <a href={`/story/${s.slugs.fr || s.slug}`} className="min-w-0 flex-1 hover:bg-paper-2">
                  <p className="kicker text-signal">
                    {s.section}
                    {statusBadge(rowStatus)}
                    {isPinned ? uneBadge(pinIndex + 1) : null}
                  </p>
                  <p className="mt-1 font-serif text-lg">{c.headline}</p>
                  <p className="mt-1 text-sm text-ink-muted">{c.dek}</p>
                </a>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {canPin && !isFirstPin ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => void pinToFront(s.id)}>
                      {isPinned ? "Remonter en une" : "Mettre en une"}
                    </Button>
                  ) : null}
                  {canPin && isPinned ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => void unpinFromFront(s.id)}>
                      Retirer de la une
                    </Button>
                  ) : null}
                  {rowStatus !== "held" ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => void applyStoryDeskStatus(s.id, "held")}>
                      Attente
                    </Button>
                  ) : null}
                  {rowStatus !== "deleted" ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => void applyStoryDeskStatus(s.id, "deleted")}>
                      Supprimer
                    </Button>
                  ) : null}
                  {rowStatus === "held" || rowStatus === "deleted" ? (
                    <Button type="button" size="sm" onClick={() => void applyStoryDeskStatus(s.id, "published")}>
                      Remettre en ligne
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
