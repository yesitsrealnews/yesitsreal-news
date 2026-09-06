import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/corrections")({ component: Corrections });

function Corrections() {
  const lang = useAppStore((s) => s.lang);
  return (
    <LegalPage titleKey="corrections">
      <p>{t(lang, "correctionsDek")}</p>
      <p>{t(lang, "correctionsEmpty")}</p>
      <p>Sample desk policy: a correction is a new line on the article, dated, and linked from this page. We do not quietly rewrite history. Tone is not a fact and will not be “corrected” because a subject disliked it.</p>
    </LegalPage>
  );
}
