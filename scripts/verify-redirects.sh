#!/usr/bin/env bash
set -u
cd "$(dirname "$0")/.."
failed=0
while IFS=, read -r old target; do
  [[ "$old" == old_path ]] && continue
  for origin in https://drmanisdentalclinic.com https://www.drmanisdentalclinic.com http://drmanisdentalclinic.com http://www.drmanisdentalclinic.com; do
    variants=("$old")
    if [[ "$old" != / ]]; then
      variants+=("$old/" "$(printf '%s' "$old" | tr '[:lower:]' '[:upper:]')")
    fi
    for path in "${variants[@]}"; do
      result=$(curl -sSI --connect-timeout 5 --max-time 12 "$origin$path") || { failed=1; continue; }
      code=$(printf '%s\n' "$result" | awk '/^HTTP\// {n=$2} END{print n}')
      location=$(printf '%s\n' "$result" | awk 'tolower($1)=="location:" { sub(/^[^:]+:[[:space:]]*/,""); sub(/\r$/,""); print }')
      if [[ "$code" != 301 || "$location" != "$target" ]]; then
        printf 'FAIL %s%s -> %s %s (expected 301 %s)\n' "$origin" "$path" "$code" "$location" "$target"
        failed=1
      fi
    done
  done
done < docs/old-domain-redirects.csv
exit "$failed"
