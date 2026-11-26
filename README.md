# BUILT for TRMNL

**What it took to make it real.**

BUILT shows an illustrated exhibit about a completed landmark and the design or construction decision that made it possible. The colour illustrations depict construction in progress.

- **Frame** — separately composed landscape and portrait colour artwork. Choose Artwork only, optionally with a title, or Caption overlay.
- **OG and X** — monochrome artwork and a short construction story. The X full layout also shows a construction detail. All four standard TRMNL layouts are included.

## Choose exhibits

Set **Exhibit rotation** to **My Selection** and open **Choose exhibits**. Copy your selection from the catalogue picker and paste it into **My exhibits**. A single title stays on screen. Several titles use the normal refresh and rotation rules. **Full Collection** is the default, and it also applies when no selected titles are available. Choose **Frame** under **Display edition** to use **My Frame exhibits**, which lists exhibits with both colour orientations.

## Live catalogue

| Exhibit | Construction story |
| --- | --- |
| Millau Viaduct | Launching the steel deck from both sides of the Tarn valley |
| Sydney Opera House | Using a common spherical geometry to build the roof shells |
| Hoover Dam | Cooling concrete blocks through embedded steel pipes |
| Gotthard Base Tunnel | Bracing a tunnel boring machine against the rock to advance its cutterhead |
| Gateway Arch | Lifting steel sections with climbing derricks while a temporary truss braced the two legs |
| Guggenheim Museum Bilbao | Translating complex curves into buildable geometry with CATIA |
| Abu Simbel Temples Relocation | Cutting the temples into blocks and reassembling them above the reservoir |
| Golden Gate Bridge | Spinning individual steel wires over the towers to build the main cables |
| Eiffel Tower | Aligning first-floor ironwork with temporary hydraulic cylinders and hand pumps |
| Brunelleschi’s Dome | Stabilizing rising inclined masonry courses with herringbone brickwork |
| Falkirk Wheel | Joining segmented rotating arms with bolted site connections |
| Forth Bridge | Extending cantilever arms in balance on both sides of each tower |

## Install BUILT

1. Open **BUILT** in TRMNL (plugin ID `543792`) and import this repository in its GitHub sync card. Leave the repository folder blank so the import uses `src/`. Import before clicking **Save** so TRMNL has the repository settings before it writes back to GitHub.
2. In **Edit Markup**, check that **Serverless** shows Node and the transform from `src/transform.js`. If the code is missing, paste the transform there. Check that the polling URL points to `data/trmnl.json` on `main`.
3. Force-refresh the preview. Automatic display edition selects the Frame gallery in full view. A manual override and the Frame presentation options are available in settings.

Each successful TRMNL data refresh advances to the next exhibit in catalogue order, then wraps to the beginning. The Node transform uses TRMNL Saved State to remember the last exhibit. **Force Refresh** in the plugin settings fetches new data and advances the rotation. Reloading a cached preview or viewing a different layout uses the last rendered exhibit.

## Catalogue and artwork

The [catalogue](data/trmnl.json) records the display text, original artistic reconstructions and sources.

Each entry uses a 2560 × 1440 landscape and a 1440 × 2560 portrait colour JPEG, with space in the upper-right for the caption. The classic layouts use 2:1 and 4:3 grayscale exports. Artwork is illustrative and may simplify construction details.

The Frame layout adapts the [NEVER BUILT Frame markup](https://github.com/michaelkurath/Never-Built/blob/95dc5bb/src/shared.liquid) by Michael Kurath under its [CC BY 4.0 licence](https://github.com/michaelkurath/Never-Built/blob/95dc5bb/LICENSE.md). BUILT uses its own artwork, captions, and classic layouts.

## Contribute an exhibit

The [candidate queue](data/candidates.json) records rated ideas and their sources. Follow the [editorial process](docs/EDITORIAL_PROCESS.md) to prepare a live exhibit, export artwork, and inspect device previews. [GitHub Actions](https://github.com/michaelkurath/TRMNL-BUILT/actions) runs the catalogue, rotation, and render checks on pull requests and updates to `main`.
