import { createFileRoute, Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "La Cambuse" }],
  }),
});

const LINKS = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/inbox", label: "File d’attente" },
  { to: "/admin/translations", label: "Translations" },
  { to: "/admin/rejected", label: "Rejected" },
  { to: "/admin/sources", label: "Sources" },
  { to: "/admin/calibration", label: "Calibration" },
  { to: "/admin/ads", label: "Ads" },
  { to: "/admin/leads", label: "Leads / 72h" },
  { to: "/admin/analytics", label: "Analytics" },
] as const;

function AdminGate() {
  const admin = useAppStore((s) => s.admin);
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
          <p className="font-serif text-xl">YES IT'S REAL desk</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link to="/" className="underline">
            Paper
          </Link>
          <button type="button" className="underline" onClick={() => setAdmin(false)}>
            Lock
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
