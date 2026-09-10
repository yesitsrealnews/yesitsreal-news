import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LegalPage } from "@/components/site/legal-page";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Honeypot } from "@/components/site/honeypot";
import { CONTACT_FORWARD_TO, EMAILS } from "@/lib/brand";
import { isEmail, isHoneypotTripped, sanitizeText } from "@/lib/security";
import type { ContactChannel } from "@/lib/contact-inbox";

export const Route = createFileRoute("/contact")({ component: Contact });

const FORM_CHANNELS: { id: ContactChannel; label: string; mailbox: keyof typeof EMAILS }[] = [
  { id: "press", label: "Press", mailbox: "press" },
  { id: "investors", label: "Investors", mailbox: "investors" },
  { id: "game", label: "Game", mailbox: "game" },
  { id: "advertisers", label: "Advertisers", mailbox: "advertisers" },
  { id: "other", label: "Other", mailbox: "desk" },
];

function mailtoHref(channel: string, visibleAlias: string): string {
  const subject = encodeURIComponent(`[YESITREAL ${channel}]`);
  const body = encodeURIComponent(`(alias: ${visibleAlias})\n\n`);
  return `mailto:${CONTACT_FORWARD_TO}?subject=${subject}&body=${body}`;
}

function Contact() {
  const lang = useAppStore((s) => s.lang);
  const addContact = useAppStore((s) => s.addContact);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [hp, setHp] = useState("");
  const [channel, setChannel] = useState<ContactChannel>("press");

  return (
    <LegalPage titleKey="contact">
      <p>{t(lang, "contactDek")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t(lang, "contactFormNote")}</p>
      <ul className="mt-4 space-y-1 text-sm">
        <li>
          Press:{" "}
          <a className="font-bold underline" href={mailtoHref("press", EMAILS.press)}>
            {EMAILS.press}
          </a>
        </li>
        <li>
          Investors:{" "}
          <a className="font-bold underline" href={mailtoHref("investors", EMAILS.investors)}>
            {EMAILS.investors}
          </a>
        </li>
        <li>
          Game:{" "}
          <a className="font-bold underline" href={mailtoHref("game", EMAILS.game)}>
            {EMAILS.game}
          </a>
        </li>
        <li>
          Advertisers:{" "}
          <a className="font-bold underline" href={mailtoHref("advertisers", EMAILS.advertisers)}>
            {EMAILS.advertisers}
          </a>
        </li>
        <li>
          Desk:{" "}
          <a className="underline" href={mailtoHref("desk", EMAILS.desk)}>
            {EMAILS.desk}
          </a>
        </li>
        <li>
          Ads:{" "}
          <a className="underline" href={mailtoHref("ads", EMAILS.ads)}>
            {EMAILS.ads}
          </a>
        </li>
        <li>
          Cup:{" "}
          <a className="underline" href={mailtoHref("contest", EMAILS.contest)}>
            {EMAILS.contest}
          </a>
        </li>
        <li>
          Security:{" "}
          <a className="underline" href={mailtoHref("security", EMAILS.security)}>
            {EMAILS.security}
          </a>
        </li>
      </ul>
      {ok ? (
        <p className="mt-6">{t(lang, "contactOk")}</p>
      ) : (
        <form
          className="relative mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (isHoneypotTripped(hp)) return;
            const em = sanitizeText(email, 180);
            const text = sanitizeText(body, 2000);
            if (!isEmail(em)) {
              setErr(t(lang, "invalidEmail"));
              return;
            }
            if (text.length < 8) {
              setErr(t(lang, "submitNeedUrl"));
              return;
            }
            const stored = addContact(em, text);
            if (!stored) {
              setErr(t(lang, "rateLimited"));
              return;
            }
            void fetch("/api/contact", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ email: em, body: text, channel, company_url: hp }),
            }).catch(() => undefined);
            setOk(true);
          }}
        >
          <Honeypot value={hp} onChange={setHp} />
          <div>
            <Label htmlFor="topic">{t(lang, "contactTopic")}</Label>
            <select
              id="topic"
              value={channel}
              onChange={(e) => setChannel(e.target.value as ContactChannel)}
              className="mt-1 flex h-11 w-full border border-rule bg-card px-3 text-sm text-ink"
            >
              {FORM_CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="em">{t(lang, "newsletterEmail")}</Label>
            <Input id="em" type="email" required maxLength={180} value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="body">{t(lang, "submitNotes")}</Label>
            <Textarea id="body" required maxLength={2000} value={body} onChange={(e) => setBody(e.target.value)} className="mt-1" />
          </div>
          {err ? <p className="text-sm text-signal">{err}</p> : null}
          <Button type="submit">{t(lang, "contactSend")}</Button>
        </form>
      )}
    </LegalPage>
  );
}
