import { ES_HEADLINES } from "@/lib/data/headlines-es";
import type { Lang, Story } from "@/lib/types";
import type { StoryCopy } from "@/lib/types";

/** Localized hed/dek/why for languages beyond the English body. */
type Hed = { h: string; d: string; w: [string, string, string] };

export const HEADLINES: Record<string, Partial<Record<Lang, Hed>>> = {
  s01: {
    fr: { h: "Un conseil interdit le pain rassis pour que les canards « cessent de se croire tout permis »", d: "Un borough gallois a consigné que les oiseaux d’eau avaient pris l’habitude d’être nourris.", w: ["La cible est un trait de caractère attribué à un canard.", "Un aliment déjà déconseillé est interdit comme affaire de manières.", "Le mot figure au procès-verbal."] },
    es: { h: "Un concejo prohíbe el pan sobrante para que los patos ‘dejen de sentirse con derecho’", d: "Un municipio galés dejó constancia de que las aves se habían acostumbrado a que las alimentaran.", w: ["El objeto es un rasgo de carácter de un pato.", "Un alimento ya desaconsejado se prohíbe como cuestión de modales.", "El acta incluye esa palabra."] },
    de: { h: "Gemeinderat verbietet Altbrot, damit Enten ‘aufhören, sich berechtigt zu fühlen’", d: "Ein walisischer Bezirk hielt fest, Wasservögel seien das Füttern gewohnt.", w: ["Ziel ist ein Charakterzug einer Ente.", "Ungeeignetes Futter wird zur Charakterfrage.", "Das Wort steht im Protokoll."] },
    ar: { h: "مجلس يمنع الخبز اليابس كي «يكف البط عن الشعور بالاستحقاق»", d: "سجل حي ويلزي أن الطيور اعتادت على الإطعام.", w: ["الهدف سمة شخصية منسوبة لبطة.", "طعام غير مناسب يُمنع كمسألة أخلاق.", "الكلمة صارت في المحضر."] },
    ja: { h: "議会、残りパンを禁止「アヒルが権利意識を持たぬよう」", d: "ウェールズの自治体は水鳥が給餌に慣れたと記録した。", w: ["政策の対象はアヒルの性格である。", "栄養的に既に非推奨の餌がマナーの問題になった。", "議事録にその語が残った。"] },
    zh: { h: "镇议会禁止剩面包，以免鸭子“变得有特权感”", d: "威尔士一市镇记录水禽已习惯被投喂，并着手制止。", w: ["政策对象是鸭子的性格。", "本已不建议的食物被当成教养问题。", "会议记录里出现了这个词。"] },
  },
  s03: {
    fr: { h: "Un maire déclare la guerre aux pigeons, et la perd", d: "Une ville d’Italie du Nord a annoncé un plan extraordinaire. Les pigeons n’ont pas signé.", w: ["Guerre déclarée à un animal qui ne lit pas.", "Le matériel est devenu du mobilier.", "La concession est au procès-verbal."] },
    es: { h: "Un alcalde declara la guerra a las palomas y la pierde", d: "Una ciudad del norte de Italia anunció un plan. Las palomas no lo firmaron.", w: ["Guerra a un animal que no reconoce declaraciones.", "El hardware se volvió mobiliario.", "La concesión está en acta."] },
    de: { h: "Bürgermeister erklärt Tauben den Krieg und verliert", d: "Eine norditalienische Stadt kündigte einen Plan an. Die Tauben unterschrieben nicht.", w: ["Krieg gegen ein Tier ohne Erklärungen.", "Technik wurde Möbel.", "Das Eingeständnis steht im Protokoll."] },
  },
  s16: {
    fr: { h: "Une célébrité annonce avoir découvert la gravité toute seule", d: "La chute a été présentée comme une percée personnelle.", w: ["Une loi de la nature devenue style de vie.", "Un jus a été crédité.", "Les applaudissements ne changent pas une constante."] },
    es: { h: "Una celebridad anuncia que ha descubierto la gravedad por su cuenta", d: "Las caídas se presentaron como un hallazgo personal.", w: ["Una ley natural, convertida en estilo de vida.", "Un jugo recibió el crédito.", "El aplauso no altera una constante."] },
    de: { h: "Prominenter gibt bekannt, die Schwerkraft eigenständig entdeckt zu haben", d: "Das Fallen wurde als persönlicher Durchbruch präsentiert.", w: ["Ein Naturgesetz als Lebensstil.", "Ein Saft bekam den Credit.", "Applaus ändert keine Konstante."] },
  },
  s31: {
    fr: { h: "Francis Lalanne candidat à l’Élysée depuis une salle de 100 places — et encore inéligible", d: "Le chanteur, 68 ans, a lancé 2027 au Théâtre Galabru. 500 parrainages. Dernier score : 0,02 %.", w: ["Cent places pour soixante-sept millions.", "Course nationale pendant une inéligibilité pour comptes non déposés.", "0,02 % avec le Premier ministre pressenti."] },
    es: { h: "Lalanne se presenta al Elíseo desde un teatro de 100 localidades — y sigue inelegible", d: "El cantante, 68 años, lanzó 2027 en el Théâtre Galabru. 500 avales. Último resultado: 0,02 %.", w: ["Cien asientos para 67 millones.", "Campaña nacional aún inelegible por no presentar cuentas.", "0,02 % con su primer ministro previsto."] },
    de: { h: "Lalanne kandidiert für den Élysée aus einem 100-Plätze-Theater — und ist noch nicht wählbar", d: "Der Sänger, 68, startete 2027 im Théâtre Galabru. 500 Unterstützer. Letztes Ergebnis: 0,02 %.", w: ["Hundert Plätze für 67 Millionen.", "Nationale Kandidatur während einer Sperre wegen nicht abgelegter Konten.", "0,02 % mit dem Wunschpremier."] },
  },
  s32: {
    fr: { h: "Le « Christ cosmique » de Bugarach candidat à l’Élysée — encore — et sans ticket Lalanne", d: "Sylvain Durif a annoncé 2027 le 23 août, sur Instagram. 2017 déjà. 500 maires. En 2014 : sept voix.", w: ["2017 : une vidéo, pas de bulletin.", "Sept voix à Arques, dernière fois qu’on a compté.", "Pas d’alliance Lalanne : il est contre les frontières."] },
    es: { h: "El ‘Cristo cósmico’ de Bugarach se presenta al Elíseo — otra vez — y sin ticket Lalanne", d: "Sylvain Durif anunció 2027 el 23 de agosto en Instagram. Ya lo hizo en 2017. 500 avales. En 2014: siete votos.", w: ["2017: un vídeo, sin papeleta.", "Siete votos en un pueblo, el último recuento.", "Sin alianza con Lalanne: está contra las fronteras."] },
    de: { h: "Der ‚kosmische Christus‘ von Bugarach kandidiert erneut — ohne Ticket mit Lalanne", d: "Sylvain Durif rief 2027 am 23. August per Instagram aus. Schon 2017. 500 Bürgermeister. 2014: sieben Stimmen.", w: ["2017: ein Video, keine Liste.", "Sieben Stimmen im Dorf, letzter Zählerstand.", "Kein Bündnis mit Lalanne: er ist gegen Grenzen."] },
  },
  s33: {
    fr: { h: "Un lauréat remercie son attaché de presse « de m’avoir appris l’humilité » — sur un carton écrit par l’attaché", d: "La pool a récupéré le carton. La dernière ligne était l’humilité. Ce n’était pas son écriture.", w: ["La vertu a été sous-traitée, puis jouée.", "L’auteur de la phrase était dans la salle.", "Le carton a survécu."] },
  },
  s34: {
    fr: { h: "Un influenceur annonce une détox digitale en live de 47 minutes, sur quatre applis à la fois", d: "Il a demandé qu’on respecte son absence, puis a posté un recap au petit-déjeuner.", w: ["L’annonce de l’absence a duré plus qu’un déjeuner.", "Le suivi est un post sur le fait de ne plus poster.", "Quatre applis, ce n’est pas une retraite."] },
  },
  s35: {
    fr: { h: "Trump a rebaptisé une mer partagée « golfe d’Amérique ». Google Maps dépend du pays. Cette semaine : un lac", d: "Décret 14172 sur le plateau américain du golfe du Mexique. Le Mexique a poursuivi Google. Jeudi, le lac Ontario est devenu Lake America.", w: ["Le décret nomme un plateau. La marque a coulé sur tout le golfe.", "Google Maps fait passer un test de nationalité à l’eau.", "Après la mer, un lac — que New York refuse aussi."] },
    es: { h: "Trump rebautizó un mar compartido como Golfo de América. Google Maps depende del país. Esta semana, un lago", d: "La orden 14172 relabeló la plataforma estadounidense. México demandó a Google. El jueves, el lago Ontario pasó a Lake America.", w: ["El decreto nombra una plataforma. La marca se derramó al golfo entero.", "Maps pone un test de nacionalidad al agua.", "Después del mar, un lago que Nueva York tampoco renombra."] },
    de: { h: "Trump taufte ein geteiltes Meer zum Golf von Amerika. Google Maps hängt vom Land ab. Diese Woche: ein See", d: "Erlass 14172 für den US-Sockel des Golfs von Mexiko. Mexiko verklagte Google. Donnerstag wurde der Ontariosee zu Lake America.", w: ["Der Erlass nennt einen Sockel. Das Branding lief auf den ganzen Golf.", "Maps macht dem Wasser einen Staatsbürgerschaftstest.", "Nach dem Meer ein See — den New York auch nicht umbenennt."] },
  },
};

export function localizedCopy(story: Story, lang: Lang): { copy: StoryCopy; bodyPending: boolean } {
  const base = story.copy[lang];
  if (base) return { copy: base, bodyPending: false };
  const hed = lang === "es" ? ES_HEADLINES[story.id] : HEADLINES[story.id]?.[lang];
  if (hed) {
    return {
      copy: {
        ...story.copy.en,
        headline: hed.h,
        dek: hed.d,
        whyDumb: hed.w,
      },
      bodyPending: true,
    };
  }
  return { copy: story.copy.en, bodyPending: lang !== "en" && lang !== story.originalLang };
}
