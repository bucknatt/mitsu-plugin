#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT_PATH="${1:-$ROOT_DIR/qa/vaults/clean-desktop}"

PLUGIN_SRC="$ROOT_DIR/obsidian-miku-plugin"
PLUGIN_DST="$VAULT_PATH/.obsidian/plugins/miku-plugin-hybrid"
THEME_DST_DIR="$VAULT_PATH/.obsidian/themes"
THEME_DST_FILE="$THEME_DST_DIR/Miku Theme Hybrid Base.css"
ANCHOR_NOTE="$VAULT_PATH/README.md"

mkdir -p "$PLUGIN_DST" "$THEME_DST_DIR"

if [[ ! -f "$ANCHOR_NOTE" ]]; then
	echo "# QA vault anchor" >>"$ANCHOR_NOTE"
	echo "This file lets \`qa/launch-obsidian.sh\` open this folder via obsidian:// (see qa/test-environment.md)." >>"$ANCHOR_NOTE"
fi

cp "$PLUGIN_SRC/main.js" "$PLUGIN_DST/main.js"
cp "$PLUGIN_SRC/manifest.json" "$PLUGIN_DST/manifest.json"
cp "$PLUGIN_SRC/styles.css" "$PLUGIN_DST/styles.css"
cp "$ROOT_DIR/obsidian-miku-theme/theme.css" "$THEME_DST_FILE"

echo "Installed plugin + theme into: $VAULT_PATH"
echo "Plugin path: $PLUGIN_DST"
echo "Theme file: $THEME_DST_FILE"
echo "URI anchor note: $ANCHOR_NOTE"
echo ""
echo "Next in Obsidian (required for vault-wide colors):"
echo "  Settings → Appearance → Theme → pick theme named like the file:"
echo "  \"Miku Theme Hybrid Base\" (not auto-selected when you enable the plugin)."
