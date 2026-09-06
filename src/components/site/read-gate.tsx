import { useEffect, useState, type ReactNode } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Honeypot } from "@/components/site/honeypot";
import { isEmail, isHoneypotTripped } from "@/lib/security";
import { useAppStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";

export function useArticleUnlocked() {
  const [ready, setReady] = useState(false);
  const newsletter = useAppStore((s) => s.newsletter);
  const admin = useAppStore((s) => s.admin);
  useEffect(() => setReady(true), []);
  if (!ready) return false;
  return admin || newsletter.length > 0;
}

export function ReadGate({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const unlocked = useArticleUnlocked();
  const add = useAppStore((s) => s.addNewsletter);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="max-h-40 overflow-hidden" aria-hidden>
        <div className="article-serif space-y-5 text-ink-muted opacity-70">{children}</div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-paper/70 to-paper" />
      </div>
      <section className="relative z-10 -mt-6 border-2 border-ink bg-scream p-5 text-scream-ink sm:p-7">
        <p className="kicker">{t(lang, "gateKicker")}</p>
        <h2 className="mt-2 font-serif text-3xl uppercase leading-none sm:text-4xl">{t(lang, "gateTitle")}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed">{t(lang, "gateDek")}</p>
        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (isHoneypotTripped(hp)) return;
            if (!isEmail(email)) {
              setErr(t(lang, "invalidEmail"));
              return;
            }
            if (!consent) {
              setErr(t(lang, "gateConsent"));
              return;
            }
            add(email);
          }}
        >
          <Honeypot value={hp} onChange={setHp} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              required
              maxLength={180}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(lang, "newsletterEmail")}
              aria-label={t(lang, "newsletterEmail")}
              className="border-ink bg-paper text-ink sm:max-w-xs"
            />
            <Button type="submit" className="bg-ink text-paper hover:opacity-90">
              {t(lang, "gateCta")}
            </Button>
          </div>
          <label className="flex items-start gap-2 text-xs leading-snug">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-ink"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>{t(lang, "gateConsent")}</span>
          </label>
          <p className="text-[0.7rem] opacity-80">
            {t(lang, "gateFree")} {t(lang, "gatePrivacy")}{" "}
            <Link to="/privacy" className="underline">
              {t(lang, "privacy")}
            </Link>
          </p>
          {err ? <p className="text-xs font-bold">{err}</p> : null}
        </form>
      </section>
    </div>
  );
}
