import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { originCountry, originDesk, publicDesk, storyInDeskListing } from "./desk-origin.ts";
import type { Story } from "./types.ts";

function stub(url: string, countryCode = "IT"): Pick<Story, "sources" | "countryCode"> {
  return {
    countryCode,
    sources: [{ title: "t", publisher: "p", url, date: "2026-09-01", type: "local" }],
  };
}

describe("originDesk", () => {
  it("puts a Le Parisien first publication in France", () => {
    assert.equal(originCountry(stub("https://www.leparisien.fr/faits-divers/coq")), "FR");
    assert.equal(originDesk(stub("https://www.leparisien.fr/faits-divers/coq")), "france");
  });

  it("puts a Houston Chronicle first publication in the USA", () => {
    assert.equal(originDesk(stub("https://www.houstonchronicle.com/news/turtles")), "usa");
  });

  it("puts a Guardian first publication in World", () => {
    assert.equal(originDesk(stub("https://www.theguardian.com/environment/croc", "IT")), "world");
  });

  it("FR public desk: US paper is Monde; EN public desk: French paper is World", () => {
    const us = stub("https://www.nytimes.com/2026/09/01/us/odd.html");
    const fr = stub("https://www.ouest-france.fr/insolite/coq");
    assert.equal(publicDesk(us, "fr"), "monde");
    assert.equal(publicDesk(fr, "en"), "world");
    assert.equal(publicDesk(fr, "fr"), "france");
    assert.equal(publicDesk(us, "en"), "usa");
  });

  it("monde listing is everything not first-published in France", () => {
    const us = stub("https://www.npr.org/2026/odd");
    const fr = stub("https://www.ladepeche.fr/insolite/nain");
    assert.equal(storyInDeskListing(us, "monde"), true);
    assert.equal(storyInDeskListing(fr, "monde"), false);
    assert.equal(storyInDeskListing(fr, "world"), true);
    assert.equal(storyInDeskListing(us, "world"), false);
  });
});
