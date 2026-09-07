import type { QueueItem, Story, StoryCopy } from "@/lib/types";

const SEED_FR: Record<string, StoryCopy> = {
  "q-seed-1": {
    headline: "Un arrondissement d’Oslo paie une étude pour savoir si les couvercles de poubelles s’ouvrent trop agressivement",
    dek: "Des habitants ont écrit que certains couvercles étaient « confrontationnels ». Une audition a été fixée.",
    body: [
      "Un comité d’arrondissement à Oslo a ouvert une audition sur l’angle auquel un couvercle de bac à ordures ménagères peut rester quand on ne s’en sert pas, après des plaintes écrites décrivant certains couvercles comme « confrontationnels » et « peu voisins » lorsqu’ils dépassent la verticale.",
      "Les marchés publics montrent qu’un petit cabinet a été chargé de mesurer « l’indignation liée aux couvercles ». Le dossier sur le bureau n’a pas encore la facture.",
      "Personne n’est blessé. La question est de savoir si une charnière peut avoir une personnalité, et si la ville doit payer pour y répondre.",
    ],
    whyDumb: [
      "L’objet étudié est un couvercle.",
      "L’émotion prêtée au couvercle est un problème humain.",
      "Un consultant est maintenant dans la phrase.",
    ],
    factCheckNote: "Avis d’audition confirmé. Dépense du cabinet pas encore recoupée avec une facture publique.",
  },
  "q-seed-2": {
    headline: "Une université demande au personnel de ne pas soupirer plus de deux fois devant une imprimante bloquée",
    dek: "La note de « savoir-vivre des appareils partagés » traite le désespoir audible comme un problème de logistique.",
    body: [
      "Une circulaire « étiquette des appareils partagés » demande au personnel qui attend aux imprimantes de limiter les « expressions audibles de déception » pendant qu’un travail s’imprime, ou semble s’imprimer.",
      "La page de la fac résume la note ; le PDF complet n’est pas joint. Le chiffre des deux soupirs est dans le résumé. Il faut encore le document source.",
      "La desk ne publiera pas un chiffre qu’elle ne peut pas montrer.",
    ],
    whyDumb: [
      "La machine n’écoute pas.",
      "Le règlement porte sur le bruit de l’abandon.",
      "Un PDF travaille plus que l’imprimante.",
    ],
    factCheckNote: "La page-résumé existe. Le caractère contraignant n’est pas vérifié.",
  },
  "q-seed-3": {
    headline: "Un club s’excuse pour l’ambiance d’un match qui n’a pas encore eu lieu",
    dek: "Le communiqué couvre « tout ton futur » en tribune, par précaution.",
    body: [
      "Un club portugais a publié des excuses pour « toute ambiance qui pourrait naître » lors d’une prochaine rencontre, trois jours avant le coup d’envoi.",
      "Le texte ne nomme aucun incident. Il nomme une humeur, au futur, et ouvre une hotline.",
      "La ligue avait demandé aux clubs de rappeler les règles de conduite. Celui-ci a sauté le rappel et est allé droit au remords.",
    ],
    whyDumb: [
      "Le remords a un horaire.",
      "L’offense est hypothétique.",
      "Une hotline existe maintenant pour un sentiment.",
    ],
    factCheckNote: "Le communiqué est sur le site du club. La ligue n’a pas encore répondu au dossier.",
  },
  "q-rej-1": {
    headline: "Refusé : domaine d’origine satirique",
    dek: "Le filtre a tenu.",
    body: ["Non publié."],
    whyDumb: ["Ce n’est pas une info.", "C’est une blague en costume de papier.", "Notre signature n’est pas à louer."],
    factCheckNote: "Domaine sur la liste satire.",
  },
};

export function frenchCopyOf(story: Story): StoryCopy {
  if (story.copy.fr) return story.copy.fr;
  if (SEED_FR[story.id]) return SEED_FR[story.id];
  const en = story.copy.en;
  const blob = `${en.headline} ${en.dek} ${en.body.join(" ")}`;
  if (looksFrench(blob)) return en;
  return {
    headline: `À relire — ${en.headline}`,
    dek: "Traduction desk. Vérifier la source avant de publier.",
    body: [
      "Ce papier arrive en anglais. La desk le met en français avant toute mise en ligne.",
      ...en.body,
      "YES IT’S REAL ne publie pas sans source. Pas de satire.",
    ],
    whyDumb: en.whyDumb,
    factCheckNote: `${en.factCheckNote} Traduction française à figer.`,
  };
}

function looksFrench(text: string): boolean {
  return /[àâäéèêëïîôùûçœæ]/i.test(text) || /\b(le|la|les|une|des|pour|dans|avec|pas de satire)\b/i.test(text);
}

export function storyWithFrench(story: Story): Story {
  if (story.copy.fr) return story;
  const fr = frenchCopyOf(story);
  const slugFr = story.slugs.fr || `${story.slug}-fr`;
  return { ...story, slugs: { ...story.slugs, fr: slugFr }, copy: { ...story.copy, fr } };
}

export function queueWithFrench(item: QueueItem): QueueItem {
  return { ...item, story: storyWithFrench(item.story) };
}
