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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-paper-2 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] text-ink md:bottom-4 md:left-4 md:right-auto md:max-w-md md:border md:pb-4">
      <p className="kicker mb-2 text-signal">{t(lang, "cookieTitle")}</p>
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">{t(lang, "cookieBody")}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="signal" onClick={() => onChoice("all")}>
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
