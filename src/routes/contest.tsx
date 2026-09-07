import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { ShareBar } from "@/components/site/share-bar";
import { Honeypot } from "@/components/site/honeypot";
import { AdSlot } from "@/components/site/ad-slot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { CUP, cupClosesIn, liveVotes, seedEntries } from "@/lib/contest";
import { formatCount } from "@/lib/engagement";
import { flagEmoji } from "@/lib/format";
import { isHoneypotTripped, isSafeHttpUrl, sanitizeText } from "@/lib/security";
import { EMAILS } from "@/lib/brand";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/contest")({ component: ContestPage });

function ContestPage() {
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const voted = useAppStore((s) => s.contestVoted);
  const extraVotes = useAppStore((s) => s.contestVotes);
  const userEntries = useAppStore((s) => s.cupEntries);
  const voteCup = useAppStore((s) => s.voteCup);
  const addCupEntry = useAppStore((s) => s.addCupEntry);
  const addSubmission = useAppStore((s) => s.addSubmission);
  const [hp, setHp] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [country, setCountry] = useState("");
  const [msg, setMsg] = useState("");
  const [clock, setClock] = useState<{ d: number; h: number; m: number } | null>(null);
  useEffect(() => {
    setClock(cupClosesIn());
  }, []);

  const board = useMemo(() => {
    const seeded = seedEntries(lang).map((e) => ({
      ...e,
      votes: liveVotes(e.baseVotes) + (extraVotes[e.id] ?? 0),
    }));
    const extrasOnBoard = extras
      .filter((s) => s.status === "published")
      .map((s) => ({
        id: s.id,
        countryCode: s.countryCode,
        countryName: s.countryName,
        headline: s.copy.en.headline,
        dek: s.copy.en.dek,
        slug: s.slug,
        dumbness: s.dumbness,
        votes: liveVotes(900) + (extraVotes[s.id] ?? 0),
        baseVotes: 900,
      }));
    const merged = [...seeded];
    for (const e of extrasOnBoard) {
      if (!merged.some((m) => m.id === e.id)) merged.push(e);
    }
    return merged.sort((a, b) => b.votes - a.votes);
  }, [lang, extras, extraVotes]);

  const total = board.reduce((n, e) => n + e.votes, 0);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "contestLive")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-[0.9] sm:text-7xl">{t(lang, "contestTitle")}</h1>
        <p className="mt-4 max-w-2xl text-lg">{t(lang, "contestDek")}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Badge tone="scream">
            {clock ? `${clock.d}${t(lang, "daysAbbr")} ${clock.h}${t(lang, "hoursAbbr")} ${clock.m}${t(lang, "minutesAbbr")}` : t(lang, "contestLive")}
          </Badge>
          <Badge tone="signal">{formatCount(total, lang)} {t(lang, "votes")}</Badge>
          <Badge tone="ink">{CUP.purse} €</Badge>
        </div>
        <p className="mt-4 text-sm">{t(lang, "contestPrize")}</p>
        <p className="mt-2 text-sm text-ink-muted">{t(lang, "contestRules")}</p>
        <ShareBar lang={lang} path="/contest" headline={t(lang, "contestTitle")} className="mt-5" />

        <div className="mt-8 overflow-hidden bg-ink">
          <img src="/ads/cup.jpg" alt="" className="max-h-80 w-full object-cover" />
        </div>

        <h2 className="mt-10 font-serif text-3xl uppercase">{t(lang, "contestLeaders")}</h2>
        <ol className="mt-4 divide-y-2 divide-ink border-2 border-ink">
          {board.map((e, i) => {
            const already = voted.includes(e.id);
            return (
              <li key={e.id} className="flex flex-col gap-3 bg-card p-4 sm:flex-row sm:items-center">
                <span className="font-serif text-4xl text-signal tabular-nums">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em]">
                    {flagEmoji(e.countryCode)} {e.countryName}
                  </p>
                  {e.slug ? (
                    <Link to="/story/$slug" params={{ slug: e.slug }} className="font-serif text-xl uppercase leading-tight hover:underline">
                      {e.headline}
                    </Link>
                  ) : (
                    <p className="font-serif text-xl uppercase leading-tight">{e.headline}</p>
                  )}
                  <p className="mt-1 text-xs text-ink-muted">
                    {formatCount(e.votes, lang)} {t(lang, "votes")} · {t(lang, "dumbness")} {e.dumbness}/10
                  </p>
                </div>
                <Button
                  variant={already ? "outline" : "signal"}
                  disabled={already}
                  onClick={() => voteCup(e.id)}
                >
                  {already ? t(lang, "contestVoted") : t(lang, "contestVote")}
                </Button>
              </li>
            );
          })}
        </ol>

        {userEntries.length ? (
          <p className="mt-4 text-sm text-ink-muted">
            {userEntries.length} {t(lang, "contestEntries")} — pending desk.
          </p>
        ) : null}

        <section className="relative mt-12 border-2 border-ink bg-scream p-6 text-scream-ink">
          <h2 className="flex items-center gap-2 font-serif text-3xl uppercase">
            <Trophy className="size-7" />
            {t(lang, "contestEnter")}
          </h2>
          <p className="mt-2 text-sm">{t(lang, "contestHow")}</p>
          {msg ? (
            <p className="mt-6 bg-ink p-4 text-sm text-paper">{msg}</p>
          ) : (
            <form
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (isHoneypotTripped(hp)) return;
                const cleanUrl = sanitizeText(url, 500);
                const cleanNotes = sanitizeText(notes, 800);
                const cleanCountry = sanitizeText(country, 80);
                if (!isSafeHttpUrl(cleanUrl)) {
                  setMsg(t(lang, "contestNeed"));
                  return;
                }
                addCupEntry({ country: cleanCountry, url: cleanUrl, notes: cleanNotes });
                addSubmission({
                  id: `sub-cup-${Date.now()}`,
                  url: cleanUrl,
                  notes: `CUP: ${cleanNotes}`,
                  country: cleanCountry,
                  name: "",
                  createdAt: new Date().toISOString(),
                  status: "received",
                });
                setMsg(t(lang, "contestThanks"));
              }}
            >
              <Honeypot value={hp} onChange={setHp} />
              <div>
                <Label htmlFor="cup-url">{t(lang, "submitUrl")}</Label>
                <Input id="cup-url" value={url} maxLength={500} onChange={(e) => setUrl(e.target.value)} className="mt-1 bg-paper" />
              </div>
              <div>
                <Label htmlFor="cup-notes">{t(lang, "submitNotes")}</Label>
                <Textarea id="cup-notes" value={notes} maxLength={800} onChange={(e) => setNotes(e.target.value)} className="mt-1 bg-paper" />
              </div>
              <div>
                <Label htmlFor="cup-country">{t(lang, "submitCountry")}</Label>
                <Input id="cup-country" value={country} maxLength={80} onChange={(e) => setCountry(e.target.value)} className="mt-1 bg-paper" />
              </div>
              <Button type="submit" variant="default">
                {t(lang, "contestEnter")}
              </Button>
            </form>
          )}
          <p className="mt-4 text-xs">
            {EMAILS.contest}
          </p>
        </section>

        <div className="mt-10">
          <AdSlot lang={lang} slot="native" salt="contest" />
        </div>
      </main>
    </SiteShell>
  );
}
