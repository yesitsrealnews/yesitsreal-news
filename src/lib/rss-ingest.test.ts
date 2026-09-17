import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shouldKeepHit, scoreHit } from "./rss-keep.ts";
import { parseFeed } from "./rss-parse.ts";
import { feedKind, feedPriority, priorityFeeds, RSS_FEEDS } from "./rss-feeds.ts";

describe("shouldKeepHit", () => {
  it("keeps a neighbor-war rooster", () => {
    assert.equal(
      shouldKeepHit(
        "Il adopte un coq pour se venger des aboiements du chien de son voisin",
        "Plainte de 27 habitants à Vilablareix.",
      ),
      true,
    );
  });

  it("keeps guerre de voisin (guerre is not a hard skip)", () => {
    assert.equal(
      shouldKeepHit("Guerre de voisin autour d’une haie de thuyas", "copropriété, syndic, clôture"),
      true,
    );
  });

  it("drops assaults, minors, fires, elections", () => {
    assert.equal(shouldKeepHit("Il agresse sa compagne : 5 ans de prison", "tribunal de Carcassonne"), false);
    assert.equal(shouldKeepHit("Violences sexuelles dans le périscolaire", "Hidalgo"), false);
    assert.equal(shouldKeepHit("L'incendie de sa maison le met hors de lui : l'ancien maire", "pompiers"), false);
    assert.equal(shouldKeepHit("Municipales 2026 : le recours du RN", "élections municipales"), false);
    assert.equal(shouldKeepHit("Procès de Rémy Daillet : rapt d'enfant", "Haute-Garonne"), false);
  });

  it("does not keep ordinary politics just because maire is in the headline", () => {
    assert.equal(shouldKeepHit("L'ancien maire de Saint-Jory se heurte aux pompiers", "maison"), false);
  });

  it("keeps an insolite-feed item even without animal keywords", () => {
    assert.equal(
      shouldKeepHit("Il collectionne 400 nains de jardin sur sa pelouse", "le maire a reçu des lettres", "", "insolite"),
      true,
    );
  });

  it("still drops death on an insolite feed", () => {
    assert.equal(shouldKeepHit("Un homme meurt après une chute", "pompiers", "FR — insolite", "insolite"), false);
  });

  it("drops minors by age and grave accidents", () => {
    assert.equal(shouldKeepHit("À 15 ans, Léo capture un monstre de 2,20 mètres", "canne"), false);
    assert.equal(shouldKeepHit("Victime d’un grave accident en se rendant à son mariage", "hôpital"), false);
  });

  it("keeps UFO, underwear, municipal bylaw, boat launch", () => {
    assert.equal(shouldKeepHit("Un OVNI signalé à la gendarmerie de Foix", "procès-verbal"), true);
    assert.equal(shouldKeepHit("Voleur de culottes interpellé au sèche-linge", "adultes, commissariat"), true);
    assert.equal(shouldKeepHit("Arrêté municipal : interdiction de tondre le dimanche", "conseil municipal"), true);
    assert.equal(shouldKeepHit("Sa mise à l’eau tourne court : le bateau coule au bout de la cale", "remorque"), true);
  });

  it("scores animal beats above a generic insolite label", () => {
    const animal = scoreHit("Un sanglier dans le métro de Rennes", "station République");
    const weak = scoreHit("Faits divers du jour", "un quiproquo en mairie", "", "faits-divers");
    assert.ok(animal.keep);
    assert.equal(animal.beat, "animaux");
    assert.ok(weak.keep);
    assert.ok((animal.score ?? 0) > (weak.score ?? 0));
  });
});

describe("RSS_FEEDS", () => {
  it("has insolite and faits-divers desks for the morning pull", () => {
    const morning = priorityFeeds();
    assert.ok(morning.length >= 20);
    assert.ok(morning.some((f) => /insolite/i.test(f.name)));
    assert.ok(morning.some((f) => f.domain === "dhnet.be"));
    assert.ok(RSS_FEEDS.some((f) => f.domain === "upi.com"));
    assert.ok(RSS_FEEDS.some((f) => f.domain === "letelegramme.fr" && /faits-divers/i.test(f.name)));
    assert.ok(RSS_FEEDS.some((f) => f.domain === "maire-info.com"));
    assert.ok(RSS_FEEDS.some((f) => f.domain === "japantimes.co.jp"));
    assert.ok(RSS_FEEDS.some((f) => f.domain === "jeuneafrique.com"));
    assert.ok(RSS_FEEDS.some((f) => f.name === "Metro UK weird"));
    assert.equal(feedKind(RSS_FEEDS.find((f) => f.name === "20 Minutes insolite")!), "insolite");
    assert.equal(feedKind(RSS_FEEDS.find((f) => f.name === "Metro UK weird")!), "insolite");
    assert.equal(feedKind(RSS_FEEDS.find((f) => f.name === "BFMTV police-justice")!), "faits-divers");
    assert.equal(feedPriority(RSS_FEEDS.find((f) => f.name === "UPI Odd News")!), 1);
  });

  it("does not list duplicate urls", () => {
    const urls = RSS_FEEDS.map((f) => f.url);
    assert.equal(urls.length, new Set(urls).size);
  });
});

describe("parseFeed", () => {
  it("reads enclosure images", () => {
    const xml = `<?xml version="1.0"?>
<rss><channel>
<item>
<title>Coq en copropriété</title>
<link>https://www.ladepeche.fr/2026/09/15/coq</link>
<description>Haie et aboiements.</description>
<pubDate>Mon, 15 Sep 2026 08:00:00 GMT</pubDate>
<enclosure url="https://www.ladepeche.fr/photo/coq.jpg" type="image/jpeg" />
</item>
</channel></rss>`;
    const items = parseFeed(xml);
    assert.equal(items.length, 1);
    assert.equal(items[0]?.title, "Coq en copropriété");
    assert.equal(items[0]?.image, "https://www.ladepeche.fr/photo/coq.jpg");
  });
});
