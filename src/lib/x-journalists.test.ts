import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { xCronMode, xJournalistFeeds, xSearchQueries, xWatches } from "./x-journalists.ts";
import { RSS_FEEDS } from "./rss-feeds.ts";
import { scoreHit } from "./rss-keep.ts";

describe("xWatches", () => {
  it("lists unique public handles, newsrooms plus odd desks", () => {
    const watches = xWatches();
    const handles = watches.map((w) => w.handle.toLowerCase());
    assert.equal(handles.length, new Set(handles).size);
    assert.ok(watches.length >= 80);
    assert.ok(watches.some((w) => w.handle === "OuestFrance"));
    assert.ok(watches.some((w) => w.handle === "nypmetro" && w.kind === "desk"));
    assert.ok(watches.some((w) => w.handle === "SoraNews24"));
    assert.ok(watches.some((w) => w.handle === "infobae" && w.priority === 1));
    assert.ok(watches.some((w) => w.handle === "NationAfrica"));
    assert.ok(watches.some((w) => w.handle === "ChannelNewsAsia"));
    assert.ok(watches.every((w) => /^[A-Za-z0-9_]{1,15}$/.test(w.handle)));
    assert.ok(watches.filter((w) => w.priority === 1).length >= 20);
  });

  it("builds Google News feeds tagged via x for every region", () => {
    const feeds = xJournalistFeeds();
    assert.ok(feeds.length >= 8);
    assert.ok(feeds.every((f) => f.via === "x" && (f.priority === 1 || f.priority === 2) && f.kind === "insolite"));
    assert.ok(feeds.some((f) => /X · FR/.test(f.name)));
    assert.ok(feeds.some((f) => /X · Asie/.test(f.name)));
    assert.ok(feeds.some((f) => /X · Afrique/.test(f.name) || /X · LatAm/.test(f.name)));
    assert.ok(RSS_FEEDS.some((f) => f.via === "x"));
  });

  it("exposes from: search queries for the revue", () => {
    const q = xSearchQueries(new Date("2026-09-18T00:00:00Z"));
    assert.ok(q.length >= 2);
    assert.ok(q.some((s) => s.includes("from:OuestFrance") || s.includes("from:nypost")));
  });

  it("switches cron to X-only after 10:00 UTC", () => {
    assert.deepEqual(xCronMode(new Date("2026-09-18T07:40:00Z")), { quick: true, xOnly: false });
    assert.deepEqual(xCronMode(new Date("2026-09-18T11:40:00Z")), { quick: false, xOnly: true });
    assert.deepEqual(xCronMode(new Date("2026-09-18T16:40:00Z")), { quick: false, xOnly: true });
  });

  it("keeps a newsroom odd-news post on the insolite X desk", () => {
    const r = scoreHit(
      "Excédé par les aboiements, il achète un coq qui chante nuit et jour",
      "Post @ladepechedumidi. Village, habitants.",
      "X · FR",
      "insolite",
    );
    assert.equal(r.keep, true);
  });
});
