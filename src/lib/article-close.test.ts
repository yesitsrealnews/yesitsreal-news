import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { stripClosingLecture } from "./article-close.ts";

describe("stripClosingLecture", () => {
  it("drops the verification closer and keeps the fact", () => {
    const out = stripClosingLecture([
      "Wrexham County Borough Council approved a notice prohibiting leftover bread.",
      "A councillor asked whether ‘entitled’ should remain. It remained.",
      "YES IT'S REAL checked the minutes against the notice. Both exist. Neither is satire.",
      "Readers looking for a hoax will be disappointed. The joke is the minute. The minute is real.",
    ]);
    assert.equal(out.length, 2);
    assert.match(out[0] || "", /Wrexham/);
    assert.doesNotMatch(out.join(" "), /checked the minutes|hoax|satire/);
  });

  it("drops a YES IT'S REAL crossed/read closer", () => {
    const out = stripClosingLecture([
      "Polsat News prints the PKP post. Platforms 3 and 4 suspended.",
      "A dart. Then a sheet. Uninjured.",
      "YES IT'S REAL crossed Polsat, 20 minutes and Notes from Poland against the railway post they quote.",
    ]);
    assert.equal(out.length, 2);
    assert.doesNotMatch(out.join(" "), /crossed Polsat/);
  });

  it("drops the French republish lecture", () => {
    const out = stripClosingLecture([
      "La Dépêche du Midi, 2026-09-15. Latrape. Un bouc a bloqué un homme.",
      "YES IT'S REAL republie le fait déjà paru. On n’invente pas de citations.",
      "Les sources sont sous le papier. Si le journal d’origine corrige, on corrige. Ça s’est vraiment passé.",
    ]);
    assert.equal(out.length, 1);
    assert.match(out[0] || "", /bouc/);
  });

  it("does not empty a one-paragraph piece", () => {
    const out = stripClosingLecture(["YES IT'S REAL checked the minutes. It happened."]);
    assert.equal(out.length, 1);
  });
});
