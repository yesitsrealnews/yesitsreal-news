export const RSS_SKIP =
  /\b(dead|died|death|killed|killing|murder|suicide|massacre|war in|rape|tué|tuee|tuerie|décès|deces|\bmort\b|\bmorte\b|guerre|viol\b|mineur|underage|child sex|rapt|pédophil|pedophil|agress(?:é|ee|ion|er)?|poignard|sabre|fusill|disparition|malaise|incendie|cannabis|cocaïne|cocaine|drogue|violences sexuelles|périscolaire|gilets jaunes|élections?\s+municipales|west nile|migrant)\b/i;

export const RSS_KEEP =
  /insolite|absurde|ridicule|cocasse|ubuesque|bizarre|étrange|etrange|oddly|\bweird\b|\bfail\b|\bcoq\b|poulailler|aboiement|cocorico|canard|pigeon|\bboa\b|serpent|\bmouton\b|bélier|\bram\b|\bsheep\b|chèvre|sanglier|goldfish|poisson rouge|castor|loutre|\botter\b|\blynx\b|bobcat|culotte|sous-vêtement|sex[-\s]?toy|\bovni\b|\bufo\b|extraterrestre|arrêté municipal|\bbylaw\b|\bby-law\b|ig nobel|imprimante|roundabout|giratoire|voiturette|biochar|rubber duck|copropriét|guerre de voisin|effet haaland|haaland-effekt|\bgulrot/i;

export function shouldKeepHit(title: string, summary: string, region = ""): boolean {
  const blob = `${title} ${summary}`;
  if (RSS_SKIP.test(blob)) return false;
  if (RSS_KEEP.test(blob)) return true;
  if (/science/i.test(region) && /ig nobel|imprimante|goldfish|spreadsheet/.test(blob)) return true;
  return false;
}
