const ASSET_ROOT = "https://raw.githubusercontent.com/michaelkurath/TRMNL-BUILT/main/";
const DAY_MS = 86_400_000;
const ROTATION_START = Date.UTC(2026, 10, 17);

function selectExhibit(items, now) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const elapsedDays = Math.max(0, Math.floor((now.getTime() - ROTATION_START) / DAY_MS));
  const { name, location, year, caption, detail, image_alt, artwork } =
    items[elapsedDays % items.length];

  return {
    name, location, year, caption, detail, image_alt,
    image_url_frame_landscape: ASSET_ROOT + artwork.landscape,
    image_url_frame_portrait: ASSET_ROOT + artwork.portrait,
    image_url_wide: ASSET_ROOT + artwork.wide,
    image_url_standard: ASSET_ROOT + artwork.standard
  };
}

function run(input) {
  return { selected_entry: selectExhibit(input?.items, new Date()) };
}

if (typeof module !== "undefined") module.exports = { run, selectExhibit };
