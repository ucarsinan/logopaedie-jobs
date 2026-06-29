#!/usr/bin/env bash
set -euo pipefail

echo "== logopaedie-jobs verify =="

if node -e "const s=require('./package.json').scripts||{}; process.exit(s.check ? 0 : 1)" 2>/dev/null; then
  echo "-- npm run check"
  npm run check
elif node -e "const p=require('./package.json'); process.exit((p.devDependencies||{})['@astrojs/check'] || (p.dependencies||{})['@astrojs/check'] ? 0 : 1)" 2>/dev/null; then
  echo "-- npx astro check"
  npx astro check
else
  echo "-- typecheck/check uebersprungen: kein check-Skript und kein @astrojs/check gefunden"
fi

echo "-- npm run build"
npm run build

echo "-- git diff --check"
git diff --check

echo "-- untracked relevant files whitespace check"
files="$(git ls-files --others --exclude-standard | grep -E '\.(astro|css|html|js|json|md|mjs|ts|tsx|yml|yaml|sh)$' || true)"
if [[ -n "$files" ]]; then
  while IFS= read -r file; do
    if grep -n '[[:blank:]]$' "$file"; then
      echo "Trailing whitespace in $file" >&2
      exit 1
    fi
    if [[ -s "$file" ]] && [[ $(tail -c 1 "$file") != "" ]]; then
      echo "Missing newline at EOF in $file" >&2
      exit 1
    fi
  done <<< "$files"
else
  echo "Keine relevanten untracked Dateien gefunden."
fi

echo "-- Freigabepflichtige Checks nicht ausgefuehrt"
echo "Nicht ausgefuehrt ohne Freigabe: produktive Datenbank-/Datenservice-Zugriffe, Vercel Deploy, Live-Domain-/DNS-Aenderungen."
echo "== verify complete =="
