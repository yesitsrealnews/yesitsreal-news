import type { Lang, Story } from "@/lib/types";
import { t } from "@/lib/i18n";
import { SECTION_KEY } from "@/lib/i18n/keys";
import { flagEmoji, formatDateTime, readingMinutes, storyBodyPending, storyCopy, storySlug } from "@/lib/format";
import { formatCount, storyViews } from "@/lib/engagement";
import { DumbnessScore } from "@/components/stories/dumbness";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/site/ad-slot";
import { ShareBar } from "@/components/site/share-bar";
import { StoryCard } from "@/components/stories/story-card";
import { StoryCover } from "@/components/stories/cover";
import { QuoteCardButton } from "@/components/stories/quote-card";
import { ReactionBar } from "@/components/stories/reactions";
import { SoundsFake } from "@/components/stories/sounds-fake";
import { ReaderComments } from "@/components/stories/reader-comments";
import { SourceVideo } from "@/components/stories/source-video";
import { relatedStories } from "@/lib/catalog";
import { applyVoice, voiceMeta } from "@/lib/voices";
import { BadgeCheck, Eye, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function ArticleBody({
  story,
  lang,
  extras,
}: {
  story: Story;
  lang: Lang;
  extras: Story[];
}) {
  const raw = storyCopy(story, lang);
  const voice = voiceMeta(story.id);
  const copy = applyVoice(story, raw, lang);
  const pending = storyBodyPending(story, lang);
  const related = relatedStories(story, extras);
  const mid = Math.max(2, Math.floor(copy.body.length / 2));
  const slug = storySlug(story, lang);
  const era = story.section === "archive";

  return (
    <article className={cn("mx-auto max-w-3xl px-4 py-6 sm:px-6", era && "era-archive")}>
      <p className="kicker text-signal">{t(lang, SECTION_KEY[story.section] ?? "secWorld")}</p>
      {story.section === "commentaire" ? (
        <p className="mt-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-signal">
          {t(lang, "commentaireKicker")} · {t(lang, "byline")}
        </p>
      ) : null}
      {voice.id !== "desk" ? (
        <p className="mt-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-signal">
          {t(lang, "voiceAfter")} {lang === "fr" ? voice.afterFr : voice.after}
        </p>
      ) : null}
      <h1
        className={cn(
          "mt-3 font-serif text-4xl uppercase leading-[0.98] tracking-tight sm:text-5xl",
          era && "font-archive italic normal-case leading-[1.12]",
        )}
      >
        {copy.headline}
      </h1>
      <p className={cn("mt-4 text-lg text-ink-muted", era && "font-[family-name:var(--font-archive-body)]")}>{copy.dek}</p>
      <SoundsFake storyId={story.id} lang={lang} />
      <div
        className={cn(
          "mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y-2 border-ink py-3 text-xs font-medium text-ink-muted",
          era && "double-rule border-y-0",
        )}
      >
        <span>{t(lang, "byline")}</span>
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>{flagEmoji(story.countryCode)}</span>
          <MapPin className="size-3.5" />
          {story.location}
        </span>
        <span>
          {t(lang, "published")} {formatDateTime(story.publishedAt, lang)}
        </span>
        <span>{readingMinutes(copy.body)} min</span>
        <span className="inline-flex items-center gap-1">
          <Eye className="size-3.5" />
          {formatCount(storyViews(story.id), lang)} {t(lang, "viewsLabel")}
        </span>
        {story.sponsored ? (
          <Badge tone="gold">{t(lang, "sponsored")}</Badge>
        ) : (
          <span className="inline-flex items-center gap-1 text-true">
            <BadgeCheck className="size-3.5" />
            {t(lang, "factChecked")}
          </span>
        )}
        <DumbnessScore score={story.dumbness} lang={lang} />
      </div>

      <div className="relative my-6 aspect-[16/9] overflow-hidden bg-ink">
        <StoryCover id={story.id} section={story.section} alt={copy.headline} priority credit />
        <span className="absolute left-3 top-3">
          <Badge tone="scream">{t(lang, "truePill")}</Badge>
        </span>
      </div>

      <SourceVideo storyId={story.id} lang={lang} />

      <ShareBar lang={lang} path={`/story/${slug}`} headline={copy.headline} className="mt-6" />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <QuoteCardButton story={story} lang={lang} />
      </div>
      <div className="mt-4">
        <ReactionBar storyId={story.id} lang={lang} />
      </div>

      {story.sponsored ? (
        <p className="mt-6 border border-gold bg-paper-2 px-4 py-3 text-sm">
          {t(lang, "sponsored")}. {copy.factCheckNote}
        </p>
      ) : null}

      {pending ? <p className="mt-6 text-sm italic text-ink-muted">{t(lang, "bodyPending")}</p> : null}

      <div className="article-serif mt-8 space-y-5 text-ink">
        {copy.body.map((p, i) => (
          <div key={i}>
            <p>{p}</p>
            {i === 1 ? <AdSlot lang={lang} slot="inarticle" salt={`${story.id}-p2`} className="my-8" /> : null}
            {i === mid ? <AdSlot lang={lang} slot="inarticle" salt={`${story.id}-mid`} className="my-8" /> : null}
          </div>
        ))}
      </div>

      {!story.sponsored ? (
        <section className="mt-10 border-2 border-ink bg-scream p-5 text-scream-ink">
          <h2 className="kicker">{t(lang, "whyDumb")}</h2>
          <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm font-medium">
            {copy.whyDumb.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-8 border border-rule p-5">
        <h2 className="kicker text-ink-muted">{t(lang, "originalSources")}</h2>
        <p className="mt-2 text-xs text-ink-muted">{copy.factCheckNote}</p>
        <ul className="mt-3 space-y-2 text-sm">
          {story.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="underline underline-offset-2" rel="noopener noreferrer">
                {s.publisher}: {s.title}
              </a>
              <span className="text-ink-muted"> · {s.date}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-muted">
          Confidence {Math.round(story.confidence * 100)}% · {story.countryName}
        </p>
        {voice.id !== "desk" ? (
          <p className="mt-3 text-xs text-ink-muted">
            {t(lang, "voiceAfter")} {lang === "fr" ? voice.afterFr : voice.after}. {t(lang, "voiceDisclaimer")}
          </p>
        ) : null}
      </section>

      <section className="mt-8 border-4 border-signal bg-paper p-5">
        <p className="kicker text-signal">{t(lang, "notSatire")}</p>
        <h2 className="mt-2 font-serif text-3xl uppercase leading-none">{t(lang, "tagline2")}</h2>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">{t(lang, "shareNote")} · @yesitsrealnews</p>
        <ShareBar lang={lang} path={`/story/${slug}`} headline={copy.headline} className="mt-4" />
      </section>

      <ReaderComments storyId={story.id} lang={lang} />

      <div className="mt-8">
        <AdSlot lang={lang} slot="native" salt={`${story.id}-end`} />
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-3xl uppercase">{t(lang, "related")}</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {related.map((s) => (
            <StoryCard key={s.id} story={s} lang={lang} variant="compact" />
          ))}
        </div>
      </section>
    </article>
  );
}
