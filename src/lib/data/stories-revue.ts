import type { Story } from "@/lib/types";
import { enCopy as c, src, story } from "@/lib/data/story-factory";

/** Held until the desk clicks Publier. Catalog status is review so they never leak. */
function revue(p: Parameters<typeof story>[0]): Story {
  return story({ ...p, status: "review" });
}

export const REVUE_STORIES: Story[] = [
  revue({
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
  revue({
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
        "CBS Texas 3 Sept; FOX 4 3 Sept; Houston Chronicle 6 Sept 2026. Sender unnamed. Destination China per FOX 4 / Denton Animal Services.",
      ),
      fr: c(
        "Quelqu’un a voulu envoyer 191 tortues au FedEx de Denton. Direction la Chine. Au comptoir.",
        "1er septembre 2026. FedEx Office, Denton, Texas. Animal Services, puis le zoo de Dallas. Fish and Wildlife ouvre un dossier. L’expéditeur n’est pas nommé.",
        [
          "CBS Texas (Doug Myers, 3 septembre), FOX 4 et le Houston Chronicle : un FedEx Office de Denton appelle les services animaliers de la ville après qu’un client au comptoir a voulu expédier 191 tortues vivantes. FOX 4 : récupérées le 1er septembre ; destination, selon la ville, la Chine. Le refuge : « Business not as usual. » Ils les logent dans un bureau, appellent U.S. Fish and Wildlife, puis transférent les 191 au zoo de Dallas.",
          "Les comptoirs FedEx ne prennent pas les reptiles vivants pour un client de passage. Priority Overnight, comptes commerciaux pré-approuvés, service spécialisé — pas un magasin un mardi. La personne qui a apporté les cartons n’est pas nommée. Le dossier fédéral est ouvert. Les tortues, dit le refuge, sont saines.",
          "YES IT'S REAL a croisé CBS Texas, FOX 4 et le Chronicle. Ville nommée. Zoo nommé. Agence nommée. On n’invente pas un trafiquant. La couverture, des tortues à oreilles rouges — Commons, domaine public — pas une caisse saisie.",
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
  revue({
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

  revue({
    id: "s138",
    slug: "vilablareix-rooster-revenge-dog-barking-farigola",
    slugs: {
      fr: "vilablareix-il-prend-un-coq-pour-repondre-aux-chiens-du-voisin",
    },
    section: "animals",
    countryCode: "ES",
    countryName: "Spain",
    location: "Vilablareix, Gérone",
    dumbness: 9,
    sources: [
      src(
        "El cant d'un gall divideix Vilablareix, al Gironès",
        "RTVE / La 2Cat",
        "https://www.rtve.es/play/noticies/20260915/poble-girones-confrontat-cant-gall-vilablareix/17225167.shtml",
        "2026-09-15",
        "wire",
      ),
      src(
        "Il adopte un coq pour se venger des aboiements du chien de son voisin : à bout, tout le quartier porte plainte",
        "Midi Libre",
        "https://www.midilibre.fr/2026/09/14/il-adopte-un-coq-pour-se-venger-des-aboiements-du-chien-de-son-voisin-a-bout-tout-le-quartier-porte-plainte-13550719.php",
        "2026-09-14",
        "local",
      ),
      src(
        "Excédé par les aboiements des chiens de son quartier, il achète un coq... qui chante nuit et jour",
        "La Dépêche du Midi",
        "https://www.ladepeche.fr/2026/09/14/excede-par-les-aboiements-des-chiens-de-son-quartier-il-achete-un-coq-qui-chante-nuit-et-jour-poussant-a-bout-les-habitants-du-village-13550689.php",
        "2026-09-14",
        "local",
      ),
      src(
        "Après s’être plaint des aboiements des chiens du voisin, il achète un coq et rend chèvre tout le quartier",
        "Ouest-France",
        "https://www.ouest-france.fr/europe/espagne/apres-setre-plaint-des-aboiements-des-chiens-du-voisin-il-achete-un-coq-et-rend-chevre-tout-le-quartier-ff6e4520-ac23-11f1-8801-66f16947434c",
        "2026-09-10",
        "wire",
      ),
    ],
    publishedAt: "2026-09-15T12:00:00.000Z",
    originalLang: "es",
    confidence: 0.94,
    entities: ["Vilablareix", "Maite Tixis", "Mossos d'Esquadra", "carrer Farigola"],
    copy: {
      en: c(
        "He complained about the dogs. Then he got a rooster. The street filed a complaint. The mayor says it is a loudspeaker.",
        "Vilablareix, Girona. Carrer Farigola. Twenty-seven neighbours. Mayor Maite Tixis. Owner Francisco. Mossos four visits. No deaths, no minors — a poultry feud.",
        [
          "RTVE’s La 2Cat (Adrián Soler Royes, 15 September 2026), Midi Libre and La Dépêche (14 September) and Ouest-France (10 September), all citing the Catalan local press: in Vilablareix, south of Girona, a man who had spoken for the street about barking dogs then installed a rooster. Neighbours on carrer Farigola have lived with it for months. Midi Libre: a complaint signed by 27 residents went to the town hall.",
          "The owner, Francisco, told La 2Cat he puts the bird inside at night and denies a loudspeaker. Mayor Maite Tixis told the same programme the police report ‘determines that there really is a loudspeaker that puts rooster noises on at night.’ The Mossos, the French papers say, have been four times and found no device. He says if dogs bark and cats meow, a rooster that sings in the day is not his remaining problem to solve.",
          "YES IT'S REAL crossed RTVE, Midi Libre, La Dépêche and Ouest-France. Named town. Named mayor. Named street. We do not name a breed we have not been given. Cover is a farmyard rooster — Commons CC — not the bird on Farigola.",
        ],
        [
          "The mediation was a rooster.",
          "Twenty-seven signatures. One bird. A mayor talking about a speaker.",
          "Spain still settles barking with poultry.",
        ],
        "RTVE La 2Cat 15 Sept 2026; Midi Libre 14 Sept; La Dépêche 14 Sept; Ouest-France 10 Sept. Mayor: Maite Tixis. Owner first-named Francisco.",
      ),
      fr: c(
        "Il s’était plaint des chiens. Il a pris un coq. Le quartier a porté plainte. La maire parle d’un haut-parleur.",
        "Vilablareix, Gérone. Carrer Farigola. Vingt-sept voisins. Maire Maite Tixis. Le propriétaire, Francisco. Les Mossos, quatre visites. Personne n’est blessé — une guerre de basse-cour.",
        [
          "RTVE / La 2Cat (Adrián Soler Royes, 15 septembre 2026), Midi Libre et La Dépêche (14 septembre) et Ouest-France (10 septembre), tous d’après la presse catalane : à Vilablareix, au sud de Gérone, un homme qui s’était fait le porte-parole de la rue contre les aboiements a ensuite installé un coq. Les voisins du carrer Farigola vivent avec depuis des mois. Midi Libre : une plainte signée par 27 habitants est arrivée à la mairie.",
          "Le propriétaire, Francisco, dit à La 2Cat qu’il rentre l’animal le soir et nie le haut-parleur. La maire Maite Tixis, au même magazine : le procès-verbal « détermine qu’il y a vraiment un haut-parleur qui met des bruits de coq la nuit ». Les Mossos, écrivent les journaux français, sont passés quatre fois et n’ont rien trouvé. Lui : s’il y a des chiens qui aboient et des chats qui miaulent, un coq qui chante le jour n’est plus son affaire à régler.",
          "YES IT'S REAL a croisé RTVE, Midi Libre, La Dépêche et Ouest-France. Commune nommée. Maire nommée. Rue nommée. On ne nomme pas une race qu’on ne nous a pas donnée. La couverture, un coq de basse-cour — Commons, licence claire — pas le volatile de Farigola.",
        ],
        [
          "La médiation, c’était un coq.",
          "Vingt-sept signatures. Un oiseau. Une maire qui parle d’enceinte.",
          "L’Espagne règle encore les aboiements par la volaille.",
        ],
        "RTVE La 2Cat 15 sept. 2026 ; Midi Libre 14 sept. ; La Dépêche 14 sept. ; Ouest-France 10 sept. Maire : Maite Tixis. Propriétaire prénommé Francisco.",
      ),
    },
  }),
  revue({
    id: "s139",
    slug: "norway-haaland-effect-carrot-sales-landbruksdirektoratet",
    slugs: {
      fr: "norvege-effet-haaland-les-carottes-en-botte-ont-leur-ministere",
    },
    section: "sports",
    countryCode: "NO",
    countryName: "Norway",
    location: "Norway",
    dumbness: 8,
    sources: [
      src(
        "Stort salg av gulrøtter i sommer: – Haaland-effekt",
        "NRK",
        "https://www.nrk.no/nyheter/stort-salg-av-gulrotter-i-sommer_-_-haaland-effekt-1.17982936",
        "2026-08-08",
        "wire",
      ),
      src(
        "Knallsalg av gulrøtter i sommer: – Haaland-effekt",
        "TV 2",
        "https://www.tv2.no/nyheter/knallsalg-av-gulrotter-i-sommer-haaland-effekt/19110866/",
        "2026-08-08",
        "wire",
      ),
      src(
        "« Le bonbon Haaland » : comment le Norvégien a boosté la consommation de carottes dans son pays",
        "L'Équipe",
        "https://www.lequipe.fr/Football/Actualites/-le-bonbon-haaland-comment-le-norvegien-a-booste-la-consommation-de-carottes-dans-son-pays/1718862",
        "2026-09-15",
        "wire",
      ),
      src(
        "Ukens marked for frukt og grønt",
        "Landbruksdirektoratet",
        "https://www.landbruksdirektoratet.no/nb/industri-og-handel/marked-og-pris/ukens-marked",
        "2026-08-08",
        "official",
      ),
    ],
    publishedAt: "2026-09-15T12:10:00.000Z",
    originalLang: "no",
    confidence: 0.93,
    entities: ["Erling Braut Haaland", "Landbruksdirektoratet", "Bama"],
    copy: {
      en: c(
        "Norway’s agriculture directorate put a Haaland effect in the weekly fruit-and-veg note. The crop was bunched carrots.",
        "Landbruksdirektoratet, summer 2026. NRK and TV 2, 8 August. L'Équipe picked it up 15 September. Bama ads. No invented sales figure.",
        [
          "NRK and TV 2, 8 August 2026, quoting the Norwegian agriculture directorate’s weekly fruit-and-veg report: producers described a ‘Haaland-effekt’ on bunched carrots after the World Cup. The directorate also noted cauliflower and other summer vegetables moving. L'Équipe (Tom Prevot, 15 September) brought the same note to French newsrooms; Ouest-France followed the same day.",
          "The directorate did not publish a percentage in the pieces we have. What it did publish is the phrase, in an official market note, next to a footballer who eats carrots in a Bama advert and in car videos on the way to matches. TV 2: seven World Cup goals in four games for Norway; also a man in a truck, eating a root vegetable, on national television.",
          "YES IT'S REAL crossed NRK, TV 2, L'Équipe and the directorate’s market page. Named agency. Named player. We do not invent a tonnage. Cover is bunched carrots — Commons CC — not a Bama still.",
        ],
        [
          "The ministry of vegetables named a striker.",
          "The snack is a carrot. The metric is a vibe.",
          "Norway files football under produce.",
        ],
        "NRK + TV 2, 8 Aug 2026, quoting Landbruksdirektoratet; L'Équipe 15 Sept. No percentage in the copy we cite.",
      ),
      fr: c(
        "La Norvège a mis un « effet Haaland » dans la note hebdo des carottes. C’est le ministère qui le dit.",
        "Landbruksdirektoratet, été 2026. NRK et TV 2, 8 août. L'Équipe le ramène le 15 septembre. Pubs Bama. Pas de chiffre inventé.",
        [
          "NRK et TV 2, 8 août 2026, d’après la note hebdomadaire fruits et légumes de la direction norvégienne de l’agriculture : les producteurs décrivent un « Haaland-effekt » sur la carotte en botte, après la Coupe du monde. La direction note aussi le chou-fleur et d’autres légumes d’été. L'Équipe (Tom Prevot, 15 septembre) sort la même note dans les rédactions françaises ; Ouest-France suit le jour même.",
          "La direction ne publie pas de pourcentage dans les papiers que nous avons. Elle publie la formule, dans une note de marché officielle, à côté d’un attaquant qui mange des carottes dans une pub Bama et dans des vidéos en voiture, en route vers le match. TV 2 : sept buts en quatre matches pour la Norvège ; aussi un homme au volant d’un chariot élévateur, une racine entre les dents, à la télévision nationale.",
          "YES IT'S REAL a croisé NRK, TV 2, L'Équipe et la page marché de la direction. Agence nommée. Joueur nommé. On n’invente pas un tonnage. La couverture, des carottes en botte — Commons, licence claire — pas un photogramme Bama.",
        ],
        [
          "Le ministère des légumes a nommé un avant-centre.",
          "Le snack, c’est une carotte. L’unité, c’est une humeur.",
          "La Norvège classe le football aux primeurs.",
        ],
        "NRK + TV 2, 8 août 2026, d’après Landbruksdirektoratet ; L'Équipe 15 sept. Pas de pourcentage dans les textes cités.",
      ),
    },
  }),
];

/** Desk already published these from the cambuse. Not revue — they are live. */
export const DESK_LIVE: Story[] = [
  story({
    id: "s140",
    slug: "latrape-billy-goat-holds-man-in-his-house-firefighters-sedate-it",
    slugs: {
      fr: "latrape-un-bouc-sequestre-un-habitant-les-pompiers-sedatent-lanimal",
    },
    section: "animals",
    countryCode: "FR",
    countryName: "France",
    location: "Latrape, Haute-Garonne",
    dumbness: 8,
    sources: [
      src(
        "Scène insolite au sud de Toulouse, un habitant séquestré chez lui par un bouc sauvage et agressif : les pompiers sédatent l’animal",
        "La Dépêche du Midi",
        "https://www.ladepeche.fr/2026/09/15/scene-insolite-au-sud-de-toulouse-un-habitant-sequestre-chez-lui-par-un-bouc-sauvage-et-agressif-les-pompiers-sedatent-lanimal-13552745.php",
        "2026-09-15",
        "local",
      ),
    ],
    publishedAt: "2026-09-15T18:22:00.000Z",
    originalLang: "fr",
    confidence: 0.91,
    entities: ["Latrape", "SDIS 31", "SACPA", "impasse de Sardi"],
    copy: {
      en: c(
        "A billy goat held a man in his house in Latrape. Nine firefighters. A vet. The pound.",
        "Latrape, near Cazères, Tuesday 14 September. Impasse de Sardi. A stray billy, aggressive. The resident locked himself in. La Dépêche, 15 September.",
        [
          "La Dépêche du Midi, 15 September 2026: in Latrape, in the Volvestre south of Toulouse, a stray billy goat walked into a property on impasse de Sardi on Tuesday 14 in the morning. The resident, the paper says, ended up stuck inside: the animal was aggressive, with horns. He called the fire service. La Dépêche called it ‘a very original hostage-taking.’ We keep the phrase. We do not invent a first name: the paper does not give one.",
          "Haute-Garonne firefighters sent five vehicles and nine sapeurs-pompiers, including animal-risk specialists. They moved the goat first so the man could leave. A firefighter veterinarian then sedated it. A few minutes. Then SACPA, the animal-control pound, took it. La Dépêche: it is not established whether the billy belongs to a farmer nearby, nor how it landed there.",
          "YES IT'S REAL read La Dépêche. Named commune. Named lane. Named headcount. We do not name the resident; the paper didn’t. Cover is a farmyard billy — Commons, clear licence — not the animal on impasse de Sardi.",
        ],
        [
          "The hostage-taking had horns.",
          "Nine firefighters for one ruminant.",
          "SACPA now has a goat. The man has his door.",
        ],
        "La Dépêche du Midi, 15 Sept 2026. Events of 14 Sept in Latrape (31). SACPA. No personal names in the originating copy.",
      ),
      fr: c(
        "Un bouc le séquestre dans sa maison à Latrape. Neuf pompiers, un véto, la fourrière.",
        "Latrape, près de Cazères, mardi 14 septembre. Impasse de Sardi. Un bouc en divagation, agressif. L’habitant s’enferme. La Dépêche, 15 septembre.",
        [
          "La Dépêche du Midi, 15 septembre 2026 : à Latrape, dans le Volvestre, au sud de Toulouse, un bouc en divagation s’introduit dans une propriété, impasse de Sardi, le mardi 14 au matin. L’habitant, dit le journal, se retrouve bloqué chez lui : l’animal est agressif, armé de cornes. Il prévient les secours. La Dépêche appelle ça « une prise d’otage très originale ». On reprend le mot. On n’invente pas de prénom : le journal n’en donne pas.",
          "Les sapeurs-pompiers de Haute-Garonne engagent cinq véhicules et neuf hommes, dont des spécialistes du risque animalier. Ils déplacent d’abord le bouc, pour que l’homme puisse sortir. Un vétérinaire sapeur-pompier sédate l’animal. Quelques minutes. Puis la SACPA, la fourrière, le prend en charge. La Dépêche : on ne sait pas s’il appartient à un agriculteur du secteur, ni comment il a atterri là.",
          "YES IT'S REAL a lu La Dépêche. Commune nommée. Impasse nommée. Effectif nommé. On ne nomme pas l’habitant ; le journal non plus. La couverture, un bouc de ferme — Commons, licence claire — pas l’animal de l’impasse de Sardi.",
        ],
        [
          "La prise d’otage a des cornes.",
          "Neuf pompiers pour un ruminant.",
          "La SACPA a maintenant un bouc. L’habitant a sa porte.",
        ],
        "La Dépêche du Midi, 15 sept. 2026. Faits du 14 sept. à Latrape (31). SACPA. Aucun nom de personne dans le papier d’origine.",
      ),
    },
  }),
];

export const REVUE_HOLD_IDS = REVUE_STORIES.map((s) => s.id);
