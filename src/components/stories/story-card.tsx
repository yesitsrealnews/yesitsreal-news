import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import type { Lang, Story } from "@/lib/types";
import { t } from "@/lib/i18n";
import { SECTION_KEY } from "@/lib/i18n/keys";
import { flagEmoji, storyCopy, storySlug } from "@/lib/format";
import { DumbnessScore } from "@/components/stories/dumbness";
import { StoryCover } from "@/components/stories/cover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { voiceMeta } from "@/lib/voices";

export function StoryCard({
  story,
  lang,
  variant = "standard",
}: {
  story: Story;
  lang: Lang;
  variant?: "standard" | "compact" | "rail" | "feature";
}) {
  const copy = storyCopy(story, lang);
  const sectionLabel = t(lang, SECTION_KEY[story.section] ?? "secWorld");
  const slug = storySlug(story, lang);
  const voice = voiceMeta(story.id);

  return (
    <article className={cn("group", variant === "feature" && "flex flex-col")}>
      {variant !== "rail" ? (
        <Link
          to="/story/$slug"
          params={{ slug }}
          className={cn(
            "relative mb-3 block overflow-hidden bg-ink",
            variant === "feature" ? "aspect-[16/9]" : "aspect-[4/3]",
          )}
        >
          <StoryCover
            id={story.id}
            section={story.section}
            alt=""
            className="transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <span className="absolute left-2 top-2">
            <Badge tone="scream">{t(lang, "truePill")}</Badge>
          </span>
          {story.breaking ? (
            <span className="absolute right-2 top-2">
              <Badge tone="signal">{t(lang, "breaking")}</Badge>
            </span>
          ) : null}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className="kicker text-signal">{sectionLabel}</span>
        {voice.id !== "desk" ? (
          <span className="kicker text-ink-muted">{lang === "fr" ? voice.afterFr : voice.after}</span>
        ) : null}
        {story.sponsored ? <Badge tone="gold">{t(lang, "sponsored")}</Badge> : null}
        {variant === "rail" && story.breaking ? <Badge tone="signal">{t(lang, "breaking")}</Badge> : null}
      </div>
      <h3
        className={cn(
          "font-serif uppercase tracking-tight text-ink group-hover:underline decoration-2 underline-offset-4",
          variant === "compact" || variant === "rail" ? "text-lg leading-snug" : "text-2xl leading-[1.05]",
          variant === "feature" && "text-3xl sm:text-4xl",
          story.section === "archive" && "font-archive italic normal-case tracking-normal leading-snug",
        )}
      >
        <Link to="/story/$slug" params={{ slug }}>
          {copy.headline}
        </Link>
      </h3>
      {variant !== "rail" ? (
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{copy.dek}</p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs font-medium text-ink-muted">
        <span>
          {flagEmoji(story.countryCode)} {story.location}
        </span>
        <DumbnessScore score={story.dumbness} lang={lang} size="sm" />
        {story.factChecked && !story.sponsored ? (
          <span className="inline-flex items-center gap-1 text-true">
            <BadgeCheck className="size-3.5" />
            {t(lang, "factChecked")}
          </span>
        ) : null}
      </div>
    </article>
  );
}
