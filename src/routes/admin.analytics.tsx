import { createFileRoute } from "@tanstack/react-router";
import { publishedStories } from "@/lib/catalog";
import { useAppStore } from "@/lib/store";
import { useMergedInbox } from "@/lib/admin-inbox";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const extras = useAppStore((s) => s.extras);
  const newsletter = useAppStore((s) => s.newsletter);
  const submissions = useAppStore((s) => s.submissions);
  const stories = publishedStories(extras);
  const avg = stories.reduce((a, s) => a + s.dumbness, 0) / Math.max(1, stories.length);
  const inbox = useMergedInbox();
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Analytics</h1>
      <p className="mt-2 text-sm text-ink-muted">Preview counters. No tracker ships until cookie consent is all.</p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat k="Published" v={String(stories.length)} />
        <Stat k="Mean dumbness" v={avg.toFixed(1)} />
        <Stat k="Queue" v={String(inbox.length)} />
        <Stat k="Briefing list" v={String(newsletter.length)} />
        <Stat k="Submissions" v={String(submissions.length)} />
      </dl>
    </main>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-rule p-4">
      <dt className="kicker text-ink-muted">{k}</dt>
      <dd className="mt-2 font-serif text-4xl tabular-nums">{v}</dd>
    </div>
  );
}
