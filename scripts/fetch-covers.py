#!/usr/bin/env python3
"""Pull Wikimedia Commons stills (PD / CC) for EVERY story cover.

Standing order (DESK.md): no story ships without a credited free photo.
Never leave the painted TRUE placeholder. Imagine is last resort, not this script.
Cite in src/lib/cover-credits.json.
"""
from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

OUT = Path("/workspace/public/covers")
CREDITS = Path("/workspace/src/lib/cover-credits.json")
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
}

FREE = ("public domain", "pd", "cc0", "cc by", "cc-by", "cc by-sa", "cc-by-sa", "fal")


def api(params: dict) -> dict:
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(f"{API}?{q}", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def strip_html(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", s).strip()


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
    credits = {}
    for sid in sorted(COVERS, key=lambda x: int(x[1:])):
        print(f"→ {sid}", flush=True)
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
        artist = strip_html(meta.get("Artist", {}).get("value", "Wikimedia Commons"))
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
    CREDITS.write_text(json.dumps(credits, indent=2, ensure_ascii=False))
    print("wrote", CREDITS, "n=", len(credits))


if __name__ == "__main__":
    main()
