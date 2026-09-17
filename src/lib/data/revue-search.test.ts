import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SITE_CLUSTERS,
  QUERY_PACKS,
  SATIRE_SITE_EXCLUDE,
  buildRevueSearchPlan,
  alwaysClusters,
  rotateClusters,
  allRevueSites,
} from "./revue-search.ts";

describe("revue search base", () => {
  it("keeps France as always-on and heavier than any rotate cluster", () => {
    const always = alwaysClusters();
    assert.ok(always.some((c) => c.id.startsWith("fr-pqr")));
    assert.ok(always.some((c) => c.id === "be-ch-qc"));
    const frSites = always.filter((c) => c.id.startsWith("fr")).flatMap((c) => c.sites);
    assert.ok(frSites.length >= 30);
  });

  it("lists unique valid hosts and never satire", () => {
    const sites = allRevueSites();
    assert.ok(sites.length >= 80);
    assert.equal(sites.length, new Set(sites).size);
    for (const host of sites) {
      assert.match(host, /^[a-z0-9.-]+\.[a-z]{2,}$/);
      assert.ok(!host.startsWith("www."));
      assert.ok(!SATIRE_SITE_EXCLUDE.includes(host));
    }
    const ids = SITE_CLUSTERS.map((c) => c.id);
    assert.equal(ids.length, new Set(ids).size);
    assert.ok(ids.includes("asia"));
    assert.ok(ids.includes("africa-maghreb"));
    assert.ok(ids.includes("aus-nz"));
    assert.ok(ids.includes("latam"));
    assert.ok(ids.includes("us-local"));
  });

  it("covers every beat pack with FR + EN phrases", () => {
    assert.ok(QUERY_PACKS.length >= 8);
    for (const pack of QUERY_PACKS) {
      assert.ok(pack.fr.length >= 2, pack.beat);
      assert.ok(pack.en.length >= 2, pack.beat);
    }
  });

  it("builds a France-heavy plan and rotates world clusters across days", () => {
    const a = buildRevueSearchPlan(new Date("2026-09-17T09:00:00Z"));
    const b = buildRevueSearchPlan(new Date("2026-09-18T09:00:00Z"));
    assert.ok(a.queries.length >= 16);
    assert.ok(a.xQueries.length >= 2);
    assert.ok(a.clusters.includes("fr-pqr-ouest"));
    assert.ok(a.clusters.includes("be-ch-qc"));
    assert.ok(a.queries.every((q) => q.includes("after:")));
    assert.ok(a.queries.some((q) => q.includes("site:ouest-france.fr")));
    assert.ok(a.queries.some((q) => q.includes("-site:theonion.com")));
    const rotA = rotateClusters(new Date("2026-09-17T09:00:00Z")).map((c) => c.id);
    const rotB = rotateClusters(new Date("2026-09-18T09:00:00Z")).map((c) => c.id);
    assert.notDeepEqual(rotA, rotB);
    assert.notDeepEqual(a.queries, b.queries);
  });
});
