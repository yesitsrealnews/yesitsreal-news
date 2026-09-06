import { createFileRoute } from "@tanstack/react-router";
import { LANGS } from "@/lib/i18n/langs";
import { publishedStories } from "@/lib/catalog";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/admin/translations")({ component: TranslationsPage });

function TranslationsPage() {
  const extras = useAppStore((s) => s.extras);
  const stories = publishedStories(extras);
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Translation review</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Names, numbers, places and legal terms stay. A locked sentence is not overwritten.
      </p>
      <table className="mt-6 w-full border border-rule text-left text-sm">
        <thead className="bg-paper-2 text-xs uppercase tracking-[0.12em]">
          <tr>
            <th className="p-2">Story</th>
            <th className="p-2">Langs with copy</th>
            <th className="p-2">Flags</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((s) => {
            const have = Object.keys(s.copy);
            const missing = LANGS.length - have.length;
            return (
              <tr key={s.id} className="border-t border-rule">
                <td className="p-2">{s.copy.en.headline}</td>
                <td className="p-2">{have.join(", ")}</td>
                <td className="p-2">{missing > 0 ? `${missing} pending lock` : "Complete"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
