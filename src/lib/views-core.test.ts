import test from "node:test";
import assert from "node:assert/strict";
import {
  addToDelta,
  applyDelta,
  formatViewsDoc,
  isBotUserAgent,
  isCountableStoryId,
  parseViewsDoc,
  summarize,
  SITE_KEY,
  type ViewsDelta,
} from "./views-core.ts";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15";

test("applyDelta accumulates per story, per day and site totals", () => {
  const delta: ViewsDelta = new Map();
  addToDelta(delta, "2026-10-01", "s12", 1, 1);
  addToDelta(delta, "2026-10-01", "s12", 1, 0);
  addToDelta(delta, "2026-10-01", SITE_KEY, 2, 1);
  const doc = applyDelta(parseViewsDoc(null), delta, "2026-10-01T10:00:00.000Z");
  assert.deepEqual(doc.s.s12, [2, 1]);
  assert.deepEqual(doc.t, [2, 1]);
  const round = parseViewsDoc(formatViewsDoc(doc));
  const sum = summarize(round, new Date("2026-10-01T12:00:00Z"));
  assert.deepEqual(sum.stories.s12, { views: 2, uniques: 1, views7d: 2, uniques7d: 1 });
  assert.deepEqual(sum.site, { views: 2, uniques: 1, views7d: 2, uniques7d: 1 });
  assert.deepEqual(sum.today, [2, 1]);
});

test("negative corrections clamp at zero and old days are pruned", () => {
  let doc = parseViewsDoc(null);
  for (let i = 1; i <= 10; i += 1) {
    const delta: ViewsDelta = new Map();
    addToDelta(delta, `2026-09-${String(i).padStart(2, "0")}`, "s1", 1, 1);
    doc = applyDelta(doc, delta, "x");
  }
  assert.equal(Object.keys(doc.d).length, 8);
  assert.deepEqual(doc.s.s1, [10, 10]);
  const fix: ViewsDelta = new Map();
  addToDelta(fix, "2026-09-10", "s1", -5, -5);
  doc = applyDelta(doc, fix, "y");
  assert.deepEqual(doc.d["2026-09-10"].s1, [0, 0]);
  assert.deepEqual(doc.s.s1, [5, 5]);
  const sum = summarize(doc, new Date("2026-09-10T08:00:00Z"));
  assert.equal(sum.stories.s1.views7d, 6);
});

test("parse rejects junk and bot filter works", () => {
  assert.deepEqual(parseViewsDoc("nope").s, {});
  assert.deepEqual(parseViewsDoc(JSON.stringify({ v: 1, s: { "../x": [1, 1], s3: [2, 1] } })).s, { s3: [2, 1] });
  assert.equal(isCountableStoryId("s42"), true);
  assert.equal(isCountableStoryId("admin"), false);
  assert.equal(isBotUserAgent(UA), false);
  assert.equal(isBotUserAgent("Googlebot/2.1 (+http://www.google.com/bot.html)"), true);
  assert.equal(isBotUserAgent("curl/8.5.0"), true);
  assert.equal(isBotUserAgent(""), true);
});
