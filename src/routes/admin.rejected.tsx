import { createFileRoute } from "@tanstack/react-router";
import { useMergedRejected } from "@/lib/admin-inbox";
import { storyCopy } from "@/lib/format";

export const Route = createFileRoute("/admin/rejected")({ component: RejectedPage });

function RejectedPage() {
  const rejected = useMergedRejected();
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Refusés</h1>
      <ul className="mt-6 space-y-4">
        {rejected.map((i) => {
          const c = storyCopy(i.story, "fr");
          return (
            <li key={i.id} className="border border-rule p-4">
              <h2 className="font-serif text-xl">{c.headline}</h2>
              <p className="mt-1 text-sm text-signal">{i.story.rejectReason || "Sans motif"}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
