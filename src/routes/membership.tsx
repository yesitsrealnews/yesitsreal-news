import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Newsletter } from "@/components/site/newsletter";
import { EMAILS } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/membership")({ component: Membership });

function Membership() {
  const lang = useAppStore((s) => s.lang);
  const add = useAppStore((s) => s.addNewsletter);
  return (
    <LegalPage titleKey="membership">
      <p>{t(lang, "membershipDek")}</p>
      <ul className="mt-4 list-disc space-y-2 ps-5 text-sm">
        <li>Ad-light reading on articles.</li>
        <li>Earlier sight of the Cup queue.</li>
        <li>TRUE stamp merch drop.</li>
      </ul>
      <p className="mt-6">
        <Button variant="signal" asChild>
          <Link to="/shop">{t(lang, "shopCta")}</Link>
        </Button>
      </p>
      <p className="mt-4 text-sm">
        {t(lang, "noChargeToday")}{" "}
        <a className="font-bold underline" href={`mailto:${EMAILS.desk}`}>
          {EMAILS.desk}
        </a>
      </p>
      <Newsletter lang={lang} onSubscribe={add} />
    </LegalPage>
  );
}
