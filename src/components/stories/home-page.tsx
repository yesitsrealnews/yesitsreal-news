import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Lang, Story } from "@/lib/types";
import { t } from "@/lib/i18n";
import { SECTION_KEY } from "@/lib/i18n/keys";
import { flagEmoji, formatDate, storyCopy, storySlug } from "@/lib/format";
import { storySharePath } from "@/lib/viral";
import { dumbest, homeStories, mostRead, sponsoredStory } from "@/lib/catalog";
import { StoryCard } from "@/components/stories/story-card";
import { StoryCover } from "@/components/stories/cover";
import { Newsletter } from "@/components/site/newsletter";
import { AdSlot } from "@/components/site/ad-slot";
import { SocialRail } from "@/components/site/social-rail";
import { ShareBar } from "@/components/site/share-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DumbnessScore } from "@/components/stories/dumbness";
import { BadgeCheck, Newspaper } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function HomePage({
  lang,
  extras,
  onSubscribe,
  frontPageIds: frontPageIdsProp,
}: {
  lang: Lang;
  extras: Story[];
  onSubscribe: (email: string) => void;
  frontPageIds?: string[];
}) {
  const deskStatus = useAppStore((s) => s.deskStatus);
  const storeFrontIds = useAppStore((s) => s.frontPageIds);
  const frontPageIds = frontPageIdsProp?.length ? frontPageIdsProp : storeFrontIds;
  const all = homeStories(extras, deskStatus, frontPageIds);
  const hero = all[0];
  const rest = all.slice(1);
  const features = rest.slice(0, 2);
  const [shown, setShown] = useState(8);
  const grid = rest.slice(2, 2 + shown);
  const read = mostRead(extras, 6, all, deskStatus);
  const dumb = dumbest(extras, 5, all, deskStatus);
  const sponsored = sponsoredStory(extras, deskStatus);

  if (!hero) return <p className="p-8">{t(lang, "noStories")}</p>;
  const heroCopy = storyCopy(hero, lang);
  const heroSlug = storySlug(hero, lang);

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <div className="mb-5 flex flex-wrap gap-2">
        <Link to="/today" className="inline-flex h-11 items-center bg-ink px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-paper">
          <Newspaper className="me-2 size-4" />
          {t(lang, "todayTitle")}
        </Link>
        <Link to="/shop" className="inline-flex h-11 items-center bg-scream px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-scream-ink">
          {t(lang, "shopCta")}
        </Link>
      </div>
      <p className="mb-5 max-w-3xl border-s-4 border-signal ps-4 text-sm font-medium leading-snug sm:text-base">
        {t(lang, "raisonLine")}{" "}
        <Link to="/about" className="underline underline-offset-2">
          {t(lang, "about")}
        </Link>
        {" · "}
        {t(lang, "thisWeek")}
        {" · "}
        <Link to="/rankings" className="underline underline-offset-2">
          {t(lang, "allTime")}
        </Link>
      </p>
      <section className="grid gap-6 border-b-4 border-ink pb-6 lg:grid-cols-12">
        <Link
          to="/story/$slug"
          params={{ slug: heroSlug }}
          className="relative block aspect-[16/10] overflow-hidden bg-ink lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]"
        >
          <StoryCover id={hero.id} section={hero.section} alt="" priority className="h-full w-full" />
          <span className="absolute left-3 top-3 flex flex-wrap gap-2">
            {hero.breaking ? <Badge tone="signal">{t(lang, "breaking")}</Badge> : null}
            <Badge tone="scream">{t(lang, "truePill")}</Badge>
            <Badge>{t(lang, "thisWeek")}</Badge>
          </span>
        </Link>
        <div className="flex flex-col justify-center lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="kicker text-signal">{t(lang, SECTION_KEY[hero.section])}</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            <Link to="/story/$slug" params={{ slug: heroSlug }}>
              {heroCopy.headline}
            </Link>
          </h1>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">{heroCopy.dek}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-ink-muted">
            <span>
              {flagEmoji(hero.countryCode)} {hero.location}
            </span>
            <DumbnessScore score={hero.dumbness} lang={lang} />
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
              <Button variant="signal" onClick={() => setShown((n) => n + 8)}>
                {t(lang, "loadMore")}
              </Button>
            </div>
          ) : null}
        </div>
        <aside className="space-y-8 lg:col-span-4">
          <AdSlot lang={lang} slot="sidebar" className="hidden lg:block" salt="home-side" />
          {read.length ? (
          <section>
            <h2 className="kicker border-b-2 border-ink pb-2 text-ink">{t(lang, "mostRead")}</h2>
            <ol className="mt-3 space-y-3">
              {read.map((s, i) => (
                <li key={s.id} className="flex gap-3">
                  <span className="font-serif text-3xl leading-none text-signal tabular-nums">{i + 1}</span>
                  <StoryCard story={s} lang={lang} variant="rail" />
                </li>
              ))}
            </ol>
          </section>
          ) : null}
          {dumb.length ? (
          <section>
            <h2 className="kicker border-b-2 border-signal pb-2 text-signal">{t(lang, "dumbestToday")}</h2>
            <ul className="mt-3 space-y-4">
              {dumb.map((s) => (
                <li key={s.id}>
                  <StoryCard story={s} lang={lang} variant="rail" />
                </li>
              ))}
            </ul>
            <Link to="/today" className="mt-3 inline-block text-xs font-extrabold uppercase tracking-[0.14em] underline">
              {t(lang, "todayShare")}
            </Link>
          </section>
          ) : null}
          <SocialRail lang={lang} />
          {sponsored ? (
            <div className="border-2 border-gold p-4">
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
