import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { StoryCard } from "@/components/stories/story-card";
import { Input } from "@/components/ui/input";
import { searchStories } from "@/lib/catalog";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const [q, setQ] = useState(initial);
  const results = q.trim() ? searchStories(extras, q, lang) : [];

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
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(lang, "searchPlaceholder")}
            aria-label={t(lang, "search")}
            autoFocus
          />
        </form>
        <div className="mt-8 space-y-8">
          {q.trim() && results.length === 0 ? <p>{t(lang, "searchEmpty")}</p> : null}
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
