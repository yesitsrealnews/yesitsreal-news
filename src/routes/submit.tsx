import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Honeypot } from "@/components/site/honeypot";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { looksLikeSatire, detectSensitivity, makeQueueItem } from "@/lib/pipeline";
import { isHoneypotTripped, isSafeHttpUrl, sanitizeText } from "@/lib/security";

export const Route = createFileRoute("/submit")({ component: SubmitPage });

function SubmitPage() {
  const lang = useAppStore((s) => s.lang);
  const addSubmission = useAppStore((s) => s.addSubmission);
  const upsertInbox = useAppStore((s) => s.upsertInbox);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <h1 className="font-serif text-4xl uppercase">{t(lang, "submitTitle")}</h1>
        <p className="mt-3 text-sm text-ink-muted">{t(lang, "submitDek")}</p>
        {msg ? (
          <p className="mt-8 border border-rule bg-paper-2 p-4 text-sm">{msg}</p>
        ) : (
          <form
            className="relative mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (isHoneypotTripped(hp)) return;
              const cleanUrl = sanitizeText(url, 500);
              const cleanNotes = sanitizeText(notes, 1200);
              const cleanCountry = sanitizeText(country, 80);
              const cleanName = sanitizeText(name, 80);
              if (!isSafeHttpUrl(cleanUrl)) {
                setMsg(t(lang, "submitNeedUrl"));
                return;
              }
              if (looksLikeSatire(cleanUrl)) {
                setMsg("Rejected at the door. Satire domains are not ingested.");
                return;
              }
              if (detectSensitivity(`${cleanNotes} ${cleanUrl}`) === "reject-minors") {
                setMsg("Rejected. This desk does not handle that material.");
                return;
              }
              addSubmission({
                id: `sub-${Date.now()}`,
                url: cleanUrl,
                notes: cleanNotes,
                country: cleanCountry,
                name: cleanName,
                createdAt: new Date().toISOString(),
                status: "received",
              });
              upsertInbox(makeQueueItem({ url: cleanUrl, notes: cleanNotes, country: cleanCountry, name: cleanName }));
              void fetch("/api/ingest", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ url: cleanUrl, notes: cleanNotes, company_url: hp }),
              }).catch(() => undefined);
              setMsg(t(lang, "submitThanks"));
            }}
          >
            <Honeypot value={hp} onChange={setHp} />
            <div>
              <Label htmlFor="url">{t(lang, "submitUrl")}</Label>
              <Input id="url" required maxLength={500} value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="notes">{t(lang, "submitNotes")}</Label>
              <Textarea id="notes" maxLength={1200} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="country">{t(lang, "submitCountry")}</Label>
              <Input id="country" maxLength={80} value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="name">{t(lang, "submitName")}</Label>
              <Input id="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <Button type="submit">{t(lang, "submitSend")}</Button>
          </form>
        )}
      </main>
    </SiteShell>
  );
}
