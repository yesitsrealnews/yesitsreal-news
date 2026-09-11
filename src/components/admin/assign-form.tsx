import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SECTIONS } from "@/lib/data/sections";
import { useAppStore } from "@/lib/store";
import type { QueueItem, SectionId } from "@/lib/types";
import { VOICES, type VoiceId } from "@/lib/voices";

const SECTION_FR: Record<SectionId, string> = {
  world: "Monde",
  accidents: "Accidents",
  stars: "Célébrités",
  science: "Science",
  "faits-divers": "Faits divers",
  crime: "Crime & ratés",
  politics: "Politique",
  animals: "Animaux",
  tech: "Tech",
  sports: "Sports",
  "love-money": "Amour & argent",
  courts: "Justice",
  commentaire: "Commentaire",
  archive: "Archives",
};

const VOICE_ORDER: VoiceId[] = [
  "desk",
  "thompson",
  "londres",
  "ephron",
  "didion",
  "wolfe",
  "talese",
  "gellhorn",
  "hitchens",
];

const selectClass =
  "h-11 w-full border border-rule bg-card px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

export function AssignForm({ compact = false }: { compact?: boolean }) {
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [url, setUrl] = useState("");
  const [extraUrls, setExtraUrls] = useState("");
  const [notes, setNotes] = useState("");
  const [country, setCountry] = useState("");
  const [section, setSection] = useState("");
  const [voice, setVoice] = useState<VoiceId>("desk");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    if (subject.trim().length < 8 && !url.trim()) {
      setMsg("Un sujet, ou une URL. Les deux, c’est mieux.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/desk-assign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          url: url.trim(),
          extraUrls,
          notes,
          country,
          section,
          voice,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        reason?: string;
        warning?: string | null;
        item?: QueueItem;
      };
      if (!res.ok || !data.ok || !data.item) {
        setMsg(data.message || (res.status === 429 ? "Trop de commandes. Attendez un peu." : "La desk n’a pas pu rédiger."));
        return;
      }
      upsertInbox(data.item);
      if (data.warning) setMsg(data.warning);
      void navigate({ to: "/admin/story/$id", params: { id: data.item.id } });
    } catch {
      setMsg("Réseau. Réessaie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <div>
        <Label htmlFor="assign-subject">Le sujet que vous avez repéré</Label>
        <Textarea
          id="assign-subject"
          required={url.trim().length === 0}
          maxLength={800}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={compact ? "mt-1 min-h-24" : "mt-1 min-h-28"}
          placeholder="Ex. Un maire interdit les moustiques par arrêté. Coller aussi l’URL si vous l’avez."
        />
      </div>
      <div>
        <Label htmlFor="assign-url">URL de la source</Label>
        <Input
          id="assign-url"
          type="url"
          inputMode="url"
          maxLength={500}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1"
          placeholder="https://…"
        />
      </div>
      {compact ? null : (
        <>
          <div>
            <Label htmlFor="assign-extra">Autres URLs (une par ligne)</Label>
            <Textarea
              id="assign-extra"
              maxLength={2000}
              value={extraUrls}
              onChange={(e) => setExtraUrls(e.target.value)}
              className="mt-1 min-h-20"
            />
          </div>
          <div>
            <Label htmlFor="assign-notes">Consigne</Label>
            <Textarea
              id="assign-notes"
              maxLength={1500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 min-h-24"
              placeholder="Ex. Insister que c’est en France. Pas de citation hors source. Ton Albert Londres."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="assign-section">Rubrique</Label>
              <select
                id="assign-section"
                className={`${selectClass} mt-1`}
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                <option value="">Auto</option>
                {SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {SECTION_FR[s.id]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="assign-country">Pays / lieu</Label>
              <Input
                id="assign-country"
                maxLength={80}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1"
                placeholder="France, Calais…"
              />
            </div>
            <div>
              <Label htmlFor="assign-voice">Voix</Label>
              <select
                id="assign-voice"
                className={`${selectClass} mt-1`}
                value={voice}
                onChange={(e) => setVoice(e.target.value as VoiceId)}
              >
                {VOICE_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {VOICES[id].afterFr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
      {msg ? <p className="text-sm text-signal">{msg}</p> : null}
      <p className="text-xs text-ink-muted">
        {busy
          ? "Lecture de la source et rédaction. 20 à 40 secondes. Ne fermez pas la page."
          : "Rien n’est publié tout seul. Le brouillon arrive dans la file, en français, à relire."}
      </p>
      <Button type="submit" disabled={busy}>
        {busy ? "Rédaction en cours…" : "Rédiger le brouillon"}
      </Button>
    </form>
  );
}
