import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/method")({ component: Method });

function Method() {
  const lang = useAppStore((s) => s.lang);
  return (
    <LegalPage titleKey="method">
      <p>{t(lang, "methodShort")}</p>
      <ol className="list-decimal space-y-3 ps-5">
        <li>Ingest: wires, gazettes, dockets, university pages, local desks, and reader URLs.</li>
        <li>Triage: is it news or satire? Dumbness 0–10. Category, country, duplicates, sensitivity.</li>
        <li>Draft: 400–900 words in a news voice. Accurate headline. Why-it’s-dumb box. Two to six sources.</li>
        <li>Fact-check pack: claims versus sources, confidence, what still needs a human.</li>
        <li>Human gate: the only required person. Approve, edit, reject, or send back.</li>
        <li>On approve: translate, SEO, homepage, section. Original links stay visible.</li>
      </ol>
      <p>
        Satire domains are rejected. Sexual crime involving minors is auto-rejected. Death runs only when the
        facts are public, the tone is flat, and the selection is not exploitation.
      </p>
    </LegalPage>
  );
}
