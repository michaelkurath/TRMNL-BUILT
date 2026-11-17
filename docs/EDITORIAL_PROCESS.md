# Editorial process

BUILT features completed works of architecture, industry and infrastructure with a specific design or construction decision worth explaining. An exhibit can focus on an unfinished construction stage of a project that subsequently opened or entered service. Distinguish completion, official opening and first use when those dates differ.

## Research and rate candidates

Add candidates to [the queue](../data/candidates.json) with a unique slug, project name, location, year, one construction story, an illustration brief and at least two reliable source links. Use owner, engineer, contractor, public archive or comparable sources. Check that the sources establish both the completed project and the specific method. If a subject appears in a sibling recipe, identify the construction angle that earns it a separate exhibit here.

Rate each criterion from 1 to 5 for a total out of 25.

| Criterion | Question |
| --- | --- |
| Recognition | Is the work recognisable or immediately understandable from the title? |
| Visual strength | Will the construction idea be readable at wall distance and in monochrome? |
| Story strength | Can one sentence explain an important decision and its effect? |
| Evidence clarity | Can we verify the method, scope and project milestone directly? |
| Catalogue fit | Does it add a distinctive built-work story to the collection? |

Set the review flags as work is completed. `fact_check` records source verification, `text_review` records a check of the final display copy, `image_review` records artwork and preview review, and `final_approval` records the completed editorial pass.

## Promote an exhibit

1. Verify the facts and sources again. Draft a caption of up to 100 characters and a construction detail of up to 170 characters. Use the caption for the key decision and the detail for evidence or context.
2. Create original illustrations and export the four JPEGs below. Give the image a descriptive alt text and identify interpretive images as artistic reconstructions.
3. In one pull request, move the exhibit from the candidate queue into [the live catalogue](../data/trmnl.json), append it to the rotation, retain its source links, and add its artwork. Include the verified construction story and preview evidence in the pull request.
4. Wait for the checks, then inspect the preview artifacts. Compare the Frame portrait and landscape compositions at reduced size, check the quiet upper-right caption area, and check classic crop and text legibility. Merge once the facts, artwork and previews pass review.

## Artwork exports

Store JPEGs in `assets/exhibits/` with the ID as the filename prefix.

| Export | Dimensions | Mode |
| --- | --- | --- |
| `-frame-landscape.jpg` | 2560 × 1440 | RGB |
| `-frame-portrait.jpg` | 1440 × 2560 | RGB |
| `-wide.jpg` | 1600 × 800 | Grayscale |
| `-standard.jpg` | 1080 × 810 | Grayscale |

Compose the Frame orientations separately. Show the part of the construction process that tells the story, keep a clear focal point and leave quiet space at the upper right. Use historically supported machinery and geometry where visible. Check that the grayscale crop still communicates the mechanism and keeps the subject within the frame.

## Checks

Run `python -m pip install -r scripts/requirements.txt`, then `python scripts/validate.py` and `node --test scripts/rotation.test.js`. The [GitHub workflow](../.github/workflows/trmnl.yml) also runs `trmnlp lint` and renders the standard OG and X layouts and all full-screen Frame presentation modes. Preview artifacts default to the newest live exhibit. To inspect an older exhibit, run the workflow manually with its ID or run `BUILT_EXHIBIT=<id> bash scripts/render-previews.sh frame overlay` in a checkout with trmnlp, Firefox and ImageMagick installed.
