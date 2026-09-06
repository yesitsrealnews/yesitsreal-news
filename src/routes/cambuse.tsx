import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cambuse")({
  component: Cambuse,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "La Cambuse" },
    ],
  }),
});

function Cambuse() {
  const admin = useAppStore((s) => s.admin);
  const setAdmin = useAppStore((s) => s.setAdmin);
  const lang = useAppStore((s) => s.lang);
  const fr = lang === "fr";
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [tries, setTries] = useState(0);
  const locked = tries >= 8;

  if (admin) {
    void navigate({ to: "/admin" });
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-ink">
      <p className="kicker text-signal">{fr ? "La cambuse" : "The galley"}</p>
      <h1 className="mt-3 font-serif text-4xl">YES IT'S REAL</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-ink-muted">
        {fr ? "Réservé à la desk." : "Desk only."}
      </p>
      <form
        className="mt-8 flex w-full max-w-sm flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (locked) return;
          if (code.trim() === "1aPepette") {
            setAdmin(true);
            void navigate({ to: "/admin" });
          } else setTries((n) => n + 1);
        }}
      >
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={fr ? "Code" : "Code"}
          aria-label="Code"
          autoComplete="off"
        />
        {tries > 0 ? (
          <p className="text-sm text-signal">
            {locked ? (fr ? "Verrouillée." : "Locked.") : fr ? "Non." : "No."}
          </p>
        ) : null}
        <Button type="submit" disabled={locked}>
          {fr ? "Entrer" : "Enter"}
        </Button>
      </form>
      <Link to="/" className="mt-8 text-sm underline">
        {fr ? "Le journal" : "The paper"}
      </Link>
    </main>
  );
}
