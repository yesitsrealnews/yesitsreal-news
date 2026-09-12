import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMergedInbox } from "@/lib/admin-inbox";
import { deskStories, publishedStories } from "@/lib/catalog";
import { storyCopy } from "@/lib/format";
import { makeQueueItem } from "@/lib/pipeline";
import { useAppStore } from "@/lib/store";
import type { QueueItem, Story } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

function RewriteControls({ story }: { story: Story }) {
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const navigate = useNavigate();

  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/desk-rewrite", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ storyId: story.id, instructions, story }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; item?: QueueItem };
      if (!res.ok || !data.ok || !data.item) {
        setErr(data.message || "Réécriture impossible.");
        setBusy(false);
        return;
      }
      upsertInbox(data.item);
      void navigate({ to: "/admin/story/$id", params: { id: data.item.id } });
    } catch {
      setErr("Réseau / session. Réessaie.");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        Réécrire
      </Button>
    );
  }

  return (
    <div className="w-full max-w-md space-y-2 rounded border border-ink bg-paper-2 p-3 sm:w-80">
      <p className="text-xs font-bold uppercase tracking-[0.12em]">Réécrire — consignes</p>
      <Textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Ex. : FR plus moqueur, syntaxe impeccable, moins de calque EN…"
        className="min-h-24 bg-paper text-sm"
        maxLength={2000}
      />
      {err ? <p className="text-xs text-signal">{err}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={busy || instructions.trim().length < 8} onClick={() => void submit()}>
          {busy ? "Réécriture…" : "Lancer"}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </div>
  );
}

function AdminHome() {
  const inbox = useMergedInbox();
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
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/assign">Commander un papier</Link>
          </Button>
          <Button type="button" onClick={createPapier}>
            Créer un papier
          </Button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.l} to={t.to} className="border border-rule p-4 hover:bg-paper-2">
            <p className="font-serif text-4xl tabular-nums">{t.n}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">{t.l}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="kicker">Papiers en ligne</h2>
        <p className="mt-1 text-xs text-ink-muted">La une suit l’ordre des pastilles Une (#1 = hero). Réécrire = consignes → file à relire.</p>
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
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex flex-wrap justify-end gap-2">
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void applyStoryDeskStatus(s.id, "deleted");
                        }}
                      >
                        Supprimer
                      </Button>
                    ) : null}
                    {rowStatus === "held" ? (
                      <Button type="button" size="sm" onClick={() => void applyStoryDeskStatus(s.id, "published")}>
                        Remettre en ligne
                      </Button>
                    ) : null}
                    {rowStatus !== "deleted" ? <RewriteControls story={s} /> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
