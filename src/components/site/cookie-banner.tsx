import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function CookieBanner({
  lang,
  onChoice,
}: {
  lang: Lang;
  onChoice: (choice: "all" | "necessary") => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-scream p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] text-scream-ink shadow-[0_-8px_24px_rgba(0,0,0,0.12)] md:bottom-4 md:left-4 md:right-auto md:max-w-md md:border-2 md:pb-4">
      <p className="kicker mb-2">{t(lang, "cookieTitle")}</p>
      <p className="mb-4 text-sm leading-relaxed">{t(lang, "cookieBody")}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => onChoice("all")}>
          {t(lang, "cookieAccept")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onChoice("necessary")}>
          {t(lang, "cookieReject")}
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link to="/cookies">{t(lang, "cookies")}</Link>
        </Button>
      </div>
    </div>
  );
}
