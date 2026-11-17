const ASSET_ROOT = "https://raw.githubusercontent.com/michaelkurath/TRMNL-BUILT/main/";

function run(input) {
  const items = input?.items;
  if (!Array.isArray(items) || items.length === 0) return { selected_entry: null };

  const lastId = input.trmnl?.state?.last_exhibit_id;
  const previousName = input.trmnl?.previous_merge_variables?.selected_entry?.name;
  // Existing installations can start from their last dated exhibit before a cursor is saved.
  const lastIndex = lastId
    ? items.findIndex((item) => item.id === lastId)
    : items.findIndex((item) => item.name === previousName);
  const { id, name, location, year, caption, detail, image_alt, artwork } =
    items[(lastIndex + 1) % items.length];

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
