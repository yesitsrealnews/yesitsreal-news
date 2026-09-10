import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EMAILS, SITE_NAME, SITE_URL } from "@/lib/brand";
import { homeStories, publishedStories } from "@/lib/catalog";
import { storyCopy, storySlug } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { Lang, Story } from "@/lib/types";

export const Route = createFileRoute("/tesla")({
  head: () => ({
    meta: [
      { title: `Lecteur Tesla — ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Lecteur voiture YES IT'S REAL. Prêt pour l’écran Tesla. Pas d’accord de préinstall. Le quart d’heure Supercharger est le prime time.",
      },
      { property: "og:title", content: `Lecteur Tesla — ${SITE_NAME}` },
      { property: "og:url", content: `${SITE_URL}/tesla` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/tesla` }],
  }),
  component: TeslaReader,
});

const MAIL = `mailto:${EMAILS.investors}?subject=${encodeURIComponent("YES IT'S REAL — Tesla in-car / Theater")}`;

function TeslaReader() {
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const deskStatus = useAppStore((s) => s.deskStatus);
  const setLang = useAppStore((s) => s.setLang);
  const fr = lang === "fr";
  const week = useMemo(() => homeStories(extras, deskStatus).slice(0, 8), [extras, deskStatus]);
  const fallback = useMemo(() => publishedStories(extras, deskStatus).slice(0, 8), [extras, deskStatus]);
  const list = week.length ? week : fallback;
  const [open, setOpen] = useState<string | null>(list[0]?.id ?? null);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f4efe4]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 px-6 py-4">
        <p className="font-serif text-3xl uppercase leading-none tracking-tight sm:text-4xl">YES IT'S REAL</p>
        <div className="flex items-center gap-2">
          <LangBtn on={lang === "fr"} onClick={() => setLang("fr")}>
            FR
          </LangBtn>
          <LangBtn on={lang === "en"} onClick={() => setLang("en")}>
            EN
          </LangBtn>
          <Link
            to="/"
            className="inline-flex h-12 items-center border border-white/30 px-4 text-sm font-extrabold uppercase tracking-[0.12em]"
          >
            {fr ? "Le journal" : "The paper"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.18em] text-[#e10600]">
          {fr ? "Lecteur voiture · ça s’est vraiment passé" : "Car reader · it really happened"}
        </p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl uppercase leading-[0.92] sm:text-6xl">
          {fr ? "Le quart d’heure Supercharger." : "The Supercharger quarter-hour."}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
          {fr
            ? "Tesla ne préinstalle pas une appli tierce comme un téléphone. C’est un accord, on ne l’a pas. Le lecteur, lui, est prêt : écran paysage, titres énormes, doigts, pas de pub. Favori dans le navigateur Tesla, en P. Si Tesla veut Theater ou une préinstall : investors@yesitsreal.news."
            : "Tesla does not pre-install a third-party app like a phone. That is a deal. We do not have it. The reader is ready: landscape, huge type, fingers, no ads. Bookmark it in the Tesla browser, in Park. If Tesla wants Theater or a pre-install: investors@yesitsreal.news."}
        </p>

        <ul className="mt-10 grid gap-4 lg:grid-cols-2">
          {list.map((story) => (
            <StoryTile
              key={story.id}
              story={story}
              lang={lang}
              open={open === story.id}
              onToggle={() => setOpen(open === story.id ? null : story.id)}
            />
          ))}
        </ul>

        <section className="mt-14 border-t border-white/15 pt-8">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.18em] text-[#e10600]">
            {fr ? "Pour Tesla" : "For Tesla"}
          </p>
          <h2 className="mt-3 font-serif text-3xl uppercase">{fr ? "Theater, favori, préinstall." : "Theater, bookmark, pre-install."}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
            {fr
              ? "Le conducteur est déjà arrêté. Quinze minutes. Il ne veut pas la guerre. Il veut un fait vrai qui a l’air inventé. C’est exactement le journal. Pas de morts. Pas de mineurs. Ça s’est vraiment passé. Une source sur chaque papier."
              : "The driver is already stopped. Fifteen minutes. They do not want the war. They want a true fact that looks invented. That is the paper. No death beat. No minors. It really happened. A source on every story."}
          </p>
          <a
            href={MAIL}
            className="mt-6 inline-flex h-14 items-center bg-[#e10600] px-6 text-sm font-extrabold uppercase tracking-[0.14em] text-white"
          >
            {fr ? "Écrire pour un accord Tesla" : "Write for a Tesla deal"}
          </a>
        </section>
      </main>
    </div>
  );
}

function LangBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 min-w-12 items-center justify-center px-4 text-sm font-extrabold uppercase tracking-[0.12em] ${
        on ? "bg-[#f4efe4] text-[#0b0b0b]" : "border border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

function StoryTile({
  story,
  lang,
  open,
  onToggle,
}: {
  story: Story;
  lang: Lang;
  open: boolean;
  onToggle: () => void;
}) {
  const copy = storyCopy(story, lang);
  const src = story.sources[0];
  return (
    <li className="border border-white/15">
      <button type="button" onClick={onToggle} className="w-full p-5 text-left">
        <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#e10600]">
          {story.countryName} · {story.section}
        </p>
        <h2 className="mt-2 font-serif text-2xl uppercase leading-[0.95] sm:text-3xl">{copy.headline}</h2>
        <p className="mt-3 text-base leading-relaxed text-white/70">{copy.dek}</p>
      </button>
      {open ? (
        <div className="border-t border-white/15 px-5 pb-5">
          <div className="mt-4 space-y-3 text-[1.05rem] leading-relaxed text-white/85">
            {copy.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          {src ? (
            <p className="mt-4 text-sm text-white/55">
              {src.publisher}
              {src.url ? (
                <>
                  {" · "}
                  <a href={src.url} className="underline" rel="noopener noreferrer">
                    {lang === "fr" ? "Source" : "Source"}
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
          <Link
            to="/story/$slug"
            params={{ slug: storySlug(story, lang) }}
            className="mt-4 inline-flex h-12 items-center border border-white/30 px-4 text-sm font-extrabold uppercase tracking-[0.12em]"
          >
            {lang === "fr" ? "Ouvrir le papier" : "Open the story"}
          </Link>
        </div>
      ) : null}
    </li>
  );
}
