import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/kit")({ component: KitPage });

const FILES = [
  {
    href: "/brand/YES-ITS-REAL-banniere-X-1500x500.jpg",
    label: "Bandeau X — 1500 × 500",
    hint: "Modifier le profil → Bannière. Ne pas recadrer.",
    img: "/brand/YES-ITS-REAL-banniere-X-1500x500.jpg",
    primary: true,
  },
  {
    href: "/brand/avatar.jpg",
    label: "Photo de profil",
    hint: "Le rond. REAL au milieu.",
    img: "/brand/avatar.jpg",
    primary: false,
  },
  {
    href: "/brand/card-bat.jpg",
    label: "Carte — chauve-souris",
    hint: "À coller dans le post.",
    img: "/brand/card-bat.jpg",
    primary: false,
  },
  {
    href: "/brand/card-pigeon.jpg",
    label: "Carte — pigeon",
    hint: "À coller dans le post.",
    img: "/brand/card-pigeon.jpg",
    primary: false,
  },
  {
    href: "/brand/card-snake.jpg",
    label: "Carte — serpent",
    hint: "À coller dans le post.",
    img: "/brand/card-snake.jpg",
    primary: false,
  },
];

function KitPage() {
  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">Kit X</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-none">Télécharger le bandeau</h1>
        <p className="mt-4 max-w-xl text-lg">
          Un clic. Le fichier tombe sur le téléphone. Ensuite : X → Modifier le profil → Bannière.
        </p>

        <a
          href="/brand/YES-ITS-REAL-banniere-X-1500x500.jpg"
          download="YES-ITS-REAL-banniere-X-1500x500.jpg"
          className="mt-8 block border-4 border-ink bg-scream p-4 text-scream-ink"
        >
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em]">Le bandeau — clique ici</p>
          <img
            src="/brand/YES-ITS-REAL-banniere-X-1500x500.jpg"
            alt="Bandeau YES IT'S REAL 1500 par 500"
            className="mt-3 w-full border-2 border-ink"
          />
          <p className="mt-4 bg-ink px-4 py-3 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-scream">
            Télécharger 1500 × 500
          </p>
        </a>

        <a
          href="/brand/annonce-X-9x16.mp4"
          download="YES-ITS-REAL-annonce-X.mp4"
          className="mt-8 block border-4 border-ink bg-ink p-4 text-paper"
        >
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-scream">Vidéo d’annonce — 10 s</p>
          <video
            className="mt-3 mx-auto max-h-[70vh] border-2 border-scream bg-ink"
            src="/brand/annonce-X-9x16.mp4"
            controls
            playsInline
            preload="metadata"
          />
          <p className="mt-4 bg-scream px-4 py-3 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-scream-ink">
            Télécharger pour X (9:16)
          </p>
        </a>
        <a
          href="/brand/annonce-site-16x9.mp4"
          download="YES-ITS-REAL-annonce-site.mp4"
          className="mt-4 block border-2 border-ink bg-card p-4"
        >
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-signal">Version large 16:9</p>
          <video className="mt-3 w-full border border-ink" src="/brand/annonce-site-16x9.mp4" controls playsInline preload="metadata" />
          <p className="mt-3 text-sm font-extrabold uppercase">Télécharger pour le site / YouTube</p>
        </a>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a href="/brand/lalanne-christ-FR.mp4" download="YES-ITS-REAL-lalanne-christ-FR.mp4" className="block border-2 border-ink bg-ink p-3 text-paper">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-scream">Lalanne + Christ cosmique — FR</p>
            <video className="mt-2 w-full" src="/brand/lalanne-christ-FR.mp4" controls playsInline preload="metadata" />
            <p className="mt-2 text-xs font-extrabold uppercase">Télécharger FR</p>
          </a>
          <a href="/brand/lalanne-christ-EN.mp4" download="YES-ITS-REAL-lalanne-christ-EN.mp4" className="block border-2 border-ink bg-ink p-3 text-paper">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-scream">Lalanne + Cosmic Christ — EN</p>
            <video className="mt-2 w-full" src="/brand/lalanne-christ-EN.mp4" controls playsInline preload="metadata" />
            <p className="mt-2 text-xs font-extrabold uppercase">Download EN</p>
          </a>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a href="/brand/lalanne-christ-visages-FR.mp4" download="YES-ITS-REAL-lalanne-christ-visages-FR.mp4" className="block border-4 border-scream bg-ink p-3 text-paper">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-scream">Visages — FR</p>
            <video className="mt-2 w-full" src="/brand/lalanne-christ-visages-FR.mp4" controls playsInline preload="metadata" />
            <p className="mt-2 text-xs font-extrabold uppercase">Télécharger FR (visages)</p>
          </a>
          <a href="/brand/lalanne-christ-visages-EN.mp4" download="YES-ITS-REAL-lalanne-christ-visages-EN.mp4" className="block border-4 border-scream bg-ink p-3 text-paper">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-scream">Faces — EN</p>
            <video className="mt-2 w-full" src="/brand/lalanne-christ-visages-EN.mp4" controls playsInline preload="metadata" />
            <p className="mt-2 text-xs font-extrabold uppercase">Download EN (faces)</p>
          </a>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {FILES.filter((f) => !f.primary).map((f) => (
            <li key={f.href}>
              <a href={f.href} download className="block border-2 border-ink bg-card p-3 hover:bg-scream hover:text-scream-ink">
                <img src={f.img} alt={f.label} className="aspect-square w-full object-cover" />
                <p className="mt-2 font-extrabold uppercase">{f.label}</p>
                <p className="text-sm">{f.hint}</p>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </SiteShell>
  );
}
