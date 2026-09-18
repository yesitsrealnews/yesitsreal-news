import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Honeypot } from "@/components/site/honeypot";
import { TrueStamp } from "@/components/site/true-stamp";
import { isEmail, isHoneypotTripped } from "@/lib/security";

export function Newsletter({
  lang,
  onSubscribe,
}: {
  lang: Lang;
  onSubscribe: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  return (
    <section className="border border-rule bg-card p-6 md:p-8">
      <TrueStamp tone="signal">{t(lang, "edition")}</TrueStamp>
      <h2 className="mt-4 font-serif text-4xl uppercase text-ink sm:text-5xl">{t(lang, "newsletterTitle")}</h2>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">{t(lang, "newsletterDek")}</p>
      {ok ? (
        <p className="mt-4 text-sm text-signal">{t(lang, "newsletterOk")}</p>
      ) : (
        <form
          className="relative mt-5 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (isHoneypotTripped(hp)) return;
            if (!isEmail(email)) {
              setErr(t(lang, "invalidEmail"));
              return;
            }
            onSubscribe(email);
            setOk(true);
          }}
        >
          <Honeypot value={hp} onChange={setHp} />
          <Input
            type="email"
            required
            maxLength={180}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t(lang, "newsletterEmail")}
            aria-label={t(lang, "newsletterEmail")}
            className="border-rule bg-paper text-ink sm:max-w-xs"
          />
          <Button type="submit" variant="signal">
            {t(lang, "newsletterCta")}
          </Button>
        </form>
      )}
      {err ? <p className="mt-2 text-xs text-signal">{err}</p> : null}
    </section>
  );
}
