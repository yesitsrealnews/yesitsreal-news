import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ShareBar } from "@/components/site/share-bar";
import { QuoteCardButton } from "@/components/stories/quote-card";
import { StoryCard } from "@/components/stories/story-card";
import { Newsletter } from "@/components/site/newsletter";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { dumbest } from "@/lib/catalog";
import { flagEmoji, formatDate, storyCopy, storySlug } from "@/lib/format";
import { DumbnessScore } from "@/components/stories/dumbness";

export const Route = createFileRoute("/today")({ component: TodayPage });

function TodayPage() {
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const add = useAppStore((s) => s.addNewsletter);
  const countShare = useAppStore((s) => s.countShare);
  const list = dumbest(extras, 5);
  const lead = list[0];
  const rest = list.slice(1);
  const now = formatDate(new Date().toISOString(), lang);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "edition")} · {now}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-[0.9] sm:text-7xl">{t(lang, "todayTitle")}</h1>
        <p className="mt-4 text-lg">{t(lang, "todayDek")}</p>
        <ShareBar
          lang={lang}
          path="/today"
          headline={t(lang, "todayTitle")}
          className="mt-5"
          onShare={() => countShare("today")}
        />

        {lead ? (
          <article className="mt-10 border-b-4 border-ink pb-8">
            <Badge tone="scream">{t(lang, "dumbestToday")}</Badge>
            <h2 className="mt-3 font-serif text-4xl uppercase leading-[0.95]">
              <Link to="/story/$slug" params={{ slug: storySlug(lead, lang) }}>
                {storyCopy(lead, lang).headline}
              </Link>
            </h2>
            <p className="mt-3 text-ink-muted">{storyCopy(lead, lang).dek}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span>
                {flagEmoji(lead.countryCode)} {lead.location}
              </span>
              <DumbnessScore score={lead.dumbness} lang={lang} />
            </div>
            <div className="mt-4">
              <QuoteCardButton story={lead} lang={lang} onSaved={() => countShare(`card-${lead.id}`)} />
            </div>
          </article>
        ) : null}

        <ol className="mt-8 space-y-6">
          {rest.map((s, i) => (
            <li key={s.id} className="flex gap-4 border-b border-rule pb-6">
              <span className="font-serif text-4xl leading-none text-signal tabular-nums">{i + 2}</span>
              <StoryCard story={s} lang={lang} variant="compact" />
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Newsletter lang={lang} onSubscribe={add} />
        </div>
      </main>
    </SiteShell>
  );
}
