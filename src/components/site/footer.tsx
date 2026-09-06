import { Link } from "@tanstack/react-router";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { EMAILS, SOCIAL } from "@/lib/brand";

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="mt-16 border-t-4 border-ink bg-paper-2 pb-20 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="masthead-wordmark text-3xl">{t(lang, "siteName")}</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em]">{t(lang, "tagline1")}</p>
          <p className="mt-3 max-w-lg text-sm font-medium text-ink">{t(lang, "raisonLine")}</p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">{t(lang, "disclaimer")}</p>
          <p className="mt-4 text-sm">
            <a className="font-bold underline" href={`mailto:${EMAILS.desk}`}>
              {EMAILS.desk}
            </a>
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {EMAILS.press} · {EMAILS.ads} · {EMAILS.jobs} · {EMAILS.investors}
          </p>
        </div>
        <div>
          <p className="kicker mb-3 text-ink-muted">{t(lang, "desk")}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/today" className="font-bold hover:underline">
                {t(lang, "today")}
              </Link>
            </li>
            <li>
              <Link to="/kit" className="font-bold hover:underline">
                {lang === "fr" ? "Bandeau X" : "X kit"}
              </Link>
            </li>
            <li>
              <Link to="/contest" className="font-bold hover:underline">
                {t(lang, "contest")}
              </Link>
            </li>
            <li>
              <Link to="/careers" className="font-bold hover:underline">
                {t(lang, "careers")}
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:underline">
                {t(lang, "shop")}
              </Link>
            </li>
            <li>
              <Link to="/social" className="hover:underline">
                {t(lang, "social")}
              </Link>
            </li>
            <li>
              <Link to="/advertise" className="hover:underline">
                {t(lang, "advertise")}
              </Link>
            </li>
            <li>
              <Link to="/invest" className="hover:underline">
                {t(lang, "invest")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                {t(lang, "about")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                {t(lang, "contact")}
              </Link>
            </li>
            <li>
              <Link to="/submit" className="hover:underline">
                {t(lang, "submit")}
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:underline">
                {t(lang, "membership")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker mb-3 text-ink-muted">{t(lang, "followUs")}</p>
          <ul className="space-y-2 text-sm">
            {SOCIAL.slice(0, 6).map((s) => (
              <li key={s.id}>
                <a href={s.url} className="hover:underline" rel="noopener noreferrer">
                  {s.name} · {s.handle}
                </a>
              </li>
            ))}
            <li>
              <Link to="/privacy" className="hover:underline">
                {t(lang, "privacy")}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                {t(lang, "terms")}
              </Link>
            </li>
            <li>
              <Link to="/terms" hash="thanks" className="hover:underline">
                {t(lang, "thanksKicker")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-rule px-4 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} YES IT'S REAL · {EMAILS.desk} · {t(lang, "shareNote")}
        <br />
        {lang === "fr"
          ? "Hébergé aux États-Unis (Vercel, Washington D.C.)."
          : "Hosted in the United States (Vercel, Washington, D.C.)."}
      </p>
    </footer>
  );
}
