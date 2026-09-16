import { ExternalLink } from "lucide-react";
import type { Lang, Story } from "@/lib/types";
import { t } from "@/lib/i18n";
import { newsroomXForUrl, originSource } from "@/lib/source-x";
import { Button } from "@/components/ui/button";

export function OriginSources({
  story,
  lang,
  note,
  lead = false,
}: {
  story: Story;
  lang: Lang;
  note?: string;
  lead?: boolean;
}) {
  const origin = originSource(story.sources);

  return (
    <section className="rounded-2xl border-2 border-ink bg-card p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
      <h2 className="kicker text-ink">{t(lang, "originalSources")}</h2>
      {lead && origin ? (
        <Button asChild variant="signal" className="mt-3 h-auto min-h-11 w-full whitespace-normal py-2 sm:w-auto">
          <a href={origin.url} rel="noopener noreferrer">
            <ExternalLink className="size-4 shrink-0" />
            {t(lang, "originArticle")}
          </a>
        </Button>
      ) : null}
      {note ? <p className="mt-2 text-xs text-ink-muted">{note}</p> : null}
      <ul className="mt-3 space-y-3 text-sm">
        {story.sources.map((s) => {
          const x = newsroomXForUrl(s.url);
          return (
            <li key={s.url} className="border-b border-rule pb-3 last:border-b-0 last:pb-0">
              <a href={s.url} className="font-medium underline underline-offset-2" rel="noopener noreferrer">
                {s.publisher}: {s.title}
              </a>
              <span className="text-ink-muted"> · {s.date}</span>
              {x ? (
                <p className="mt-1.5">
                  <a
                    href={x.href}
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 border-2 border-ink bg-ink px-3 py-1 text-[0.68rem] font-extrabold text-paper"
                  >
                    <span className="uppercase tracking-[0.08em]" aria-hidden>
                      X
                    </span>
                    <span className="normal-case tracking-normal">{x.handle}</span>
                    <span className="font-medium normal-case tracking-normal text-paper/70">
                      · {t(lang, "originNewsroomX")}
                    </span>
                  </a>
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {lead ? <p className="mt-3 text-[0.7rem] text-ink-muted">{t(lang, "originNewsroomNote")}</p> : null}
    </section>
  );
}
