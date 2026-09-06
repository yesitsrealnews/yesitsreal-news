import { Link } from "@tanstack/react-router";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const lang = useAppStore((s) => s.lang);
  return (
    <main id="main" className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="kicker text-signal">404</p>
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{t(lang, "notFoundTitle")}</h1>
      <p className="mt-4 text-ink-muted">{t(lang, "notFoundBody")}</p>
      <Button className="mt-8" asChild>
        <Link to="/">{t(lang, "notFoundCta")}</Link>
      </Button>
    </main>
  );
}
