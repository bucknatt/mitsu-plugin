#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT_PATH="${1:-$ROOT_DIR/qa/vaults/clean-desktop}"

PLUGIN_SRC="$ROOT_DIR/obsidian-miku-plugin"
PLUGIN_DST="$VAULT_PATH/.obsidian/plugins/miku-plugin-hybrid"
THEME_DST_DIR="$VAULT_PATH/.obsidian/themes"
THEME_DST_FILE="$THEME_DST_DIR/Miku Theme Hybrid Base.css"

mkdir -p "$PLUGIN_DST" "$THEME_DST_DIR"

cp "$PLUGIN_SRC/main.js" "$PLUGIN_DST/main.js"
cp "$PLUGIN_SRC/manifest.json" "$PLUGIN_DST/manifest.json"
cp "$PLUGIN_SRC/styles.css" "$PLUGIN_DST/styles.css"
cp "$ROOT_DIR/obsidian-miku-theme/theme.css" "$THEME_DST_FILE"

echo "Installed plugin + theme into: $VAULT_PATH"
echo "Plugin path: $PLUGIN_DST"
echo "Theme file: $THEME_DST_FILE"
