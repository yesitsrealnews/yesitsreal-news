/** Editorial keep/skip for the desk RSS pull. Beats = DESK.md veille. */

export type RssKind = "insolite" | "faits-divers" | "animaux" | "general";

export type KeepResult = {
  keep: boolean;
  score: number;
  beat: string;
};

function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/** Harm / grief / minors / war — never a piste. Bare « guerre » is NOT here (guerre de voisin is a beat). */
export const RSS_SKIP =
  /\b(dead|died|death|killed|killing|murder|suicide|massacre|war in|world war|rape|tue\b|tuee|tuerie|deces|decede|\bmeurt\b|\bmourir\b|\bmort\b|\bmorte\b|mortel|blesse|blessure|injured|hospitalis|guerre en|guerre d(?:'|e l)|viol\b|mineur|underage|child sex|\ba 1[0-7]\s*ans\b|1[0-7]-year-old|rapt|pedophil|agress(?:e|ee|ion|er)?|roue de coups|tabass|coup de poing|machette|poignard|sabre|fusill|disparition|malaise|incendie|cannabis|cocaine|drogue|violences sexuelles|atteinte sex|periscolaire|gilets jaunes|elections?\s+municipales|west nile|migrant|attentat|terror|otage|hostage|gaza|ukraine|cisjordanie|grave accident|cancer|chimio|manchester city|premier league|ligue 1|scene penible et traumatisant|traumatisante)\b/i;

/** Label-level insolite — enough on a dedicated insolite/odd feed. */
const SOFT =
  /insolite|absurde|ridicule|cocasse|ubuesque|bizarre|etrange|oddly|\bweird\b|\bfail\b|blunder|mishap|quiproquo|maladresse|improbable|burlesque|nains? de jardin|garden gnome|voiturette|s.introduit|s.invite|debarque|intrusion|fait divers|faits divers|insolito|bizarro|estranho|extrano|merkwurdig|kurios|besynderlig|aneh|odd news|oddities|weird but true/;

type Beat = { name: string; re: RegExp; weight: number };

const BEATS: Beat[] = [
  {
    name: "insolite",
    weight: 4,
    re: /insolite|absurde|ridicule|cocasse|ubuesque|bizarre|etrange|oddly|\bweird\b|\bfail\b|ig nobel|improbable research|insolito|bizarro|estranho|extrano|merkwurdig|kurios/,
  },
  {
    name: "animaux",
    weight: 5,
    re: /\b(coq|poule|poulailler|canard|oie|cygne|pigeon|ramier|corbeau|pie|goeland|mouette|perroquet|paon|chien|chat|chiot|chaton|vache|taureau|veau|mouton|belier|agneau|chevre|bouc|cochon|porc|sanglier|chevreuil|cerf|daim|renard|blaireau|loutre|castor|ragondin|lynx|ours|\bloup\b|serpent|boa|python|crocodile|alligator|tortue|iguane|cheval|poney|ane|lama|alpaga|kangourou|wallaby|rat|souris|hamster|furet|lapin|poisson rouge|goldfish|aboiement|cocorico|rooster|hen|chicken|duck|goose|swan|seagull|parrot|dog|cat|cow|sheep|\bram\b|goat|pig|boar|deer|fox|otter|beaver|bear|snake|turtle|tortoise|horse|donkey|llama|kangaroo|raccoon|moose|elk|emu|hedgehog|squirrel|baboon|macaque|capybara|capivara|carpincho|caiman|jacare|dingo|koala|wombat|civet|orangutan|gibbon|gallo|gallina|pato|paloma|perro|gato|vaca|oveja|cabra|cerdo|jabali|ciervo|zorro|nutria|serpiente|cocodrilo|mapache|vizinho|galo|galinha|cachorro|cao|cobra|anatra|piccione|cane|gatto|mucca|pecora|capra|cinghiale|cervo|volpe|lontra|tartaruga|hahn|huhn|ente|gans|taube|hund|katze|kuh|schaf|ziege|schwein|wildschwein|waschbar|reh|fuchs|schlange|krokodil|babuino|macaco|macaco|monyet|ular|babi|ayam|haan|wasbeer|aap)\b/,
  },
  {
    name: "voisin",
    weight: 5,
    re: /voisin|voisine|voisinage|mitoyen|copropriet|syndic|\bhoa\b|cloture|haie|nuisances sonores|guerre de voisin|noisy neighbou?r|neighborhood dispute|aboiement|vecino|vizinho|nachbar|buurman/,
  },
  {
    name: "ovni",
    weight: 5,
    re: /\bovni\b|\bufo\b|extraterrestre|\balien\b|geipan|soucoupe|flying saucer|unidentified aerial/,
  },
  {
    name: "fetish",
    weight: 5,
    re: /culotte|sous-vetement|lingerie|\bstring\b|sex[-\s]?toy|\bgode\b|vibromasseur|sextoy|panties|underpants|knickers|underwear thief/,
  },
  {
    name: "municipal",
    weight: 4,
    re: /arrete municipal|by-?law|ordinance|conseil municipal|municipal ban|interdit de|decree banning|prefeitura|decreto municipal|ayuntamiento/,
  },
  {
    name: "bateau",
    weight: 4,
    re: /mise a l.?eau|cale de lancement|remorque|boat launch|bateau.{0,24}coul|coul.{0,18}bateau|trailer.{0,12}boat/,
  },
  {
    name: "vol-bizarre",
    weight: 4,
    re: /vol(?:e|ee)? (?:de |d['’])?(?:culotte|nain|gnome|casserole|fromage|canard|coq)|voleur de|stolen (?:gnome|underpants|garden|lawn|duck|rooster)/,
  },
  {
    name: "travaux",
    weight: 3,
    re: /giratoire|roundabout|travaux publics|nid-?de-?poule|pothole|lampadaire|voirie|chantier rate/,
  },
  {
    name: "chasse",
    weight: 3,
    re: /\bchasse\b|chasseur|hunting (?:mishap|accident|fail)|sanglier/,
  },
  {
    name: "tribunal",
    weight: 3,
    re: /plainte contre|sues? (?:a |the )?(?:city|council|tree|dog|cat|pigeon)|juge aux affaires|divorce.{0,20}(poisson|chien|chat|goldfish)/,
  },
  {
    name: "science",
    weight: 3,
    re: /ig nobel|imprimante|goldfish|spreadsheet|biochar|rubber duck|effet haaland|haaland-effekt|\bgulrot/,
  },
];

export const RSS_KEEP = new RegExp(BEATS.map((b) => `(?:${b.re.source})`).join("|"), "i");

function isKind(kind: string, ...want: RssKind[]): boolean {
  return want.includes(kind as RssKind);
}

export function scoreHit(title: string, summary: string, region = "", kind: RssKind | string = "general"): KeepResult {
  const blob = fold(`${title} ${summary}`);
  if (RSS_SKIP.test(blob)) return { keep: false, score: 0, beat: "skip" };

  let score = 0;
  let beat = "";
  for (const b of BEATS) {
    if (b.re.test(blob)) {
      score += b.weight;
      if (!beat) beat = b.name;
    }
  }

  const insoliteDesk = isKind(kind, "insolite", "animaux") || /insolite|odd|weird|oddities/i.test(region);
  const faitsDesk = isKind(kind, "faits-divers") || /faits-?divers|cronaca|panorama|sucesos/i.test(region);
  const scienceDesk = /science/i.test(region);

  if (insoliteDesk) {
    const soft = SOFT.test(blob);
    if (score > 0 || soft) {
      return { keep: true, score: Math.max(score, 2) + (soft ? 1 : 0), beat: beat || "insolite-feed" };
    }
    return { keep: false, score: 0, beat: "" };
  }

  if (score >= 3) return { keep: true, score, beat };

  if (faitsDesk && (score > 0 || SOFT.test(blob))) {
    return { keep: true, score: Math.max(score, 1) + 1, beat: beat || "faits-divers" };
  }

  if (scienceDesk && /ig nobel|imprimante|goldfish|spreadsheet/.test(blob)) {
    return { keep: true, score: Math.max(score, 3), beat: beat || "science" };
  }

  return { keep: false, score, beat: beat || "" };
}

export function shouldKeepHit(title: string, summary: string, region = "", kind: RssKind | string = "general"): boolean {
  return scoreHit(title, summary, region, kind).keep;
}
