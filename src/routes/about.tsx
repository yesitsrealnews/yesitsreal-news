import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { ThanksMusk } from "@/components/site/thanks";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  const lang = useAppStore((s) => s.lang);
  return (
    <LegalPage titleKey="about">
      <p className="kicker text-signal">{t(lang, "raisonKicker")}</p>
      <p className="font-serif text-3xl uppercase leading-[0.95] sm:text-4xl">{t(lang, "raisonTitle")}</p>
      <p>{t(lang, "aboutShort")}</p>
      <p>{t(lang, "raisonP1")}</p>
      <p>{t(lang, "raisonP2")}</p>
      <p>{t(lang, "raisonP3")}</p>
      <p className="font-serif text-2xl uppercase">{t(lang, "raisonLine")}</p>
      <p>{t(lang, "tagline3")}</p>
      <p>{t(lang, "disclaimer")}</p>
      <ThanksMusk />
    </LegalPage>
  );
}
