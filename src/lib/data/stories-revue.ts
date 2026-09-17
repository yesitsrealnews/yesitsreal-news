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

  revue({
    id: "s141",
    slug: "brussels-flemish-mp-stuck-13-hours-parliament-toilet-lock",
    slugs: {
      fr: "bruxelles-depute-flamand-coince-13-heures-toilettes-parlement",
    },
    section: "politics",
    countryCode: "BE",
    countryName: "Belgium",
    location: "Brussels, Flemish Parliament",
    dumbness: 9,
    sources: [
      src(
        "Far-right MP freed after being stuck in Flemish Parliament toilet for 13 hours",
        "The Brussels Times",
        "https://www.brusselstimes.com/2319603/far-right-mp-taken-to-hospital-after-being-stuck-for-13-hours-in-parliament-toilet",
        "2026-09-16",
        "wire",
      ),
      src(
        "« J’ai dû jouer les MacGyver » : coincé dans les toilettes du Parlement flamand pendant 13 heures",
        "Sudinfo",
        "https://www.sudinfo.be/id1194477/article/2026-09-16/jai-du-jouer-les-macgyver-coince-dans-les-toilettes-du-parlement-flamand-pendant",
        "2026-09-16",
        "local",
      ),
      src(
        "Un député flamand reste enfermé 13 heures dans les toilettes du Parlement",
        "La Libre",
        "https://www.lalibre.be/belgique/politique-belge/2026/09/16/un-depute-flamand-reste-enferme-13-heures-dans-les-toilettes-du-parlement-7HHHM2TK7NH2LACWVKDUIFHZMU/",
        "2026-09-16",
        "local",
      ),
      src(
        "Un député passe 13 heures enfermé dans les toilettes",
        "L'Indépendant",
        "https://www.lindependant.fr/2026/09/16/un-depute-passe-13-heures-enferme-dans-les-toilettes-prive-dair-il-doit-etre-hospitalise-le-lendemain-matin-13553775.php",
        "2026-09-16",
        "wire",
      ),
    ],
    publishedAt: "2026-09-17T09:00:00.000Z",
    originalLang: "nl",
    confidence: 0.95,
    entities: ["Frédéric Erens", "Vlaams Parlement", "Hôpital Saint-Jean"],
    copy: {
      en: c(
        "The lock jammed. The MP spent 13 hours in a Flemish Parliament toilet. He drilled two holes for air.",
        "Tuesday 15 September, after a meeting. No phone. Motion-sensor ventilation. Crowbar at 6 a.m. Brussels Times, Sudinfo, La Libre, L'Indépendant.",
        [
          "The Brussels Times (16 September), Sudinfo, La Libre and L'Indépendant, after HLN / VTM Nieuws: Frédéric Erens, 58, Vlaams Belang MP for Flemish Brabant, went to the toilet after a meeting at the Flemish Parliament in Brussels on Tuesday 15 September. The lock jammed. He had left his phone. He shouted. He knocked. The night security round did not find him.",
          "Sudinfo, quoting Het Nieuwsblad: the toilet ventilation runs on a motion sensor, so the air stopped. Erens told HLN, as La Libre prints it: ‘I had to play MacGyver. With a metal object I found in the toilets, I made two holes in the door, one at the top and one at the bottom, so oxygen could come in.’ A cleaner found him around 6 a.m. Wednesday. The door would not open from outside. Military police used a crowbar. He was taken to Saint-Jean hospital in Brussels; L'Indépendant says he was light-headed, then better in the open air.",
          "YES IT'S REAL crossed The Brussels Times, Sudinfo, La Libre and L'Indépendant. Named MP. Named parliament. Named hospital. We do not invent a lock brand. Cover is the Flemish Parliament chamber — Commons, clear licence — not the cubicle.",
        ],
        [
          "The meeting ended. The lock did not.",
          "Thirteen hours. Two holes. One crowbar.",
          "Belgium still legislates behind a door that sometimes stays shut.",
        ],
        "Brussels Times + Sudinfo + La Libre + L'Indépendant, 16 Sept 2026, after HLN / VTM / Het Nieuwsblad. Events of 15–16 Sept. Erens named. No invented quotes.",
      ),
      fr: c(
        "La serrure bloque. Le député passe 13 heures aux toilettes du Parlement flamand. Il perce deux trous pour l’air.",
        "Mardi 15 septembre, après une réunion. Pas de téléphone. Ventilation à détecteur. Pied-de-biche à 6 h. The Brussels Times, Sudinfo, La Libre, L'Indépendant.",
        [
          "The Brussels Times (16 septembre), Sudinfo, La Libre et L'Indépendant, d’après HLN / VTM Nieuws : Frédéric Erens, 58 ans, député Vlaams Belang du Brabant flamand, passe aux toilettes du Parlement flamand, à Bruxelles, après une réunion, le mardi 15 septembre. La serrure se bloque. Il n’a pas son téléphone. Il crie. Il frappe. La ronde de sécurité ne le trouve pas.",
          "Sudinfo, d’après Het Nieuwsblad : la ventilation des toilettes ne tourne que s’il y a du mouvement. La nuit, l’air s’arrête. Erens dit à HLN, tel que La Libre le reprend : « J’ai dû jouer les MacGyver. Avec un objet métallique que j’ai trouvé dans les toilettes, j’ai fait deux trous dans la porte, un en haut et un en bas, afin de faire entrer de l’oxygène. » Une employée du nettoyage le trouve vers 6 h, mercredi. La porte ne s’ouvre pas de l’extérieur. La police militaire sort un pied-de-biche. On l’emmène à l’hôpital Saint-Jean, à Bruxelles. L'Indépendant : il était étourdi ; ça va mieux à l’air.",
          "YES IT'S REAL a croisé The Brussels Times, Sudinfo, La Libre et L'Indépendant. Député nommé. Parlement nommé. Hôpital nommé. On n’invente pas une marque de serrure. La couverture, l’hémicycle du Parlement flamand — Commons, licence claire — pas la cabine.",
        ],
        [
          "La réunion est finie. La serrure, non.",
          "Treize heures. Deux trous. Un pied-de-biche.",
          "La Belgique légifère encore derrière une porte qui, parfois, reste fermée.",
        ],
        "Brussels Times + Sudinfo + La Libre + L'Indépendant, 16 sept. 2026, d’après HLN / VTM / Het Nieuwsblad. Faits des 15–16 sept. Erens nommé. Aucune citation inventée.",
      ),
    },
  }),

  revue({
    id: "s142",
    slug: "san-diego-golden-retriever-nash-brings-toys-to-burglar",
    slugs: {
      fr: "san-diego-le-golden-retriever-apporte-ses-jouets-au-cambrioleur",
    },
    section: "animals",
    countryCode: "US",
    countryName: "United States",
    location: "Sherman Heights, San Diego",
    dumbness: 9,
    sources: [
      src(
        "‘Guard dog’ Nash greets burglars with a toy inside San Diego house",
        "FOX 5 San Diego",
        "https://fox5sandiego.com/news/san-diego-burglary-ring-camera/",
        "2026-09-16",
        "local",
      ),
      src(
        "Watch golden retriever beg to play with intruder in San Diego break-in",
        "Los Angeles Times",
        "https://www.latimes.com/california/story/2026-09-16/golden-retriever-begs-to-play-with-intruder-in-san-diego-break-in",
        "2026-09-16",
        "wire",
      ),
      src(
        "Golden Retriever brings toys to intruder during San Diego home break-in",
        "New York Post",
        "https://nypost.com/2026/09/16/us-news/golden-retriever-brings-toys-to-intruder-during-san-diego-home-break-in/",
        "2026-09-16",
        "wire",
      ),
    ],
    publishedAt: "2026-09-17T09:10:00.000Z",
    originalLang: "en",
    confidence: 0.94,
    entities: ["Nash", "Dante Rowley", "Sherman Heights", "San Diego Police"],
    copy: {
      en: c(
        "The burglar ate the yogurt. The golden retriever brought him toys. Then he tried the police.",
        "Sherman Heights, San Diego. Open upstairs window. A ladder. Nash, four, 90 lb. FOX 5, Los Angeles Times, New York Post, 16 September.",
        [
          "FOX 5 San Diego (Zara Barker, 16 September 2026), the Los Angeles Times (Grace Toohey) and the New York Post: Dante Rowley and his fiancée were away when a man climbed a ladder to an open second-floor window of their house in Sherman Heights, near 20th and J. Ring cameras. FOX 5: he took off his shoes and his shirt, sat in the foyer, ate yogurt, turkey and cheese from the fridge, then had a nap. Rowley, to FOX 5: he said something like ‘Oh, that’s good, maybe there’s more.’",
          "Nash, a four-year-old golden retriever, kept coming back with a toy. The Times: another dog went out the dog flap. Rowley, to FOX 5: ‘Nash is not the greatest guard dog.’ He watched from a plane, texted San Diego police, and opened the Ring app for them. Officers sent a drone in, then came in. Nash offered them a toy too. FOX 5 names John Cline, 57, arrested on suspicion of first-degree burglary. The Times, the same day, does not name him.",
          "YES IT'S REAL crossed FOX 5, the Times and the Post. Named street. Named dog. Named owner. We take the suspect’s name as FOX 5 printed it, not further. Cover is two goldens with a toy — Commons CC — not Nash.",
        ],
        [
          "The job was fetch. The visitor was not.",
          "Yogurt, turkey, cheese, a nap. Then the dog again.",
          "San Diego still staffs some houses with a welcoming committee.",
        ],
        "FOX 5 San Diego + LA Times + NY Post, 16 Sept 2026. Nash / Dante Rowley named. Suspect named only as FOX 5 named him.",
      ),
      fr: c(
        "Le cambrioleur mange le yaourt. Le golden retriever lui apporte ses jouets. Puis il s’y prend avec la police.",
        "Sherman Heights, San Diego. Fenêtre ouverte à l’étage. Une échelle. Nash, quatre ans, 40 kg. FOX 5, Los Angeles Times, New York Post, 16 septembre.",
        [
          "FOX 5 San Diego (Zara Barker, 16 septembre 2026), le Los Angeles Times (Grace Toohey) et le New York Post : Dante Rowley et sa fiancée sont absents quand un homme pose une échelle sous une fenêtre ouverte, à l’étage, dans leur maison de Sherman Heights, vers 20th et J. Caméras Ring. FOX 5 : il enlève ses chaussures et sa chemise, s’assoit dans l’entrée, mange du yaourt, de la dinde et du fromage dans le frigo, puis fait un somme. Rowley, à FOX 5 : le type a dit à peu près « Oh, that’s good, maybe there’s more. »",
          "Nash, golden retriever de quatre ans, revient avec un jouet. Le Times : l’autre chien passe par la chatière. Rowley, à FOX 5 : « Nash is not the greatest guard dog. » Il suit ça depuis l’avion, écrit à la police de San Diego, leur ouvre l’appli Ring. Les agents envoient un drone, puis entrent. Nash leur tend aussi un jouet. FOX 5 nomme John Cline, 57 ans, arrêté pour suspicion de cambriolage au premier degré. Le Times, le même jour, ne le nomme pas.",
          "YES IT'S REAL a croisé FOX 5, le Times et le Post. Rue nommée. Chien nommé. Propriétaire nommé. Le nom du suspect, on le prend tel que FOX 5 l’a imprimé, pas plus. La couverture, deux golden retrievers avec un jouet — Commons, licence claire — pas Nash.",
        ],
        [
          "La mission, c’était rapporter le jouet. Le visiteur, non.",
          "Yaourt, dinde, fromage, un somme. Puis le chien, encore.",
          "San Diego équipe encore certaines maisons d’un comité d’accueil.",
        ],
        "FOX 5 San Diego + LA Times + NY Post, 16 sept. 2026. Nash / Dante Rowley nommés. Suspect nommé seulement comme FOX 5 l’a nommé.",
      ),
    },
  }),

  revue({
    id: "s143",
    slug: "gray-haute-saone-caiman-python-boas-seized-from-flat",
    slugs: {
      fr: "gray-haute-saone-caiman-python-boas-saisis-dans-un-appartement",
    },
    section: "animals",
    countryCode: "FR",
    countryName: "France",
    location: "Gray, Haute-Saône",
    dumbness: 8,
    sources: [
      src(
        "En Haute-Saône, ce couple détenait sans « aucune qualification » dix reptiles dont un python royal et plusieurs boas",
        "Le Figaro",
        "https://www.lefigaro.fr/animaux/en-haute-saone-ce-couple-detenait-sans-aucune-qualification-dix-reptiles-dont-un-python-royal-et-plusieurs-boas-20260908",
        "2026-09-08",
        "wire",
      ),
      src(
        "Un couple détenait illégalement un caïman, un python et des boas à son domicile : les gendarmes saisissent onze animaux",
        "Charente Libre",
        "https://www.charentelibre.fr/societe/un-couple-detenait-illegalement-un-caiman-un-python-et-des-boas-a-son-domicile-les-gendarmes-saisissent-onze-animaux-30534110.php",
        "2026-09-08",
        "local",
      ),
      src(
        "Un python royal, des boas constricteurs ou encore un caïman à lunettes saisis par les gendarmes à Gray",
        "ICI",
        "https://www.ici.fr/bourgogne-franche-comte/haute-saone-70/gray/un-python-royal-des-boas-constricteurs-ou-encore-un-caiman-a-lunettes-saisis-par-les-gendarmes-a-gray-en-haute-saone-6853144",
        "2026-09-08",
        "local",
      ),
    ],
    publishedAt: "2026-09-17T09:20:00.000Z",
    originalLang: "fr",
    confidence: 0.96,
    entities: ["Gray", "OFB", "gendarmerie de Haute-Saône", "refuge de Kaa"],
    copy: {
      en: c(
        "A caiman in the flat. A royal python. Three boas. An iguana. Gray, Haute-Saône. No papers.",
        "Search, Thursday 3 September, 7.30 a.m. Gendarmes and OFB. SPA tip in April. Figaro, Charente Libre, ICI, 8 September.",
        [
          "Le Figaro (AFP), Charente Libre and ICI, 8 September 2026, quoting the Haute-Saône gendarmerie: on Thursday 3 September at 7.30 a.m., gendarmes and the French biodiversity office (OFB) searched a couple’s home in Gray, a town of about 5,000, fifty kilometres from Besançon. They took ‘a spectacled caiman, a green iguana, two tegus, two “tortues d’estampe”, three boa constrictors and a royal python, plus a rodent (a prairie dog)’, all held illegally. The pair are not named.",
          "The gendarmerie: the couple had bought animals that need a declaration, ‘with no qualification to keep these species’. Squadron chief Nicolas Guillemin told AFP, as ICI reports: the animals were ‘a bit everywhere in the flat, in vivariums and cages’. Most reptiles went to the Kaa refuge in Barlin (Pas-de-Calais). The prairie dog went to Parc Sainte-Croix in Rhodes (Moselle). The Vesoul prosecutor had opened a preliminary inquiry after an SPA report in April 2026. Interviews later.",
          "YES IT'S REAL crossed AFP / Le Figaro, Charente Libre and ICI. Named town. Named agencies. Named shelters. We do not name the couple; the gendarmerie did not. Cover is a spectacled caiman — Commons, public domain — not the animal in Gray.",
        ],
        [
          "The flat had a caiman. The file did not.",
          "Eleven animals. Zero papers. One prairie dog, for the road.",
          "France still finds the equator in Haute-Saône, behind a door.",
        ],
        "Figaro (AFP) + Charente Libre + ICI, 8 Sept 2026. Search of 3 Sept in Gray (70). Couple unnamed. Inventory as the gendarmerie listed it.",
      ),
      fr: c(
        "Un caïman dans l’appart. Un python royal. Trois boas. Un iguane. Gray, Haute-Saône. Aucun papier.",
        "Perquisition, jeudi 3 septembre, 7 h 30. Gendarmes et OFB. Signalement SPA en avril. Le Figaro, Charente Libre, ICI, 8 septembre.",
        [
          "Le Figaro (AFP), Charente Libre et ICI, 8 septembre 2026, d’après la gendarmerie de Haute-Saône : jeudi 3 septembre, 7 h 30, les gendarmes et l’Office français de la biodiversité (OFB) perquisitionnent le domicile d’un couple à Gray, 5 000 habitants, à une cinquantaine de kilomètres de Besançon. Ils saisissent « un caïman à lunettes, un iguane vert, deux tégus, deux tortues d’estampe, trois boas constricteurs et un python royal, ainsi qu’un rongeur (chien de prairie) », détenus illégalement. Le couple n’est pas nommé.",
          "La gendarmerie : le couple a acquis des reptiles soumis à déclaration, « ne disposant d’aucune qualification pour détenir ces espèces ». Le chef d’escadron Nicolas Guillemin, à l’AFP, tel qu’ICI le reprend : les animaux étaient « un peu partout dans l’appartement, dans des vivariums et des cages ». La plupart des reptiles partent au refuge de Kaa, à Barlin (Pas-de-Calais). Le chien de prairie, au parc Sainte-Croix, à Rhodes (Moselle). Le parquet de Vesoul avait ouvert une enquête préliminaire après un signalement de la SPA, en avril 2026. Audition plus tard.",
          "YES IT'S REAL a croisé AFP / Le Figaro, Charente Libre et ICI. Ville nommée. Services nommés. Refuges nommés. On ne nomme pas le couple ; la gendarmerie non plus. La couverture, un caïman à lunettes — Commons, domaine public — pas l’animal de Gray.",
        ],
        [
          "L’appart avait un caïman. Le dossier, non.",
          "Onze bêtes. Zéro papier. Un chien de prairie, pour la route.",
          "La France trouve encore l’équateur en Haute-Saône, derrière une porte.",
        ],
        "Figaro (AFP) + Charente Libre + ICI, 8 sept. 2026. Perquisition du 3 sept. à Gray (70). Couple non nommé. Inventaire tel que la gendarmerie l’a listé.",
      ),
    },
  }),

  revue({
    id: "s144",
    slug: "kirkland-911-burglar-bobcat-on-the-stairs-drone",
    slugs: {
      fr: "kirkland-il-appelle-le-911-pour-un-cambrioleur-cest-un-lynx-roux",
    },
    section: "animals",
    countryCode: "US",
    countryName: "United States",
    location: "Kirkland, Washington",
    dumbness: 9,
    sources: [
      src(
        "Police bust ‘cat burglar’ bobcat, caught on video in Kirkland home",
        "The Seattle Times",
        "https://www.seattletimes.com/seattle-news/law-justice/police-bust-cat-burglar-bobcat-caught-on-video-in-kirkland-home/",
        "2026-09-02",
        "local",
      ),
      src(
        "Cat Burglar: Bobcat breaks into Kirkland, WA home after climbing tree",
        "FOX 13 Seattle",
        "https://www.fox13seattle.com/news/bobcat-kirkland-wa",
        "2026-09-01",
        "local",
      ),
      src(
        "Washington homeowner hears banging, calls 911 before police find growling bobcat at top of stairs",
        "Fox News",
        "https://www.foxnews.com/us/washington-homeowner-hears-mysterious-banging-calls-911-police-find-growling-bobcat-top-stairs",
        "2026-09-02",
        "wire",
      ),
    ],
    publishedAt: "2026-09-17T09:30:00.000Z",
    originalLang: "en",
    confidence: 0.95,
    entities: ["Kirkland Police", "Moss Bay", "Officer Brian Farman", "Forbes Creek"],
    copy: {
      en: c(
        "He called 911 for a burglar. At the top of the stairs: a bobcat. The police flew a drone indoors.",
        "Moss Bay, Kirkland, Washington. Open window, a tree, a house cat. No injuries. Seattle Times, FOX 13, Fox News.",
        [
          "The Seattle Times (2 September 2026), FOX 13 Seattle (1 September) and Fox News, after the Kirkland Police Department: a resident in the Moss Bay neighbourhood heard banging, thought of a break-in, and called 911. Officers found a bobcat at the top of the stairs. The Times names Officer Brian Farman. Police: the animal had probably climbed a tree and gone through an open window, ‘possibly drawn inside by the resident’s cat.’ The house cat was unharmed. Nobody was hurt — not the owner, not the officers, not the bobcat.",
          "To keep a distance, officers flew an unmanned aircraft inside the house and herded the animal into a room. Washington Department of Fish and Wildlife arrived, sedated it, and released it near Forbes Creek, close to where it had been found. Kirkland police posted the drone video and called it a ‘cat burglar.’ The papers kept the phrase. We keep it too.",
          "YES IT'S REAL crossed the Seattle Times, FOX 13 and Fox News. Named neighbourhood. Named officer. Named creek. We do not name the resident; the police did not. Cover is a bobcat — Commons CC — not the one on the landing.",
        ],
        [
          "The burglar had tufted ears.",
          "A drone in the hallway. A cat on the stairs. A cat in the house, still.",
          "Kirkland still sends wildlife calls to people with a badge.",
        ],
        "Seattle Times 2 Sept ; FOX 13 1 Sept ; Fox News 2 Sept 2026. Kirkland PD. Moss Bay. No injuries. Resident unnamed.",
      ),
      fr: c(
        "Il appelle le 911 pour un cambrioleur. En haut de l’escalier : un lynx roux. La police sort le drone, dans le salon.",
        "Moss Bay, Kirkland, Washington. Fenêtre ouverte, un arbre, un chat de maison. Personne n’est blessé. Seattle Times, FOX 13, Fox News.",
        [
          "The Seattle Times (2 septembre 2026), FOX 13 Seattle (1er septembre) et Fox News, d’après la police de Kirkland : un habitant du quartier de Moss Bay entend du bruit, pense à une intrusion, compose le 911. Les agents trouvent un lynx roux en haut de l’escalier. Le Times nomme l’officer Brian Farman. La police : l’animal a probablement grimpé à un arbre et est passé par une fenêtre ouverte, « possibly drawn inside by the resident’s cat ». Le chat de la maison est indemne. Personne n’est blessé — ni le propriétaire, ni les agents, ni le lynx.",
          "Pour garder la distance, les agents font voler un drone dans la maison et rabattent l’animal dans une pièce. Le Washington Department of Fish and Wildlife arrive, le sédate, le relâche près de Forbes Creek, à deux pas de là où on l’a trouvé. La police de Kirkland poste la vidéo du drone et parle d’un « cat burglar ». Les journaux gardent le mot. Nous aussi.",
          "YES IT'S REAL a croisé le Seattle Times, FOX 13 et Fox News. Quartier nommé. Agent nommé. Ruisseau nommé. On ne nomme pas l’habitant ; la police non plus. La couverture, un lynx roux — Commons, licence claire — pas celui du palier.",
        ],
        [
          "Le cambrioleur avait des pinceaux aux oreilles.",
          "Un drone dans le couloir. Un félin dans l’escalier. Un chat dans la maison, toujours.",
          "Kirkland envoie encore les appels animaliers à des gens avec un badge.",
        ],
        "Seattle Times 2 sept. ; FOX 13 1er sept. ; Fox News 2 sept. 2026. Police de Kirkland. Moss Bay. Aucun blessé. Habitant non nommé.",
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
