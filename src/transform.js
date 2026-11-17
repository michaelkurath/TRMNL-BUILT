const ASSET_ROOT = "https://raw.githubusercontent.com/michaelkurath/TRMNL-BUILT/main/";

function getSelectedPool(items, settings) {
  if (settings?.exhibit_mode !== "selected") return [];

  const ids = Array.isArray(settings.exhibit_ids)
    ? settings.exhibit_ids
    : String(settings.exhibit_ids ?? "").split(",");
  const selectedIds = new Set(ids.map((id) => String(id).trim()));
  return items.filter((item) => selectedIds.has(item.id) && (
    settings.display_edition !== "frame" ||
    (item.artwork?.landscape && item.artwork?.portrait)
  ));
}

function run(input) {
  const items = input?.items;
  if (!Array.isArray(items) || items.length === 0) return { selected_entry: null };

  const selectedPool = getSelectedPool(items, input.trmnl?.plugin_settings?.custom_fields_values);
  const pool = selectedPool.length ? selectedPool : items;
  const lastId = input.trmnl?.state?.last_exhibit_id;
  const previousName = input.trmnl?.previous_merge_variables?.selected_entry?.name;
  // Existing installations can start from their last dated exhibit before a cursor is saved.
  const lastIndex = lastId
    ? pool.findIndex((item) => item.id === lastId)
    : pool.findIndex((item) => item.name === previousName);
  const { id, name, location, year, caption, detail, image_alt, artwork } =
    pool[(lastIndex + 1) % pool.length];

  return {
    selected_entry: {
      name, location, year, caption, detail, image_alt,
      image_url_frame_landscape: ASSET_ROOT + artwork.landscape,
      image_url_frame_portrait: ASSET_ROOT + artwork.portrait,
      image_url_wide: ASSET_ROOT + artwork.wide,
      image_url_standard: ASSET_ROOT + artwork.standard
    },
    trmnl_state: { last_exhibit_id: id }
  };
}

if (typeof module !== "undefined") module.exports = { run };
