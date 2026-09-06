import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang, LeadKind } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { isEmail, isHoneypotTripped, isSafeHttpUrl, sanitizeText } from "@/lib/security";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Honeypot } from "@/components/site/honeypot";

export function LeadForm({
  lang,
  kind,
  sku,
  amount,
  roleOptions,
  cta,
  thanks,
}: {
  lang: Lang;
  kind: LeadKind;
  sku?: string;
  amount?: number;
  roleOptions?: { id: string; label: string }[];
  cta: string;
  thanks: string;
}) {
  const addLead = useAppStore((s) => s.addLead);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(roleOptions?.[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [hp, setHp] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  if (ok) return <p className="border border-rule bg-paper-2 p-4 text-sm">{thanks}</p>;

  return (
    <form
      className="relative space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (isHoneypotTripped(hp)) return;
        const cleanEmail = sanitizeText(email, 180).toLowerCase();
        const cleanName = sanitizeText(name, 80);
        const cleanNotes = sanitizeText(notes, 1200);
        if (!isEmail(cleanEmail)) {
          setErr(t(lang, "invalidEmail"));
          return;
        }
        if (kind === "job" && cleanNotes && !isSafeHttpUrl(cleanNotes) && cleanNotes.startsWith("http")) {
          setErr(t(lang, "invalidUrl"));
          return;
        }
        const okLead = addLead({
          kind,
          email: cleanEmail,
          name: cleanName,
          role: role || undefined,
          sku,
          amount: amount ?? 0,
          notes: cleanNotes,
        });
        if (!okLead) {
          setErr(t(lang, "rateLimited"));
          return;
        }
        setOk(true);
      }}
    >
      <Honeypot value={hp} onChange={setHp} />
      <div>
        <Label htmlFor={`${kind}-name`}>{t(lang, "submitName")}</Label>
        <Input id={`${kind}-name`} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor={`${kind}-email`}>{t(lang, "newsletterEmail")}</Label>
        <Input
          id={`${kind}-email`}
          type="email"
          required
          maxLength={180}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
        />
      </div>
      {roleOptions ? (
        <div>
          <Label htmlFor={`${kind}-role`}>{t(lang, "yourRole")}</Label>
          <select
            id={`${kind}-role`}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 flex h-11 w-full border border-rule bg-card px-3 text-sm text-ink"
          >
            {roleOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <Label htmlFor={`${kind}-notes`}>{kind === "job" ? t(lang, "portfolio") : t(lang, "submitNotes")}</Label>
        <Textarea
          id={`${kind}-notes`}
          value={notes}
          maxLength={1200}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1"
        />
      </div>
      {err ? <p className="text-sm text-signal">{err}</p> : null}
      <Button type="submit" variant="signal">
        {cta}
      </Button>
      <p className="text-xs text-ink-muted">{t(lang, "noChargeToday")}</p>
    </form>
  );
}
