import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AssignForm } from "@/components/admin/assign-form";
import { useMergedInbox } from "@/lib/admin-inbox";
import { formatDateTime, storyCopy } from "@/lib/format";
import { makeQueueItem } from "@/lib/pipeline";
import type { QueueItem } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { RewriteControls } from "@/components/admin/rewrite-controls";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/inbox")({ component: InboxPage });

function InboxPage() {
  const inbox = useMergedInbox();
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const setInbox = useAppStore((s) => s.setInbox);
  const publishQueueItem = useAppStore((s) => s.publishQueueItem);
  const rejectQueueItem = useAppStore((s) => s.rejectQueueItem);
  const deleteInboxItem = useAppStore((s) => s.deleteInboxItem);
  const purgedIds = useAppStore((s) => s.purgedIds);
  const navigate = useNavigate();
  const [pulling, setPulling] = useState(false);
  const [pullNote, setPullNote] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/rss-pull?stored=1", { credentials: "include" });
        const data = (await res.json()) as { ok?: boolean; count?: number; at?: string; items?: QueueItem[] };
        if (cancelled || !res.ok || !data.ok) return;
        for (const item of data.items ?? []) upsertInbox(item);
        if (data.at) {
          const when = formatDateTime(data.at, "fr");
          setPullNote(`${data.count ?? 0} pistes RSS en cache · dernier tirage ${when}`);
        }
      } catch {
        /* preview without desk cookie is fine */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [upsertInbox]);

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

  async function pullRss() {
    setPulling(true);
    setPullNote("");
    try {
      const res = await fetch("/api/rss-pull", { method: "POST", credentials: "include" });
      const data = (await res.json()) as { ok?: boolean; count?: number; items?: QueueItem[]; failed?: string[]; scanned?: number };
      if (!res.ok || !data.ok) {
        setPullNote("Les flux n’ont pas répondu. Réessaie dans une minute.");
        return;
      }
      for (const item of data.items ?? []) upsertInbox(item);
      const fail = data.failed?.length ? ` · silencieux : ${data.failed.slice(0, 4).join(", ")}` : "";
      setPullNote(`${data.count ?? 0} pistes sur ${data.scanned ?? "?"} flux${fail}`);
    } catch {
      setPullNote("Réseau. Réessaie.");
    } finally {
      setPulling(false);
    }
  }

  async function dismissItem(item: QueueItem) {
    setBusyId(item.id);
    deleteInboxItem(item.id);
    try {
      const res = await fetch("/api/desk-assign", {
        method: "DELETE",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = (await res.json()) as { ok?: boolean; items?: QueueItem[] };
      if (res.ok && data.ok && Array.isArray(data.items)) {
        const purged = new Set(purgedIds);
        purged.add(item.id);
        if (item.story?.id) purged.add(item.story.id);
        setInbox(data.items.filter((it) => it?.id && !purged.has(it.id) && !purged.has(it.story?.id)));
      } else {
        rejectQueueItem(item, "Proposition refusée en Cambuse");
      }
    } catch {
      rejectQueueItem(item, "Proposition refusée en Cambuse");
    }
    setBusyId("");
  }

  return (
    <main className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">File d’attente</h1>
          <p className="mt-2 text-sm text-ink-muted">À relire avant publication. Titres en français. Pre Pubs ici. Publier = en ligne. Réécrire = consignes → même Pre Pub. Supprimer = destruction définitive (pas d’archive).</p>
          {pullNote ? <p className="mt-2 text-sm text-signal">{pullNote}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void pullRss()} disabled={pulling}>
            {pulling ? "Lecture des flux…" : "Tirer les flux RSS"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/assign">Commander un papier</Link>
          </Button>
          <Button type="button" onClick={createPapier}>
            Créer un papier
          </Button>
        </div>
      </div>
      <div className="mt-6 border border-rule bg-paper-2 p-4">
        <p className="kicker text-signal">Vous avez repéré un sujet</p>
        <p className="mt-1 text-sm text-ink-muted">
          Collez le fait et l’URL. La desk rédige. Vous relisez.{" "}
          <Link to="/admin/assign" className="underline">
            Plus d’options
          </Link>
        </p>
        <div className="mt-4">
          <AssignForm compact />
        </div>
      </div>
      <ul className="mt-6 divide-y divide-rule border-y border-rule">
        {inbox.map((item) => {
          const c = storyCopy(item.story, "fr");
          const isPre = item.submittedBy.startsWith("Pre Pub") || item.submittedBy.startsWith("Veille");
          return (
            <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
              <Link to="/admin/story/$id" params={{ id: item.id }} className="min-w-0 flex-1 hover:bg-paper-2">
                <p className="kicker text-signal">
                  {item.story.section} · {item.story.status}
                  {item.submittedBy.startsWith("RSS") ? " · RSS" : ""}
                  {item.submittedBy.startsWith("Commande") ? " · Commande" : ""}
                  {isPre ? " · Pre Pub" : ""}
                </p>
                <h2 className="mt-1 font-serif text-xl">{c.headline}</h2>
                <p className="mt-1 text-sm text-ink-muted">{c.dek}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  Bêtise {item.story.dumbness} · confiance {Math.round(item.pack.confidence * 100)} % ·{" "}
                  {item.submittedBy} · {formatDateTime(item.submittedAt, "fr")}
                </p>
              </Link>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={busyId === item.id}
                  onClick={() => {
                    publishQueueItem(item);
                  }}
                >
                  Publier
                </Button>
                <Button type="button" size="sm" variant="outline" asChild>
                  <Link to="/admin/story/$id" params={{ id: item.id }}>
                    Relire
                  </Link>
                </Button>
                <RewriteControls
                  story={item.story}
                  mode="inplace"
                  queueItem={item}
                  onInPlace={(merged) => {
                    void navigate({ to: "/admin/story/$id", params: { id: merged.id } });
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyId === item.id}
                  onClick={() => void dismissItem(item)}
                >
                  {busyId === item.id ? "…" : "Supprimer"}
                </Button>
              </div>
            </li>
          );
        })}
        {inbox.length === 0 ? (
          <li className="py-8 text-sm">File vide. Tire les flux RSS, ou les papiers déjà en ligne sont dans Tableau.</li>
        ) : null}
      </ul>
    </main>
  );
}
