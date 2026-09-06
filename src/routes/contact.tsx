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
import { EMAILS } from "@/lib/brand";
import { isEmail, isHoneypotTripped, sanitizeText } from "@/lib/security";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const lang = useAppStore((s) => s.lang);
  const addContact = useAppStore((s) => s.addContact);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [hp, setHp] = useState("");

  return (
    <LegalPage titleKey="contact">
      <p>{t(lang, "contactDek")}</p>
      <ul className="mt-4 space-y-1 text-sm">
        <li>
          Desk:{" "}
          <a className="font-bold underline" href={`mailto:${EMAILS.desk}`}>
            {EMAILS.desk}
          </a>
        </li>
        <li>
          Press:{" "}
          <a className="underline" href={`mailto:${EMAILS.press}`}>
            {EMAILS.press}
          </a>
        </li>
        <li>
          Ads:{" "}
          <a className="underline" href={`mailto:${EMAILS.ads}`}>
            {EMAILS.ads}
          </a>
        </li>
        <li>
          Investors:{" "}
          <a className="underline" href={`mailto:${EMAILS.investors}`}>
            {EMAILS.investors}
          </a>
        </li>
        <li>
          Cup:{" "}
          <a className="underline" href={`mailto:${EMAILS.contest}`}>
            {EMAILS.contest}
          </a>
        </li>
        <li>
          Security:{" "}
          <a className="underline" href={`mailto:${EMAILS.security}`}>
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
              body: JSON.stringify({ email: em, body: text, company_url: hp }),
            }).catch(() => undefined);
            setOk(true);
          }}
        >
          <Honeypot value={hp} onChange={setHp} />
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
