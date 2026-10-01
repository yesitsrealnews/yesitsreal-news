#!/usr/bin/env python3
"""Pull Wikimedia Commons stills (PD / CC) for EVERY story cover.

Standing order (DESK.md): no story ships without a credited free photo.
Never leave the painted TRUE placeholder. Photos only (culprit / witness / animal / object). No drawings, no Imagine.
Cite in src/lib/cover-credits.json.

Named mugshot / booking photos (DESK.md « Mugshots ») may be added manually under
COVERS / public/covers/{id}.jpg with credits pointing to the releasing agency page
(Public record, PD, or CC). This script remains Commons-oriented and does not scrape
news sites or jail portals for mugshots.
"""
from __future__ import annotations

import html
import json
import re
import time
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parents[1] / "public" / "covers"
CREDITS = Path(__file__).resolve().parents[1] / "src" / "lib" / "cover-credits.json"
UA = "YESITSREAL/1.0 (newsroom covers; https://yesitsreal.news; desk@yesitsreal.news)"
API = "https://commons.wikimedia.org/w/api.php"

# Prefer a named file. Fallback query if the file 404s.
COVERS: dict[str, tuple[str, str]] = {
    "s01": ("File:Mallard Ducks on Rutland Water - geograph.org.uk - 4724581.jpg", "mallard ducks water"),
    "s02": ("File:Laser printer.jpg", "office laser printer"),
    "s03": ("File:Pigeons in Venice.jpg", "feral pigeons piazza"),
    "s04": ("File:Cumulonimbus clouds.jpg", "cumulonimbus clouds sky"),
    "s05": ("File:Cobblestone street in Europe.jpg", "cobblestone street bicycle"),
    "s06": ("File:Cheese sandwich.jpg", "cheese sandwich"),
    "s07": ("File:Football celebration.jpg", "association football stadium"),
    "s08": ("File:Smartphone.jpg", "smartphone in hand"),
    "s09": ("File:Robot Vacuum 2016 (31606445890).jpg", "robot vacuum cleaner"),
    "s10": ("File:Stapler 01.jpg", "office stapler"),
    "s11": ("File:Oriental small-clawed otter 2.jpg", "Aonyx cinereus otter"),
    "s12": ("File:Printer (laser) Brother.jpg", "computer printer"),
    "s13": ("File:Magic Roundabout, Swindon.jpg", "traffic roundabout"),
    "s14": ("File:Office plant.jpg", "potted plant office"),
    "s15": ("File:River.jpg", "wide river landscape"),
    "s16": ("File:Newton's apple tree, Woolsthorpe Manor.jpg", "apple tree gravity"),
    "s17": ("File:Speed bump.jpg", "speed bump asphalt"),
    "s18": ("File:Goldfish in a bowl.jpg", "goldfish bowl"),
    "s19": ("File:Hotel minibar.jpg", "hotel minibar fridge"),
    "s20": ("File:Football pitch.jpg", "empty football pitch"),
    "s21": ("File:Cat March 2010-1a.jpg", "tabby cat sitting"),
    "s22": ("File:Press conference.jpg", "press conference microphones"),
    "s23": ("File:Office cubicles.jpg", "office cubicle"),
    "s24": ("File:Raccoon (Procyon lotor) 2.jpg", "raccoon"),
    "s25": ("File:Wooden fence.jpg", "wooden garden fence"),
    "s26": ("File:Toast-2.jpg", "buttered toast"),
    "s27": ("File:Fountain.jpg", "ornamental city fountain"),
    "s28": ("File:Bank vault.jpg", "bank vault door"),
    "s29": ("File:Fountain pens.jpg", "fountain pens"),
    "s30": ("File:Lagos traffic.jpg", "Lagos Nigeria traffic"),
    "s31": ("File:Francis Lalanne - Salon du Livre de Paris 2015.jpg", "Francis Lalanne"),
    "s32": ("File:Sylvain Durif.jpg", "Sylvain Durif"),
    "s33": ("File:Theatre curtains.jpg", "theatre stage curtains"),
    "s34": ("File:Woman with smartphone.jpg", "person livestream smartphone"),
    "s35": (
        "File:Aerial view of oil refinery next to the Gulf of Mexico near Houston, Texas LCCN2011630532.tif",
        "Gulf of Mexico sea",
    ),
    "s36": ("File:Common pigeon at Waterlow Park, London 01.jpg", "feral pigeon"),
    "s37": ("File:Californiakingsnake.jpg", "kingsnake"),
    "s38": ("File:Little brown bat hanging in cave - DPLA - 443e6bf724ebeafa47244eacf310b369.jpg", "brown bat cave"),
    "s39": ("File:11.03.85 Au CNES la salle blanche (1985) - 53Fi2159.jpg", "clean room laboratory"),
    "s40": ("File:The Pentagon January 2008.jpg", "Pentagon building"),
    "s41": ("File:Pain au chocolat Luc Viatour.jpg", "pain au chocolat"),
    "s42": ("File:Speed bump (asphalt).jpg", "speed bump"),
    "s43": ("File:Chèvre naine - Sérent 8.jpg", "dwarf goat"),
    "s44": ("File:Python reticulatus (1).jpg", "reticulated python"),
    "s45": ("File:Venus de Milo.JPG", "Venus de Milo statue"),
    "s46": ("File:046 Capybara by the river in Encontro das Águas State Park Photo by Giles Laurent.jpg", "capybara"),
    "s47": ("File:Door in Mijas 3107.JPG", "spanish house door number"),
    "s48": ("File:Red-necked wallaby442.jpg", "red-necked wallaby"),
    "s49": ("File:Urban goats.jpg", "urban goats"),
    "s50": ("File:Rose-ringed parakeet (Psittacula krameri borealis) male Jaipur.jpg", "rose-ringed parakeet"),
    "s51": ("File:CDC-Gathany-Aedes-albopictus-1.jpg", "Aedes albopictus mosquito"),
    "s52": ("File:Carpet Python - Andrew Mercer - DSC07078.jpg", "carpet python Morelia spilota"),
    "s53": ("File:Polar bear (Ursus maritimus) in the drift ice region north of Svalbard.jpg", "polar bear Svalbard"),
    "s54": ("File:Sulphur-crested cockatoo (Cacatua galerita galerita) Sydney.jpg", "sulphur-crested cockatoo"),
    "s55": ("File:Didelphis albiventris-12-07-28.jpg", "white-eared opossum"),
    "s56": ("File:Common brushtail possum (Trichosurus vulpecula) with joey Triabunna.jpg", "brushtail possum"),
    "s57": ("File:Cockroach July 2013-1.jpg", "cockroach"),
    "s58": ("File:Gendarmerie GIGN 01.jpg", "GIGN gendarmerie"),
    "s59": ("File:UFC-Octagon-USMCPhoto.jpg", "UFC octagon"),
    "s60": ("File:Quigley's Half-Irish Pub in Baltimore, Maryland.jpg", "Baltimore Irish pub"),
    "s61": ("File:Auch RV toilet dump station.jpg", "RV toilet dump station"),
    "s62": ("File:7-Eleven Store at 1810 N Cahuenga Blvd, Los Angeles 20110807 1.jpg", "7-Eleven store"),
    "s63": ("File:Raclette 20040817 140816.jpg", "raclette cheese"),
    "s64": ("File:Couch-furniture-living-room-sofa (24300293356).jpg", "living room sofa"),
    "s65": ("File:Stamford police station, Blue lamp (geograph 2304587).jpg", "UK police station blue lamp"),
    "s66": ("File:7-Eleven vending machine at the entrance lobby of the Daan International Building, as taken on 23 February 2021.jpg", "vending machine lobby"),
    "s67": ("File:Circle K gas station, Dolina, Warsaw.jpg", "Circle K station"),
    "s68": ("File:French Identity card 1988 - 1994.jpg", "old French ID card template"),
    "s69": ("File:LRP sunscreen bottle.jpg", "pharmacy sunscreen bottle"),
    "s70": ("File:Sos Aranzos beach (Spiaggia Sos Aranzos), Sardinia, Italy - Flickr - Wloski.jpg", "Sardinia white sand beach"),
    "s71": ("File:Sunbeds at a hotel pool.jpg", "hotel pool sunbeds"),
    "s72": ("File:Firenze, fontana del nettuno (dopo il restauro del 2020) di giorno, 01.jpg", "Neptune fountain Florence"),
    "s73": ("File:Duct-tape.jpg", "duct tape roll"),
    "s74": ("File:Norwegian Boeing 737-800 cabin Sky Interior.JPG", "737 cabin seats"),
    "s75": ("File:Capbreton - Chapelle Sainte-Thérèse - 1.jpg", "Capbreton beach chapel"),
    "s76": ("File:Coq brun noir.jpg", "farm rooster"),
    "s77": ("File:Église Saint Vincent - Le Mesnil-le-Roi (FR78) - 2025-07-14 - 2.jpg", "Saint-Vincent Mesnil-le-Roi"),
    "s78": ("File:-2019-05-18 Cockerel, Trimingham (2).JPG", "Norfolk cockerel"),
    "s79": ("File:Abandoned artificial turf in Hermanninranta, Helsinki, Finland, 2021.jpg", "artificial turf"),
    "s80": ("File:Rocchetta a Volturno-Chiesa di Santa Maria Assunta-campanile.JPG", "Italian village campanile"),
    "s81": ("File:Thaïlande - Phuket - Raya Island (13445948294).jpg", "Racha Yai island"),
    "s82": ("File:Wat Pho, Bangkok, Tailandia, 2013-08-22, DD 02.jpg", "Wat Pho Buddha Bangkok"),
    "s83": ("File:Royal Crescent in Bath, England - July 2006.jpg", "Bath stone houses"),
    "s84": ("File:Houses on Slough Lane, Kingsbury - geograph.org.uk - 4700337.jpg", "Kingsbury suburban houses"),
    "s85": ("File:Takamatsu Station Plaza Facade.jpg", "Takamatsu station Kagawa"),
    "s86": ("File:Palais Bourbon, Paris 7e, NW View 140402 1.jpg", "Palais Bourbon Assemblée"),
    "s87": ("File:Oxley central roundabout.jpg", "Australian suburban roundabout"),
    "s88": ("File:Courdimanche - Parc d'attraction Mirapolis - La Vallée des Grès , La Mare au Canes.jpg", "Mirapolis Cergy abandoned park"),
    "s89": ("File:Eiffel tower at Exposition Universelle, Paris, 1889.jpg", "Eiffel Tower 1889"),
    "s90": ("File:Brooklyn Bridge Entrance on Brooklyn side, 1899.jpg", "Brooklyn Bridge 1899"),
    "s91": ("File:Welles-Radio-Studio-1938.jpg", "Orson Welles radio 1938"),
    "s92": ("File:Coca-Cola bottles.jpg", "classic Coca-Cola bottles"),
    "s93": ("File:Bahnhof Altdorf Parkplatz West 2.jpg", "Altdorf UR car park"),
    "s94": ("File:Gloucester Old Spot Piglets.jpg", "spotted piglets"),
    "s95": ("File:Hamburg ICE1 op Lombardsbrücke kerst (23776695399).jpg", "ICE train Hamburg"),
    "s96": ("File:Psilocybe cubensis (Earle) Singer 514039.jpg", "Psilocybe cubensis mushroom"),
    "s97": ("File:Cannabis sativa.jpg", "Cannabis sativa plant"),
    "s98": ("File:World Bank Headquarters.jpg", "World Bank headquarters"),
    "s99": ("File:Paris - UNESCO (29775501630).jpg", "UNESCO headquarters Paris"),
    "s100": ("File:Berlaymont building 2022.jpg", "European Commission Berlaymont"),
    "s101": ("File:Food waste.jpg", "Food waste"),
    "s102": ("File:Berlaymont building in Brussels.jpg", "European Commission Brussels"),
    "s103": ("File:Apis mellifera.jpg", "Honey bee"),
    "s104": ("File:Piper J-3 Cub.jpg", "Piper Cub"),
    "s105": ("File:Holden Commodore.jpg", "Holden Commodore"),
    "s106": ("File:Pizza.jpg", "Pizza"),
    "s107": ("File:Potatoes.jpg", "Potatoes"),
    "s108": ("File:Bicycle.jpg", "Bicycle"),
    "s109": ("File:Night sky.jpg", "Night sky"),
    "s110": ("File:Diamond.jpg", "Diamond"),
    "s111": ("File:Police badge.jpg", "Police badge"),
    "s112": ("File:Chiropractic Adjustment 13.jpg", "Chiropractic"),
    "s113": ("File:Wheelie bin.jpg", "Wheelie bin"),
    "s114": ("File:Garden.jpg", "Garden"),
    "s125": ("File:Red deer by the road, Cnoc Bad a' Ghille Duibh - geograph.org.uk - 645743.jpg", "red deer roadside UK"),
    "s126": ("File:Coach and Horses, Greek Street, Soho, W1 (2711029239).jpg", "Soho London pub"),
    "s127": ("File:Trailer park- Cape Canaveral, Florida (7221106912).jpg", "Florida trailer park"),
    "s132": ("File:Pile of manure on a field.jpg", "manure pile farm field"),
    "s133": ("File:Singapore Marina Bay Dusk 2018-02-27.jpg", "Singapore Marina Bay skyline"),
    "s134": ("File:Cambridge Crown Court.jpg", "Cambridge Crown Court"),
    "s135": ("File:Nile crocodile head.jpg", "nile crocodile head"),
    "s136": ("File:Trachemys scripta elegans.jpg", "red-eared slider turtles"),
    "s137": ("File:Marché provençal.jpg", "Provence outdoor market"),
    "s138": ("File:Coq brun noir.jpg", "farm rooster crowing"),
    "s139": ("File:Carrots of many colors.jpg", "orange carrots bunch"),
    "s140": ("File:Burenziegenbock 1 (cropped).JPG", "boer goat billy"),
    "s141": ("File:Flemish Parliament Brussels.jpg", "Flemish Parliament Brussels hemicycle"),
    "s142": ("File:Dogs playing.JPG", "golden retriever dog toy"),
    "s143": ("File:Caiman crocodilus pair.jpg", "spectacled caiman"),
    "s144": ("File:Lynx rufus.jpg", "bobcat lynx rufus"),
    "s145": ("File:Pizza 1.jpg", "pizza margherita"),
    "s146": ("File:Lake Erie from space.jpg", "Lake Erie shoreline"),
    "s147": ("File:Cockroach.jpg", "cockroach insect"),
    "s148": ("File:Boa constrictor (2).jpg", "boa constrictor snake"),
    "s149": ("File:Guinness.jpg", "pint of Guinness stout"),
    "s150": ("File:Abronia graminea.jpg", "arboreal alligator lizard"),
    "s151": ("File:Playing cards.jpg", "fanned playing cards"),
    "s152": ("File:Sika Deer (Cervus nippon).jpg", "sika deer cervus nippon"),
    "s153": ("File:Clothes line.jpg", "laundry clothesline drying clothes"),
    "s154": ("File:Pipistrellus pipistrellus01.jpg", "pipistrelle bat"),
    "s155": ("File:20230923-Morgins-Herens-2.jpg", "herens cow valais"),
    "s156": ("File:Anaconda común (Eunectes murinus), Tierpark Hellabrunn, Múnich, Alemania, 2012-06-17, DD 01.JPG", "green anaconda"),
    "s157": ("File:Red-necked wallaby442.jpg", "red-necked wallaby bennett macropus"),
    "s158": ("File:Elk (Alces alces) calf Biebrzanski.jpg", "moose elk alces alces"),
    "s159": ("File:Alpine A110 der Gendarmerie Nationale.jpg", "french gendarmerie patrol car alpine"),
    "s160": ("File:Charcoal Toothpaste.jpg", "charcoal toothpaste tube"),
    "s161": ("File:Gazpacho.jpg", "spanish gazpacho tomato soup"),
    "s162": ("File:Raccoon (Procyon lotor) 2.jpg", "raccoon procyon lotor"),
    "s163": ("File:Boite aux lettres dans le Nord, France.jpg", "french mailbox boite aux lettres"),
    "s164": ("File:Aedes albopictus bloodfeeding PLoS.jpg", "aedes albopictus tiger mosquito"),
    "s165": ("File:Vlaams Parlement.jpg", "flemish parliament brussels building"),
    "s166": ("File:046 Capybara by the river in Encontro das Águas State Park Photo by Giles Laurent.jpg", "capybara hydrochoerus"),
    "s167": ("File:Emu - Melbourne Zoo.jpg", "emu dromaius novaehollandiae"),
    "s168": ("File:Bélier.jpg", "belier ram sheep horns"),
    "s169": ("File:Chacma baboon (Papio ursinus ursinus) male.jpg", "chacma baboon papio ursinus"),
    "s170": ("File:Macaca fuscata fuscata -Arashiyama, Kyoto, Japan-8.jpg", "japanese macaque snow monkey"),
    "s171": ("File:Azumino Public Central Library bookshelves ac (4).jpg", "public library bookshelves"),
    "s172": ("File:Murmuration 11-2025.jpg", "starling murmuration flock birds"),
    "s173": ("File:Bagel Making.jpg", "bagel pastry bread sesame"),
    "s174": ("File:Croissant.jpg", "butter croissant pastry bakery"),
    "s175": ("File:Horse running.jpg", "brown horse galloping field"),
    "s193": ("File:Capybara swimming.jpg", "capybara hydrochoerus swimming"),
    "s194": ("File:White-tailed Deer.jpg", "white-tailed deer odocoileus virginianus"),
    "s195": ("File:Traffic cones.jpg", "orange traffic cones road works"),
    "s196": ("File:Round cast iron Manhole cover.jpg", "manhole cover cast iron street"),
    "s197": ("File:Dinghy leaving Harbour - geograph.org.uk - 8095676.jpg", "dinghy small boat harbour pier"),
    "s198": ("File:Labrador Retriever - Yellow.JPG", "Labrador Retriever yellow dog"),
    "s199": ("File:Cassoulet toulousain.jpg", "cassoulet toulousain bean stew sausage"),
    # s200–s206 Pre Pub covers (Commons PD/CC photos only)
    "s200": (
        "File:US Navy 020403-N-0401E-002 USS Germantown - BQM-74E target drone launch.jpg",
        "BQM-74E military target drone Navy",
    ),
    "s201": (
        "File:FEMA - 34554 - Pickup truck stranded by flood water in Missouri.jpg",
        "pickup truck stranded flood water",
    ),
    "s202": (
        "File:Hole in sidewall following car crash, vacant rowhouse with commercial storefront, 701 E. Preston Street, Baltimore, MD 21202 (49095457382).jpg",
        "car crash hole building wall storefront",
    ),
    "s203": (
        "File:HK CB new Wheelchair side top view idle Dec-2015 DSC.JPG",
        "empty manual wheelchair object",
    ),
    "s204": (
        "File:Carcassonne - Rempart de la Bastide saint-Louis (le bastion Saint-Martial).jpg",
        "Carcassonne Bastide Saint-Louis rempart",
    ),
    "s205": (
        "File:Wood carving of a red squirrel - geograph.org.uk - 8290236.jpg",
        "ornamental wood carving red squirrel",
    ),
    "s206": ("File:Lady Lake Town Hall01.jpg", "Lady Lake Florida town hall exterior"),
    # s207–s213 Pre Pub covers (Commons PD/CC photos only)
    "s207": (
        "File:Hole in Drax Wall, Charborough Park - geograph.org.uk - 1200346.jpg",
        "brick wall hole exterior damage",
    ),
    "s208": ("File:Great Dane black male.jpg", "Great Dane dog portrait"),
    "s209": ("File:Target Othello Avenue.jpg", "Target retail store exterior parking"),
    "s210": ("File:Raccoon in Central Park (35264).jpg", "raccoon Procyon lotor wildlife"),
    "s211": (
        "File:Boat ramp at Perry Lake - USACE-p15141coll5-7800.jpeg",
        "boat launch ramp trailer lake",
    ),
    "s212": ("File:Soraya Martinez Ferrada.jpg", "Montreal mayor Soraya Martinez Ferrada"),
    "s213": (
        "File:Manalili Street in Cebu City (2025-05-17).jpg",
        "Cebu City street plaza Philippines",
    ),
    # s215–s220 Pre Pub covers (Commons PD/CC photos only) — Fort Lauderdale cranes re-keyed s214 → s228 (s214 = live RSS story)
    "s215": ("File:The Tap, Ossett - geograph.org.uk - 2163315.jpg", "The Tap pub Ossett"),
    "s216": ("File:Coupe Icare 2014, Frankreich.JPG", "Coupe Icare paraglider costume Saint-Hilaire-du-Touvet"),
    "s217": ("File:Wikimania 2018, Cape Town ( 1050390).jpg", "traffic light Cape Town South Africa"),
    "s218": (
        "File:130420-F-ZZ999-101 (15718415681).jpg",
        "telescopic crane lifting rooftop HVAC air handling unit",
    ),
    "s219": ("File:HeadofEmu.jpg", "emu Dromaius novaehollandiae head"),
    "s220": ("File:Warrenton, Virginia 17.jpg", "Warrenton Virginia Main Street"),
    # s221–s227 Pre Pub covers (Commons PD/CC photos only)
    "s221": ("File:CCTV camera in Poland (1).jpg", "wall mounted CCTV security camera"),
    "s222": ("File:Rhesus Macaque with bottle, Agra, India.jpg", "rhesus macaque bottle India"),
    "s223": ("File:Macaca fascicularis 482606028.jpg", "long-tailed macaque Singapore"),
    "s224": ("File:Ocho Boston Terrier.jpg", "Boston Terrier dog"),
    "s225": ("File:Arrowe Park Hospital, Wirral (1).JPG", "Arrowe Park Hospital Wirral"),
    "s226": ("File:20170316 Michael Raml M77 1.jpg", "Michael Raml FPÖ Linz"),
    "s227": ("File:Tiny House (29426649064).jpg", "tiny house on wheels trailer"),
    "s228": ("File:Collapsed crane Zelenograd 01.jpg", "collapsed crane building damage"),
    # s229–s235 Pre Pub covers (Commons PD/CC photos; s233/s234 from Flickr CC, see EXTERNAL)
    "s229": ("File:Pile of sand by the soccer fields at Brastad Arena.jpg", "pile of sand"),
    "s230": ("File:Funny goat.jpg", "funny goat"),
    "s231": ("File:Swan Support Animal Ambulance - 55465882653.jpg", "animal ambulance United Kingdom"),
    "s232": ("File:Red curb - Arlington, MA.jpg", "badly painted curb"),
    "s235": ("File:Night Sky Above Dunes and Cleveland Peak (26507963410).jpg", "Colorado night sky"),
    # s236–s242 Pre Pub covers (Commons PD/CC photos, licence checked on each file page)
    "s236": ("File:Innsbruck-Helicopter Robinson R44 Raven II-02ASD.jpg", "Robinson R44 helicopter Austria"),
    "s237": ("File:Hollywood Sign (Zuschnitt).jpg", "Hollywood Sign"),
    "s238": ("File:Koi carp; March 2009.jpg", "koi carp"),
    "s239": ("File:Marmande - hôpital - boîte à livres.jpg", "Marmande hospital"),
    "s240": ("File:Tudigong-beitou-puding-3.jpg", "Tudigong shrine Taipei"),
    "s241": ("File:Matlock - County Offices frontage.jpg", "County Hall Matlock Derbyshire"),
    "s242": ("File:Camper van parked in the street, Vieux-Limoilou.jpg", "camper van parked street"),
    # s243–s249 Pre Pub covers (Commons PD/CC photos, licence checked on each file page / Flickr original)
    "s243": ("File:Amphibious vehicle conversion from a VW T3 Transporter (1242448749).jpg", "amphibious camper van boat"),
    "s244": ("File:Pygmy Goat being grabbed.jpg", "pygmy goat kid"),
    "s245": ("File:HeadofEmu.jpg", "emu head"),
    "s246": ("File:Saltwater Crocodile (Crocodylus porosus) (10106331165).jpg", "saltwater crocodile"),
    "s247": ("File:Small boats at the shore of Strachur Bay - geograph.org.uk - 6305333.jpg", "small boats on muddy shore"),
    "s248": ("File:Hirsch-Biotop-vor-dem-Bad-Iburger-Schloss 1180097.jpg", "bronze stag statue"),
    "s249": ("File:Lucha libre coliseo coacalco.jpg", "lucha libre ring Estado de México"),
    # s250–s256 Pre Pub covers (Commons PD/CC photos + one Flickr CC BY, licence checked on each original page)
    "s250": ("File:Aedes albopictus on human skin.jpg", "Aedes albopictus tiger mosquito"),
    "s251": ("File:Jet Skiing - Mahe - Seychelles - 2025.jpg", "jet ski"),
    "s252": ("File:Better reading the notice of this human-made drink.jpg", "rhesus macaque bottle"),
    "s254": ("File:Iowa Pig (7341687640).jpg", "pig peeking through fence"),
    "s255": ("File:Copy of bronze statue, ram 3rd century BC, Maniace castle, Syracuse, 121635.jpg", "bronze ram statue"),
    "s256": ("File:Mannequin in the shop window. Paris, France.jpg", "mannequin shop window"),
    # s257–s263 evening Pre Pub covers (Commons PD/CC0/CC BY/CC BY-SA photos, licence checked on each original page)
    "s257": ("File:Closeup of the bag of flour.jpg", "bag of flour"),
    "s258": ("File:Malinois, Belgian Shepherd 02.jpg", "Belgian Malinois"),
    "s259": ("File:A couple watching skycrapers at night in Marina Bay (20189404519).jpg", "couple Marina Bay Singapore"),
    "s260": ("File:E37 Clackline railway museum - Massey Ferguson tractor 1.jpg", "Massey Ferguson tractor"),
    "s261": ("File:Uprooted Plant.jpg", "uprooted plant"),
    "s262": ("File:Wrexham Guildhall.jpg", "Wrexham Guildhall"),
    "s263": ("File:1, place de la Commanderie (49911888726).jpg", "place de la Commanderie Nancy"),
    # s264–s270 Pre Pub covers (Commons PD/CC0/CC BY/CC BY-SA real photos, licence checked on each original page)
    "s264": ("File:Kroger - Eisenhower Crossing.jpg", "Kroger storefront"),
    "s265": ("File:Helicopter of the Austrian Federal police 9356.jpg", "Austrian police helicopter"),
    "s266": ("File:Mustelus canis noaa.jpg", "smooth dogfish Mustelus canis"),
    "s267": ("File:Raccoon in Central Park (35264).jpg", "raccoon Procyon lotor"),
    "s268": ("File:White Land Rover 90 TD front left.jpg", "Land Rover Defender 90"),
    "s269": ("File:A typical black bin bag from the UK 20060811.jpg", "black bin bag"),
    "s270": ("File:A black bear resting in a tree, in downtown Estes Park (6181697614).jpg", "black bear Estes Park tree"),
}

