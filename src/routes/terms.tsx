import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { ThanksMusk } from "@/components/site/thanks";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { EMAILS, HOSTING, SITE_DOMAIN } from "@/lib/brand";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  const lang = useAppStore((s) => s.lang);
  const fr = lang === "fr";
  return (
    <LegalPage titleKey="terms">
      <p>
        {fr
          ? `Publication : YES IT'S REAL — ${SITE_DOMAIN}. Contact de la desk : ${EMAILS.desk}. Direction de la publication : le rédacteur en chef, via le back-office.`
          : `Publication: YES IT'S REAL — ${SITE_DOMAIN}. Desk: ${EMAILS.desk}. Publisher: the editor-in-chief, via the desk.`}
      </p>
      <p>
        {fr
          ? `Hébergeur : ${HOSTING.provider}, ${HOSTING.city}, ${HOSTING.country}. Serveurs de production : ${HOSTING.region}. Le journal est hébergé aux États-Unis.`
          : `Host: ${HOSTING.provider}, ${HOSTING.city}, ${HOSTING.country}. Production servers: ${HOSTING.region}. This paper is hosted in the United States.`}
      </p>
      <p>
        {fr
          ? "La prévisualisation que tu vois ici tourne encore dans l’environnement Grok / xAI. Dès que yesitsreal.news est branché, le site public sort de Vercel, États-Unis."
          : "This preview still runs in the Grok / xAI environment. Once yesitsreal.news is pointed, the public site is served from Vercel in the United States."}
      </p>
      <p>
        {fr
          ? "Les papiers de démonstration sont de la copie de desk originale, sourcée. Ne pas les traiter comme des minutes d’audience. Le sponsoring est marqué. Ce n’est pas une enquête."
          : "Seed articles in this preview are original sample desk copy. Do not treat sample dockets as live court records. Sponsored notices are marked. They are not investigations."}
      </p>
      <p>
        {fr
          ? "Vous pouvez partager les titres avec la mention « pas de satire ». Vous ne pouvez pas aspirer la file de la desk."
          : "You may share our headlines with the not-satire note. You may not scrape the desk queue."}
      </p>
      <ThanksMusk />
    </LegalPage>
  );
}
