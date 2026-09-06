import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Honeypot } from "@/components/site/honeypot";
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
    <section className="border-2 border-ink bg-ink p-6 text-paper md:p-8">
      <p className="kicker text-scream">{t(lang, "edition")}</p>
      <h2 className="mt-2 font-serif text-4xl uppercase text-paper">{t(lang, "newsletterTitle")}</h2>
      <p className="mt-2 max-w-xl text-sm text-paper/80">{t(lang, "newsletterDek")}</p>
      {ok ? (
        <p className="mt-4 text-sm text-scream">{t(lang, "newsletterOk")}</p>
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
            className="border-paper/30 bg-paper text-ink sm:max-w-xs"
          />
          <Button type="submit" variant="gold">
            {t(lang, "newsletterCta")}
          </Button>
        </form>
      )}
      {err ? <p className="mt-2 text-xs text-scream">{err}</p> : null}
    </section>
  );
}