# Non-Commons free photos (Flickr CC BY / CC BY-SA, Pexels, Pixabay…): direct file URL + credit
# checked by hand on the ORIGINAL page (Flickr page JSON "license": 4 = CC BY 2.0, 5 = CC BY-SA 2.0).
# `artist` = the photographer's name only (desk rule), `page` = the original photo page.
EXTERNAL: dict[str, dict[str, str]] = {
    "s233": {
        "url": "https://live.staticflickr.com/1307/1305406591_63788bcc47_o.jpg",
        "file": "Flickr 1305406591 — Bear (chainsaw carving)",
        "artist": "jimjarmo",
        "license": "CC BY-SA 2.0",
        "page": "https://www.flickr.com/photos/10846528@N05/1305406591/",
    },
    "s234": {
        "url": "https://live.staticflickr.com/5264/5579852238_3cedd0cf37_k.jpg",
        "file": "Flickr 5579852238 — Nice bit of bokeh in there. ODC - Metallic",
        "artist": "Jase Curtis",
        "license": "CC BY 2.0",
        "page": "https://www.flickr.com/photos/25722571@N08/5579852238/",
    },
    "s253": {
        "url": "https://live.staticflickr.com/65535/50311321806_873f5f853f_k.jpg",
        "file": "Flickr 50311321806 — Close-up of a goat eating a corn cob",
        "artist": "Ivan Radic",
        "license": "CC BY 2.0",
        "page": "https://www.flickr.com/photos/26344495@N05/50311321806/",
    },
}

