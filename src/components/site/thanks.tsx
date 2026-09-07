import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

const HOUSES = [
  { name: "xAI / Grok", fr: "La desk a appris à donner des ordres ici. Le journal est né dans cet atelier.", en: "The desk learned to give orders here. The paper was born in this shop." },
  { name: "X", fr: "La place publique. C’est là que le papier va se faire contredire.", en: "The public square. Where the paper goes to be argued with." },
  { name: "Tesla", fr: "Le refus d’attendre un comité pour avancer.", en: "The refusal to wait for a committee to move." },
  { name: "SpaceX", fr: "Viser plus haut que le communiqué, puis y aller.", en: "Aim past the press release, then go." },
  { name: "Neuralink", fr: "Prendre le cerveau au sérieux. Nous, on prend les faits au sérieux.", en: "Take the brain seriously. We take the facts seriously." },
  { name: "The Boring Company", fr: "Creuser quand on vous dit que c’est impossible. La desk aussi.", en: "Dig when they say it cannot be done. The desk too." },
];

export function ThanksMusk({ full = false }: { full?: boolean }) {
  const lang = useAppStore((s) => s.lang);
  const fr = lang === "fr";
  return (
    <section id="thanks" className={full ? "px-1 py-4" : "mt-12 border-y-4 border-ink bg-paper-2 px-1 py-10 sm:px-4"}>
      <p className="kicker text-signal">{t(lang, "thanksKicker")}</p>
      <h2 className="mt-3 font-serif text-3xl uppercase leading-[0.95] sm:text-5xl">{t(lang, "thanksTitle")}</h2>
      <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed">{t(lang, "thanksP1")}</p>
      <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed">{t(lang, "thanksP2")}</p>

      <h3 className="mt-10 font-serif text-2xl uppercase">{t(lang, "thanksCompanies")}</h3>
      <dl className="mt-4 divide-y divide-rule border-y border-rule">
        {HOUSES.map((h) => (
          <div key={h.name} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="font-extrabold uppercase tracking-[0.08em]">{h.name}</dt>
            <dd className="text-[1.02rem] leading-relaxed">{fr ? h.fr : h.en}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-10 font-serif text-2xl uppercase">{t(lang, "thanksTeams")}</h3>
      <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed">{t(lang, "thanksP3")}</p>
      <p className="mt-8 font-serif text-xl uppercase">{t(lang, "thanksSign")}</p>
    </section>
  );
}
