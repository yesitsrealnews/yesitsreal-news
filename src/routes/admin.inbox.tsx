import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AssignForm } from "@/components/admin/assign-form";
import { useMergedInbox } from "@/lib/admin-inbox";
import { fetchStoredRss } from "@/lib/desk-rss-client";
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
  const ingestRss = useAppStore((s) => s.ingestRss);
  const rememberKilled = useAppStore((s) => s.rememberKilled);
  const publishQueueItem = useAppStore((s) => s.publishQueueItem);
  const deleteInboxItem = useAppStore((s) => s.deleteInboxItem);
  const navigate = useNavigate();
  const [pulling, setPulling] = useState(false);
  const [pullNote, setPullNote] = useState("");
  const [busyId, setBusyId] = useState("");
  const [publishNote, setPublishNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await fetchStoredRss();
      if (cancelled || !stored) return;
      if (stored.killed.length) rememberKilled(stored.killed);
      ingestRss(stored.items);
      if (stored.at) {
        const when = formatDateTime(stored.at, "fr");
        setPullNote(`${stored.count} pistes RSS en cache · dernier tirage ${when}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ingestRss, rememberKilled]);

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
      const data = (await res.json()) as {
        ok?: boolean;
        count?: number;
        items?: QueueItem[];
        failed?: string[];
        scanned?: number;
        killed?: string[];
      };
      if (!res.ok || !data.ok) {
        setPullNote("Les flux n’ont pas répondu. Réessaie dans une minute.");
        return;
      }
      ingestRss(data.items ?? []);
      if (data.killed?.length) rememberKilled(data.killed);
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
        body: JSON.stringify({ id: item.id, url: item.sourceUrl }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        window.alert("Suppression serveur échouée — la ligne reste hors file localement.");
      }
    } catch {
      window.alert("Réseau — suppression locale ok, sync serveur à refaire.");
    }
    setBusyId("");
  }

  return (
    <main className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">File d’attente</h1>
          <p className="mt-2 text-sm text-ink-muted">
            À relire avant publication. Hors ligne éditoriale : ça n’entre pas. Supprimer est définitif — la piste ne
            revient pas au prochain tirage.
          </p>
          {pullNote ? <p className="mt-2 text-sm text-signal">{pullNote}</p> : null}
          {publishNote ? <p className="mt-2 text-sm font-semibold text-true">{publishNote}</p> : null}
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
      <div className="mt-6 rounded-2xl border-2 border-ink bg-card p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
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
                <div className="mt-1 flex gap-3">
                  {item.leadImage ? (
                    <img
                      src={item.leadImage}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="mt-1 size-16 shrink-0 rounded-md border-2 border-ink object-cover"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <h2 className="font-serif text-xl">{c.headline}</h2>
                    <p className="mt-1 text-sm text-ink-muted">{c.dek}</p>
                    <p className="mt-2 text-xs text-ink-muted">
                      {item.story.sources.length} source{item.story.sources.length > 1 ? "s" : ""} ·{" "}
                      {item.submittedBy} · {formatDateTime(item.submittedAt, "fr")}
                      {item.leadImage ? " · visuel source" : ""}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="pop"
                  disabled={busyId === item.id}
                  onClick={() => {
                    setBusyId(item.id);
                    void publishQueueItem(item).then((ok) => {
                      setBusyId("");
                      setPublishNote(
                        ok
                          ? `« ${c.headline} » est en ligne.`
                          : "Publication ratée. Session ou réseau — reconnecte-toi si besoin.",
                      );
                    });
                  }}
                >
                  {busyId === item.id ? "Publication…" : "Publier"}
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
          <li className="py-8 text-sm">File vide. Les pistes du matin atterrissent ici. Tu peux aussi tirer les flux.</li>
        ) : null}
      </ul>
    </main>
  );
}
