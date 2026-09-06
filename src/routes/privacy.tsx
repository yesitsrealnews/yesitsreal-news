import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { EMAILS } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  const lang = useAppStore((s) => s.lang);
  return (
    <LegalPage titleKey="privacy">
      <p>{t(lang, "privacyShort")}</p>
      <p>
        We store language, theme, cookie choice, newsletter address if you give one (including to unlock the rest of an
        article), and story submissions you send, in your browser for this preview. We do not sell reader lists.
        Advertising partners, if you accept optional cookies, may set their own. Necessary cookies run the site.
      </p>
      <p>
        {lang === "fr"
          ? "Les serveurs de production sont aux États-Unis (Vercel, Washington D.C.). Les données techniques de visite peuvent transiter par les États-Unis."
          : "Production servers are in the United States (Vercel, Washington, D.C.). Technical visit data may transit the United States."}
      </p>
    </LegalPage>
  );
}
