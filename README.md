# BUILT for TRMNL

**What it took to make it real.**

BUILT is a daily illustrated exhibit about a completed landmark and the design or construction decision that made it possible. The pilot covers the **Millau Viaduct**, whose steel deck was launched from both sides of the Tarn valley. The colour illustrations depict the bridge under construction.

- **Frame** — separately composed landscape and portrait colour artwork. Choose Artwork only, optionally with a title, or Caption overlay.
- **OG and X** — monochrome artwork and a short construction story. The X full layout also shows a construction detail. All four standard TRMNL layouts are included.

## Install the pilot

1. Create a private plugin called **BUILT**, connect this repository in its GitHub sync card, and import the repository configuration. Leave the repository folder blank so the import uses `src/`.
2. In **Edit Markup**, check that **Serverless** shows Node and the transform from `src/transform.js`. If the code is missing, paste the transform there. Check that the polling URL points to `data/trmnl.json` on `main`.
3. Force-refresh the preview. Automatic display edition selects the Frame gallery in full view. A manual override and the Frame presentation options are available in settings.

The catalogue rotates by UTC date at the next refresh after midnight. The pilot has one exhibit, so it appears every day until the catalogue grows. Saved State is unnecessary. Catalogue order determines rotation.

## Catalogue and artwork

The [catalogue](data/trmnl.json) records the display text, original artistic reconstructions and sources. Eiffage verifies the opening and launch milestones. Bureau Greisch documents the launch from both sides and the temporary works.

Each entry uses a 2560 × 1440 landscape and a 1440 × 2560 portrait colour JPEG, with space in the upper-right for the caption. The classic layouts use 2:1 and 4:3 grayscale exports. Artwork is illustrative and may simplify construction details.

The Frame layout adapts the [NEVER BUILT Frame markup](https://github.com/michaelkurath/Never-Built/blob/95dc5bb/src/shared.liquid) by Michael Kurath under its [CC BY 4.0 licence](https://github.com/michaelkurath/Never-Built/blob/95dc5bb/LICENSE.md). BUILT uses its own artwork, captions, and classic layouts.

## Contribute an exhibit

The [candidate queue](data/candidates.json) records rated ideas and their sources. Follow the [editorial process](docs/EDITORIAL_PROCESS.md) to prepare a live exhibit, export artwork, and inspect device previews. [GitHub Actions](https://github.com/michaelkurath/TRMNL-BUILT/actions) runs the catalogue, rotation, and render checks on pull requests and updates to `main`.
