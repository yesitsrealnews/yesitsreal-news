import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ShareBar } from "@/components/site/share-bar";
import { AdSlot } from "@/components/site/ad-slot";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { EMAILS, SOCIAL } from "@/lib/brand";
import { CONTENT_CALENDAR, deskFeed } from "@/lib/social-feed";
import { formatCount } from "@/lib/engagement";
import { formatDate } from "@/lib/format";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/social")({ component: SocialPage });

function SocialPage() {
  const lang = useAppStore((s) => s.lang);
  const feed = deskFeed();

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "followUs")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-none">{t(lang, "social")}</h1>
        <p className="mt-4">
          <a href="/kit" className="inline-block bg-scream px-3 py-2 text-sm font-extrabold uppercase tracking-[0.12em] text-scream-ink">
            Télécharger le bandeau X
          </a>
        </p>
        <p className="mt-4 max-w-2xl text-lg">{t(lang, "socialDek")}</p>
        <p className="mt-2 text-sm text-ink-muted">{EMAILS.press}</p>
        <ShareBar lang={lang} path="/social" headline={t(lang, "social")} className="mt-5" />

        <section className="mt-8 border-2 border-ink bg-scream p-5 text-scream-ink">
          <p className="kicker">X · @Yesitsarealnews · LIVE</p>
          <h2 className="mt-2 font-serif text-3xl uppercase">Compte actif. Colle ça maintenant.</h2>
          <div className="mt-5 flex flex-wrap items-center gap-4 border border-ink bg-paper p-3 text-ink">
            <img src="/brand/avatar.jpg" alt="YES IT'S REAL avatar" className="size-24 border border-ink object-cover" />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-signal">Photo + bannière + cartes</p>
              <p className="mt-1 text-sm font-medium">YES IT'S REAL — vrai, sourcé, trop bête. Pas de satire.</p>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-extrabold uppercase">
                <a href="/brand/avatar.jpg" download className="underline">Avatar</a>
                <a href="/brand/header.jpg" download className="underline">Bannière</a>
                <a href="/brand/header-clean.jpg" download className="underline">Bannière nette</a>
                <a href="/brand/card-bat.jpg" download className="underline">Carte chauve-souris</a>
                <a href="/brand/card-pigeon.jpg" download className="underline">Carte pigeon</a>
                <a href="/brand/card-snake.jpg" download className="underline">Carte serpent</a>
              </p>
            </div>
          </div>
          <p className="mt-2 max-w-xl text-sm">
            Le journal pointe vers x.com/Yesitsarealnews. Trois posts, dans l’ordre.
          </p>
          <ol className="mt-4 space-y-3">
            {[
              "YES IT'S REAL. Vrai. Sourcé. Trop bête. Pas de satire.\n\nSi ça sonne faux, lis les sources.",
              "Une médecin de Richmond se réveille : une chauve-souris sur la bouche. Elle l’a coincée. Test rage négatif. Elle a fait un PSA.\n\nC’est vrai. WTVR. Pas de satire.",
              "Percuté à 90 km/h, un pigeon passe 12 h dans la calandre. Le mécano : « jamais vu ça en dix ans. » Ils l’ont appelé Romont.\n\nC’est vrai. Ouest-France. Pas de satire.",
            ].map((text, i) => (
              <li key={i} className="border border-ink bg-paper p-3 text-ink">
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-signal">Post {i + 1}</p>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{text}</pre>
              </li>
            ))}
          </ol>
        </section>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SOCIAL.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-full flex-col border-2 border-ink bg-card p-4 hover:bg-scream hover:text-scream-ink"
              >
                <span className="kicker">{s.name}</span>
                {s.live ? (
                  <span className="ms-2 inline-flex items-center bg-scream px-1.5 py-0.5 text-[0.6rem] font-extrabold tracking-[0.14em] text-scream-ink">
                    LIVE
                  </span>
                ) : null}
                <span className="mt-1 font-serif text-2xl uppercase">{s.handle}</span>
                <span className="mt-2 text-sm">{s.bio}</span>
                <span className="mt-auto pt-3 text-xs font-bold uppercase tracking-[0.12em]">{s.cadence}</span>
              </a>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-serif text-3xl uppercase">{t(lang, "socialLive")}</h2>
        <ol className="mt-4 space-y-4">
          {feed.map((p) => (
            <li key={p.id} className="border border-rule bg-card p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-signal">
                {p.network} · {p.handle} · {formatDate(p.time, lang)}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{p.text}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <a href={p.href} className="font-bold uppercase underline">
                  {t(lang, "readMore")}
                </a>
                <span className="inline-flex items-center gap-1">
                  <Heart className="size-3" />
                  {formatCount(p.faves, lang)}
                </span>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 font-serif text-3xl uppercase">Desk clock</h2>
        <ul className="mt-4 divide-y border border-rule">
          {CONTENT_CALENDAR.map((c) => (
            <li key={c.slot} className="flex gap-4 px-4 py-3 text-sm">
              <span className="w-16 font-extrabold tabular-nums">{c.slot}</span>
              <span>{c.item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <AdSlot lang={lang} slot="native" salt="social" />
        </div>
      </main>
    </SiteShell>
  );
}
