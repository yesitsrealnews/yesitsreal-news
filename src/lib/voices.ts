import type { Lang, Story, StoryCopy } from "@/lib/types";

export const VOICE_IDS = [
  "desk",
  "thompson",
  "didion",
  "wolfe",
  "talese",
  "ephron",
  "londres",
  "gellhorn",
  "hitchens",
] as const;

export type VoiceId = (typeof VOICE_IDS)[number];

export interface Voice {
  id: VoiceId;
  name: string;
  after: string;
  afterFr: string;
  note: string;
  noteFr: string;
}

export const VOICES: Record<VoiceId, Voice> = {
  desk: {
    id: "desk",
    name: "The desk",
    after: "Desk",
    afterFr: "La desk",
    note: "Straight copy. Sources under the fold.",
    noteFr: "Copie droite. Sources sous l’article.",
  },
  thompson: {
    id: "thompson",
    name: "Hunter S. Thompson",
    after: "Hunter S. Thompson",
    afterFr: "Hunter S. Thompson",
    note: "Gonzo weather. The bats are a metaphor. The sources are not.",
    noteFr: "Météo gonzo. Les chauves-souris sont une métaphore. Les sources, non.",
  },
  didion: {
    id: "didion",
    name: "Joan Didion",
    after: "Joan Didion",
    afterFr: "Joan Didion",
    note: "The water, the wiring, the thing that will not stay still.",
    noteFr: "L’eau, le câblage, la chose qui ne tient pas en place.",
  },
  wolfe: {
    id: "wolfe",
    name: "Tom Wolfe",
    after: "Tom Wolfe",
    afterFr: "Tom Wolfe",
    note: "Status panic, white suits, the social X-ray. Facts unmoved.",
    noteFr: "Panique de statut, costumes blancs, radio X sociale. Faits intacts.",
  },
  talese: {
    id: "talese",
    name: "Gay Talese",
    after: "Gay Talese",
    afterFr: "Gay Talese",
    note: "The room, the shoes, the wait. Then the record.",
    noteFr: "La pièce, les chaussures, l’attente. Puis le procès-verbal.",
  },
  ephron: {
    id: "ephron",
    name: "Nora Ephron",
    after: "Nora Ephron",
    afterFr: "Nora Ephron",
    note: "Wry, lethal, nobody asked them to do this.",
    noteFr: "Pince-sans-rire, létale : personne ne leur avait demandé.",
  },
  londres: {
    id: "londres",
    name: "Albert Londres",
    after: "Albert Londres",
    afterFr: "Albert Londres",
    note: "J’accuse with a suitcase. The colony is the committee.",
    noteFr: "J’accuse avec une valise. La colonie, c’est le comité.",
  },
  gellhorn: {
    id: "gellhorn",
    name: "Martha Gellhorn",
    after: "Martha Gellhorn",
    afterFr: "Martha Gellhorn",
    note: "No poetry in the cable. There is a record.",
    noteFr: "Pas de poésie dans le câble. Il y a un procès-verbal.",
  },
  hitchens: {
    id: "hitchens",
    name: "Christopher Hitchens",
    after: "Christopher Hitchens",
    afterFr: "Christopher Hitchens",
    note: "Stupidity will suffice. No conspiracy required.",
    noteFr: "La bêtise suffit. Nul complot requis.",
  },
};

const ROSTER: VoiceId[] = ["thompson", "didion", "wolfe", "talese", "ephron", "londres", "gellhorn", "hitchens"];

/** Half the well: odd catalog numbers get a named cadence. Even stay desk. */
const OVERRIDE: Partial<Record<string, VoiceId>> = {
  s35: "thompson",
  s31: "londres",
  s32: "wolfe",
  s38: "thompson",
};

export function voiceForStory(id: string): VoiceId {
  if (OVERRIDE[id]) return OVERRIDE[id]!;
  const n = Number(id.replace(/\D/g, "")) || 0;
  if (n % 2 === 0) return "desk";
  return ROSTER[n % ROSTER.length];
}

export function voiceMeta(id: string): Voice {
  return VOICES[voiceForStory(id)];
}

function lede(voice: VoiceId, lang: Lang, s: Story, copy: StoryCopy): string | null {
  const place = s.location;
  const paper = s.sources[0]?.publisher ?? "the record";
  const who = s.entities[0] ?? "the committee";
  const dek = copy.dek;
  const fr = lang === "fr";

  switch (voice) {
    case "thompson":
      return fr
        ? `On était quelque part du côté de ${place} quand la nouvelle est arrivée, et la nouvelle n’avait pas besoin de LSD : ${dek} Personne à la desk n’a inventé ça. ${paper} l’avait déjà, ce qui est la seule raison pour laquelle tu le lis ici au lieu de le rêver.`
        : `We were somewhere around ${place} when the news came over the hill, and the news did not require chemicals: ${dek} Nobody at this desk invented it. ${paper} already had it, which is the only reason you are reading it here instead of in a dream.`;
    case "didion":
      return fr
        ? `On oublie facilement, à ${place}, qu’une chose peut être vraie et indéfendable à la fois. ${dek} L’eau continue de couler. Le communiqué, aussi.`
        : `It is easy to forget, in ${place}, that a thing can be both true and indefensible. ${dek} The water keeps moving. So does the communiqué.`;
    case "wolfe":
      return fr
        ? `La panique de statut de la semaine, depuis ${place}—! ${dek} Les gens qui signent ça portent encore le badge. Le badge est très important.`
        : `The status panic of the week, from ${place}—! ${dek} The people who signed it are still wearing the badge. The badge is very important.`;
    case "talese":
      return fr
        ? `À ${place}, voici ce qui s’est produit, et ce fut noté. ${dek} On n’a pas haussé le ton. On a regardé les chaussures, puis le papier.`
        : `In ${place}, the following occurred, and it was noted. ${dek} Nobody raised their voice. They looked at the shoes, then at the paper.`;
    case "ephron":
      return fr
        ? `Le truc avec ${who}, c’est que personne n’avait demandé. Ils l’ont fait quand même. ${dek}`
        : `The thing about ${who} is that nobody asked them to do this, and they did it anyway. ${dek}`;
    case "londres":
      return fr
        ? `J’ai vu ${place}. Voici ce qu’on y a signé. ${dek} Les sources sont nommées. C’est toute ma police.`
        : `I have seen ${place}. This is what they signed there. ${dek} The sources are named. That is the entire police force.`;
    case "gellhorn":
      return fr
        ? `Il n’y a pas de poésie là-dedans. Il y a un procès-verbal, à ${place}. ${dek}`
        : `There is no poetry in this. There is a record, from ${place}. ${dek}`;
    case "hitchens":
      return fr
        ? `On n’a pas besoin d’un complot. La bêtise suffit, et ${who} en a fourni plus qu’il n’en faut. ${dek}`
        : `One does not require a conspiracy. Stupidity will suffice, and ${who} has furnished more than enough. ${dek}`;
    default:
      return null;
  }
}

export function applyVoice(story: Story, copy: StoryCopy, lang: Lang): StoryCopy {
  const id = voiceForStory(story.id);
  if (id === "desk") return copy;
  const extra = lede(id, lang, story, copy);
  if (!extra) return copy;
  return {
    ...copy,
    body: [extra, ...copy.body],
  };
}
