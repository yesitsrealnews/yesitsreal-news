import { createFileRoute } from "@tanstack/react-router";
import { STORIES } from "@/lib/data/stories";

export const Route = createFileRoute("/admin/calibration")({ component: CalibrationPage });

function CalibrationPage() {
  const ranked = [...STORIES].filter((s) => !s.sponsored).sort((a, b) => b.dumbness - a.dumbness);
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Dumbness calibration</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        10 is civilization taking a day off. 5 is ordinary bureaucratic sludge. Death is not a score.
      </p>
      <ol className="mt-6 space-y-3">
        {ranked.map((s) => (
          <li key={s.id} className="flex gap-4 border-b border-rule py-2">
            <span className="w-8 font-serif text-2xl tabular-nums">{s.dumbness}</span>
            <span className="text-sm">{s.copy.en.headline}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
