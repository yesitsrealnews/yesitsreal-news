import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMergedInbox } from "@/lib/admin-inbox";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { mockTranslate } from "@/lib/pipeline";
import type { StoryCopy } from "@/lib/types";

export const Route = createFileRoute("/admin/story/$id")({ component: StoryEditor });

const EMPTY: StoryCopy = {
  headline: "",
  dek: "",
  body: [],
  whyDumb: ["", "", ""],
  factCheckNote: "",
};

function StoryEditor() {
  const { id } = Route.useParams();
  const inbox = useMergedInbox();
  const item = inbox.find((i) => i.id === id);
  const publishQueueItem = useAppStore((s) => s.publishQueueItem);
  const rejectQueueItem = useAppStore((s) => s.rejectQueueItem);
  const updateStory = useAppStore((s) => s.updateStory);
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"draft" | "sources" | "facts">("draft");
  const [hed, setHed] = useState(item?.story.copy.en.headline ?? "");
  const [dek, setDek] = useState(item?.story.copy.en.dek ?? "");
  const [body, setBody] = useState(item?.story.copy.en.body.join("\n\n") ?? "");
  const [reason, setReason] = useState("");

  const translated = useMemo(() => mockTranslate(item?.story.copy.en ?? EMPTY, "fr"), [item]);

  if (!item) {
    return (
      <main className="p-6">
        <p>Not in the queue.</p>
        <Link to="/admin/inbox" className="underline">
          Inbox
        </Link>
      </main>
    );
  }

  const current = item;

  function persistDraft() {
    const next = {
      ...current.story,
      copy: {
        ...current.story.copy,
        en: {
          ...current.story.copy.en,
          headline: hed,
          dek,
          body: body.split(/\n\n+/).filter(Boolean),
        },
      },
    };
    upsertInbox({ ...current, story: next });
    updateStory(next);
  }

  return (
    <main className="p-4 md:p-6">
      <p className="kicker text-signal">
        {current.story.section} · {current.story.location}
      </p>
      <h1 className="mt-2 font-serif text-2xl md:text-3xl">Review</h1>
      <div className="mt-4 flex gap-2">
        {(["draft", "sources", "facts"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`h-10 px-3 text-xs font-semibold uppercase tracking-[0.12em] ${tab === k ? "bg-ink text-paper" : "border border-rule"}`}
          >
            {k}
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
              <p className="text-xs text-ink-muted">French machine draft (lock pending): {translated.headline}</p>
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
              <p>Confidence {Math.round(current.pack.confidence * 100)}%</p>
              <p>{current.pack.dumbnessRationale}</p>
              <table className="w-full border border-rule text-left text-xs">
                <thead className="bg-paper-2">
                  <tr>
                    <th className="p-2">Claim</th>
                    <th className="p-2">Source</th>
                    <th className="p-2">Status</th>
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
              <p className="kicker">Still needs</p>
              <ul className="list-disc ps-5">
                {current.pack.stillNeeds.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="kicker">Suggested edits</p>
              <ul className="list-disc ps-5">
                {current.pack.suggestedEdits.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <aside className="border border-rule p-4">
          <p className="kicker">Desk actions</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              onClick={() => {
                persistDraft();
                publishQueueItem({
                  ...current,
                  story: {
                    ...current.story,
                    copy: {
                      ...current.story.copy,
                      en: {
                        ...current.story.copy.en,
                        headline: hed,
                        dek,
                        body: body.split(/\n\n+/).filter(Boolean),
                      },
                    },
                  },
                });
                void navigate({ to: "/admin/inbox" });
              }}
            >
              Publish now
            </Button>
            <Button variant="outline" onClick={persistDraft}>
              Save edit
            </Button>
            <Input placeholder="Reject reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Button
              variant="outline"
              onClick={() => {
                rejectQueueItem(current, reason || "Desk reject");
                void navigate({ to: "/admin/inbox" });
              }}
            >
              Reject
            </Button>
            <Button variant="ghost" disabled>
              Schedule (preview)
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
