import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { REGIONAL_PRESS } from "@/lib/data/regional-press";
import { RSS_FEEDS, feedKind, feedPriority } from "@/lib/rss-feeds";
import { xWatches } from "@/lib/x-journalists";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/sources")({ component: SourcesPage });

function SourcesPage() {
  const allowList = useAppStore((s) => s.allowList);
  const denyList = useAppStore((s) => s.denyList);
  const setAllowList = useAppStore((s) => s.setAllowList);
  const setDenyList = useAppStore((s) => s.setDenyList);
  const seedRegionalPress = useAppStore((s) => s.seedRegionalPress);
  const [a, setA] = useState("");
  const [d, setD] = useState("");
  const [srcQ, setSrcQ] = useState("");
  const [rssQ, setRssQ] = useState("");
  const [xQ, setXQ] = useState("");

  const filteredPress = srcQ.trim()
    ? REGIONAL_PRESS.filter((s) => {
        const blob = `${s.name} ${s.domain} ${s.region} ${s.group ?? ""}`.toLowerCase();
        return srcQ
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
          .every((t) => blob.includes(t));
      })
    : REGIONAL_PRESS;

  const rssWithMeta = useMemo(
    () =>
      RSS_FEEDS.map((f) => ({
        ...f,
        kind: feedKind(f),
        prio: feedPriority(f),
      })),
    [],
  );

  const filteredRss = rssQ.trim()
    ? rssWithMeta.filter((f) => {
        const blob = `${f.name} ${f.domain} ${f.region} ${f.kind}`.toLowerCase();
        return rssQ
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
          .every((t) => blob.includes(t));
      })
    : rssWithMeta;

  const watches = useMemo(() => xWatches(), []);
  const filteredX = xQ.trim()
    ? watches.filter((w) => {
        const blob = `${w.handle} ${w.name} ${w.countryCode} ${w.kind}`.toLowerCase();
        return xQ
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
          .every((t) => blob.includes(t));
      })
    : watches;
  const xPrio = watches.filter((w) => w.priority === 1).length;
  const insoliteN = rssWithMeta.filter((f) => f.kind === "insolite" || f.kind === "animaux").length;
  const faitsN = rssWithMeta.filter((f) => f.kind === "faits-divers").length;
  const morningN = rssWithMeta.filter((f) => f.prio === 1).length;
  const withRss = REGIONAL_PRESS.filter((s) => s.rss).length;

  return (
    <main className="grid gap-8 p-6 lg:grid-cols-2">
      <div className="space-y-8 lg:col-span-2">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Sources & PQR</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Base régionale&nbsp;: {REGIONAL_PRESS.length} titres ({withRss} avec RSS) · flux
              branchés&nbsp;: {RSS_FEEDS.length} · file du matin&nbsp;: {morningN} · insolite&nbsp;:{" "}
              {insoliteN} · faits-divers&nbsp;: {faitsN} · allowlist&nbsp;: {allowList.length} ·
              denylist&nbsp;: {denyList.length} · X&nbsp;: {watches.length} comptes ({xPrio}{" "}
              prioritaires). Les revues suivantes scannent les clusters FR +
              BE/CH/QC à chaque fois, le reste du monde tourne.
            </p>
          </div>
          <Button type="button" onClick={() => seedRegionalPress()}>
            Charger / fusionner la base PQR
          </Button>
        </header>

        <section className="rounded-lg border border-rule">
          <div className="border-b border-rule px-4 py-3">
            <h2 className="font-serif text-xl">Presse régionale (lecture seule)</h2>
            <p className="text-xs text-muted-foreground">
              {filteredPress.length} / {REGIONAL_PRESS.length} titres — domaines publics
            </p>
            <Input
              className="mt-2"
              value={srcQ}
              onChange={(e) => setSrcQ(e.target.value)}
              placeholder="Filtrer : pays, titre, domaine…"
              aria-label="Filtrer la base PQR"
            />
          </div>
          <ul className="max-h-72 overflow-y-auto text-sm">
            {filteredPress.map((s) => (
              <li
                key={`${s.name}-${s.domain}-${s.region}`}
                className="flex flex-wrap justify-between gap-2 border-b border-rule px-4 py-2 last:border-b-0"
              >
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">
                  {s.domain} — {s.region}
                  {s.rss ? (
                    <>
                      {" · "}
                      <a href={s.rss} className="underline" target="_blank" rel="noopener noreferrer">
                        RSS
                      </a>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-rule">
          <div className="border-b border-rule px-4 py-3">
            <h2 className="font-serif text-xl">Veille X — rédactions et desks</h2>
            <p className="text-xs text-muted-foreground">
              {filteredX.length} / {watches.length} comptes. Pas de handle inventé — rédactions sourcées + desks
              insolite. Le tirage du matin et les passes midi/soir lisent leurs posts (mots de la ligne) et poussent
              les articles liés dans la file. Un post sans URL de journal reste dehors. Cambuse : bouton Tirer X.
            </p>
            <Input
              className="mt-2"
              value={xQ}
              onChange={(e) => setXQ(e.target.value)}
              placeholder="Filtrer : OuestFrance, JP, desk…"
              aria-label="Filtrer la veille X"
            />
          </div>
          <ul className="max-h-72 overflow-y-auto text-sm">
            {filteredX.map((w) => (
              <li
                key={w.handle.toLowerCase()}
                className="flex flex-wrap justify-between gap-2 border-b border-rule px-4 py-2 last:border-b-0"
              >
                <span>
                  <a
                    href={`https://x.com/${w.handle}`}
                    className="font-medium underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{w.handle}
                  </a>
                  <span className="ml-2 text-[0.7rem] uppercase tracking-wide text-ink-muted">
                    {w.kind}
                    {w.priority === 1 ? " · matin" : ""}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {w.name} · {w.countryCode}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-rule">
          <div className="border-b border-rule px-4 py-3">
            <h2 className="font-serif text-xl">Flux RSS branchés</h2>
            <p className="text-xs text-muted-foreground">
              {filteredRss.length} / {RSS_FEEDS.length} — matin = prioritaire pour la file. Insolite
              et faits-divers passent un filtre plus large. Pas de publication auto.
            </p>
            <Input
              className="mt-2"
              value={rssQ}
              onChange={(e) => setRssQ(e.target.value)}
              placeholder="Filtrer les flux : insolite, DH, Wales…"
              aria-label="Filtrer les flux RSS"
            />
          </div>
          <ul className="max-h-72 overflow-y-auto text-sm">
            {filteredRss.map((f) => (
              <li key={f.url} className="flex flex-wrap justify-between gap-2 border-b border-rule px-4 py-2 last:border-b-0">
                <span>
                  <span className="font-medium">{f.name}</span>
                  <span className="ml-2 text-[0.7rem] uppercase tracking-wide text-ink-muted">
                    {f.kind}
                    {f.prio === 1 ? " · matin" : ""}
                  </span>
                </span>
                <a href={f.url} className="text-muted-foreground underline" target="_blank" rel="noopener noreferrer">
                  {f.domain}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="font-serif text-2xl">Allowlist</h2>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (a.trim()) setAllowList([a.trim(), ...allowList]);
            setA("");
          }}
        >
          <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="domaine" />
          <Button type="submit">Ajouter</Button>
        </form>
        <ul className="mt-4 max-h-96 overflow-y-auto text-sm">
          {allowList.map((x) => (
            <li key={x} className="flex justify-between border-b border-rule py-2">
              {x}
              <button
                type="button"
                className="text-xs underline"
                onClick={() => setAllowList(allowList.filter((i) => i !== x))}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Denylist</h2>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (d.trim()) setDenyList([d.trim(), ...denyList]);
            setD("");
          }}
        >
          <Input value={d} onChange={(e) => setD(e.target.value)} placeholder="domaine satire" />
          <Button type="submit">Ajouter</Button>
        </form>
        <ul className="mt-4 max-h-96 overflow-y-auto text-sm">
          {denyList.map((x) => (
            <li key={x} className="flex justify-between border-b border-rule py-2">
              {x}
              <button
                type="button"
                className="text-xs underline"
                onClick={() => setDenyList(denyList.filter((i) => i !== x))}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
