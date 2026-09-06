import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { remaining, formatEur } from "@/lib/revenue";
import { formatCount } from "@/lib/engagement";

export const Route = createFileRoute("/admin/leads")({ component: LeadsDesk });

function LeadsDesk() {
  const leads = useAppStore((s) => s.leads);
  const newsletter = useAppStore((s) => s.newsletter);
  const shares = useAppStore((s) => s.shares);
  const ends = useAppStore((s) => s.sprintEndsAt);
  const ensure = useAppStore((s) => s.ensureSprint);
  const [clock, setClock] = useState(() => remaining(ends));

  useEffect(() => {
    ensure();
    const id = window.setInterval(() => setClock(remaining(useAppStore.getState().sprintEndsAt)), 15_000);
    return () => window.clearInterval(id);
  }, [ensure]);

  const pipeline = useMemo(() => leads.reduce((n, l) => n + (l.amount || 0), 0), [leads]);
  const shareN = useMemo(() => Object.values(shares).reduce((n, v) => n + v, 0), [shares]);
  const byKind = useMemo(() => {
    const m: Record<string, number> = {};
    for (const l of leads) m[l.kind] = (m[l.kind] ?? 0) + 1;
    return m;
  }, [leads]);

  return (
    <main className="p-6">
      <p className="kicker text-signal">72-hour desk</p>
      <h1 className="mt-2 font-serif text-3xl">Revenue war room</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        No card is charged in this preview. Every membership, merch, tip, job, and ad booking is a lead. Wire Stripe and AdSense and this table invoices.
      </p>
      <p className="mt-3 font-serif text-4xl tabular-nums">
        {clock.live ? `${clock.h}h ${clock.m}m left` : "Window closed"}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { n: formatEur(pipeline, "en"), l: "Intent in the pipe" },
          { n: String(leads.length), l: "Leads" },
          { n: String(newsletter.length), l: "Briefing list" },
          { n: formatCount(shareN, "en"), l: "Tracked shares" },
        ].map((t) => (
          <div key={t.l} className="border border-rule p-4">
            <p className="font-serif text-3xl tabular-nums">{t.n}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">{t.l}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        {Object.entries(byKind).map(([k, n]) => `${k}: ${n}`).join(" · ") || "No leads yet. Push /today, /shop, /careers, /advertise."}
      </p>
      <p className="mt-2 text-sm">
        <Link to="/shop" className="underline">
          /shop
        </Link>
        {" · "}
        <Link to="/careers" className="underline">
          /careers
        </Link>
        {" · "}
        <Link to="/advertise" className="underline">
          /advertise
        </Link>
        {" · "}
        <Link to="/today" className="underline">
          /today
        </Link>
      </p>

      <table className="mt-8 w-full border border-rule text-left text-sm">
        <thead className="bg-paper-2 text-xs uppercase tracking-[0.12em]">
          <tr>
            <th className="p-2">When</th>
            <th className="p-2">Kind</th>
            <th className="p-2">Who</th>
            <th className="p-2">SKU</th>
            <th className="p-2">€</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td className="p-3 text-ink-muted" colSpan={5}>
                Empty. The window is open. Make someone tap.
              </td>
            </tr>
          ) : (
            leads.map((l) => (
              <tr key={l.id} className="border-t border-rule">
                <td className="p-2 whitespace-nowrap">{l.createdAt.slice(11, 16)}</td>
                <td className="p-2">{l.kind}</td>
                <td className="p-2">
                  {l.name || "—"}
                  <span className="block text-xs text-ink-muted">{l.email}</span>
                </td>
                <td className="p-2 font-mono text-xs">{l.sku || l.role || "—"}</td>
                <td className="p-2 tabular-nums">{l.amount ? formatEur(l.amount, "en") : "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
