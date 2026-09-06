import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function ThanksMusk() {
  const lang = useAppStore((s) => s.lang);
  return (
    <section
      id="thanks"
      className="mt-12 border-y-4 border-ink bg-paper-2 px-1 py-10 sm:px-4"
    >
      <p className="kicker text-signal">{t(lang, "thanksKicker")}</p>
      <h2 className="mt-3 font-serif text-3xl uppercase leading-[0.95] sm:text-5xl">{t(lang, "thanksTitle")}</h2>
      <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed">{t(lang, "thanksP1")}</p>
      <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed">{t(lang, "thanksP2")}</p>
      <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed">{t(lang, "thanksP3")}</p>
      <p className="mt-8 font-serif text-xl uppercase">{t(lang, "thanksSign")}</p>
    </section>
  );
}
