import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/ads")({ component: AdsPage });

function AdsPage() {
  const slots = [
    { name: "Header leaderboard", size: "728×90 / fluid", id: "yir_leaderboard" },
    { name: "In-article p2", size: "300×250", id: "yir_inarticle_1" },
    { name: "In-article mid", size: "300×250", id: "yir_inarticle_2" },
    { name: "Sidebar sticky", size: "300×600", id: "yir_sidebar" },
    { name: "Native recommended", size: "fluid", id: "yir_native" },
    { name: "Mobile anchor", size: "320×50", id: "yir_anchor" },
    { name: "Cup title", size: "brand", id: "yir_cup" },
  ];
  return (
    <main className="p-6">
      <h1 className="font-serif text-3xl">Ads</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Dummy creatives compatible with AdSense / Ad Manager. Public kit:{" "}
        <Link to="/advertise" className="underline">
          /advertise
        </Link>
        . ads@yesitsreal.news
      </p>
      <table className="mt-6 w-full border border-rule text-left text-sm">
        <thead className="bg-paper-2 text-xs uppercase tracking-[0.12em]">
          <tr>
            <th className="p-2">Slot</th>
            <th className="p-2">Size</th>
            <th className="p-2">Unit</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.id} className="border-t border-rule">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.size}</td>
              <td className="p-2 font-mono text-xs">{s.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
