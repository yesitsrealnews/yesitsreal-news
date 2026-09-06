import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/sources")({ component: SourcesPage });

function SourcesPage() {
  const allowList = useAppStore((s) => s.allowList);
  const denyList = useAppStore((s) => s.denyList);
  const setAllowList = useAppStore((s) => s.setAllowList);
  const setDenyList = useAppStore((s) => s.setDenyList);
  const [a, setA] = useState("");
  const [d, setD] = useState("");
  return (
    <main className="grid gap-8 p-6 md:grid-cols-2">
      <section>
        <h1 className="font-serif text-3xl">Allowlist</h1>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (a.trim()) setAllowList([a.trim(), ...allowList]);
            setA("");
          }}
        >
          <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="domain" />
          <Button type="submit">Add</Button>
        </form>
        <ul className="mt-4 text-sm">
          {allowList.map((x) => (
            <li key={x} className="flex justify-between border-b border-rule py-2">
              {x}
              <button type="button" className="text-xs underline" onClick={() => setAllowList(allowList.filter((i) => i !== x))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-3xl">Denylist</h2>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (d.trim()) setDenyList([d.trim(), ...denyList]);
            setD("");
          }}
        >
          <Input value={d} onChange={(e) => setD(e.target.value)} placeholder="satire domain" />
          <Button type="submit">Add</Button>
        </form>
        <ul className="mt-4 text-sm">
          {denyList.map((x) => (
            <li key={x} className="flex justify-between border-b border-rule py-2">
              {x}
              <button type="button" className="text-xs underline" onClick={() => setDenyList(denyList.filter((i) => i !== x))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
