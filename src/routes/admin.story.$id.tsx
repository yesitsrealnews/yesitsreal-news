import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMergedInbox } from "@/lib/admin-inbox";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { storyCopy } from "@/lib/format";
import type { StoryCopy } from "@/lib/types";

export const Route = createFileRoute("/admin/story/$id")({ component: StoryEditor });

function StoryEditor() {
  const { id } = Route.useParams();
  const inbox = useMergedInbox();
  const item = inbox.find((i) => i.id === id);
  const publishQueueItem = useAppStore((s) => s.publishQueueItem);
  const rejectQueueItem = useAppStore((s) => s.rejectQueueItem);
  const holdInboxItem = useAppStore((s) => s.holdInboxItem);
  const deleteInboxItem = useAppStore((s) => s.deleteInboxItem);
  const updateStory = useAppStore((s) => s.updateStory);
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const frontPageIds = useAppStore((s) => s.frontPageIds);
  const pinToFront = useAppStore((s) => s.pinToFront);
  const unpinFromFront = useAppStore((s) => s.unpinFromFront);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"draft" | "sources" | "facts">("draft");
  const fr = item ? storyCopy(item.story, "fr") : undefined;
  const [hed, setHed] = useState(fr?.headline ?? "");
  const [dek, setDek] = useState(fr?.dek ?? "");
  const [body, setBody] = useState(fr?.body.join("\n\n") ?? "");
  const [reason, setReason] = useState("");

  if (!item) {
    return (
      <main className="p-6">
        <p>Pas dans la file.</p>
        <Link to="/admin/inbox" className="underline">
          File d’attente
        </Link>
      </main>
    );
  }

  const current = item;
  const tabs = { draft: "Texte FR", sources: "Sources", facts: "Faits" } as const;

  function nextFr(): StoryCopy {
    const base = storyCopy(current.story, "fr");
    return {
      ...base,
      headline: hed,
      dek,
      body: body.split(/\n\n+/).filter(Boolean),
    };
  }

  function persistDraft() {
    const next = {
      ...current.story,
      copy: { ...current.story.copy, fr: nextFr() },
    };
    upsertInbox({ ...current, story: next });
    updateStory(next);
  }

  return (
    <main className="p-4 md:p-6">
      <p className="kicker text-signal">
        {current.story.section} · {current.story.location}
      </p>
      <h1 className="mt-2 font-serif text-2xl md:text-3xl">Relire en français</h1>
      <div className="mt-4 flex gap-2">
        {(["draft", "sources", "facts"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`h-10 px-3 text-xs font-semibold uppercase tracking-[0.12em] ${tab === k ? "bg-ink text-paper" : "border border-rule"}`}
          >
            {tabs[k]}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          {tab === "draft" ? (
            <div className="space-y-3">
              <Input value={hed} onChange={(e) => setHed(e.target.value)} />
              <Textarea value={dek} onChange={(e) => setDek(e.target.value)} className="min-h-20" />
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-72" />
            </div>
          ) : null}
          {tab === "sources" ? (
            <ul className="space-y-3 text-sm">
              {current.story.sources.map((s) => (
                <li key={s.url} className="border border-rule p-3">
                  <p className="font-medium">{s.publisher}</p>
                  <a className="underline" href={s.url}>
                    {s.title}
                  </a>
                  <p className="text-xs text-ink-muted">
                    {s.date} · {s.type}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
          {tab === "facts" ? (
            <div className="space-y-3 text-sm">
              <p>Confiance {Math.round(current.pack.confidence * 100)} %</p>
              <p>{current.pack.dumbnessRationale}</p>
              <table className="w-full border border-rule text-left text-xs">
                <thead className="bg-paper-2">
                  <tr>
                    <th className="p-2">Affirmation</th>
                    <th className="p-2">Source</th>
                    <th className="p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {current.pack.claims.map((c) => (
                    <tr key={c.claim} className="border-t border-rule">
                      <td className="p-2">{c.claim}</td>
                      <td className="p-2">{c.source}</td>
                      <td className="p-2 uppercase">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
        <aside className="border border-rule p-4">
          <p className="kicker">Décision</p>
          <div className="mt-4 flex flex-col gap-2">
            {/^s\d+$/.test(current.story.id) ? (
              <>
                {frontPageIds[0] !== current.story.id ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void pinToFront(current.story.id)}
                  >
                    {frontPageIds.includes(current.story.id) ? "Remonter en une" : "Mettre en une"}
                  </Button>
                ) : (
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal">Une #1 (hero)</p>
                )}
                {frontPageIds.includes(current.story.id) ? (
                  <Button type="button" variant="outline" onClick={() => void unpinFromFront(current.story.id)}>
                    Retirer de la une
                  </Button>
                ) : null}
              </>
            ) : null}
            <Button
              onClick={() => {
                persistDraft();
                publishQueueItem({
                  ...current,
                  story: { ...current.story, copy: { ...current.story.copy, fr: nextFr() } },
                });
                void navigate({ to: "/admin/inbox" });
              }}
            >
              Publier
            </Button>
            <Button variant="outline" onClick={persistDraft}>
              Enregistrer
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                persistDraft();
                holdInboxItem({
                  ...current,
                  story: { ...current.story, copy: { ...current.story.copy, fr: nextFr() } },
                });
                void navigate({ to: "/admin/inbox" });
              }}
            >
              Mettre en attente
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                deleteInboxItem(current.id);
                void navigate({ to: "/admin/inbox" });
              }}
            >
              Supprimer de la file
            </Button>
            <Input placeholder="Motif du refus" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Button
              variant="outline"
              onClick={() => {
                rejectQueueItem(current, reason || "Refus desk");
                void navigate({ to: "/admin/inbox" });
              }}
            >
              Refuser
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
