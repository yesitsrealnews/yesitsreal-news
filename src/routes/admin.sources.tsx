import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { REGIONAL_PRESS } from "@/lib/data/regional-press";
import { RSS_FEEDS, feedKind, feedPriority } from "@/lib/rss-feeds";
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
              denylist&nbsp;: {denyList.length}
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
