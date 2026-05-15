#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Running static guards..."

rg "data-miku-theme|data-miku-reduced-motion|miku-glow-intensity" \
  "$ROOT_DIR/obsidian-miku-plugin/src/theme-manager.ts" >/dev/null

rg "body\\[data-miku-theme=" "$ROOT_DIR/obsidian-miku-theme/theme.css" >/dev/null

rg "body\\[data-miku-theme=" "$ROOT_DIR/obsidian-miku-plugin/styles.css" >/dev/null
rg "Miku hybrid theme \\(bundled" "$ROOT_DIR/obsidian-miku-plugin/styles.css" >/dev/null

rg "mount\\(\\)|update\\(settings|unmount\\(\\)" \
  "$ROOT_DIR/obsidian-miku-plugin/src/modules.ts" >/dev/null

rg "registerView|detachLeavesOfType|miku-open-dashboard|miku-cycle-theme" \
  "$ROOT_DIR/obsidian-miku-plugin/src/main.ts" >/dev/null

if rg -i "new Audio\\(|howler|<audio|audio/" "$ROOT_DIR/obsidian-miku-plugin" >/dev/null; then
  echo "Audio policy violation detected in plugin package."
  exit 1
fi

if rg -i "new Audio\\(|howler|<audio|audio/" "$ROOT_DIR/obsidian-miku-theme" >/dev/null; then
  echo "Audio policy violation detected in theme package."
  exit 1
fi

echo "All static guards passed."
