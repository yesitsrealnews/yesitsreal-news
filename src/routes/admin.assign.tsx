import { createFileRoute, Link } from "@tanstack/react-router";
import { AssignForm } from "@/components/admin/assign-form";
import { useMergedInbox } from "@/lib/admin-inbox";
import { formatDateTime, storyCopy } from "@/lib/format";

export const Route = createFileRoute("/admin/assign")({ component: AssignPage });

function AssignPage() {
  const inbox = useMergedInbox();
  const commandes = inbox.filter((i) => i.submittedBy.startsWith("Commande"));

  return (
    <main className="p-6">
      <p className="kicker text-signal">La cambuse</p>
      <h1 className="mt-2 font-serif text-3xl">Commander un papier</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Vous avez repéré un fait. Vous donnez l’ordre. La desk lit la source, rédige en français, et pose le
        brouillon dans la file. Vous restez rédacteur en chef : relire, corriger, publier — ou refuser.
      </p>
      <div className="mt-8 max-w-2xl border border-rule bg-paper-2 p-4 md:p-6">
        <AssignForm />
      </div>
      <section className="mt-10">
        <h2 className="kicker">Commandes récentes</h2>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {commandes.map((item) => {
            const c = storyCopy(item.story, "fr");
            return (
              <li key={item.id} className="py-3">
                <Link to="/admin/story/$id" params={{ id: item.id }} className="block hover:bg-paper-2">
                  <p className="kicker text-signal">
                    {item.story.section} · {item.story.status}
                  </p>
                  <p className="mt-1 font-serif text-lg">{c.headline}</p>
                  <p className="mt-1 text-xs text-ink-muted">{formatDateTime(item.submittedAt, "fr")}</p>
                </Link>
              </li>
            );
          })}
          {commandes.length === 0 ? (
            <li className="py-6 text-sm text-ink-muted">Aucune commande dans la file pour l’instant.</li>
          ) : null}
        </ul>
      </section>
    </main>
  );
}
