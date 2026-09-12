import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import type { QueueItem, Story } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type RewriteMode = "spawn" | "inplace";

const MOCKERY_LABELS: Record<number, string> = {
  0: "Très plat — zéro moquerie",
  1: "Sobre, presque neutre",
  2: "Léger sourire",
  3: "Ironie soft (défaut desk)",
  4: "Moqueur assumé",
  5: "Très moqueur — pince-sans-rire",
};

function mockeryInstruction(level: number): string {
  const map: Record<number, string> = {
    0: "Ton : très plat, factuel, aucune moquerie, aucune ironie. Compte rendu sec.",
    1: "Ton : sobre, presque neutre. Une pointe d’humour au maximum, pas de moquerie.",
    2: "Ton : léger sourire. Ironie douce, pas acide.",
    3: "Ton : ironie soft desk YES IT’S REAL (défaut). Plat + un cran de distance amusée.",
    4: "Ton : moqueur assumé. Ironie française sèche, sans inventer ni viser le grief.",
    5: "Ton : très moqueur, pince-sans-rire. Monter le ridicule du fait, toujours vrai et sourcé, jamais inventé, jamais mineurs/grief.",
  };
  return map[level] ?? map[3];
}

export function RewriteControls({
  story,
  mode = "spawn",
  queueItem,
  onInPlace,
  className,
}: {
  story: Story;
  /** spawn = new À relire item (Tableau). inplace = same queue row / Relire fields. */
  mode?: RewriteMode;
  queueItem?: QueueItem;
  onInPlace?: (item: QueueItem) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [mockery, setMockery] = useState(3);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const navigate = useNavigate();

  async function submit() {
    setBusy(true);
    setErr("");
    const free = instructions.trim();
    const combined = [mockeryInstruction(mockery), free || null].filter(Boolean).join("\n\n");
    try {
      const res = await fetch("/api/desk-rewrite", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ storyId: story.id, instructions: combined, story, mockery }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; item?: QueueItem };
      if (!res.ok || !data.ok || !data.item) {
        setErr(data.message || "Réécriture impossible.");
        setBusy(false);
        return;
      }

      if (mode === "inplace" && queueItem) {
        const merged: QueueItem = {
          ...queueItem,
          story: {
            ...data.item.story,
            id: queueItem.story.id,
            status: "review",
          },
          pack: data.item.pack,
          submittedBy: `Réécriture · ${queueItem.story.id}`,
          submittedAt: data.item.submittedAt,
        };
        upsertInbox(merged);
        onInPlace?.(merged);
        setOpen(false);
        setInstructions("");
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
      <Button type="button" variant="outline" size="sm" className={className} onClick={() => setOpen(true)}>
        Réécrire
      </Button>
    );
  }

  return (
    <div className={`w-full max-w-md space-y-3 rounded border border-ink bg-paper-2 p-3 sm:w-80 ${className ?? ""}`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em]">Réécrire — consignes</p>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={`mockery-${story.id}`} className="text-xs font-semibold uppercase tracking-[0.1em]">
            Moquerie
          </label>
          <span className="text-[11px] text-ink-muted tabular-nums">{mockery}/5</span>
        </div>
        <input
          id={`mockery-${story.id}`}
          type="range"
          min={0}
          max={5}
          step={1}
          value={mockery}
          onChange={(e) => setMockery(Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-signal"
          aria-valuetext={MOCKERY_LABELS[mockery]}
        />
        <div className="flex justify-between text-[10px] uppercase tracking-wide text-ink-muted">
          <span>Moins</span>
          <span>Plus</span>
        </div>
        <p className="text-xs text-ink-muted">{MOCKERY_LABELS[mockery]}</p>
      </div>

      <Textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Consignes libres (optionnel) : syntaxe, calques EN, longueur…"
        className="min-h-20 bg-paper text-sm"
        maxLength={2000}
      />
      {err ? <p className="text-xs text-signal">{err}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={busy} onClick={() => void submit()}>
          {busy ? "Réécriture…" : "Lancer"}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
