const assert = require("node:assert/strict");
const { test } = require("node:test");
const { items } = require("../data/trmnl.json");
const { run } = require("../src/transform");

test("empty polling data leaves the saved cursor untouched", () => {
  assert.deepEqual(run({ items: [], trmnl: { state: { last_exhibit_id: "anything" } } }),
    { selected_entry: null });
  assert.deepEqual(run(), { selected_entry: null });
});

test("each refresh advances in catalogue order and wraps using Saved State", () => {
  let state = {};
  for (const exhibit of [...items, items[0]]) {
    const result = run({ items, trmnl: { state } });
    assert.equal(result.selected_entry.name, exhibit.name);
    assert.deepEqual(result.trmnl_state, { last_exhibit_id: exhibit.id });
    state = result.trmnl_state;
  }
});

test("an existing install can continue from its last exhibit on the first refresh", () => {
  const result = run({
    items,
    trmnl: { previous_merge_variables: { selected_entry: { name: items[0].name } } }
  });
  assert.equal(result.selected_entry.name, items[1 % items.length].name);
});

test("a removed exhibit restarts at the first entry and a one-entry catalogue wraps", () => {
  const unknown = run({ items, trmnl: { state: { last_exhibit_id: "removed-exhibit" } } });
  assert.equal(unknown.selected_entry.name, items[0].name);
  const only = run({ items: [items[0]], trmnl: { state: unknown.trmnl_state } });
  assert.equal(only.selected_entry.name, items[0].name);
});

test("the transform sends the four published images and trims source metadata", () => {
  const { selected_entry: entry } = run({ items: [items[0]] });
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

test("My Selection pins one exhibit or advances only through the chosen exhibits", () => {
  const [first, , third] = items;
  const custom_fields_values = { exhibit_mode: "selected", exhibit_ids: [first.id, third.id, "removed"] };
  const trmnl = { plugin_settings: { custom_fields_values } };
  for (const exhibit of [first, third, first]) {
    const result = run({ items, trmnl });
    assert.equal(result.selected_entry.name, exhibit.name);
    trmnl.state = result.trmnl_state;
  }

  const classicOnly = { ...first, id: "classic-only", artwork: { ...first.artwork, portrait: null } };
  Object.assign(custom_fields_values, { display_edition: "frame", frame_exhibit_ids: classicOnly.id + "," + third.id });
  for (let i = 0; i < 2; i++) {
    const result = run({ items: [classicOnly, ...items], trmnl });
    assert.equal(result.selected_entry.name, third.name);
    trmnl.state = result.trmnl_state;
  }
  custom_fields_values.frame_exhibit_ids = [];
  assert.equal(run({ items, trmnl }).selected_entry.name, first.name);

  Object.assign(custom_fields_values, { exhibit_mode: "all", exhibit_ids: [third.id] });
  assert.equal(run({ items, trmnl }).selected_entry.name, first.name);
});
