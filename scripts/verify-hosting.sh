#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
origin=${1:-https://www.drmanisdentalkaraikudi.com}
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
curl --compressed -fsS -D "$tmp/headers" "$origin/" -o "$tmp/index"
cmp dist/index.html "$tmp/index"
shasum -a 256 dist/index.html "$tmp/index"
wc -c dist/index.html "$tmp/index"
grep -i '^content-encoding:' "$tmp/headers"
while IFS= read -r asset; do
  name=${asset#dist}
  info=$(curl -fsS -o /dev/null -w '%{http_code} %{content_type}' "$origin$name")
  case "$name" in
    *.js) [[ "$info" == 200\ *javascript* ]] ;;
    *.webp) [[ "$info" == 200\ image/webp* ]] ;;
    *.mp4) [[ "$info" == 200\ video/mp4* ]] ;;
    *) [[ "$info" == 200\ * ]] ;;
  esac
done < <(find dist/assets -type f)
[[ "$(curl -fsS -H 'Range: bytes=0-1023' -o /dev/null -w '%{http_code}' "$origin/assets/hero.mp4")" == 206 ]]
[[ "$(curl -sS -o /dev/null -w '%{http_code}' "$origin/verify-page-does-not-exist/")" == 404 ]]
