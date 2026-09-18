import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Lang, Story } from "@/lib/types";
import { t } from "@/lib/i18n";
import { SECTION_KEY } from "@/lib/i18n/keys";
import { flagEmoji, formatDate, storyCopy, storySlug } from "@/lib/format";
import { storySharePath } from "@/lib/viral";
import { StoryCard } from "@/components/stories/story-card";
import { StoryCover } from "@/components/stories/cover";
import { Newsletter } from "@/components/site/newsletter";
import { AdSlot } from "@/components/site/ad-slot";
import { SocialRail } from "@/components/site/social-rail";
import { ShareBar } from "@/components/site/share-bar";
import { TrueStamp } from "@/components/site/true-stamp";
import { Button } from "@/components/ui/button";
import { SourceProof } from "@/components/stories/source-proof";
import { BadgeCheck, Newspaper } from "lucide-react";

export function HomePage({
  lang,
  stories,
  sponsored,
  onSubscribe,
}: {
  lang: Lang;
  stories: Story[];
  sponsored?: Story | null;
  onSubscribe: (email: string) => void;
}) {
  const hero = stories[0];
  const rest = stories.slice(1);
  const features = rest.slice(0, 2);
  const [shown, setShown] = useState(8);
  const grid = rest.slice(2, 2 + shown);

  if (!hero) return <p className="p-8">{t(lang, "noStories")}</p>;
  const heroCopy = storyCopy(hero, lang);
  const heroSlug = storySlug(hero, lang);

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          to="/today"
          className="inline-flex h-12 items-center bg-scream px-4 text-xs font-extrabold uppercase tracking-[0.16em] text-scream-ink"
        >
          <Newspaper className="me-2 size-4" />
          {t(lang, "todayTitle")}
        </Link>
        <Link
          to="/shop"
          className="inline-flex h-12 items-center border border-rule px-4 text-xs font-extrabold uppercase tracking-[0.16em]"
        >
          {t(lang, "shop")}
        </Link>
      </div>
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
        {t(lang, "raisonLine")}{" "}
        <Link to="/about" className="underline underline-offset-2">
          {t(lang, "about")}
        </Link>
        {" · "}
        <Link to="/method" className="underline underline-offset-2">
          {t(lang, "method")}
        </Link>
      </p>
      <section className="grid gap-8 border-b border-rule pb-10 lg:grid-cols-12">
        <Link
          to="/story/$slug"
          params={{ slug: heroSlug }}
          className="photo-frame relative block aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]"
        >
          <StoryCover id={hero.id} section={hero.section} alt={heroCopy.headline} remote={hero.coverUrl} priority sizes="(min-width: 1024px) 60vw, 100vw" className="h-full w-full" />
          <span className="absolute left-3 top-4 flex flex-wrap gap-2">
            {hero.breaking ? <TrueStamp tone="signal">{t(lang, "breaking")}</TrueStamp> : null}
            <TrueStamp>{t(lang, "truePill")}</TrueStamp>
          </span>
        </Link>
        <div className="flex flex-col justify-center lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="kicker text-signal">{t(lang, SECTION_KEY[hero.section])}</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-6xl">
            <Link to="/story/$slug" params={{ slug: heroSlug }}>
              {heroCopy.headline}
            </Link>
          </h1>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">{heroCopy.dek}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-ink-muted">
            <span>
              {flagEmoji(hero.countryCode)} {hero.location}
            </span>
            <SourceProof story={hero} lang={lang} names />
            <span className="inline-flex items-center gap-1 text-true">
              <BadgeCheck className="size-3.5" />
              {t(lang, "factChecked")}
            </span>
            <time>{formatDate(hero.publishedAt, lang)}</time>
          </div>
          <ShareBar lang={lang} path={storySharePath(hero, lang)} headline={heroCopy.headline} className="mt-5" />
        </div>
      </section>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {features.map((s) => (
          <StoryCard key={s.id} story={s} lang={lang} variant="feature" />
        ))}
      </div>

      <div className="mt-8">
        <AdSlot lang={lang} slot="native" salt="home-mid" />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {grid.map((s, i) => (
              <div key={s.id}>
                <StoryCard story={s} lang={lang} variant="compact" />
                {i === 3 ? (
                  <div className="mt-8">
                    <AdSlot lang={lang} slot="inarticle" salt="home-grid" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {shown < rest.length - 2 ? (
            <div className="mt-8">
              <Button variant="pop" onClick={() => setShown((n) => n + 8)}>
                {t(lang, "loadMore")}
              </Button>
            </div>
          ) : null}
        </div>
        <aside className="space-y-8 lg:col-span-4">
          <AdSlot lang={lang} slot="sidebar" className="hidden lg:block" salt="home-side" />
          <SocialRail lang={lang} />
          {sponsored ? (
            <div className="border border-rule bg-card p-4">
              <StoryCard story={sponsored} lang={lang} variant="compact" />
            </div>
          ) : null}
        </aside>
      </div>

      <div className="mt-12">
        <Newsletter lang={lang} onSubscribe={onSubscribe} />
      </div>
    </main>
  );
}
