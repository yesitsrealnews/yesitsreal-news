import { SOCIAL } from "@/lib/brand";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function SocialRail({ lang }: { lang: Lang }) {
  return (
    <section>
      <h2 className="kicker border-b border-rule pb-2 text-ink">{t(lang, "followUs")}</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {SOCIAL.filter((s) => s.id !== "rss").map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-between border border-rule bg-card px-3 text-xs font-bold uppercase tracking-[0.1em] hover:bg-ink hover:text-paper"
            >
              <span>{s.name}</span>
              <span className="truncate text-[0.6rem] text-ink-muted">{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
