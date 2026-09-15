import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ShareBar } from "@/components/site/share-bar";
import { QuoteCardButton } from "@/components/stories/quote-card";
import { StoryCard } from "@/components/stories/story-card";
import { StoryCover } from "@/components/stories/cover";
import { Newsletter } from "@/components/site/newsletter";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { SITE_URL } from "@/lib/brand";
import { homeStories } from "@/lib/catalog";
import { loadPublicDesk, mergeExtras } from "@/lib/desk-public";
import { flagEmoji, formatDate, storyCopy, storySlug } from "@/lib/format";
import { SourceProof } from "@/components/stories/source-proof";

export const Route = createFileRoute("/today")({
  loader: async () => loadPublicDesk(),
  component: TodayPage,
  head: () => ({
    meta: [
      { title: "Le briefing du jour — YES IT'S REAL" },
      {
        name: "description",
        content: "Le briefing du jour ouvré. Faits vrais, sourcés, déjà parus. Une pierre à la fois.",
      },
      { property: "og:title", content: "Le briefing du jour — YES IT'S REAL" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/today` }],
  }),
});

function TodayPage() {
  const loaded = Route.useLoaderData();
  const lang = useAppStore((s) => s.lang);
  const extras = mergeExtras(loaded?.extras, useAppStore((s) => s.extras));
  const deskStatus = { ...(loaded?.desk ?? {}), ...useAppStore((s) => s.deskStatus) };
  const frontPageIds = (useAppStore((s) => s.frontPageIds).length ? useAppStore.getState().frontPageIds : loaded?.frontPageIds) ?? [];
  const add = useAppStore((s) => s.addNewsletter);
  const countShare = useAppStore((s) => s.countShare);
  const list = homeStories(extras, deskStatus, frontPageIds).slice(0, 5);
  const lead = list[0];
  const rest = list.slice(1);
  const now = formatDate(new Date().toISOString(), lang);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "edition")} · {now}</p>
        <h1 className="mt-2 font-serif text-5xl leading-[0.9] sm:text-7xl">{t(lang, "todayTitle")}</h1>
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
            <Link
              to="/story/$slug"
              params={{ slug: storySlug(lead, lang) }}
              className="photo-frame relative mb-5 block aspect-[16/9]"
            >
              <StoryCover id={lead.id} section={lead.section} alt={storyCopy(lead, lang).headline} priority />
            </Link>
            <h2 className="mt-3 font-serif text-4xl leading-[0.95]">
              <Link to="/story/$slug" params={{ slug: storySlug(lead, lang) }}>
                {storyCopy(lead, lang).headline}
              </Link>
            </h2>
            <p className="mt-3 text-ink-muted">{storyCopy(lead, lang).dek}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span>
                {flagEmoji(lead.countryCode)} {lead.location}
              </span>
              <SourceProof story={lead} lang={lang} names />
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
