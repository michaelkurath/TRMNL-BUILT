#!/usr/bin/env bash
set -euo pipefail

# Run from a disposable checkout. Restore the local preview config on exit.
config_backup=$(mktemp)
cp .trmnlp.yml "$config_backup"
assets_pid=
preview_pid=
cleanup() {
  if [[ -n "$preview_pid" ]]; then kill "$preview_pid" 2>/dev/null || true; fi
  if [[ -n "$assets_pid" ]]; then kill "$assets_pid" 2>/dev/null || true; fi
  mv "$config_backup" .trmnlp.yml
}
trap cleanup EXIT

device=$1
mode=${2:-artwork}
views=(full half_horizontal half_vertical quadrant)
palette_args=()
case "$device" in
  og)
    read -r width height depth <<< "800 480 1"
    classes="screen--1bit screen--og_png screen--md screen--density-1x" ;;
  x)
    read -r width height depth <<< "1872 1404 4"
    classes="screen--4bit screen--v2 screen--lg screen--density-2x" ;;
  x-portrait)
    read -r width height depth <<< "1404 1872 4"
    classes="screen--4bit screen--v2 screen--lg screen--portrait screen--density-2x" ;;
  frame|frame-portrait)
    read -r width height depth <<< "2560 1440 1"
    palette_args=(--data "palette=color-6a")
    classes="screen--color-6a screen--frame screen--xl screen--density-1x"
    if [[ "$device" == "frame-portrait" ]]; then
      read -r width height <<< "1440 2560"
      classes+=" screen--portrait"
    fi ;;
  *) echo "Unknown device: $device" >&2; exit 1 ;;
esac

BUILT_FRAME_MODE=$mode node scripts/prepare-preview.js
output="previews/$device-$mode"
mkdir -p "$output"
python3 -m http.server 4568 --bind 127.0.0.1 > "$output/assets.log" 2>&1 &
assets_pid=$!
trmnlp serve --bind 127.0.0.1 > "$output/trmnlp.log" 2>&1 &
preview_pid=$!

ready=false
for attempt in {1..30}; do
  if curl --silent --fail http://127.0.0.1:4567/full > /dev/null; then
    ready=true
    break
  fi
  if ! kill -0 "$preview_pid" 2>/dev/null; then break; fi
  sleep 1
done
if [[ "$ready" != true ]]; then
  cat "$output/trmnlp.log" >&2
  exit 1
fi

for view in "${views[@]}"; do
  curl --get --fail --silent --show-error --retry 2 --retry-all-errors \
    --data-urlencode "screen_classes=screen $classes" \
    --data "width=$width" --data "height=$height" --data "color_depth=$depth" "${palette_args[@]}" \
    "http://127.0.0.1:4567/render/$view.png" --output "$output/$view.png"
done

python3 - "$output" "$width" "$height" <<'PY'
import sys
from pathlib import Path
from PIL import Image

output, width, height = sys.argv[1:]
for path in Path(output).glob("*.png"):
    with Image.open(path) as image:
        if image.format != "PNG" or image.size != (int(width), int(height)):
            raise ValueError(f"Unexpected screenshot format or size: {path}")
        if all(low == high for low, high in image.convert("RGB").getextrema()):
            raise ValueError(f"Blank screenshot: {path}")
PY
