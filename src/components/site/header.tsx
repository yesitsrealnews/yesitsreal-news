import { Link } from "@tanstack/react-router";
import { BadgeCheck, Menu, Moon, Search, Sun } from "lucide-react";
import { t } from "@/lib/i18n";
import { SECTION_KEY } from "@/lib/i18n/keys";
import { SECTIONS } from "@/lib/data/sections";
import { EMAILS, SOCIAL } from "@/lib/brand";
import type { Lang } from "@/lib/types";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Header({
  lang,
  theme,
  onLang,
  onTheme,
}: {
  lang: Lang;
  theme: "light" | "dark";
  onLang: (lang: Lang) => void;
  onTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        {t(lang, "skipToContent")}
      </a>
      <div className="hidden items-center justify-end gap-3 border-b border-rule bg-ink px-4 py-1 text-paper md:flex md:px-6">
        <div className="flex items-center gap-4">
          <a
            href={SOCIAL[0].url}
            className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-scream hover:underline"
            rel="noopener noreferrer"
          >
            {t(lang, "followUs")} {SOCIAL[0].handle} · {t(lang, "live")}
          </a>
          <a href={`mailto:${EMAILS.desk}`} className="text-[0.65rem] font-bold tracking-[0.04em] hover:text-scream">
            {EMAILS.desk}
          </a>
          <a href="/rss.xml" className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] hover:text-scream">
            {t(lang, "rss")}
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className="inline-flex size-11 items-center justify-center" aria-label={t(lang, "menu")}>
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="masthead-wordmark text-2xl">{t(lang, "siteName")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-2">
                <Link to="/" className="px-3 py-3 text-sm font-medium">
                  {t(lang, "home")}
                </Link>
                {SECTIONS.map((s) => (
                  <Link key={s.id} to="/$section" params={{ section: s.id }} className="px-3 py-3 text-sm">
                    {t(lang, SECTION_KEY[s.id])}
                  </Link>
                ))}
                <Link to="/today" className="px-3 py-3 text-sm">
                  {t(lang, "today")}
                </Link>
                <Link to="/shop" className="px-3 py-3 text-sm">
                  {t(lang, "shop")}
                </Link>
                <Link to="/rankings" className="px-3 py-3 text-sm">
                  {t(lang, "rankings")}
                </Link>
                <Link to="/social" className="px-3 py-3 text-sm">
                  {t(lang, "social")}
                </Link>
                <Link to="/submit" className="px-3 py-3 text-sm">
                  {t(lang, "submit")}
                </Link>
                <a href={`mailto:${EMAILS.desk}`} className="px-3 py-3 text-sm">
                  {EMAILS.desk}
                </a>
                <a href="/rss.xml" className="px-3 py-3 text-sm font-bold">
                  {t(lang, "rss")}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link to="/" className="flex items-center gap-2 py-1">
          <span className="masthead-wordmark text-[1.45rem] sm:text-3xl md:text-[2.15rem]">{t(lang, "siteName")}</span>
          <BadgeCheck className="size-4 text-signal sm:size-5" aria-hidden />
          <span className="hidden rounded-sm bg-scream px-1.5 py-0.5 font-sans text-[0.6rem] font-extrabold tracking-[0.16em] text-scream-ink sm:inline">
            {t(lang, "truePill")}
          </span>
        </Link>

        <div className="flex items-center">
          <Link
            to="/search"
            search={{ q: "" }}
            className="inline-flex size-11 items-center justify-center"
            aria-label={t(lang, "search")}
          >
            <Search className="size-4" />
          </Link>
          <LanguageSwitcher lang={lang} onChange={onLang} />
          <button
            type="button"
            onClick={onTheme}
            className="inline-flex size-11 items-center justify-center"
            aria-label={t(lang, "theme")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
      <div className="hidden border-t border-rule md:block">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center px-4">
          <Link to="/" className="shrink-0 px-3 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] hover:text-signal">
            {t(lang, "home")}
          </Link>
          <Link to="/today" className="shrink-0 px-3 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-signal hover:text-ink">
            {t(lang, "today")}
          </Link>
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to="/$section"
              params={{ section: s.id }}
              className="shrink-0 px-3 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-muted hover:text-ink"
            >
              {t(lang, SECTION_KEY[s.id])}
            </Link>
          ))}
          <Link to="/rankings" className="shrink-0 px-3 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-muted hover:text-ink">
            {t(lang, "rankings")}
          </Link>
          <Link to="/social" className="shrink-0 px-3 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-muted hover:text-ink">
            {t(lang, "social")}
          </Link>
          <Link to="/shop" className="ms-auto shrink-0 px-3 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink hover:text-signal">
            {t(lang, "shop")}
          </Link>
          <Link to="/submit" className="shrink-0 px-3 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-signal">
            {t(lang, "submit")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function ThemeToggleButton({ theme, onClick, label }: { theme: string; onClick: () => void; label: string }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label={label}>
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