# Commons files whose Artist field names an institution/account, not the photographer
# (name taken from the file description, e.g. "NPS/Patrick Myers").
ARTIST_OVERRIDE: dict[str, str] = {
    "s235": "Patrick Myers (NPS)",
    "s237": "Thomas Wolf",  # Commons: "Thomas Wolf , www.foto-tw.de"
    "s238": "Bernard Spragg",  # Commons: "Bernard Spragg. NZ"
    "s243": "Allen Watkin",  # Commons/Flickr: "allen watkin from London, UK"
    "s246": "Bernard Dupont",  # Commons: "Bernard DUPONT from FRANCE"
    "s252": "Yann Forget",  # Commons: "Yann (talk)" — category "Photographs and images by Yann Forget"
    "s262": "Richard Kelly",  # Commons: author [[User:Stortford|Richard Kelly]]
}

FREE = ("public domain", "pd", "cc0", "cc by", "cc-by", "cc by-sa", "cc-by-sa", "fal")


def api(params: dict) -> dict:
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(f"{API}?{q}", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def strip_html(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def clean_artist(a: str) -> str:
    """Name only (desk rule). Mirror of cleanCreditArtist() in src/lib/covers.ts."""
    a = re.sub(r"\s+", " ", html.unescape(a or "")).strip()
    m = re.search(r"No machine-readable author provided\.\s*(.+?)\s+assumed", a, re.I)
    if m:
        a = m.group(1)
    prefix = re.compile(r"^(?:[a-z]{2,3}:)?(?:User|Benutzer|Utilisateur|Usuario|Utente|Gebruiker):", re.I)
    if prefix.search(a):
        a = prefix.sub("", a).replace("_", " ")
    a = re.sub(r"~commonswiki$", "", a, flags=re.I)
    a = re.sub(r"\s*\((?:[a-z-]+:)?User:[^)]*\)", "", a, flags=re.I)
    a = re.sub(r"\s*[(\[]\s*(?:talk|contribs?|discussion|diskussion|flickr)\s*[)\]]", "", a, flags=re.I)
    a = re.sub(r"(?:\s*[·|•,-])?\s+(?:talk|contribs)$", "", a, flags=re.I)
    a = re.sub(r"\s*\((?:https?://|www\.)[^)]*\)", "", a, flags=re.I)
    a = re.sub(r"\s+at\s+[A-Z][a-z]+\s+Wikipedia$", "", a)
    a = re.sub(r"\s+from\s+[A-Z][^,()\[\]]*(?:,\s*[^,()\[\]]+)*(?:\s*\[[^\]]*\])?$", "", a).strip()
    m = re.match(r"^(.+?)\s*\(\s*(.+?)\s*\)$", a)
    if m and m.group(1) == m.group(2):
        a = m.group(1)
    m = re.match(r"^([^,]+),\s*([^,]+),\s*\d{4}-(?:\d{4})?(?:,\s*photographer)?$", a, re.I)
    if m:
        a = f"{m.group(2)} {m.group(1)}"
    return "" if re.match(r"^own work$", a, re.I) else a


def info_for_title(title: str) -> dict | None:
    d = api(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|mime|size",
            "iiurlwidth": "1600",
        }
    )
    pages = d.get("query", {}).get("pages", {})
    for p in pages.values():
        if p.get("missing") or p.get("invalid"):
            return None
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            return None
        return {"title": p.get("title"), **ii}
    return None


def search_file(q: str) -> dict | None:
    d = api(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": q + " filetype:bitmap",
            "gsrnamespace": "6",
            "gsrlimit": "8",
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|mime",
            "iiurlwidth": "1600",
        }
    )
    pages = sorted(d.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    for p in pages:
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            continue
        mime = (ii.get("mime") or "")
        if not mime.startswith("image/") or mime.endswith("svg+xml"):
            continue
        lic = strip_html((ii.get("extmetadata") or {}).get("LicenseShortName", {}).get("value", "")).lower()
        if not any(tok in lic for tok in FREE):
            continue
        return {"title": p.get("title"), **ii}
    return None


def pick(sid: str) -> dict | None:
    named, fallback = COVERS[sid]
    hit = info_for_title(named)
    if hit and (hit.get("mime") or "").startswith("image/"):
        return hit
    time.sleep(0.35)
    return search_file(fallback)


def save_jpg(raw: bytes, dest: Path) -> None:
    im = Image.open(BytesIO(raw)).convert("RGB")
    w, h = im.size
    target = 16 / 10
    if w / h > target:
        nw = int(h * target)
        left = (w - nw) // 2
        im = im.crop((left, 0, left + nw, h))
    else:
        nh = int(w / target)
        top = (h - nh) // 2
        im = im.crop((0, top, w, top + nh))
    im = im.resize((1400, 875), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=82, optimize=True)


def download(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main() -> None:
    import sys

    known = {**COVERS, **EXTERNAL}
    wanted = [a for a in sys.argv[1:] if a in known]
    ids = wanted if wanted else sorted(known, key=lambda x: int(x[1:]))
    credits = {}
    if CREDITS.exists():
        try:
            credits = json.loads(CREDITS.read_text())
        except json.JSONDecodeError:
            credits = {}

    for sid in ids:
        print(f"→ {sid}", flush=True)
        ext = EXTERNAL.get(sid)
        if ext:
            try:
                dest = OUT / f"{sid}.jpg"
                save_jpg(download(ext["url"]), dest)
                credits[sid] = {k: ext[k] for k in ("file", "artist", "license", "page")}
                print(f"  ok {dest.stat().st_size} {ext['license']} {ext['file'][:60]}")
            except Exception as e:
                print("  fail save", e)
            time.sleep(0.45)
            continue
        try:
            hit = pick(sid)
        except Exception as e:
            print("  fail pick", e)
            time.sleep(0.5)
            continue
        if not hit:
            print("  no image")
            time.sleep(0.4)
            continue
        url = hit.get("thumburl") or hit.get("url")
        meta = hit.get("extmetadata") or {}
        artist = ARTIST_OVERRIDE.get(sid) or clean_artist(strip_html(meta.get("Artist", {}).get("value", "Wikimedia Commons"))) or "Wikimedia Commons"
        lic = strip_html(meta.get("LicenseShortName", {}).get("value", ""))
        page = "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(hit["title"].replace(" ", "_"))
        try:
            raw = download(url)
            dest = OUT / f"{sid}.jpg"
            save_jpg(raw, dest)
            credits[sid] = {
                "file": hit["title"],
                "artist": artist[:160],
                "license": lic,
                "page": page,
            }
            print(f"  ok {dest.stat().st_size} {lic} {hit['title'][:60]}")
        except Exception as e:
            print("  fail save", e)
        time.sleep(0.45)
    CREDITS.write_text(json.dumps(credits, indent=2, ensure_ascii=False) + "\n")
    print("wrote", CREDITS, "n=", len(credits))


if __name__ == "__main__":
    main()
