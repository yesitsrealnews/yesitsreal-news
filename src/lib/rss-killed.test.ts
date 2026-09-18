import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canonicalRssUrl,
  expandKillKeys,
  filterRssHits,
  isKilledHit,
  rssHitId,
  titleKillKey,
  type RssHitLike,
} from "./rss-killed.ts";

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

  it("drops the same paper when the RSS URL grows tracking params", () => {
    const clean = "https://www.ladepeche.fr/insolite/coq.html";
    const dirty = "http://www.ladepeche.fr/insolite/coq.html?utm_source=rss&utm_medium=feed#top";
    const dead = hit({
      feed: "La Dépêche insolite",
      title: "Un coq chez le voisin, le syndic s’en mêle",
      url: dirty,
      summary: "aboiement haie",
    });
    const out = filterRssHits([dead], [clean]);
    assert.equal(out.length, 0);
    assert.equal(canonicalRssUrl(dirty), canonicalRssUrl(clean));
    assert.equal(rssHitId(dirty), rssHitId(clean));
  });

  it("drops a reincarnation that only changed the headline wrapper", () => {
    const url = "https://nypost.com/2026/09/17/raccoon-dumpster/";
    const first = hit({
      feed: "NY Post oddities",
      title: "Raccoon found cozied up in Iowa brewery dumpster",
      url,
      summary: "Trashed Panda",
    });
    const again = hit({
      feed: "UPI Odd News",
      title: "Raccoon found cozied up in Iowa brewery dumpster",
      url: "https://www.upi.com/Odd_News/2026/09/17/raccoon-iowa/",
      summary: "same animal",
    });
    const keys = expandKillKeys([first.url], [first]);
    const out = filterRssHits([again], keys);
    assert.equal(out.length, 0);
    assert.match(titleKillKey(first.title), /^fp:t:/);
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
      [hit({ feed: "La Dépêche insolite", title: "coq voisin chien syndic", url, summary: "voisin chien" })],
    );
    assert.ok(keys.includes(canonicalRssUrl(url)));
    assert.ok(keys.includes(rssHitId(url)));
  });
});
