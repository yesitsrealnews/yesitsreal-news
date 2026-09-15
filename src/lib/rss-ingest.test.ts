import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shouldKeepHit } from "./rss-keep.ts";

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
});
