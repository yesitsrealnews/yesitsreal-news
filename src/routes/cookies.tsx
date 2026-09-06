import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cookies")({ component: Cookies });

function Cookies() {
  const lang = useAppStore((s) => s.lang);
  const setCookies = useAppStore((s) => s.setCookies);
  return (
    <LegalPage titleKey="cookies">
      <p>{t(lang, "cookieBody")}</p>
      <p>Necessary: language, theme, cookie choice. Optional: advertising measurement. We honour a later change.</p>
      <div className="flex gap-2 pt-2">
        <Button size="sm" onClick={() => setCookies("all")}>
          {t(lang, "cookieAccept")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setCookies("necessary")}>
          {t(lang, "cookieReject")}
        </Button>
      </div>
    </LegalPage>
  );
}
