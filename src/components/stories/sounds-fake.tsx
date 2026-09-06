import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function SoundsFake({ storyId, lang }: { storyId: string; lang: Lang }) {
  const guess = useAppStore((s) => s.fakeGuesses[storyId]);
  const setGuess = useAppStore((s) => s.guessFake);

  return (
    <section className="mt-6 border-2 border-ink bg-paper-2 p-4">
      <p className="kicker text-signal">{t(lang, "soundsFake")}</p>
      {guess ? (
        <p className="mt-2 text-sm font-medium">{t(lang, "soundsFakeReveal")}</p>
      ) : (
        <>
          <p className="mt-2 text-sm">{t(lang, "soundsFakeQ")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="signal" onClick={() => setGuess(storyId, "yes")}>
              {t(lang, "soundsFakeYes")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setGuess(storyId, "no")}>
              {t(lang, "soundsFakeNo")}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
