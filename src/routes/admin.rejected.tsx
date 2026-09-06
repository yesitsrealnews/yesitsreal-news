import { createFileRoute } from "@tanstack/react-router";
import { useMergedRejected } from "@/lib/admin-inbox";

export const Route = createFileRoute("/admin/rejected")({ component: RejectedPage });

function RejectedPage() {
  const rejected = useMergedRejected();
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Rejected</h1>
      <ul className="mt-6 space-y-4">
        {rejected.map((i) => (
          <li key={i.id} className="border border-rule p-4">
            <h2 className="font-serif text-xl">{i.story.copy.en.headline}</h2>
            <p className="mt-1 text-sm text-signal">{i.story.rejectReason || "No reason filed"}</p>
            <p className="mt-2 text-xs text-ink-muted">{i.sourceUrl}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
