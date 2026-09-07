import { useMemo, useState } from "react";
import type { Lang, SectionId, Story } from "@/lib/types";
import { t } from "@/lib/i18n";
import { SECTION_KEY } from "@/lib/i18n/keys";
import { countriesFrom, dumbest, inSection } from "@/lib/catalog";
import { StoryCard } from "@/components/stories/story-card";
import { AdSlot } from "@/components/site/ad-slot";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SectionArchive({
  section,
  lang,
  extras,
}: {
  section: SectionId;
  lang: Lang;
  extras: Story[];
}) {
  const base = inSection(extras, section);
  const countries = countriesFrom(base);
  const [country, setCountry] = useState("all");
  const [minD, setMinD] = useState(0);
  const [shown, setShown] = useState(12);

  const filtered = useMemo(
    () =>
      base.filter((s) => (country === "all" ? true : s.countryCode === country) && s.dumbness >= minD),
    [base, country, minD],
  );
  const week = dumbest(filtered, 5);
  const title = t(lang, SECTION_KEY[section] ?? "secWorld");
  const era = section === "archive";

  return (
    <main
      id="main"
      className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6", era && "era-archive -mx-4 px-4 sm:-mx-6 sm:px-6")}
    >
      <p className="kicker text-signal">{era ? t(lang, "archiveKicker") : t(lang, "edition")}</p>
      <h1 className={cn("mt-2 font-serif text-4xl sm:text-5xl", era && "font-archive italic normal-case")}>{title}</h1>
      <p className={cn("mt-2 max-w-2xl text-sm text-ink-muted", era && "font-[family-name:var(--font-archive-body)] text-base")}>
        {era ? t(lang, "archiveDek") : t(lang, "tagline4")}
      </p>
      {era ? <div className="double-rule mt-6 py-2" /> : null}

      <form
        className="mt-6 grid gap-4 border border-rule p-4 sm:grid-cols-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <Label htmlFor="country">{t(lang, "country")}</Label>
          <select
            id="country"
            className="mt-1 h-11 w-full border border-rule bg-card px-2 text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="all">{t(lang, "allCountries")}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="dumb">{t(lang, "minDumbness")}</Label>
          <select
            id="dumb"
            className="mt-1 h-11 w-full border border-rule bg-card px-2 text-sm"
            value={minD}
            onChange={(e) => setMinD(Number(e.target.value))}
          >
            {[0, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? "—" : `${n}+`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCountry("all");
              setMinD(0);
            }}
          >
            {t(lang, "filterReset")}
          </Button>
        </div>
      </form>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {filtered.length === 0 ? (
            <p>{t(lang, "noStories")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {filtered.slice(0, shown).map((s) => (
                <div key={s.id} className="border-t border-rule pt-4">
                  <StoryCard story={s} lang={lang} />
                </div>
              ))}
            </div>
          )}
          {shown < filtered.length ? (
            <Button className="mt-8" variant="outline" onClick={() => setShown((n) => n + 8)}>
              {t(lang, "loadMore")}
            </Button>
          ) : null}
        </div>
        <aside className="space-y-6 lg:col-span-4">
          <section>
            <h2 className="kicker border-b border-rule pb-2">
              {era ? t(lang, "archiveKicker") : t(lang, "unbelievableWeek")}
            </h2>
            <ul className="mt-3 space-y-4">
              {week.map((s) => (
                <li key={s.id}>
                  <StoryCard story={s} lang={lang} variant="rail" />
                </li>
              ))}
            </ul>
          </section>
          <AdSlot lang={lang} slot="sidebar" className="min-h-[250px] lg:sticky lg:top-24" />
        </aside>
      </div>
    </main>
  );
}
