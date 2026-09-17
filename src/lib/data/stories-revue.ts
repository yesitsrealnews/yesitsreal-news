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

  revue({
    id: "s145",
    slug: "riom-pizza-vending-machine-heist-zero-cash",
    slugs: {
      fr: "riom-casse-du-distributeur-de-pizzas-zero-espece",
    },
    section: "faits-divers",
    countryCode: "FR",
    countryName: "France",
    location: "Riom, Puy-de-Dôme",
    dumbness: 9,
    sources: [
      src(
        "La vidéo gag d’une attaque de distributeur de pizzas en Auvergne fait un carton : « C’est presque triste d’en arriver là »",
        "Le Parisien",
        "https://www.leparisien.fr/puy-de-dome-63/la-video-gag-dune-attaque-de-distributeur-de-pizzas-en-auvergne-fait-un-carton-cest-presque-triste-den-arriver-la-03-09-2026-QOXA4YDOGRF5NCKWRVZ67ZU52E.php",
        "2026-09-03",
        "local",
      ),
      src(
        "« On dirait une parodie » : Quand la vidéo d’un casse raté au distributeur de pizzas devient virale",
        "20 Minutes",
        "https://www.20minutes.fr/arts-stars/insolite/4242310-20260902-dirait-parodie-quand-video-casse-rate-distributeur-pizzas-devient-virale",
        "2026-09-02",
        "wire",
      ),
      src(
        "Ils ratent le casse d’un distributeur de pizzas : le gérant se moque, la vidéo fait le buzz",
        "Le Dauphiné Libéré",
        "https://www.ledauphine.com/faits-divers-justice/2026/09/01/ils-ratent-le-casse-d-un-distributeur-de-pizzas-le-gerant-se-moque-la-video-fait-le-buzz",
        "2026-09-01",
        "local",
      ),
      src(
        "VIDÉO. Les champions du jour : la tentative de braquage d’un distributeur de pizzas devient une succession de gags",
        "Centre Presse Aveyron",
        "https://www.centrepresseaveyron.fr/2026/09/03/video-les-champions-du-jour-la-tentative-de-braquage-dun-distributeur-de-pizzas-devient-une-succession-de-gags-le-gerant-publie-la-video-qui-devient-13532305.php",
        "2026-09-03",
        "local",
      ),
    ],
    publishedAt: "2026-09-17T18:00:00.000Z",
    originalLang: "fr",
    confidence: 0.96,
    entities: ["Henri Pizza", "Riom", "Instagram henri.pizza_riom"],
    copy: {
      en: c(
        "Three men crowbar a pizza vending machine in Riom, ram it with a car, leave with nothing. Card only. It said so on the front.",
        "Henri Pizza, Riom, Puy-de-Dôme. Video posted 29 August. Le Parisien, 20 Minutes, Le Dauphiné, Centre Presse. About €1,000 in damage. Zero cash.",
        [
          "Le Parisien (Alix Vermande, 3 September 2026), 20 Minutes (2 September), Le Dauphiné (1 September) and Centre Presse Aveyron: three masked men attack an Henri Pizza vending machine in Riom. Crowbar first. One of them hits his accomplice on the head. Another sits down hard, then rubs his skull through the balaclava. They switch to a ram-car. Le Parisien calls it an old Clio; Centre Presse, a Peugeot 106. We keep both. The door gives. Inside: no cash. Card payments only. The front of the machine said so.",
          "The co-manager posted the CCTV on Instagram on Saturday 29 August, under henri.pizza_riom. He wrote, as Le Dauphiné quotes: ‘Tu viens cambrioler notre distributeur de pizzas… mais tu assommes ton collègue ! Ça démarre bien.’ Centre Presse: ‘À votre avis, combien ont-ils dérobé ? Zéro euro.’ About a thousand euros of damage. The machine was repaired. Nobody is named. Nobody is charged in the copy we have.",
          "YES IT'S REAL crossed Le Parisien, 20 Minutes, Le Dauphiné and Centre Presse. Named shop. Named town. Named method. We do not invent a registration plate. Cover is a pizza — Commons CC — not the wrecked cabinet in Riom.",
        ],
        [
          "The front of the machine had already answered.",
          "A crowbar, a hatchback, three balaclavas. Zero euros.",
          "Auvergne still sells pizza at a kiosk that does not keep a till.",
        ],
        "Le Parisien 3 Sept (Alix Vermande); 20 Minutes 2 Sept; Le Dauphiné 1 Sept; Centre Presse 3 Sept 2026. Clio vs 106: both papers kept. Suspects unnamed.",
      ),
      fr: c(
        "Trois hommes ouvrent un distributeur de pizzas à Riom, à coups de pied-de-biche puis de voiture. Dedans : zéro. C’était écrit.",
        "Henri Pizza, Riom, Puy-de-Dôme. Vidéo postée le 29 août. Le Parisien, 20 Minutes, Le Dauphiné, Centre Presse. Un millier d’euros de dégâts. Pas une pièce.",
        [
          "Le Parisien (Alix Vermande, 3 septembre 2026), 20 Minutes (2 septembre), Le Dauphiné (1er septembre) et Centre Presse Aveyron : trois hommes cagoulés s’en prennent à un distributeur Henri Pizza, à Riom. D’abord le pied-de-biche. L’un d’eux envoie l’outil sur le crâne du complice. Un autre s’asseoit par terre, se masse la tête à travers la cagoule. Ils passent à la voiture-bélier. Le Parisien parle d’une vieille Clio ; Centre Presse, d’une Peugeot 106. On garde les deux. La porte cède. Dedans : pas d’espèces. Carte seulement. C’était écrit sur la façade.",
          "Le cogérant poste la vidéosurveillance sur Instagram le samedi 29 août, compte henri.pizza_riom. Il écrit, tel que Le Dauphiné le reprend : « Tu viens cambrioler notre distributeur de pizzas… mais tu assommes ton collègue ! Ça démarre bien. » Centre Presse : « À votre avis, combien ont-ils dérobé ? Zéro euro. » Un millier d’euros de dégâts. La machine a été réparée. Personne n’est nommé. Personne n’est mis en cause dans les papiers que nous avons.",
          "YES IT'S REAL a croisé Le Parisien, 20 Minutes, Le Dauphiné et Centre Presse. Enseigne nommée. Ville nommée. Méthode nommée. On n’invente pas une plaque. La couverture, une pizza — Commons, licence claire — pas l’armoire cabossée de Riom.",
        ],
        [
          "La façade avait déjà répondu.",
          "Un pied-de-biche, une citadine, trois cagoules. Zéro euro.",
          "L’Auvergne vend encore la pizza dans un kiosque qui n’a pas de caisse.",
        ],
        "Le Parisien 3 sept. (Alix Vermande) ; 20 Minutes 2 sept. ; Le Dauphiné 1er sept. ; Centre Presse 3 sept. 2026. Clio ou 106 : les deux journaux. Suspects non nommés.",
      ),
    },
  }),

  revue({
    id: "s146",
    slug: "cleveland-city-council-renames-lake-erie-gulf-of-cleveland",
    slugs: {
      fr: "cleveland-le-conseil-municipal-rebaptise-le-lac-erie-golfe-de-cleveland",
    },
    section: "politics",
    countryCode: "US",
    countryName: "United States",
    location: "Cleveland, Ohio",
    dumbness: 8,
    sources: [
      src(
        "Ohio city council joins the renaming trend with ‘Gulf of Cleveland’",
        "NBC News",
        "https://www.nbcnews.com/politics/donald-trump/ohio-city-council-lake-erie-gulf-of-cleveland-trump-rcna597902",
        "2026-09-15",
        "wire",
      ),
      src(
        "Resolution passed to rename portion of Lake Erie ‘The Gulf of Cleveland’",
        "FOX 8 Cleveland",
        "https://fox8.com/news/resolution-passed-to-rename-portion-of-lake-erie-the-gulf-of-cleveland/",
        "2026-09-16",
        "local",
      ),
      src(
        "Official Who Filed To Rename Lake Erie Admits It’s ‘Shockingly Dumb’",
        "Newsweek",
        "https://www.newsweek.com/official-filed-rename-lake-erie-admits-shockingly-dumb-12448656",
        "2026-09-16",
        "wire",
      ),
      src(
        "Cleveland City Council passes resolution renaming portion of Lake Erie ‘Gulf Of Cleveland’",
        "Cleveland 19 / WOIO",
        "https://www.cleveland19.com/2026/09/15/cleveland-city-council-passes-resolution-renaming-portion-lake-erie-gulf-cleveland/",
        "2026-09-15",
        "local",
      ),
    ],
    publishedAt: "2026-09-17T18:10:00.000Z",
    originalLang: "fr",
    confidence: 0.95,
    entities: ["Kris Harsh", "Cleveland City Council", "Resolution 1047-2026", "Lake Erie"],
    copy: {
      en: c(
        "Cleveland City Council renamed two miles of Lake Erie the Gulf of Cleveland. 13–1. The sponsor told Newsweek: shockingly dumb. That’s the point.",
        "Monday 14 September 2026. Resolution 1047-2026. Councilman Kris Harsh. NBC, FOX 8, Newsweek, WOIO. Not binding. They still want Apple and Google to print it.",
        [
          "NBC News (Megan Brand, 15 September), FOX 8 (Tino Bovenzi, 16 September), Newsweek and WOIO Cleveland 19: Cleveland City Council passed resolution 1047-2026 on Monday 14 September, 13 votes to 1. It ‘renames the area of Lake Erie from the easternmost and westernmost points of its shoreline and two miles into Lake Erie from its shoreline as the Gulf of Cleveland.’ FOX 8 prints the sentence. The clerk is to tell Apple and Google.",
          "Councilman Kris Harsh, the sponsor, told Newsweek: ‘It’s shockingly dumb. And that’s the point.’ NBC: no force of law. WOIO: city maps and documents are to use the new name anyway. Harsh told the chamber he had made a map. ‘This is all it takes. It’s now the Gulf of Cleveland.’ The Pennsylvania idea of a ‘Lake Pennsylvania’ is in the same meeting, as FOX 8 and NBC report it. We leave the White House where it is. The paper is a lake that became a gulf, on a vote.",
          "YES IT'S REAL crossed NBC, FOX 8, Newsweek and WOIO. Named council. Named resolution. Named councillor. Cover is Lake Erie — Commons CC — not a new sea.",
        ],
        [
          "Two miles. A gulf. A show of hands.",
          "The sponsor said it was dumb. The clerk is writing to Cupertino.",
          "Ohio still names water the way other people name products.",
        ],
        "NBC 15 Sept (Megan Brand); FOX 8 16 Sept (Tino Bovenzi); Newsweek 16 Sept; WOIO 15 Sept 2026. Resolution 1047-2026. 13–1. Kris Harsh named.",
      ),
      fr: c(
        "Cleveland vote : deux milles du lac Érié s’appellent désormais le golfe de Cleveland. 13 voix contre 1. L’élu, à Newsweek : « shockingly dumb ». C’est le but.",
        "Lundi 14 septembre 2026. Résolution 1047-2026. Conseiller Kris Harsh. NBC, FOX 8, Newsweek, WOIO. Pas de force de loi. Ils veulent quand même qu’Apple et Google l’écrivent.",
        [
          "NBC News (Megan Brand, 15 septembre), FOX 8 (Tino Bovenzi, 16 septembre), Newsweek et WOIO Cleveland 19 : le conseil municipal de Cleveland adopte la résolution 1047-2026 le lundi 14 septembre, 13 voix contre 1. Elle « renames the area of Lake Erie from the easternmost and westernmost points of its shoreline and two miles into Lake Erie from its shoreline as the Gulf of Cleveland ». FOX 8 imprime la phrase. Le greffier doit écrire à Apple et à Google.",
          "Le conseiller Kris Harsh, qui porte le texte, dit à Newsweek : « It’s shockingly dumb. And that’s the point. » NBC : pas de force de loi. WOIO : les cartes et les documents de la ville doivent quand même user du nouveau nom. Harsh, en séance, dit qu’il a fait une carte. « This is all it takes. It’s now the Gulf of Cleveland. » L’idée pennsylvanienne d’un « Lake Pennsylvania » est dans la même séance, tel que FOX 8 et NBC la rapportent. On laisse la Maison-Blanche où elle est. Le papier, c’est un lac devenu golfe, à main levée.",
          "YES IT'S REAL a croisé NBC, FOX 8, Newsweek et WOIO. Conseil nommé. Résolution nommée. Élu nommé. La couverture, le lac Érié — Commons, licence claire — pas une mer nouvelle.",
        ],
        [
          "Deux milles. Un golfe. Un vote.",
          "L’élu dit que c’est bête. Le greffier écrit à Cupertino.",
          "L’Ohio nomme encore l’eau comme d’autres nomment un produit.",
        ],
        "NBC 15 sept. (Megan Brand) ; FOX 8 16 sept. (Tino Bovenzi) ; Newsweek 16 sept. ; WOIO 15 sept. 2026. Résolution 1047-2026. 13–1. Kris Harsh nommé.",
      ),
    },
  }),

  revue({
    id: "s147",
    slug: "ig-nobel-2026-cockroach-milk-chemistry-zurich",
    slugs: {
      fr: "ig-nobel-2026-le-lait-de-cafard-a-le-prix-de-chimie",
    },
    section: "science",
    countryCode: "CH",
    countryName: "Switzerland",
    location: "Zurich",
    dumbness: 8,
    sources: [
      src(
        "2026 Ig Nobels honor cockroach milk, interspecies kissing, taunting venomous snakes, and more",
        "Scientific American",
        "https://www.scientificamerican.com/article/2026-ig-nobels-honor-cockroach-milk-interspecies-kissing-taunting-venomous-snakes-and-more/",
        "2026-09-04",
        "university",
      ),
      src(
        "Ig Nobel prize 2026: cockroach milk wins chemistry award at first ceremony outside the US",
        "Chemistry World",
        "https://www.chemistryworld.com/news/cockroaches-producing-energy-rich-milk-bag-this-years-chemistry-ig-nobel-prize/4024123.article",
        "2026-09-04",
        "university",
      ),
      src(
        "Studies on cockroach milk and nose-blowing crowned winners of this year’s Ig Nobel Prize",
        "The Independent",
        "https://www.independent.co.uk/news/science/ig-nobel-prize-cockroack-milk-nose-blowing-trump-b3044535.html",
        "2026-09-04",
        "wire",
      ),
      src(
        "Au menu des Nobel de la science improbable, l’art du mouchage, l’urinoir parfait et les amis vicieux",
        "Le Monde",
        "https://www.lemonde.fr/sciences/article/2026/09/03/au-menu-des-nobel-de-la-science-improbable-l-art-du-mouchage-l-urinoir-parfait-et-les-amis-vicieux_6765194_1650684.html",
        "2026-09-03",
        "wire",
      ),
    ],
    publishedAt: "2026-09-17T18:20:00.000Z",
    originalLang: "fr",
    confidence: 0.95,
    entities: [
      "Ig Nobel",
      "Diploptera punctata",
      "Leonard Chavas",
      "Subramanian Ramaswamy",
      "Marc Abrahams",
    ],
    copy: {
      en: c(
        "The 2026 Ig Nobel for chemistry went to cockroach milk. More than three times the energy of cow’s milk. Hats were worn.",
        "Zurich, Thursday 3 September. First ceremony outside the United States. Scientific American, Chemistry World, The Independent. Le Monde covered the move to Switzerland.",
        [
          "Scientific American (Adam Kovac, 4 September 2026), Chemistry World and The Independent: the chemistry Ig Nobel in Zurich on Thursday 3 September went to work on milk proteins from Diploptera punctata, the Pacific beetle cockroach, one of the few cockroaches that feeds live-born young on a crystalline ‘milk’. The papers: more than three times the energy of cow’s milk proteins. Chemistry World names Leonard Chavas, Subramanian Ramaswamy and Nathan Coussens on stage, in cockroach hats, singing.",
          "Le Monde (Pierre Barthélémy, 3 September) covered the ceremony’s exile: after thirty-five editions in Boston, Marc Abrahams took it to Zurich, at the polytechnic and the university, because, he told Le Monde, it had become dangerous for foreign guests to go to the United States. The paper lists other prizes of the night — nose-blowing, a splash-free urinal, vicious friends. We keep the chemistry one. We do not invent a supermarket carton.",
          "YES IT'S REAL crossed Scientific American, Chemistry World, The Independent and Le Monde. Named prize. Named species. Named hall. Cover is a cockroach — Commons CC — not a dairy aisle.",
        ],
        [
          "The chemistry prize was a roach.",
          "Three times the cow. A hat. A song.",
          "Science still files the larder under insects, once a year, in public.",
        ],
        "SciAm 4 Sept (Adam Kovac); Chemistry World 4 Sept; Independent 4 Sept; Le Monde 3 Sept 2026 (Pierre Barthélémy) for the Zurich move. Species: Diploptera punctata.",
      ),
      fr: c(
        "L’Ig Nobel de chimie 2026 est allé au lait de cafard. Plus de trois fois l’énergie du lait de vache. Ils avaient des chapeaux.",
        "Zurich, jeudi 3 septembre. Première cérémonie hors des États-Unis. Scientific American, Chemistry World, The Independent. Le Monde a suivi le déménagement.",
        [
          "Scientific American (Adam Kovac, 4 septembre 2026), Chemistry World et The Independent : l’Ig Nobel de chimie, à Zurich le jeudi 3 septembre, récompense un travail sur les protéines du « lait » de Diploptera punctata, le cafard du Pacifique, l’une des rares blattes qui nourrit ses petits nés vivants avec un lait cristallin. Les journaux : plus de trois fois l’énergie des protéines du lait de vache. Chemistry World nomme Leonard Chavas, Subramanian Ramaswamy et Nathan Coussens sur scène, en chapeaux cafard, en train de chanter.",
          "Le Monde (Pierre Barthélémy, 3 septembre) raconte l’exil de la cérémonie : après trente-cinq éditions à Boston, Marc Abrahams l’a emmenée à Zurich, à l’École polytechnique et à l’université, parce que, dit-il au Monde, il était devenu dangereux pour les invités étrangers de se rendre aux États-Unis. Le journal aligne d’autres prix de la soirée — le mouchage, l’urinoir sans éclaboussures, les amis vicieux. On garde la chimie. On n’invente pas une brique au rayon frais.",
          "YES IT'S REAL a croisé Scientific American, Chemistry World, The Independent et Le Monde. Prix nommé. Espèce nommée. Salle nommée. La couverture, un cafard — Commons, licence claire — pas un linéaire laitier.",
        ],
        [
          "Le prix de chimie, c’était une blatte.",
          "Trois fois la vache. Un chapeau. Une chanson.",
          "La science range encore le garde-manger aux insectes, une fois l’an, en public.",
        ],
        "SciAm 4 sept. (Adam Kovac) ; Chemistry World 4 sept. ; Independent 4 sept. ; Le Monde 3 sept. 2026 (Pierre Barthélémy) pour le déménagement à Zurich. Espèce : Diploptera punctata.",
      ),
    },
  }),

  revue({
    id: "s148",
    slug: "metropolitan-opera-boa-princess-auditions-cosi-fan-tutte",
    slugs: {
      fr: "met-opera-un-boa-nomme-princess-gagne-laudition-de-cosi-fan-tutte",
    },
    section: "stars",
    countryCode: "US",
    countryName: "United States",
    location: "New York",
    dumbness: 8,
    sources: [
      src(
        "Even snakes have to audition for the opera at the Met",
        "NBC New York / AP",
        "https://www.nbcnewyork.com/entertainment/entertainment-news/even-snakes-audition-opera-met/6544304/",
        "2026-09-05",
        "wire",
      ),
      src(
        "Photos show snakes auditioning for a role at New York’s Metropolitan Opera",
        "AP News",
        "https://apnews.com/photo-gallery/photos-show-snakes-auditioning-role-new-york-s-metropolitan-opera-243dd1411be147d6a5511e47845a8b8b",
        "2026-09-05",
        "wire",
      ),
      src(
        "At the Met, snakes have to audition for the opera",
        "Taipei Times / AP",
        "https://www.taipeitimes.com/News/world/archives/2026/09/07/2003863832",
        "2026-09-07",
        "wire",
      ),
    ],
    publishedAt: "2026-09-17T18:30:00.000Z",
    originalLang: "fr",
    confidence: 0.94,
    entities: ["Metropolitan Opera", "Princess", "Nala", "Zoe Ziegfeld", "Nancy Novograd", "Così fan tutte"],
    copy: {
      en: c(
        "At the Met, a boa constrictor named Princess won the audition. Nala is the understudy. Mozart, Coney Island, 1950s.",
        "Friday 28 August 2026, Metropolitan Opera, New York. Così fan tutte. AP, NBC New York, Taipei Times. Animal wrangler Nancy Novograd. Handler Zoe Ziegfeld.",
        [
          "AP (David R. Martin and Jeffrey Collins), as NBC New York ran it on 5 September 2026 and the Taipei Times on 7 September: at the Metropolitan Opera, snakes auditioned on Friday 28 August for a part in the house’s Coney Island 1950s take on Mozart’s Così fan tutte. Zoe Ziegfeld, carnival performer turned snake-handler on stage, lifts each animal, looks it in the eye. Nancy Novograd, the animal talent, to AP: animals have to perform as human talent does.",
          "The part went to a sun-glow boa constrictor named Princess, yellow-peach, larger, ‘better visual presence on stage.’ Ziegfeld wrote afterwards, as AP quotes: the trial ‘is not about her, but rather about me and my strength.’ A smaller brown boa, Nala, is the understudy. We do not invent a critic’s notice. We do not invent a bite.",
          "YES IT'S REAL crossed AP, NBC New York and the Taipei Times. Named house. Named snakes. Named handler. Cover is a boa constrictor — Commons CC — not Princess under the lights.",
        ],
        [
          "Mozart still shares the call with a reptile.",
          "Princess got the part. Nala waits in the wings.",
          "New York auditions everyone, including the cold-blooded.",
        ],
        "AP / NBC New York 5 Sept 2026; Taipei Times 7 Sept. Auditions 28 Aug at the Met. Princess and Nala named in the copy.",
      ),
      fr: c(
        "Au Met, un boa nommé Princess a gagné l’audition. Nala est doublure. Mozart, Coney Island, années 50.",
        "Vendredi 28 août 2026, Metropolitan Opera, New York. Così fan tutte. AP, NBC New York, Taipei Times. La dresseuse Nancy Novograd. Sur scène, Zoe Ziegfeld.",
        [
          "AP (David R. Martin et Jeffrey Collins), tel que NBC New York le sort le 5 septembre 2026 et le Taipei Times le 7 : au Metropolitan Opera, des serpents passent une audition le vendredi 28 août pour un rôle dans la version Coney Island années 50 du Così fan tutte de Mozart. Zoe Ziegfeld, saltimbanque devenue charmeuse sur scène, soulève chaque bête, la regarde dans les yeux. Nancy Novograd, qui fournit les animaux, à l’AP : les bêtes doivent jouer, comme le talent humain.",
          "Le rôle revient à un boa sun-glow nommé Princess, jaune-pêche, plus grand, « better visual presence on stage ». Ziegfeld écrit ensuite, tel qu’AP le cite : l’essai « is not about her, but rather about me and my strength ». Un boa brun plus petit, Nala, est doublure. On n’invente pas une critique. On n’invente pas une morsure.",
          "YES IT'S REAL a croisé AP, NBC New York et le Taipei Times. Maison nommée. Serpents nommés. Dresseuse nommée. La couverture, un boa constricteur — Commons, licence claire — pas Princess sous les projecteurs.",
        ],
        [
          "Mozart partage encore la convocation avec un reptile.",
          "Princess a le rôle. Nala attend dans les coulisses.",
          "New York auditionne tout le monde, y compris le sang froid.",
        ],
        "AP / NBC New York 5 sept. 2026 ; Taipei Times 7 sept. Auditions du 28 août au Met. Princess et Nala nommées dans le papier d’origine.",
      ),
    },
  }),

  revue({
    id: "s149",
    slug: "runcorn-70000-pints-of-guinness-stolen-two-lorries",
    slugs: {
      fr: "runcorn-70000-pintes-de-guinness-volees-dans-deux-camions",
    },
    section: "faits-divers",
    countryCode: "GB",
    countryName: "United Kingdom",
    location: "Runcorn, Cheshire",
    dumbness: 8,
    sources: [
      src(
        "Thieves steal 70,000 pints of Guinness in two lorries",
        "BBC News",
        "https://www.bbc.co.uk/news/articles/c5yjred1dleo",
        "2026-09-03",
        "wire",
      ),
      src(
        "More than 70,000 pints worth of Guinness stolen from English depot",
        "The Irish Times",
        "https://www.irishtimes.com/world/uk/2026/09/03/more-than-70000-pints-worth-of-guinness-stolen-from-english-depot/",
        "2026-09-03",
        "wire",
      ),
      src(
        "Police recover trailers used to steal 70,000 pints of Guinness",
        "BBC News",
        "https://www.bbc.com/news/articles/c39mz7ggmrmo",
        "2026-09-07",
        "wire",
      ),
      src(
        "More than 70,000 pints of Guinness stolen in lorries at Cheshire depot",
        "ITV News Granada",
        "https://www.itv.com/news/granada/2026-09-03/seventy-thousand-pints-of-guinness-stolen-in-lorries-at-cheshire-depot",
        "2026-09-04",
        "local",
      ),
    ],
    publishedAt: "2026-09-17T18:40:00.000Z",
    originalLang: "fr",
    confidence: 0.96,
    entities: ["Cheshire Police", "Whitehouse Industrial Estate", "GXO", "Diageo", "Det Sgt Gary McClatchey"],
    copy: {
      en: c(
        "Someone stole 70,000 pints of Guinness from a depot in Runcorn. Two lorries. The trailers turned up. The beer did not.",
        "Bank Holiday Monday 31 August. Whitehouse Industrial Estate, Aston Lane. BBC, Irish Times, ITV. About £115,000 of stout. Destined for pubs.",
        [
          "BBC News (3 then 7 September 2026), The Irish Times (3 September) and ITV Granada: two HGVs hooked two trailers at a depot on Whitehouse Industrial Estate, Aston Lane, Runcorn, on Monday 31 August — one around 19.45, the second around 21.30. Combined: more than 800 barrels, about 70,000 pints of Guinness, worth about £115,000, meant for pubs. ITV: Diageo has a packaging warehouse on the estate. The trailers wore GXO curtains. Unique numbers DL736 and DL542.",
          "Cheshire Police later found the empty trailers in Skelmersdale, Lancashire, about thirty miles on. The barrels were not in them. No arrests in the copy we have. Detective Sergeant Gary McClatchey, to the BBC: ‘It is famously said that Guinness is good for you, but that is only the case when it has been bought and paid for.’ We keep the line. We do not invent a cellar.",
          "YES IT'S REAL crossed the BBC, The Irish Times and ITV. Named estate. Named force. Named sergeant. Cover is a pint of stout — Commons CC — not the missing kegs.",
        ],
        [
          "Two lorries. No round.",
          "The trailers came home. The black stuff did not.",
          "England still loses beer by the trailer, then quotes the advert.",
        ],
        "BBC 3 Sept + 7 Sept; Irish Times 3 Sept; ITV Granada 4 Sept 2026. 31 Aug, Runcorn. McClatchey named. No arrests in the cited copy.",
      ),
      fr: c(
        "On a volé 70 000 pintes de Guinness dans un dépôt de Runcorn. Deux camions. Les remorques sont réapparues. La bière, non.",
        "Lundi de bank holiday, 31 août. Whitehouse Industrial Estate, Aston Lane. BBC, Irish Times, ITV. Environ 115 000 £ de stout. Destiné aux pubs.",
        [
          "BBC News (3 puis 7 septembre 2026), The Irish Times (3 septembre) et ITV Granada : deux poids lourds accrochent deux remorques dans un dépôt du Whitehouse Industrial Estate, Aston Lane, à Runcorn, le lundi 31 août — l’un vers 19 h 45, le second vers 21 h 30. Au total : plus de 800 fûts, environ 70 000 pintes de Guinness, quelque 115 000 £, destinés aux pubs. ITV : Diageo a un entrepôt d’emballage sur la zone. Les bâches portent GXO. Numéros DL736 et DL542.",
          "La police du Cheshire retrouve plus tard les remorques vides à Skelmersdale, dans le Lancashire, à une trentaine de miles. Les fûts n’y sont plus. Pas d’arrestation dans les papiers que nous avons. Le detective sergeant Gary McClatchey, à la BBC : « It is famously said that Guinness is good for you, but that is only the case when it has been bought and paid for. » On garde la phrase. On n’invente pas une cave.",
          "YES IT'S REAL a croisé la BBC, The Irish Times et ITV. Zone nommée. Police nommée. Sergent nommé. La couverture, une pinte de stout — Commons, licence claire — pas les fûts manquants.",
        ],
        [
          "Deux camions. Pas une tournée.",
          "Les remorques sont rentrées. Le truc noir, non.",
          "L’Angleterre perd encore la bière à la remorque, puis cite la pub.",
        ],
        "BBC 3 sept. + 7 sept. ; Irish Times 3 sept. ; ITV Granada 4 sept. 2026. 31 août, Runcorn. McClatchey nommé. Pas d’arrestation dans les textes cités.",
      ),
    },
  }),

  revue({
    id: "s150",
    slug: "haneda-200-lizards-in-22-pairs-of-socks",
    slugs: {
      fr: "haneda-200-lezards-dans-22-paires-de-chaussettes",
    },
    section: "animals",
    countryCode: "JP",
    countryName: "Japan",
    location: "Haneda Airport, Tokyo",
    dumbness: 9,
    sources: [
      src(
        "Mexican man arrested over attempt to smuggle some 200 lizards into Japan",
        "The Japan Times",
        "https://www.japantimes.co.jp/news/2026/08/12/japan/crime-legal/man-arrested-lizards-smuggling/",
        "2026-08-12",
        "wire",
      ),
      src(
        "Lizards Hidden in Socks Lead to Smuggling Arrest in Tokyo",
        "Nippon.com / Jiji",
        "https://www.nippon.com/en/news/yjj2026081200511/",
        "2026-08-12",
        "wire",
      ),
      src(
        "Mexican arrested for attempting to smuggle rare lizards into Japan",
        "NHK World",
        "https://www3.nhk.or.jp/nhkworld/en/news/20260812_19/",
        "2026-08-12",
        "official",
      ),
    ],
    publishedAt: "2026-09-17T18:50:00.000Z",
    originalLang: "fr",
    confidence: 0.94,
    entities: [
      "Daniel Isaac Velasco Baltazar",
      "Tokyo Customs",
      "Haneda",
      "CITES",
    ],
    copy: {
      en: c(
        "He packed about 200 lizards into 22 pairs of socks and flew them into Haneda. Customs had been tipped off. One was already dead.",
        "Saturday 8 August 2026. Haneda, from South Korea. Japan Times, Jiji / Nippon.com, NHK. CITES. The passenger is named: Daniel Isaac Velasco Baltazar, 23, Mexican.",
        [
          "The Japan Times (Jiji, 12 August 2026), Nippon.com (same wire) and NHK World: Tokyo police arrested Daniel Isaac Velasco Baltazar, 23, a Mexican national, after Tokyo Customs at Haneda found about 200 lizards in his suitcase on Saturday 8 August, on a flight from South Korea. Twenty-two pairs of socks. Rolled in T-shirts. One lizard was dead. Nine of them, the charge specifies, were arboreal alligator lizards, CITES-listed, highland Mexico.",
          "Police had an anonymous tip in late July that a Mexican national would try to bring lizards in for a reptile fair. He admitted the facts, the papers say. He told investigators he had bought them in Mexico for about 560 to 750 yen each — three to five dollars. In Japan, NHK and Tokyo Reporter note, a collector’s animal of that kind can reach about 100,000 yen. We do not invent a buyer. We do not invent a price at the stall.",
          "YES IT'S REAL crossed Japan Times, Jiji and NHK. Named airport. Named passenger, as the police named him. Named convention. Cover is an alligator lizard — Commons CC — not the socks on the belt.",
        ],
        [
          "The socks were the licence.",
          "Two hundred. Twenty-two pairs. One already gone.",
          "Customs still opens the laundry.",
        ],
        "Japan Times + Jiji 12 Aug; NHK World 12 Aug 2026. Facts of 8 Aug at Haneda. Passenger named in the police copy. One death among the animals, as reported.",
      ),
      fr: c(
        "Il a mis environ 200 lézards dans 22 paires de chaussettes et les a fait atterrir à Haneda. La douane était prévenue. Un était déjà mort.",
        "Samedi 8 août 2026. Haneda, en provenance de Corée du Sud. Japan Times, Jiji / Nippon.com, NHK. CITES. Le passager est nommé : Daniel Isaac Velasco Baltazar, 23 ans, Mexicain.",
        [
          "The Japan Times (Jiji, 12 août 2026), Nippon.com (même dépêche) et NHK World : la police de Tokyo arrête Daniel Isaac Velasco Baltazar, 23 ans, de nationalité mexicaine, après que la douane de Haneda a trouvé, le samedi 8 août, dans sa valise, environ 200 lézards, arrivés de Corée du Sud. Vingt-deux paires de chaussettes. Enroulées dans des T-shirts. Un lézard est mort. Neuf d’entre eux, précise la prévention, sont des lézards alligators arboricoles, listés CITES, hauts plateaux du Mexique.",
          "La police avait un tuyau anonyme, fin juillet : un Mexicain s’apprêtait à entrer des lézards pour une bourse aux reptiles. Il reconnaît les faits, disent les journaux. Il dit aux enquêteurs les avoir achetés au Mexique entre 560 et 750 yens pièce — trois à cinq dollars. Au Japon, notent NHK et Tokyo Reporter, un animal de collection de ce genre peut atteindre 100 000 yens. On n’invente pas un acheteur. On n’invente pas un prix au stand.",
          "YES IT'S REAL a croisé Japan Times, Jiji et NHK. Aéroport nommé. Passager nommé, comme la police l’a nommé. Convention nommée. La couverture, un lézard alligator — Commons, licence claire — pas les chaussettes sur le tapis.",
        ],
        [
          "La licence, c’étaient les chaussettes.",
          "Deux cents. Vingt-deux paires. Un déjà mort.",
          "La douane ouvre encore le linge.",
        ],
        "Japan Times + Jiji 12 août ; NHK World 12 août 2026. Faits du 8 août à Haneda. Passager nommé dans le communiqué de police. Un animal mort, tel que rapporté.",
      ),
    },
  }),

  revue({
    id: "s151",
    slug: "france-pokemon-30-overnight-queues-livret-a",
    slugs: {
      fr: "pokemon-30-ans-ils-dorment-devant-le-magasin-plus-rentable-quun-livret-a",
    },
    section: "sports",
    countryCode: "FR",
    countryName: "France",
    location: "Quimper, Niort, Quévert",
    dumbness: 7,
    sources: [
      src(
        "« Plus rentable qu’un livret A » : ils passent la nuit dans la rue pour acheter le coffret des 30 ans de Pokémon",
        "Ouest-France",
        "https://www.ouest-france.fr/gaming/pokemon/plus-rentable-quun-livret-a-ils-passent-la-nuit-dans-la-rue-pour-acheter-le-coffret-des-30-ans-de-pokemon-e5ad290e-b1b3-11f1-bc32-13ddcee9efa7",
        "2026-09-16",
        "local",
      ),
      src(
        "La chasse aux cartes Pokémon s’est emparée de la ville de Quimper",
        "Ouest-France",
        "https://www.ouest-france.fr/bretagne/quimper-29000/la-chasse-aux-cartes-pokemon-sest-emparee-de-la-ville-de-quimper-4e14676a-b1ae-11f1-bc32-13ddcee9efa7",
        "2026-09-16",
        "local",
      ),
      src(
        "« Le premier client est arrivé hier soir » : pour les 30 ans de Pokémon, des fans se ruent dans ce magasin en Bretagne",
        "Ouest-France",
        "https://www.ouest-france.fr/bretagne/dinan-22100/le-premier-client-est-arrive-hier-soir-pour-les-30-ans-de-pokemon-des-fans-se-ruent-dans-ce-magasin-en-bretagne-27cea390-b1db-11f1-bc32-13ddcee9efa7",
        "2026-09-16",
        "local",
      ),
      src(
        "« À peine sorti avec le coffret, on m’en a proposé le double » : la folie Pokémon reprend de plus belle",
        "Le Maine Libre / Ouest-France",
        "https://www.ouest-france.fr/gaming/pokemon/cartes-pokemon/a-peine-sorti-avec-le-coffret-on-men-a-propose-le-double-la-folie-pokemon-reprend-de-plus-belle-a8962ccc-b1aa-11f1-926d-8837bd37b66e",
        "2026-09-17",
        "local",
      ),
    ],
    publishedAt: "2026-09-17T19:00:00.000Z",
    originalLang: "fr",
    confidence: 0.93,
    entities: ["JouéClub", "Ludotrotteur", "Quévert", "Niort", "Quimper"],
    copy: {
      en: c(
        "They slept outside the toy shop for Pokémon’s 30th. One man was there at 11 p.m. Ouest-France put it next to the livret A.",
        "Wednesday 16 September 2026. Niort, Quimper, Quévert, Le Mans. Ouest-France, Le Maine Libre. First in line from the evening before.",
        [
          "Ouest-France (16 September 2026) and Le Maine Libre (17 September): the 30th-anniversary Pokémon boxes went on sale on Wednesday 16. In Niort, Ouest-France writes, the first people arrived at 8 p.m. on Tuesday and slept in front of JouéClub. By morning, two 25- and 24-year-olds, Alexis and Antoine, said they were at least 150 in the queue. The paper’s headline puts the night next to the livret A.",
          "In Quimper, Hubert Mary: Théo Yvonnou was at the cultural centre at 5 a.m.; ‘one of the guys had been there since 11 p.m. the night before and had slept in his car.’ In Quévert, Côtes-d’Armor, Marion Fiault: JouéClub manager Frédéric Basset said the first customer arrived at 10.30 p.m. the evening before, others asked to sleep. He told the paper the palette felt like gold bars. In Le Mans, Le Maine Libre: a buyer was offered double in the street, still holding the box.",
          "YES IT'S REAL crossed Ouest-France and Le Maine Libre. Named towns. Named shops. Named manager. We do not invent a card’s resale price. Cover is a generic fanned pack of playing cards — Commons CC — not a Nintendo still.",
        ],
        [
          "The savings product was a cardboard box.",
          "Eleven at night. A car. A pavement. A livret A, for scale.",
          "France still queues for paper monsters as if they were bread.",
        ],
        "Ouest-France 16 Sept (Niort, Quimper, Quévert); Maine Libre 17 Sept 2026. Sale of 16 Sept. Named first names as the papers printed them.",
      ),
      fr: c(
        "Ils ont dormi devant le magasin de jouets pour les 30 ans de Pokémon. L’un était là à 23 h. Ouest-France a mis ça à côté du livret A.",
        "Mercredi 16 septembre 2026. Niort, Quimper, Quévert, Le Mans. Ouest-France, Le Maine Libre. Premiers de la file dès la veille au soir.",
        [
          "Ouest-France (16 septembre 2026) et Le Maine Libre (17 septembre) : les coffrets des 30 ans de Pokémon sont en vente le mercredi 16. À Niort, écrit Ouest-France, les premiers sont arrivés à 20 h, le mardi, et ont dormi devant le JouéClub. Le matin, deux Niortais de 25 et 24 ans, Alexis et Antoine, disent qu’ils étaient au moins 150 dans la file. Le titre du journal met la nuit à côté du livret A.",
          "À Quimper, Hubert Mary : Théo Yvonnou est à l’Espace culturel à 5 h ; « l’un des mecs était là dès 23 h, la veille, et avait dormi dans sa voiture ». À Quévert, Côtes-d’Armor, Marion Fiault : le gérant du JouéClub, Frédéric Basset, dit que le premier client est arrivé à 22 h 30 la veille, d’autres ont demandé à dormir. Il dit au journal que la palette, on aurait dit des lingots. Au Mans, Le Maine Libre : on propose le double à un acheteur, dans la rue, le coffret encore dans les mains.",
          "YES IT'S REAL a croisé Ouest-France et Le Maine Libre. Villes nommées. Magasins nommés. Gérant nommé. On n’invente pas un prix de carte. La couverture, un jeu de cartes éventail — Commons, licence claire — pas un photogramme Nintendo.",
        ],
        [
          "Le produit d’épargne, c’était un carton.",
          "Onze heures du soir. Une voiture. Un trottoir. Un livret A, pour l’échelle.",
          "La France fait encore la queue pour des monstres en papier, comme pour le pain.",
        ],
        "Ouest-France 16 sept. (Niort, Quimper, Quévert) ; Maine Libre 17 sept. 2026. Mise en vente du 16 sept. Prénoms tels que les journaux les impriment.",
      ),
    },
  }),

  revue({
    id: "s152",
    slug: "sauternes-sika-deer-chateau-yquem-vines",
    slugs: {
      fr: "sauternes-un-cerf-sika-deguste-les-vignes-dyquem",
    },
    section: "animals",
    countryCode: "FR",
    countryName: "France",
    location: "Sauternes, Gironde",
    dumbness: 8,
    sources: [
      src(
        "Un cerf sika s’échappe d’un parc animalier et se retrouve au milieu des vignes du prestigieux château d’Yquem",
        "ICI",
        "https://www.ici.fr/nouvelle-aquitaine/gironde-33/sauternes/un-cerf-sika-s-echappe-d-un-parc-animalier-et-se-retrouve-au-milieu-des-vignes-du-prestigieux-chateau-d-yquem-2737594",
        "2026-09-16",
        "local",
      ),
    ],
    publishedAt: "2026-09-17T19:10:00.000Z",
    originalLang: "fr",
    confidence: 0.86,
    entities: ["Château d’Yquem", "Patrick Meng", "parc animalier du Sud-Gironde", "Landiras"],
    copy: {
      en: c(
        "A sika deer left a park in Landiras, walked into the vines at Yquem, then the patio. The keeper: a deer who knows his grapes. They have not caught it.",
        "Wednesday 16 September 2026. Sauternes, Gironde. ICI (Alice Marot). Storm Nils, February. Harvest. Capture failed.",
        [
          "ICI (Alice Marot, 16 September 2026): a sika deer, a Japanese deer, escaped from the Sud-Gironde wildlife park in Landiras during storm Nils in February, and was seen on Wednesday in the vines of Château d’Yquem, in Sauternes, and in the patio of the house. Yquem is named. LVMH is named as owner. Capture attempts that day failed.",
          "Patrick Meng, the park’s manager, went to the spot. Until now, ICI writes, the animal had stayed around Landiras. ‘Et puis là, il y a eu les vendanges, et visiblement il se trouve bien dans les vignes.’ Then: ‘Il a choisi les bons cépages, c’est un cerf connaisseur.’ We keep the sentence. We do not invent a tasting note. We do not invent a bottle.",
          "YES IT'S REAL read ICI. Named château. Named park. Named keeper. One named local station — the desk can still want a second paper. Cover is a sika deer — Commons CC — not the animal in the rows.",
        ],
        [
          "The cellar’s neighbour has antlers.",
          "A patio at Yquem. A harvest. No net.",
          "Gironde still lets the park walk into the classification of 1855.",
        ],
        "ICI, Alice Marot, 16 Sept 2026. Landiras park, Yquem, Sauternes. Patrick Meng named. Single named source; hold if a second paper is wanted.",
      ),
      fr: c(
        "Un cerf sika sort d’un parc à Landiras, entre dans les vignes d’Yquem, puis dans le patio. Le responsable : un cerf connaisseur. Ils ne l’ont pas eu.",
        "Mercredi 16 septembre 2026. Sauternes, Gironde. ICI (Alice Marot). Tempête Nils, février. Vendanges. Capture ratée.",
        [
          "ICI (Alice Marot, 16 septembre 2026) : un cerf sika, cerf du Japon, échappé du parc animalier du Sud-Gironde, à Landiras, pendant la tempête Nils, en février, est vu mercredi dans les vignes du château d’Yquem, à Sauternes, et dans le patio de la maison. Yquem est nommé. LVMH, comme propriétaire. Les tentatives de capture du jour restent vaines.",
          "Patrick Meng, le responsable du parc, s’est déplacé. Jusque-là, écrit ICI, l’animal restait autour de Landiras. « Et puis là, il y a eu les vendanges, et visiblement il se trouve bien dans les vignes. » Puis : « Il a choisi les bons cépages, c’est un cerf connaisseur. » On garde la phrase. On n’invente pas une note de dégustation. On n’invente pas une bouteille.",
          "YES IT'S REAL a lu ICI. Château nommé. Parc nommé. Responsable nommé. Une station locale nommée — la desk peut encore vouloir un second titre. La couverture, un cerf sika — Commons, licence claire — pas l’animal dans les rangs.",
        ],
        [
          "Le voisin du chai a des bois.",
          "Un patio à Yquem. Des vendanges. Pas de filet.",
          "La Gironde laisse encore le parc se promener dans le classement de 1855.",
        ],
        "ICI, Alice Marot, 16 sept. 2026. Parc de Landiras, Yquem, Sauternes. Patrick Meng nommé. Une source nommée ; retenir si un second titre est exigé.",
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
