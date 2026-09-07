import type { Story } from "@/lib/types";
import { enCopy as c, src, story } from "@/lib/data/story-factory";

/** Last century. Funny, already printed. No Ponzi: ruining people is not the beat.
 * DORMANT — not in STORIES, not in the masthead. Wake when the desk says so. */
export const STORIES_ARCHIVE: Story[] = [
  story({
    id: "s89",
    slug: "lustig-sold-the-eiffel-tower-twice-1925",
    slugs: {
      fr: "lustig-vend-la-tour-eiffel-deux-fois-1925",
      es: "lustig-vende-la-torre-eiffel-dos-veces-1925",
    },
    section: "archive",
    countryCode: "FR",
    countryName: "France",
    location: "Paris",
    dumbness: 10,
    sources: [
      src(
        "The Man Who Sold the Eiffel Tower. Twice.",
        "Smithsonian Magazine",
        "https://www.smithsonianmag.com/history/man-who-sold-eiffel-tower-twice-180958370/",
        "2016-03-09",
        "gazette",
      ),
      src(
        "Who sold the Eiffel Tower?",
        "La Tour Eiffel",
        "https://www.toureiffel.paris/en/news/history-and-culture/who-sold-eiffel-tower",
        "2021-02-03",
        "gazette",
      ),
    ],
    publishedAt: "2026-09-07T12:00:00.000Z",
    originalLang: "en",
    confidence: 0.95,
    entities: ["Victor Lustig", "André Poisson", "Tour Eiffel"],
    copy: {
      en: c(
        "A man sold the Eiffel Tower for scrap. Then he came back and tried to sell it again",
        "Paris, 1925. Smithsonian, 9 March 2016. The Tower’s own site, 2021. “Count” Victor Lustig. Forged letterhead. A quiet room. Scrap men. André Poisson paid. He was so ashamed he did not go to the police. Lustig left for Austria. Later he tried the same sale a second time.",
        [
          "The Tower was expensive to keep up. The papers joked: must we sell it? Lustig read that, Smithsonian writes, and made a store of it. He posed as a civil servant. The iron, he said, would go to the highest bidder. Secret, of course. Controversial. The City could not say it in public.",
          "Poisson took the bait. He thought he had bought 7,300 tons of iron. The official site of the Tower prints the name. The second attempt went worse. France was done with him. The United States was not, yet.",
          "YES IT'S REAL prints the sale, not a lecture. Named man, named tower, named year. It sounds fake. The Tower is still there. He sold it anyway.",
        ],
        [
          "He sold a landmark that was not for sale.",
          "The buyer was too embarrassed to report it.",
          "Then he tried to sell it a second time.",
        ],
        "Smithsonian 9 March 2016; toureiffel.paris 3 Feb 2021. Paris, 1925. No death.",
      ),
      fr: c(
        "Un homme a vendu la Tour Eiffel au poids de la ferraille. Puis il est revenu pour la revendre",
        "Paris, 1925. Smithsonian, 9 mars 2016. Le site de la Tour, 2021. Le « comte » Victor Lustig. Du papier à en-tête. Une pièce calme. Des ferrailleurs. André Poisson a payé. La honte l’a empêché d’aller à la police. Lustig part en Autriche. Plus tard, il tente la même vente une deuxième fois.",
        [
          "La Tour coûtait cher à entretenir. Les journaux plaisantaient : faudra-t-il la vendre ? Lustig a lu ça, écrit le Smithsonian, et en a fait son magasin. Il se fait fonctionnaire. Le fer, dit-il, ira au plus offrant. Secret, évidemment. Délicat. La Ville ne peut pas le dire en public.",
          "Poisson mord. Il croit avoir acheté 7 300 tonnes de fer. Le site officiel de la Tour imprime le nom. La deuxième tentative va moins bien. La France en a assez. Les États-Unis, pas encore.",
          "YES IT’S REAL imprime la vente, pas un sermon. Homme nommé, tour nommée, année nommée. Ça a l’air faux. La Tour est toujours là. Il l’a vendue quand même.",
        ],
        [
          "Il a vendu un monument qui n’était pas à vendre.",
          "L’acheteur a eu trop honte pour porter plainte.",
          "Puis il a essayé une deuxième fois.",
        ],
        "Smithsonian 9 mars 2016 ; toureiffel.paris 3 fév. 2021. Paris, 1925. Pas de mort.",
      ),
    },
  }),
  story({
    id: "s90",
    slug: "parker-sold-the-brooklyn-bridge-toll-booth",
    slugs: {
      fr: "parker-vend-le-pont-de-brooklyn-peage",
      es: "parker-vende-el-puente-de-brooklyn-peaje",
    },
    section: "archive",
    countryCode: "US",
    countryName: "United States",
    location: "New York",
    dumbness: 9,
    sources: [
      src(
        "George C. Parker",
        "Wikipedia",
        "https://en.wikipedia.org/wiki/George_C._Parker",
        "2026-09-02",
        "gazette",
      ),
    ],
    publishedAt: "2026-09-07T12:02:00.000Z",
    originalLang: "en",
    confidence: 0.9,
    entities: ["George C. Parker", "Brooklyn Bridge"],
    copy: {
      en: c(
        "He sold the Brooklyn Bridge. The police found the new owners putting up a toll booth",
        "New York. George C. Parker, 1860–1937. Wikipedia, 2 September 2026, citing the record. He sold a landmark he did not own. Papers, forged. The bridge, he said, was his. Hard to operate. He would part with it. More than once the city’s police stopped men who had just “bought” it and were setting up a booth to collect the fare.",
        [
          "He also offered Madison Square Garden, the Metropolitan Museum, Grant’s Tomb, the Statue of Liberty. The bridge was the favourite. The phrase “if you believe that, I have a bridge to sell you” outlived him.",
          "Three fraud convictions. The third, late 1928: life at Sing Sing. He died there. The bridge stayed a bridge. The booths did not stay.",
          "YES IT'S REAL prints the booth, not a sermon on the buyer. Named man, named span, named police. The sale is the joke. The iron is still public.",
        ],
        [
          "He sold a bridge he did not own.",
          "The new owners tried to charge a toll.",
          "The police took the booth down.",
        ],
        "Wikipedia, George C. Parker, 2 Sept 2026. New York. No death as the beat.",
      ),
      fr: c(
        "Il a vendu le pont de Brooklyn. La police a trouvé les nouveaux propriétaires en train d’installer un péage",
        "New York. George C. Parker, 1860-1937. Wikipedia, 2 septembre 2026, d’après le dossier. Il vend un monument qui n’est pas à lui. Des papiers, faux. Le pont, dit-il, est le sien. Difficile à faire tourner. Il s’en séparerait. Plus d’une fois la police de la ville arrête des hommes qui viennent de « l’acheter » et montent un kiosque pour prendre le droit de passage.",
        [
          "Il a aussi proposé Madison Square Garden, le Metropolitan, le tombeau de Grant, la statue de la Liberté. Le pont était le préféré. La phrase « si vous croyez ça, j’ai un pont à vous vendre » lui a survécu.",
          "Trois condamnations pour fraude. La troisième, fin 1928 : perpétuité à Sing Sing. Il y meurt. Le pont reste un pont. Les kiosques, non.",
          "YES IT’S REAL imprime le kiosque, pas un sermon sur l’acheteur. Homme nommé, pont nommé, police nommée. La vente est la blague. Le fer est toujours public.",
        ],
        [
          "Il a vendu un pont qui n’était pas à lui.",
          "Les nouveaux propriétaires ont voulu un péage.",
          "La police a démonté le kiosque.",
        ],
        "Wikipedia, George C. Parker, 2 sept. 2026. New York. Pas de mort comme sujet.",
      ),
    },
  }),
  story({
    id: "s91",
    slug: "welles-war-of-the-worlds-radio-1938",
    slugs: {
      fr: "welles-guerre-des-mondes-radio-1938",
      es: "welles-guerra-de-los-mundos-radio-1938",
    },
    section: "archive",
    countryCode: "US",
    countryName: "United States",
    location: "New York",
    dumbness: 8,
    sources: [
      src(
        "The Infamous “War of the Worlds” Radio Broadcast Was a Magnificent Fluke",
        "Smithsonian Magazine",
        "https://www.smithsonianmag.com/history/infamous-war-worlds-radio-broadcast-was-magnificent-fluke-180955180/",
        "2015-05-06",
        "gazette",
      ),
    ],
    publishedAt: "2026-09-07T12:04:00.000Z",
    originalLang: "en",
    confidence: 0.93,
    entities: ["Orson Welles", "Mercury Theatre", "CBS"],
    copy: {
      en: c(
        "A radio play said Martians had landed in New Jersey. Papers said America panicked. The play was fiction. The panic made the front page",
        "30 October 1938. CBS. Mercury Theatre on the Air. Orson Welles, twenty-three. H. G. Wells, adapted. Smithsonian, 6 May 2015: a magnificent fluke. Bulletins, in the style of news. A farmer. A cylinder. Grovers Mill, New Jersey. Listeners who missed the disclaimer heard the planet ending.",
        [
          "Newspapers the next morning printed a nation in flight. Later historians said the scale was fatter in print than in the living room. The papers had a radio rival. A panic is a story. Welles became a name overnight.",
          "We do not print a body. We print a broadcast, a disclaimer some people missed, and a morning edition that sold the fright. Mars did not land. The microphones did.",
          "YES IT'S REAL read Smithsonian. Named night, named network, named town. It was a play. The lede was written as news. That was the trick.",
        ],
        [
          "It was a play. It sounded like the news.",
          "Some people missed the first minute.",
          "Mars did not land. The papers did.",
        ],
        "Smithsonian, 6 May 2015. CBS, 30 Oct 1938. No death as the beat.",
      ),
      fr: c(
        "Une pièce radiophonique dit que les Martiens ont atterri dans le New Jersey. Les journaux ont dit que l’Amérique paniquait. C’était de la fiction. La panique a fait la une",
        "30 octobre 1938. CBS. Mercury Theatre on the Air. Orson Welles, vingt-trois ans. H. G. Wells, adapté. Smithsonian, 6 mai 2015 : un magnifique coup de chance. Des flashs, façon journal. Un fermier. Un cylindre. Grovers Mill, New Jersey. Ceux qui ont raté l’avertissement ont entendu la fin du monde.",
        [
          "Le lendemain, les journaux impriment un pays en fuite. Plus tard, les historiens diront : l’ampleur était plus grosse sur le papier que dans le salon. La presse avait un rival : la radio. Une panique, c’est un sujet. Welles devient un nom dans la nuit.",
          "On n’imprime pas un corps. On imprime une émission, un avertissement que certains n’ont pas entendu, et une édition du matin qui a vendu la peur. Mars n’a pas atterri. Les micros, si.",
          "YES IT’S REAL a lu le Smithsonian. Nuit nommée, antenne nommée, bourg nommé. C’était une pièce. Le lancement était écrit comme une info. C’était le tour.",
        ],
        [
          "C’était une pièce. Ça sonnait comme les infos.",
          "Certains ont raté la première minute.",
          "Mars n’a pas atterri. Les journaux, si.",
        ],
        "Smithsonian, 6 mai 2015. CBS, 30 oct. 1938. Pas de mort comme sujet.",
      ),
    },
  }),
  story({
    id: "s92",
    slug: "new-coke-1985-they-changed-the-formula",
    slugs: {
      fr: "new-coke-1985-ils-ont-change-la-formule",
      es: "new-coke-1985-cambiaron-la-formula",
    },
    section: "archive",
    countryCode: "US",
    countryName: "United States",
    location: "Atlanta",
    dumbness: 8,
    sources: [
      src(
        "The Story of New Coke",
        "The Coca-Cola Company",
        "https://www.coca-colacompany.com/about-us/history/the-story-of-new-coke",
        "1985-04-23",
        "gazette",
      ),
    ],
    publishedAt: "2026-09-07T12:06:00.000Z",
    originalLang: "en",
    confidence: 0.92,
    entities: ["New Coke", "Coca-Cola", "Atlanta"],
    copy: {
      en: c(
        "They changed Coca-Cola. America shouted. Seventy-nine days later they brought the old one back and called it Classic",
        "Atlanta, 23 April 1985. The company’s own history page. Taste tests had said sweeter would win. They retired the formula of 1886 and poured New Coke. Hotlines. Petitions. People hoarded the old bottles. On 11 July they announced Coca-Cola Classic. New Coke stayed on the shelf a while, then faded. The old drink kept the name “Classic” for years.",
        [
          "The company still tells it as a lesson it paid for in public. The tests were not wrong about sugar. They were wrong about what the can meant. A formula is a recipe. A Coke was a habit.",
          "We print a seventy-nine-day drink. Named date, named return, named word: Classic. It was not a scam. It was a tasting panel that met a country.",
          "YES IT'S REAL read the company’s own file. Atlanta named the mistake. Then it sold the mistake’s opposite.",
        ],
        [
          "They changed the formula on purpose.",
          "The country filed a complaint with its throat.",
          "Seventy-nine days. Then: Classic.",
        ],
        "The Coca-Cola Company, The Story of New Coke. Atlanta, 1985. No death.",
      ),
      fr: c(
        "Ils ont changé le Coca-Cola. L’Amérique a gueulé. Soixante-dix-neuf jours plus tard, l’ancien est revenu. Ils l’ont appelé Classic",
        "Atlanta, 23 avril 1985. La page d’histoire de la maison. Les tests disaient : plus sucré gagne. Ils retirent la formule de 1886 et versent le New Coke. Des lignes téléphoniques. Des pétitions. Les gens stockent les anciennes bouteilles. Le 11 juillet : Coca-Cola Classic. Le New Coke reste un moment, puis s’efface. L’ancien garde le mot « Classic » des années.",
        [
          "La maison raconte encore ça comme une leçon payée en public. Les tests n’avaient pas tort sur le sucre. Ils avaient tort sur ce que la canette voulait dire. Une formule, c’est une recette. Un Coke, c’était une habitude.",
          "On imprime une boisson de soixante-dix-neuf jours. Date nommée, retour nommé, mot nommé : Classic. Ce n’était pas une arnaque. C’était un panel de dégustation qui a rencontré un pays.",
          "YES IT’S REAL a lu le dossier de la maison. Atlanta a nommé l’erreur. Puis elle a vendu le contraire.",
        ],
        [
          "Ils ont changé la formule exprès.",
          "Le pays a porté plainte avec la gorge.",
          "Soixante-dix-neuf jours. Puis : Classic.",
        ],
        "The Coca-Cola Company, The Story of New Coke. Atlanta, 1985. Pas de mort.",
      ),
    },
  }),
];
