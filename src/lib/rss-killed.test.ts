import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { expandKillKeys, filterRssHits, isKilledHit, rssHitId, type RssHitLike } from "./rss-killed.ts";

function hit(partial: RssHitLike): RssHitLike {
  return partial;
}

describe("filterRssHits", () => {
  it("drops killed urls and their hashed ids", () => {
    const url = "https://www.ladepeche.fr/insolite/coq-voisin.html";
    const id = rssHitId(url);
    const kept = hit({
      feed: "La Dépêche insolite",
      title: "Il adopte un coq pour se venger des aboiements du chien de son voisin",
      url: "https://www.ladepeche.fr/insolite/autre-coq.html",
      summary: "Plainte de 27 habitants",
    });
    const dead = hit({
      feed: "La Dépêche insolite",
      title: "Il adopte un coq pour se venger des aboiements du chien de son voisin",
      url,
      summary: "Plainte de 27 habitants",
    });
    const out = filterRssHits([dead, kept], [id]);
    assert.equal(out.length, 1);
    assert.equal(out[0]?.url, kept.url);
    assert.equal(isKilledHit(dead, new Set([id])), true);
  });

  it("drops insolite items that are not on the editorial beat", () => {
    const out = filterRssHits(
      [
        hit({
          feed: "La Dépêche insolite",
          title: "La médiathèque ouvre ses portes samedi",
          url: "https://www.ladepeche.fr/insolite/mediatheque.html",
          summary: "inauguration",
        }),
      ],
      [],
    );
    assert.equal(out.length, 0);
  });

  it("expands a hashed id into url + id", () => {
    const url = "https://www.ladepeche.fr/insolite/coq.html";
    const keys = expandKillKeys(
      [rssHitId(url)],
      [hit({ feed: "La Dépêche insolite", title: "coq", url, summary: "voisin chien" })],
    );
    assert.ok(keys.includes(url));
    assert.ok(keys.includes(rssHitId(url)));
  });
});
