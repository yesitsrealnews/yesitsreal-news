import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NEWSROOM_X, newsroomXForUrl, originSource, hostFromUrl } from "./source-x.ts";
import type { Source } from "./types.ts";

describe("newsroom X", () => {
  it("maps La Dépêche to the official newsroom, never a reporter", () => {
    const hit = newsroomXForUrl(
      "https://www.ladepeche.fr/2026/09/15/scene-insolite-au-sud-de-toulouse-un-habitant-sequestre-chez-lui-par-un-bouc-sauvage-et-agressif-les-pompiers-sedatent-lanimal-13552745.php",
    );
    assert.deepEqual(hit, { handle: "@ladepechedumidi", href: "https://x.com/ladepechedumidi" });
  });

  it("maps subdomains to the parent newsroom", () => {
    const hit = newsroomXForUrl("https://nantes.ouest-france.fr/faits-divers/foo");
    assert.equal(hit?.handle, "@OuestFrance");
  });

  it("does not invent handles for unknown or placeholder hosts", () => {
    assert.equal(newsroomXForUrl("https://council.example/wrexham/minutes"), null);
    assert.equal(newsroomXForUrl("https://some-random-blog.xyz/post"), null);
    assert.equal(newsroomXForUrl("not-a-url"), null);
  });

  it("every mapped handle is a legal X username", () => {
    for (const [host, handle] of Object.entries(NEWSROOM_X)) {
      assert.match(handle, /^[A-Za-z0-9_]{1,15}$/, `${host} → ${handle}`);
    }
  });

  it("picks the first real origin, skips placeholders", () => {
    const sources: Source[] = [
      { title: "Minutes", publisher: "Council", url: "https://council.example/a", date: "2026-08-12", type: "gazette" },
      {
        title: "Goat",
        publisher: "La Dépêche du Midi",
        url: "https://www.ladepeche.fr/2026/09/15/bouc",
        date: "2026-09-15",
        type: "local",
      },
    ];
    assert.equal(originSource(sources)?.publisher, "La Dépêche du Midi");
    assert.equal(hostFromUrl(originSource(sources)!.url), "ladepeche.fr");
  });
});
