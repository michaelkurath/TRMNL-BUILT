// Preview local artwork and a fixed exhibit in a disposable CI checkout.
const { writeFileSync } = require("node:fs");
const { items } = require("../data/trmnl.json");
const { run } = require("../src/transform");

const slug = process.env.BUILT_EXHIBIT;
const mode = process.env.BUILT_FRAME_MODE || "artwork";
const exhibit = slug ? items.find(({ id }) => id === slug) : items.at(-1);
if (!exhibit) throw new Error(`Unknown live exhibit: ${slug}`);
if (!["artwork", "title", "overlay"].includes(mode)) throw new Error(`Unknown Frame mode: ${mode}`);

const { selected_entry: selected } = run({ items: [exhibit] });
for (const key of Object.keys(selected).filter(key => key.startsWith("image_url_"))) {
  const asset = selected[key].split("/main/")[1];
  selected[key] = `http://127.0.0.1:4568/${asset}`;
}

const config = {
  watch: false,
  time_zone: "UTC",
  transform_runtime: "disabled",
  custom_fields: {
    display_edition: "auto",
    frame_caption: mode === "overlay" ? "overlay" : "artwork",
    frame_show_title: mode === "title",
  },
  variables: { selected_entry: selected, trmnl: {} },
};
writeFileSync(".trmnlp.yml", JSON.stringify(config, null, 2) + "\n");
console.log(`Previewing ${exhibit.id} in ${mode} mode.`);
