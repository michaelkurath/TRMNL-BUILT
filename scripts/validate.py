"""Validate the editorial data, artwork exports, and TRMNL import settings."""
import json
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

import yaml
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RATING_FIELDS = (
    "recognition", "visual_strength", "story_strength", "evidence_clarity", "catalogue_fit"
)
REVIEW_FIELDS = ("fact_check", "text_review", "image_review", "final_approval")
ARTWORK = {
    "landscape": ((2560, 1440), "RGB"),
    "portrait": ((1440, 2560), "RGB"),
    "wide": ((1600, 800), "L"),
    "standard": ((1080, 810), "L"),
}
POLLING_URL = (
    "https://raw.githubusercontent.com/michaelkurath/TRMNL-BUILT/main/data/trmnl.json"
)
CUSTOM_FIELDS = {"author_bio", "display_edition", "exhibit_mode", "exhibit_ids", "frame_exhibit_ids", "frame_caption", "frame_show_title"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def validate_entry(entry, seen):
    exhibit_id = entry.get("id", "")
    require(isinstance(exhibit_id, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", exhibit_id),
            f"Invalid exhibit ID: {exhibit_id!r}")
    require(exhibit_id not in seen, f"{exhibit_id}: duplicate across the live and candidate lists")
    seen.add(exhibit_id)
    for field in ("name", "location"):
        require(isinstance(entry.get(field), str) and entry[field].strip(),
                f"{exhibit_id}: missing {field}")
    year = entry.get("year")
    require(type(year) is int and 0 < year <= date.today().year,
            f"{exhibit_id}: invalid year")
    sources = entry.get("sources", [])
    require(len(sources) >= 2, f"{exhibit_id}: two sources are required")
    links = set()
    for source in sources:
        url = urlparse(source.get("url", ""))
        require(source.get("name") and url.scheme == "https" and url.hostname,
                f"{exhibit_id}: expected a named HTTPS source")
        links.add(source["url"].rstrip("/"))
    require(len(links) == len(sources), f"{exhibit_id}: duplicate source links")


def validate_live(entry, referenced_artwork):
    exhibit_id = entry["id"]
    for field, limit in (("caption", 100), ("detail", 170), ("image_alt", 200)):
        value = entry.get(field)
        require(isinstance(value, str) and 0 < len(value.strip()) <= limit,
                f"{exhibit_id}: {field} must contain 1–{limit} characters")
    artwork = entry.get("artwork", {})
    require(artwork.keys() == ARTWORK.keys(), f"{exhibit_id}: four artwork exports required")
    for variant, (size, mode) in ARTWORK.items():
        relative = Path(artwork[variant])
        require(relative.parent == Path("assets/exhibits") and relative.suffix == ".jpg",
                f"{exhibit_id}: invalid artwork path {relative}")
        require(relative not in referenced_artwork, f"{exhibit_id}: duplicate artwork {relative}")
        referenced_artwork.add(relative)
        with Image.open(ROOT / relative) as image:
            require((image.format, image.size, image.mode) == ("JPEG", size, mode),
                    f"{relative}: expected {size[0]} × {size[1]} {mode} JPEG")
            image.load()


def validate_candidate(entry):
    exhibit_id = entry["id"]
    for field in ("story", "art_direction"):
        require(isinstance(entry.get(field), str) and entry[field].strip(),
                f"{exhibit_id}: missing {field}")
    rating = entry.get("rating", {})
    require(rating.keys() == {*RATING_FIELDS, "total"}, f"{exhibit_id}: invalid rating fields")
    scores = [rating[field] for field in RATING_FIELDS]
    require(all(type(score) is int and 1 <= score <= 5 for score in scores),
            f"{exhibit_id}: ratings must be integers from 1 to 5")
    require(type(rating["total"]) is int and rating["total"] == sum(scores),
            f"{exhibit_id}: rating total must match the scores")
    review = entry.get("review", {})
    require(review.keys() == set(REVIEW_FIELDS) and all(type(flag) is bool for flag in review.values()),
            f"{exhibit_id}: invalid review fields")
    require(not review["final_approval"] or all(review.values()),
            f"{exhibit_id}: final approval requires all preceding reviews")


def validate_settings():
    settings = yaml.safe_load((ROOT / "src/settings.yml").read_text())
    for key, value in {
        "name": "BUILT", "strategy": "polling", "polling_verb": "get",
        "polling_url": POLLING_URL, "serverless_language": "node",
    }.items():
        require(settings.get(key) == value, f"settings.yml: expected {key} to be {value!r}")
    description = settings.get("description") or ""
    require(isinstance(description, str) and 0 < len(description.strip()) <= 35,
            "settings.yml: description must contain 1–35 characters")
    fields = [field["keyname"] for field in settings.get("custom_fields", [])]
    require(CUSTOM_FIELDS.issubset(fields) and len(fields) == len(set(fields)),
            "settings.yml: missing or duplicate custom fields")


def main():
    live = json.loads((ROOT / "data/trmnl.json").read_text())["items"]
    candidates = json.loads((ROOT / "data/candidates.json").read_text())["candidates"]
    require(isinstance(live, list) and live, "The live catalogue must contain an exhibit")
    require(isinstance(candidates, list), "The candidate queue must be a list")
    seen, artwork = set(), set()
    for entry in live:
        validate_entry(entry, seen)
        validate_live(entry, artwork)
    for entry in candidates:
        validate_entry(entry, seen)
        validate_candidate(entry)
    validate_settings()
    print(f"Validated {len(live)} live exhibits, {len(candidates)} candidates and {len(artwork)} JPEGs.")


if __name__ == "__main__":
    main()
