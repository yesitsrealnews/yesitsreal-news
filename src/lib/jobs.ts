import type { Lang } from "@/lib/types";

export type JobType = "full-time" | "contract" | "stringer";

export interface JobCopy {
  title: string;
  dek: string;
  bullets: string[];
}

export interface Job {
  id: string;
  slug: string;
  team: string;
  location: string;
  type: JobType;
  pay: string;
  copy: { en: JobCopy; fr: JobCopy };
}

export const JOBS: Job[] = [
  {
    id: "j-editor",
    slug: "editor-faits-divers",
    team: "News",
    location: "Paris / remote",
    type: "full-time",
    pay: "€48–65k",
    copy: {
      en: {
        title: "Editor, Accidents & Faits Divers",
        dek: "You can smell a preventable disaster from 800 words and you refuse to punch down.",
        bullets: [
          "Own the accidents, faits divers, and crime-fails rails.",
          "Kill anything that is satire, rumor, or tragedy without incompetence.",
          "Ship 6–10 desk-ready drafts a week with sources attached.",
        ],
      },
      fr: {
        title: "Chef·fe de rubrique Accidents & faits divers",
        dek: "Vous sentez une catastrophe évitable à 800 mots, et vous ne frappez jamais vers le bas.",
        bullets: [
          "Piloter les rails accidents, faits divers, crime & ratés.",
          "Tuer tout ce qui est satire, rumeur, ou drame sans incompétence.",
          "Livrer 6 à 10 papiers sourcés par semaine.",
        ],
      },
    },
  },
  {
    id: "j-stringer",
    slug: "stringer",
    team: "Network",
    location: "Anywhere · 31 languages",
    type: "stringer",
    pay: "€75–250 / published story",
    copy: {
      en: {
        title: "Global stringer / correspondent",
        dek: "You already screenshot dumb official PDFs for the group chat. Get paid when the desk stamps TRUE.",
        bullets: [
          "Send a live source URL, a country, and why it is dumb — not invented.",
          "Bounty paid only after human fact-check and publish.",
          "No exclusives required. Attribution always. Minors and death beats rejected.",
        ],
      },
      fr: {
        title: "Correspondant·e / stringer",
        dek: "Vous envoyez déjà des PDF municipaux absurdes au groupe. Soyez payé·e quand le bureau tamponne VRAI.",
        bullets: [
          "Une URL source vivante, un pays, et pourquoi c’est bête — pas inventé.",
          "Prime versée seulement après fact-check humain et publication.",
          "Pas d’exclusivité. Toujours attribué. Mineurs et rubrique mort refusés.",
        ],
      },
    },
  },
  {
    id: "j-facts",
    slug: "fact-check-editor",
    team: "Standards",
    location: "Remote",
    type: "full-time",
    pay: "€42–58k",
    copy: {
      en: {
        title: "Fact-check editor",
        dek: "Last human before the TRUE stamp. If it sounds like The Onion, you open the docket.",
        bullets: [
          "Score every claim: supported / needs-check / unsupported.",
          "Hold the desk when a quote is too good.",
          "Public corrections within an hour of a miss.",
        ],
      },
      fr: {
        title: "Éditeur·rice fact-check",
        dek: "Dernier humain avant le tampon VRAI. Si ça ressemble à The Onion, vous ouvrez le dossier.",
        bullets: [
          "Noter chaque affirmation : étayée / à vérifier / non étayée.",
          "Bloquer le bureau quand une citation est trop belle.",
          "Corrections publiques dans l’heure.",
        ],
      },
    },
  },
  {
    id: "j-social",
    slug: "social-producer",
    team: "Audience",
    location: "Remote (EU hours)",
    type: "full-time",
    pay: "€38–52k",
    copy: {
      en: {
        title: "Social producer, TRUE stamps",
        dek: "Fifteen seconds. The headline. The source. The planet looks unwell.",
        bullets: [
          "Daily Reels / Shorts / TikTok from published copy only.",
          "Quote cards, TRUE stamps, no invented VO.",
          "You measure shares, not vibes.",
        ],
      },
      fr: {
        title: "Producteur·rice social, tampons VRAI",
        dek: "Quinze secondes. Le titre. La source. La planète a l’air mal.",
        bullets: [
          "Reels / Shorts / TikTok quotidiens à partir du copy publié seulement.",
          "Cartes citation, tampon VRAI, pas de VO inventée.",
          "Vous mesurez les partages, pas l’ambiance.",
        ],
      },
    },
  },
  {
    id: "j-sales",
    slug: "partnerships",
    team: "Revenue",
    location: "Paris / London / remote",
    type: "contract",
    pay: "€3–6k/mo + 12% commission",
    copy: {
      en: {
        title: "Partnerships & ad sales",
        dek: "Sell the space around the news. Never the news. Opening window: 72 hours.",
        bullets: [
          "Cup title, native, membership, merch. Labeled. Always.",
          "Close the first 10 direct deals from the rate card.",
          "If a client wants to buy a story, you hang up.",
        ],
      },
      fr: {
        title: "Partenariats & régie",
        dek: "Vendre l’espace autour de l’info. Jamais l’info. Fenêtre d’ouverture : 72 h.",
        bullets: [
          "Naming de la Coupe, natif, abonnement, merch. Toujours labellisé.",
          "Fermer les 10 premiers deals directs sur le tarif.",
          "Si un client veut acheter un papier, vous raccrochez.",
        ],
      },
    },
  },
  {
    id: "j-translate",
    slug: "translator-editor",
    team: "Language desk",
    location: "Remote",
    type: "contract",
    pay: "€0.12–0.18 / word locked",
    copy: {
      en: {
        title: "Translator-editor (FR, ES, AR, JA, DE)",
        dek: "Headlines can be funny. Facts cannot drift. You lock the language, not the joke.",
        bullets: [
          "Translate after English desk lock, never before.",
          "Keep named sources, dates, and numbers identical.",
          "Flag anything that punches down in the target language.",
        ],
      },
      fr: {
        title: "Traducteur·rice-éditeur·rice (FR, ES, AR, JA, DE)",
        dek: "Les titres peuvent être drôles. Les faits ne dérivent pas. Vous verrouillez la langue, pas la blague.",
        bullets: [
          "Traduire après verrouillage anglais, jamais avant.",
          "Garder sources nommées, dates et chiffres identiques.",
          "Signaler tout ce qui frappe vers le bas dans la langue cible.",
        ],
      },
    },
  },
];

export function jobCopy(job: Job, lang: Lang): JobCopy {
  return lang === "fr" ? job.copy.fr : job.copy.en;
}

export function jobBySlug(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug || j.id === slug);
}

export const STRINGER = JOBS.find((j) => j.id === "j-stringer")!;
