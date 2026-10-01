import { createFileRoute } from "@tanstack/react-router";
import { publishedStories } from "@/lib/catalog";
import { useAppStore } from "@/lib/store";
import { useMergedInbox } from "@/lib/admin-inbox";
import { storyCopy } from "@/lib/format";
import { fmtViews, statsFor, useDeskViews } from "@/lib/views-client";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const extras = useAppStore((s) => s.extras);
  const deskStatus = useAppStore((s) => s.deskStatus);
  const newsletter = useAppStore((s) => s.newsletter);
  const submissions = useAppStore((s) => s.submissions);
  const stories = publishedStories(extras, deskStatus);
  const inbox = useMergedInbox();
  const views = useDeskViews();
  const top = [...stories]
    .map((s) => ({ s, v: statsFor(views.data, s.id) }))
    .sort((a, b) => b.v.views7d - a.v.views7d || b.v.views - a.v.views)
    .slice(0, 30);
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Analytics</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Compteur maison sans cookie (lectures d’articles, hors robots et desk) + Vercel Web Analytics anonyme :{" "}
        <a className="underline" href="https://vercel.com/yesitsreal/yesitsreal-news/analytics" target="_blank" rel="noreferrer">
          tableau Vercel
        </a>
        .
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat k="Published" v={String(stories.length)} />
        <Stat k="Queue" v={String(inbox.length)} />
        <Stat k="Briefing list" v={String(newsletter.length)} />
        <Stat k="Submissions" v={String(submissions.length)} />
        <Stat k="Vues (total)" v={views.data ? fmtViews(views.data.site.views) : "…"} />
        <Stat k="Uniques (total)" v={views.data ? fmtViews(views.data.site.uniques) : "…"} />
        <Stat k="Vues 7 j" v={views.data ? fmtViews(views.data.site.views7d) : "…"} />
        <Stat k="Uniques 7 j" v={views.data ? fmtViews(views.data.site.uniques7d) : "…"} />
      </dl>
      <h2 className="kicker mt-10">Articles — 7 derniers jours</h2>
      <table className="mt-3 w-full border border-rule text-left text-sm tabular-nums">
        <thead className="bg-paper-2 text-xs uppercase tracking-[0.1em]">
          <tr>
            <th className="p-2">Article</th>
            <th className="p-2 text-end">Vues 7 j</th>
            <th className="p-2 text-end">Uniques 7 j</th>
            <th className="p-2 text-end">Vues</th>
            <th className="p-2 text-end">Uniques</th>
          </tr>
        </thead>
        <tbody>
          {top.map(({ s, v }) => (
            <tr key={s.id} className="border-t border-rule">
              <td className="p-2">
                <a className="hover:underline" href={`/story/${s.slugs.fr || s.slug}`}>
                  {storyCopy(s, "fr").headline}
                </a>
              </td>
              <td className="p-2 text-end">{fmtViews(v.views7d)}</td>
              <td className="p-2 text-end">{fmtViews(v.uniques7d)}</td>
              <td className="p-2 text-end">{fmtViews(v.views)}</td>
              <td className="p-2 text-end">{fmtViews(v.uniques)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
