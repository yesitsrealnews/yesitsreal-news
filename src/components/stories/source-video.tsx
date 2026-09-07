import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { getStoryVideo, videoCaption, youtubeHl } from "@/lib/videos";
import { Play } from "lucide-react";

export function SourceVideo({ storyId, lang }: { storyId: string; lang: Lang }) {
  const video = getStoryVideo(storyId);
  if (!video) return null;
  const hl = youtubeHl(lang);
  const cap = videoCaption(video, lang);
  const embed = video.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=${hl}&hl=${hl}`
    : null;

  return (
    <figure className="my-6 border-2 border-ink bg-ink text-paper">
      {embed ? (
        <div className="relative aspect-video w-full bg-ink">
          <iframe
            src={embed}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        <a
          href={video.sourceUrl}
          rel="noopener noreferrer"
          className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-ink px-6 text-center text-paper"
        >
          <Play className="size-12" aria-hidden />
          <span className="text-sm font-extrabold uppercase tracking-[0.14em]">{t(lang, "sourceVideoWatch")}</span>
          <span className="text-xs text-paper/80">{video.publisher}</span>
        </a>
      )}
      <figcaption className="border-t border-paper/20 bg-paper px-4 py-3 text-ink">
        <p className="kicker text-signal">{t(lang, "sourceVideo")}</p>
        <p className="mt-2 text-sm">{cap}</p>
        <p className="mt-2 text-xs text-ink-muted">
          {t(lang, "sourceVideoCredit")}{" "}
          <a href={video.sourceUrl} className="underline underline-offset-2" rel="noopener noreferrer">
            {video.publisher}
          </a>
          {" · "}
          {t(lang, "sourceVideoOriginal")} {video.originalLang.toUpperCase()}
          {" · "}
          {t(lang, "sourceVideoCaptions")}
        </p>
      </figcaption>
    </figure>
  );
}
