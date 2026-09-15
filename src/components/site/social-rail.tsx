import { SOCIAL } from "@/lib/brand";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function SocialRail({ lang }: { lang: Lang }) {
  return (
    <section className="rounded-2xl border-2 border-ink bg-card p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
      <h2 className="kicker text-ink">{t(lang, "followUs")}</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {SOCIAL.filter((s) => s.id !== "rss").map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-between rounded-full border-2 border-ink bg-paper px-3 text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-scream"
            >
              <span>{s.name}</span>
              <span className="truncate text-[0.6rem] font-semibold normal-case tracking-normal text-ink-muted">{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
