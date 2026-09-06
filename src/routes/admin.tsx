import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminGate });

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
  const setAdmin = useAppStore((s) => s.setAdmin);
  const lang = useAppStore((s) => s.lang);
  const fr = lang === "fr";
  const [code, setCode] = useState("");
  const [tries, setTries] = useState(0);
  const locked = tries >= 8;

  if (!admin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-ink">
        <p className="kicker text-signal">{fr ? "Rédac chef" : "Editor-in-chief"}</p>
        <h1 className="mt-3 font-serif text-4xl">YES IT'S REAL</h1>
        <p className="mt-2 max-w-sm text-center text-sm text-ink-muted">
          {fr
            ? "Back-office. Tu valides, tu tues, tu publies. Tant que tu n’as pas donné tous les ordres, rien ne part tout seul."
            : "Back office. You kill, you hold, you publish. Until you have given the orders, nothing ships itself."}
        </p>
        <form
          className="mt-8 flex w-full max-w-sm flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (locked) return;
            if (code.trim() === "1aPepette") {
              setAdmin(true);
            } else setTries((n) => n + 1);
          }}
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={fr ? "Code desk" : "Desk code"}
            aria-label={fr ? "Code desk" : "Desk code"}
            autoComplete="off"
          />
          {tries > 0 ? (
            <p className="text-sm text-signal">{locked ? (fr ? "Desk verrouillée." : "Desk locked for this session.") : fr ? "Ce n’est pas le code." : "That is not the desk."}</p>
          ) : null}
          <Button type="submit" disabled={locked}>
            {fr ? "Entrer" : "Enter"}
          </Button>
        </form>
        <Link to="/" className="mt-8 text-sm underline">
          {fr ? "Retour au journal" : "Back to the paper"}
        </Link>
      </main>
    );
  }

  return <AdminShell />;
}

function AdminShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setAdmin = useAppStore((s) => s.setAdmin);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-rule px-4 py-3">
        <div>
          <p className="kicker text-signal">Rédac chef</p>
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
