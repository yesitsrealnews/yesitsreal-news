import type { Story } from "@/lib/types";
import { enCopy as c, src, story } from "@/lib/data/story-factory";

/** Revue de presse — in the catalog so Publier can go live, held in Cambuse until the desk clicks. */
export const REVUE_STORIES: Story[] = [
  story({
    id: "s135",
    slug: "turin-caselle-dried-crocodile-head-in-luggage-from-miami",
    slugs: {
      fr: "torino-caselle-tete-de-crocodile-sechee-dans-la-valise-miami",
    },
    section: "animals",
    countryCode: "IT",
    countryName: "Italy",
    location: "Turin Caselle airport",
    dumbness: 8,
    sources: [
      src(
        "Crocodile head found in luggage at Italian airport",
        "The Guardian",
        "https://www.theguardian.com/environment/2026/sep/08/crocodile-head-seized-luggage-italy-airport",
        "2026-09-08",
        "wire",
      ),
      src(
        "Testa di coccodrillo nella valigia: denunciato all'aeroporto",
        "La Stampa",
        "https://www.lastampa.it/torino/2026/09/08/news/aeroporto_torino_testa_coccodrillo_valigia_passeggero_denunciato-15733351/",
        "2026-09-08",
        "local",
      ),
      src(
        "Torino, uomo con una testa di coccodrillo in valigia: denunciato",
        "Sky TG24",
        "https://tg24.sky.it/cronaca/2026/09/08/uomo-testa-coccodrillo-valigia-torino",
        "2026-09-08",
        "wire",
      ),
    ],
    publishedAt: "2026-09-12T14:40:00.000Z",
    originalLang: "it",
    confidence: 0.93,
    entities: ["Guardia di Finanza Torino", "Agenzia delle Dogane", "Caselle"],
    copy: {
      en: c(
        "He flew Miami–Istanbul–Turin with a dried crocodile head in brown packing paper",
        "Caselle, 8 September 2026. Guardia di Finanza and customs. CITES. Fine €20,000–200,000 or six to twelve months. Passenger unnamed, reported 22.",
        [
          "The Guardian, La Stampa and Sky TG24, all 8 September 2026: an Italian passenger landed at Turin Caselle from Miami via Istanbul with a dried crocodile head in his luggage. Guardia di Finanza Turin and the customs agency (ADM) found it wrapped in ordinary brown packing paper. Species listed as Crocodylia spp, Washington Convention / CITES. No certificate, no licence. The head was seized. He was reported and released pending the file.",
          "La Stampa puts him at 22. Police statement: the wrapping was an attempt to get past checks in the country of departure. If convicted: a fine between €20,000 and €200,000, or six months to a year. Italy had stepped up summer checks on passengers from ‘exotic’ origins. Miami was on that list. The souvenir was not.",
          "YES IT'S REAL crossed the Guardian, La Stampa and Sky TG24. Named airport. Named agencies. Named treaty. We do not name the passenger; the GdF did not. Cover is a Nile crocodile head — Commons CC — not the seized specimen.",
        ],
        [
          "Holiday packing list: toothbrush, shirt, protected reptile.",
          "Brown paper is not a CITES form.",
          "Miami to Turin, via Istanbul, via the 1973 convention.",
        ],
        "Guardian + La Stampa + Sky TG24, 8 Sept 2026. GdF Turin / ADM. Passenger unnamed here. Penalty range as reported.",
      ),
      fr: c(
        "Il rentre de Miami avec une tête de crocodile séchée, en papier cadeau",
        "Caselle, 8 septembre 2026. Guardia di Finanza et douanes. CITES. 20 000 à 200 000 € d’amende, ou six à douze mois. Le passager n’est pas nommé ; La Stampa le dit âgé de 22 ans.",
        [
          "The Guardian, La Stampa et Sky TG24, 8 septembre 2026 : un passager italien atterrit à Turin-Caselle, en provenance de Miami via Istanbul, avec une tête de crocodile séchée dans la valise. La Guardia di Finanza de Turin et l’agence des douanes (ADM) la trouvent enveloppée dans du papier d’emballage marron, le genre qu’on met autour d’une bouteille. Espèce Crocodylia spp, Convention de Washington / CITES. Pas de certificat, pas de licence. Saisie. Dénoncé, laissé libre le temps du dossier.",
          "La Stampa le dit âgé de 22 ans. Le communiqué : le papier, c’était pour passer les contrôles au départ. Si l’affaire tient : amende de 20 000 à 200 000 €, ou six mois à un an. L’Italie avait durci les contrôles d’été sur les vols « exotiques ». Miami était sur la liste. Le souvenir, non.",
          "YES IT'S REAL a croisé The Guardian, La Stampa et Sky TG24. Aéroport nommé. Services nommés. Traité nommé. On ne nomme pas le passager ; la GdF non plus. La couverture, c’est une tête de crocodile du Nil — Commons, licence claire — pas la pièce saisie.",
        ],
        [
          "Liste de vacances : brosse à dents, chemise, reptile protégé.",
          "Le papier cadeau n’est pas un formulaire CITES.",
          "Miami–Turin, via Istanbul, via 1973.",
        ],
        "Guardian + La Stampa + Sky TG24, 8 sept. 2026. GdF Turin / ADM. Passager non nommé ici. Fourchette de peine telle que rapportée.",
      ),
    },
  }),
  story({
    id: "s136",
    slug: "denton-fedex-191-turtles-tortoises-walk-in-shipment-china",
    slugs: {
      fr: "denton-fedex-191-tortues-envoi-au-comptoir-vers-la-chine",
    },
    section: "animals",
    countryCode: "US",
    countryName: "United States",
    location: "Denton, Texas",
    dumbness: 9,
    sources: [
      src(
        "191 turtles and tortoises found in unusual shipment at North Texas FedEx office",
        "CBS Texas",
        "https://www.cbsnews.com/texas/news/north-texas-fedex-191-turtles-tortoises-shipment-september-2026/",
        "2026-09-03",
        "wire",
      ),
      src(
        "Nearly 200 turtles recovered in Denton after attempted FedEx shipment",
        "FOX 4 Dallas",
        "https://www.fox4news.com/news/denton-animal-shelter-turtles-fedex",
        "2026-09-03",
        "local",
      ),
      src(
        "Texas FedEx intercepts nearly 200 reptiles in shipment",
        "Houston Chronicle",
        "https://www.chron.com/texas/article/fedex-turtles-tortoises-denton-reptiles-22420032.php",
        "2026-09-06",
        "local",
      ),
    ],
    publishedAt: "2026-09-12T14:50:00.000Z",
    originalLang: "en",
    confidence: 0.92,
    entities: ["Denton Animal Services", "FedEx", "Dallas Zoo", "U.S. Fish and Wildlife Service"],
    copy: {
      en: c(
        "Someone tried to FedEx 191 turtles from a Denton shop counter. Bound for China. Walk-in.",
        "1 September 2026. FedEx Office, Denton, Texas. Animal Services, then Dallas Zoo. Fish and Wildlife opened a file. The sender is not named.",
        [
          "CBS Texas (Doug Myers, 3 September), FOX 4 and the Houston Chronicle: a FedEx Office in Denton called City of Denton Animal Services after a walk-in tried to ship 191 live turtles and tortoises. FOX 4: recovered 1 September; the destination, as reported to the city, was China. Shelter line: ‘Business not as usual.’ They housed the animals in an office, called U.S. Fish and Wildlife, and later moved all 191 to Dallas Zoo.",
          "FedEx retail counters do not ship live reptiles for walk-in customers. Priority Overnight, pre-approved commercial accounts, specialised service — not a shop on a Tuesday. The person who brought the boxes has not been named. The federal file is open. The turtles, the shelter says, are safe.",
          "YES IT'S REAL crossed CBS Texas, FOX 4 and the Chronicle. Named city. Named zoo. Named agency. We do not invent a smuggler. Cover is red-eared sliders — Commons, public domain — not a seized crate.",
        ],
        [
          "One hundred and ninety-one. At the counter.",
          "China is a destination. A high-street FedEx is not a terrarium.",
          "The zoo has them. The form does not.",
        ],
        "CBS Texas 3 Sept; FOX 4 3 Sept; Houston Chronicle 6 Sept 2026. Sender unnamed. Destination China as reported by FOX 4 via Denton Animal Services.",
      ),
      fr: c(
        "Quelqu’un a voulu envoyer 191 tortues au FedEx du coin, direction la Chine",
        "1er septembre 2026, Denton, Texas. Le comptoir. Animal Services, puis le zoo de Dallas. Fish and Wildlife ouvre un dossier. L’expéditeur n’est pas nommé.",
        [
          "CBS Texas (Doug Myers, 3 septembre), FOX 4 et le Houston Chronicle : un FedEx Office de Denton appelle les Animal Services de la ville après qu’un client au comptoir a tenté d’expédier 191 tortues et tortues terrestres vivantes. FOX 4 : récupérées le 1er septembre ; destination, telle que rapportée à la ville, la Chine. Le refuge : « Business not as usual. » Ils les logent dans un bureau, préviennent l’U.S. Fish and Wildlife, puis les 191 partent au Dallas Zoo.",
          "Un FedEx de quartier n’expédie pas les reptiles vivants pour un client de passage. Compte commercial pré-agréé, Priority Overnight, service spécialisé — pas le magasin du mardi. La personne qui a apporté les cartons n’est pas nommée. Le dossier fédéral est ouvert. Les tortues, dit le refuge, sont à l’abri.",
          "YES IT'S REAL a croisé CBS Texas, FOX 4 et le Chronicle. Ville nommée. Zoo nommé. Agence nommée. On n’invente pas un trafiquant. La couverture, des tortues à tempes rouges — Commons, domaine public — pas la caisse saisie.",
        ],
        [
          "Cent quatre-vingt-onze. Au comptoir.",
          "La Chine est une destination. Le FedEx du centre commercial n’est pas un aquarium.",
          "Le zoo les a. Le formulaire, non.",
        ],
        "CBS Texas 3 sept. ; FOX 4 3 sept. ; Houston Chronicle 6 sept. 2026. Expéditeur non nommé. Destination Chine selon FOX 4 / Denton Animal Services.",
      ),
    },
  }),
  story({
    id: "s137",
    slug: "gareoult-bans-leashed-dogs-from-markets-and-village-fetes",
    slugs: {
      fr: "gareoult-interdit-les-chiens-meme-en-laisse-sur-le-marche-et-les-fetes",
    },
    section: "politics",
    countryCode: "FR",
    countryName: "France",
    location: "Garéoult, Var",
    dumbness: 8,
    sources: [
      src(
        "Les chiens, même tenus en laisse, interdits lors des marchés et festivités",
        "Nice-Matin",
        "https://www.nicematin.com/societe/polemique/les-chiens-meme-tenus-en-laisse-interdits-lors-des-marches-et-festivites-la-polemique-enfle-dans-cette-commune-pres-de-brignoles-10718367",
        "2026-09-06",
        "local",
      ),
      src(
        "Arrêtés municipaux — Arrêté n° 2026_08_150 du 24 août 2026",
        "Mairie de Garéoult",
        "https://gareoult.fr/votre-ville/les-arretes-municipaux/",
        "2026-08-24",
        "official",
      ),
      src(
        "Garéoult : les chiens interdits sur le marché",
        "BFMTV Var",
        "https://www.bfmtv.com/var/replay-emissions/bonjour-var/video-gareoult-les-chiens-interdits-sur-le-marche_VN-202609090305.html",
        "2026-09-09",
        "wire",
      ),
    ],
    publishedAt: "2026-09-12T15:00:00.000Z",
    originalLang: "fr",
    confidence: 0.95,
    entities: ["Jérôme Tesson", "Garéoult", "arrêté 2026_08_150"],
    copy: {
      en: c(
        "Garéoult bans dogs from the market — even on a lead. The mayor: no serious reason, just prevention",
        "Arrêté 2026_08_150, 24 August 2026, in force 1 September. Guide dogs exempt. €38 from 1 December. Jérôme Tesson told Nice-Matin.",
        [
          "Nice-Matin (Jérémy Pastor, 6 September) and the town’s own list of arrêtés: Garéoult, Var, banned ‘animals and in particular dogs, even on a lead’ from markets, events and village fêtes, by municipal order 2026_08_150 of 24 August 2026, in force 1 September. Guide dogs and assistance dogs are exempt. BFMTV Var ran it on 9 September. The page at gareoult.fr lists the order by number and date.",
          "Mayor Jérôme Tesson, to Nice-Matin, 5 September: ‘There was no serious reason for this order. I just want to do prevention.’ Awareness until 30 November. From 1 December the municipal police will ticket — €38. He repeats: not a town-wide ban, only the market and the fêtes, in the sector where they are held. Residents split, as French residents do when a dog meets an arrêté.",
          "YES IT'S REAL crossed Nice-Matin, the municipal register and BFMTV. Named mayor. Named order. Named fine. The cover is a Provençal market — Commons CC — not a seized spaniel.",
        ],
        [
          "The lead was not the problem. The order was.",
          "No serious reason. Then a fine in December.",
          "France still speaks to dogs through the mayor.",
        ],
        "Nice-Matin 6 Sept 2026; mairie list arrêté 2026_08_150 (24 Aug); BFMTV Var 9 Sept. Mayor named: Jérôme Tesson.",
      ),
      fr: c(
        "Garéoult interdit les chiens au marché, même en laisse. Le maire : pas de raison grave, de la prévention",
        "Arrêté 2026_08_150, 24 août 2026, en vigueur le 1er septembre. Chiens guides exemptés. 38 € à partir du 1er décembre. Jérôme Tesson à Nice-Matin.",
        [
          "Nice-Matin (Jérémy Pastor, 6 septembre) et la liste des arrêtés de la mairie : Garéoult, dans le Var, interdit « les animaux et notamment les chiens, même tenus en laisse » à l’intérieur des marchés, des manifestations et des fêtes, par l’arrêté municipal 2026_08_150 du 24 août 2026, en vigueur le 1er septembre. Chiens guides et d’assistance exemptés. BFMTV Var l’a dit le 9 septembre. La page gareoult.fr aligne le numéro et la date.",
          "Le maire Jérôme Tesson, à Nice-Matin le 5 septembre : « Il n’y a pas eu de raison grave à la mise en place de cet arrêté. Je veux juste faire de la prévention. » Sensibilisation jusqu’au 30 novembre. À compter du 1er décembre, la police municipale verbalise — 38 €. Il martèle : pas d’interdiction sur toute la commune, seulement le marché et les fêtes, dans le secteur où ça se tient. Les habitants se coupent en deux, comme toujours en France quand un chien rencontre un arrêté.",
          "YES IT'S REAL a croisé Nice-Matin, le registre municipal et BFMTV. Maire nommé. Arrêté nommé. Amende nommée. La couverture, un marché provençal — Commons, licence claire — pas un épagneul saisi.",
        ],
        [
          "La laisse n’était pas le problème. L’arrêté, si.",
          "Pas de raison grave. Puis 38 € en décembre.",
          "La France parle encore aux chiens par le maire.",
        ],
        "Nice-Matin 6 sept. 2026 ; liste mairie arrêté 2026_08_150 (24 août) ; BFMTV Var 9 sept. Maire nommé : Jérôme Tesson.",
      ),
    },
  }),
];
