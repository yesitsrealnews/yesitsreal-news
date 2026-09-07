import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ThanksMusk } from "@/components/site/thanks";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { SITE_NAME, SITE_URL } from "@/lib/brand";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: `Crédits — ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Un grand merci à Elon Musk, à xAI, Grok, X et aux équipes qui ont permis la naissance de YES IT'S REAL.",
      },
      { property: "og:title", content: `Crédits — ${SITE_NAME}` },
      { property: "og:url", content: `${SITE_URL}/credits` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/credits` }],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  const lang = useAppStore((s) => s.lang);
  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="kicker text-signal">{t(lang, "credits")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-[0.9]">{t(lang, "credits")}</h1>
        <p className="mt-4 text-lg">{t(lang, "creditsDek")}</p>
        <ThanksMusk full />
      </main>
    </SiteShell>
  );
}
