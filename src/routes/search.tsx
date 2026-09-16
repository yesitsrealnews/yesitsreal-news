import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { StoryCard } from "@/components/stories/story-card";
import { Input } from "@/components/ui/input";
import { searchFeed } from "@/lib/public-feed-rpc";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import type { Story } from "@/lib/types";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps }) => {
    if (!deps.q.trim()) return { results: [] as Story[] };
    return searchFeed({ data: { q: deps.q } });
  },
  component: SearchPage,
});

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const loaded = Route.useLoaderData();
  const lang = useAppStore((s) => s.lang);
  const [q, setQ] = useState(initial);
  const [results, setResults] = useState<Story[]>(loaded?.results ?? []);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setResults(loaded?.results ?? []);
  }, [loaded?.results]);

  useEffect(() => {
    const needle = q.trim();
    if (!needle) {
      setResults([]);
      return;
    }
    if (needle === initial.trim()) return;
    const handle = window.setTimeout(() => {
      setPending(true);
      void searchFeed({ data: { q: needle } })
        .then((data) => setResults(data.results))
        .finally(() => setPending(false));
    }, 280);
    return () => window.clearTimeout(handle);
  }, [q, initial]);

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-serif text-4xl">{t(lang, "search")}</h1>
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            placeholder={t(lang, "searchPlaceholder")}
            aria-label={t(lang, "search")}
            autoFocus
          />
        </form>
        <div className="mt-8 space-y-8">
          {q.trim() && !pending && results.length === 0 ? <p>{t(lang, "searchEmpty")}</p> : null}
          {q.trim() && results.length > 0 ? (
            <p className="mb-4 text-sm text-ink-muted">{results.length} — {t(lang, "searchResults")}</p>
          ) : null}
          {results.map((s) => (
            <div key={s.id} className="border-t border-rule pt-4">
              <StoryCard story={s} lang={lang} />
            </div>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
