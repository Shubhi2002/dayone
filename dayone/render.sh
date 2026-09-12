#!/bin/zsh
# Renders HTML mockups / brand assets to 2x PNGs with headless Chrome.
#
#   ./render.sh mockups          # renders mockups/*.html -> mockups/png/*.png
#   ./render.sh brand            # renders brand/*.html   -> brand/png/*.png
#   ./render.sh brand dayone     # only files whose name contains "dayone"
#
# Each HTML file may declare its canvas size on the <html> tag:
#   <html data-size="1600x800">      (defaults to 1440x900)
#
# Note: headless Chrome on macOS needs to run outside the Claude sandbox
# (it reads system appearance resources), and it tends to hang on exit,
# so each render is killed once the PNG lands on disk.

set -u
cd "$(dirname "$0")"
dir="${1:-mockups}"
filter="${2:-}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$dir/png"

for f in "$dir"/*.html; do
  name="$(basename "${f%.html}")"
  [[ -n "$filter" && "$name" != *"$filter"* ]] && continue
  out="$PWD/$dir/png/$name.png"
  size="$(grep -o 'data-size="[0-9]*x[0-9]*"' "$f" | head -1 | grep -o '[0-9]*x[0-9]*')"
  size="${size:-1440x900}"
  w="${size%x*}"; h="${size#*x}"
  rm -f "$out"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --user-data-dir="/tmp/claude/chrome-profile-$$-$RANDOM" \
    --window-size="$w,$h" --force-device-scale-factor=2 --virtual-time-budget=8000 \
    --screenshot="$out" "file://$PWD/$f" >/dev/null 2>&1 &
  pid=$!
  for i in {1..200}; do sleep 0.5; [[ -s "$out" ]] && break; done
  sleep 1; kill $pid 2>/dev/null; wait $pid 2>/dev/null
  echo "$dir/png/$name.png ($size) $( [[ -s "$out" ]] && echo ok || echo FAILED )"
done
