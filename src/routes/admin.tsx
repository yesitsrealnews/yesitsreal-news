import { createFileRoute, Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow, noarchive" }, { title: "La Cambuse" }],
  }),
});

const LINKS = [
  { to: "/admin", label: "Tableau" },
  { to: "/admin/inbox", label: "File d’attente" },
  { to: "/admin/translations", label: "Traductions" },
  { to: "/admin/rejected", label: "Refusés" },
  { to: "/admin/sources", label: "Sources" },
  { to: "/admin/calibration", label: "Réglages" },
  { to: "/admin/ads", label: "Pubs" },
  { to: "/admin/leads", label: "Contacts" },
  { to: "/admin/analytics", label: "Audience" },
] as const;

function AdminGate() {
  const admin = useAppStore((s) => s.admin);
  const setAdmin = useAppStore((s) => s.setAdmin);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let live = true;
    void fetch("/api/desk", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { ok?: boolean }) => {
        if (!live) return;
        setAdmin(Boolean(d.ok));
        setChecked(true);
      })
      .catch(() => {
        if (!live) return;
        setAdmin(false);
        setChecked(true);
      });
    return () => {
      live = false;
    };
  }, [setAdmin]);

  if (!checked) return <div className="min-h-screen bg-paper" />;
  if (!admin) return <Navigate to="/cambuse" />;
  return <AdminShell />;
}

function AdminShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setAdmin = useAppStore((s) => s.setAdmin);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-rule px-4 py-3">
        <div>
          <p className="kicker text-signal">La cambuse</p>
          <p className="font-serif text-xl">Le journal</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link to="/" className="underline">
            Voir le site
          </Link>
          <button
            type="button"
            className="underline"
            onClick={() => {
              void fetch("/api/desk", { method: "DELETE", credentials: "include" });
              setAdmin(false);
            }}
          >
            Fermer
          </button>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-57px)]">
        <nav className="hidden w-52 shrink-0 border-e border-rule md:block">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "block px-4 py-3 text-sm",
                pathname === l.to ? "bg-paper-2 font-semibold" : "text-ink-muted hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">
          <nav className="flex gap-2 overflow-x-auto border-b border-rule px-3 py-2 md:hidden">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="shrink-0 px-2 py-2 text-xs uppercase tracking-[0.1em]">
                {l.label}
              </Link>
            ))}
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
