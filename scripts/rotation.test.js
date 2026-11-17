const assert = require("node:assert/strict");
const { test } = require("node:test");
const { items } = require("../data/trmnl.json");
const { run, selectExhibit } = require("../src/transform");

test("empty polling data has an empty selection", () => {
  assert.deepEqual(run({ items: [] }), { selected_entry: null });
  assert.deepEqual(run(), { selected_entry: null });
});

test("selection stays fixed for a UTC day, advances at midnight, and wraps", () => {
  const other = { ...items[0], name: "Second test exhibit" };
  const pool = [items[0], other];
  for (const [time, expected] of [
    ["2026-11-16T23:59:59Z", items[0].name],
    ["2026-11-17T00:00:00Z", items[0].name],
    ["2026-11-17T23:59:59Z", items[0].name],
    ["2026-11-18T00:00:00Z", other.name],
    ["2026-11-19T00:00:00Z", items[0].name],
  ]) {
    assert.equal(selectExhibit(pool, new Date(time)).name, expected);
  }
});

test("the transform sends the four published images and trims source metadata", () => {
  const entry = selectExhibit(items.slice(0, 1), new Date());
  const artworkFields = {
    landscape: "image_url_frame_landscape",
    portrait: "image_url_frame_portrait",
    wide: "image_url_wide",
    standard: "image_url_standard",
  };
  for (const [variant, field] of Object.entries(artworkFields)) {
    assert.equal(
      entry[field],
      "https://raw.githubusercontent.com/michaelkurath/TRMNL-BUILT/main/" +
        items[0].artwork[variant]
    );
  }
  assert.equal(entry.caption, items[0].caption);
  assert.equal(entry.detail, items[0].detail);
  assert.equal(entry.sources, undefined);
});
