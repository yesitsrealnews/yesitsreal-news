import type { Lang } from "@/lib/types";

export interface StoryVideo {
  youtubeId?: string;
  sourceUrl: string;
  publisher: string;
  title: string;
  originalLang: Lang;
  captions: Partial<Record<Lang, string>>;
}

/** Source tapes we can point at. No invented clips. YouTube IDs from the originating desk or its broadcast. */
export const SOURCE_VIDEOS: Record<string, StoryVideo> = {
  s106: {
    youtubeId: "Tc8bBWycr3o",
    sourceUrl:
      "https://france3-regions.franceinfo.fr/auvergne-rhone-alpes/puy-de-dome/clermont-ferrand/video-coup-de-pied-de-biche-dans-la-tete-butin-derisoire-quand-un-cambriolage-vire-au-potache-3410987.html",
    publisher: "France 3 Auvergne-Rhône-Alpes",
    title: "Coup de pied de biche dans la tête… quand un cambriolage vire à la farce",
    originalLang: "fr",
    captions: {
      fr: "Bande de surveillance. Trois cagoules, une Clio, un distributeur de pizzas. France 3, 3 septembre 2026.",
      en: "CCTV. Three balaclavas, a Clio, a pizza machine. France 3, 3 September 2026.",
      es: "Cámara de seguridad. Tres pasamontañas, un Clio, un distribuidor de pizzas. France 3, 3 de septiembre de 2026.",
      de: "Überwachung. Drei Masken, ein Clio, ein Pizzaautomat. France 3, 3. September 2026.",
    },
  },
  s82: {
    youtubeId: "vTYbWaj7b2w",
    sourceUrl: "https://www.youtube.com/shorts/vTYbWaj7b2w",
    publisher: "Bangkok Post",
    title: "Tourists seen high-fiving Buddha statues in Bangkok",
    originalLang: "en",
    captions: {
      fr: "Les caméras du Bangkok Post. Le geste n’est pas un check. C’est une protection.",
      en: "Bangkok Post’s own cameras. The raised palm is a ward, not a greeting.",
      es: "Cámaras del Bangkok Post. La palma no es un choca esos cinco. Es una protección.",
    },
  },
  s44: {
    youtubeId: "lck8ihy3wLM",
    sourceUrl: "https://www.youtube.com/watch?v=lck8ihy3wLM",
    publisher: "Chester Zoo",
    title: "World-first cancer treatment saves python after tumour destroys part of her jaw",
    originalLang: "en",
    captions: {
      fr: "Le zoo de Chester, 20 août 2026. Jodie Foster, python de 4,5 m. Le traitement est celui des humains.",
      en: "Chester Zoo, 20 August 2026. Jodie Foster, 4.5 m python. The treatment is the human one.",
      es: "Zoológico de Chester, 20 de agosto de 2026. Jodie Foster, pitón de 4,5 m. El tratamiento es el de los humanos.",
    },
  },
  s43: {
    youtubeId: "3JKJTRoQDkw",
    sourceUrl: "https://www.kptv.com/2026/08/12/loose-goats-cause-stir-portland-bus-station/",
    publisher: "KPTV FOX 12 Oregon",
    title: "Caught on Camera: Loose Goats Try to Board Portland Bus!",
    originalLang: "en",
    captions: {
      fr: "Caméras TriMet. Deux chèvres naines montent dans le FX2. FOX 12, 12 août 2026.",
      en: "TriMet cameras. Two pygmy goats board the FX2. FOX 12, 12 August 2026.",
      es: "Cámaras de TriMet. Dos cabras enanas suben al FX2. FOX 12, 12 de agosto de 2026.",
    },
  },
  s95: {
    youtubeId: "1_V0wQs3PU4",
    sourceUrl: "https://www.rbb24.de/panorama/av/av24/video-ice-zugfuehrer-toilettenpapier-berlin-sylt.html",
    publisher: "FAZ, after rbb24",
    title: "Klopapier-Krise im ICE",
    originalLang: "de",
    captions: {
      fr: "L’ICE s’arrête. Le chef de train achète du papier. rbb24 a la bande. FAZ la raconte.",
      en: "The ICE stops. The driver buys toilet paper. rbb24 has the tape. FAZ retells it.",
      es: "El ICE se para. El jefe de tren compra papel. rbb24 tiene la cinta. FAZ la cuenta.",
      de: "Der ICE hält. Der Zugführer kauft Klopapier. rbb24 hat das Band. Die FAZ erzählt es.",
    },
  },
  s46: {
    youtubeId: "yaJOZlAosoo",
    sourceUrl: "https://www.youtube.com/watch?v=yaJOZlAosoo",
    publisher: "Rádio CBN",
    title: "Entenda caso de capivara gerada por IA que pressionou prefeitura a consertar buraco",
    originalLang: "pt",
    captions: {
      fr: "CBN, d’après g1. La capybara dans le nid-de-poule n’existait pas. La mairie a quand même bitumé.",
      en: "CBN, after g1. The capybara in the pothole was not real. The city still filled the hole.",
      es: "CBN, según g1. La capibara del bache no era real. El ayuntamiento asfaltó igual.",
      pt: "CBN, a partir do g1. A capivara no buraco não existia. A prefeitura asfaltou mesmo assim.",
    },
  },
  s36: {
    sourceUrl:
      "https://www.ouest-france.fr/sciences/animaux/video-percute-a-90-km-h-ce-pigeon-survit-a-l-impact-et-se-retrouve-enferme-dans-une-voiture-pendant-plus-de-12-heures-f6d7501a-7232-4cd3-9f05-85298134e583",
    publisher: "Ouest-France",
    title: "VIDÉO. Percuté à 90 km/h, ce pigeon survit à l'impact",
    originalLang: "fr",
    captions: {
      fr: "La bande est chez Ouest-France. Romont, le pigeon, douze heures dans la calandre. Pas de copie YouTube du journal.",
      en: "The tape sits on Ouest-France. Romont the pigeon, twelve hours in the grille. No YouTube copy from the paper.",
      es: "La cinta está en Ouest-France. Romont, paloma, doce horas en la calandra. El diario no la puso en YouTube.",
    },
  },
};

const YT_HL: Partial<Record<Lang, string>> = {
  en: "en",
  fr: "fr",
  es: "es",
  pt: "pt",
  de: "de",
  it: "it",
  nl: "nl",
  pl: "pl",
  sv: "sv",
  no: "no",
  da: "da",
  fi: "fi",
  cs: "cs",
  ro: "ro",
  hu: "hu",
  el: "el",
  tr: "tr",
  ar: "ar",
  he: "he",
  hi: "hi",
  bn: "bn",
  id: "id",
  vi: "vi",
  th: "th",
  ja: "ja",
  ko: "ko",
  zh: "zh-Hans",
  "zh-TW": "zh-Hant",
  uk: "uk",
  ru: "ru",
};

export function youtubeHl(lang: Lang): string {
  return YT_HL[lang] ?? "en";
}

export function getStoryVideo(id: string): StoryVideo | undefined {
  return SOURCE_VIDEOS[id];
}

export function videoCaption(video: StoryVideo, lang: Lang): string {
  return video.captions[lang] ?? video.captions.fr ?? video.captions.en ?? video.title;
}
