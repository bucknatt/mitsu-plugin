#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT_PATH="${1:-$ROOT_DIR/qa/vaults/clean-desktop}"

PLUGIN_SRC="$ROOT_DIR/obsidian-miku-plugin"
PLUGIN_DST="$VAULT_PATH/.obsidian/plugins/miku-plugin-hybrid"
THEME_DST_DIR="$VAULT_PATH/.obsidian/themes"
THEME_DST_FILE="$THEME_DST_DIR/Miku Theme Hybrid Base.css"
ANCHOR_NOTE="$VAULT_PATH/README.md"
INSTALL_SPLIT_THEME="${MIKU_INSTALL_SPLIT_THEME:-0}"

mkdir -p "$PLUGIN_DST"

if [[ ! -f "$ANCHOR_NOTE" ]]; then
	echo "# QA vault anchor" >>"$ANCHOR_NOTE"
	echo "This file lets \`qa/launch-obsidian.sh\` open this folder via obsidian:// (see qa/test-environment.md)." >>"$ANCHOR_NOTE"
fi

MANIFEST_SRC="$ROOT_DIR/manifest.json"
if [[ ! -f "$MANIFEST_SRC" ]]; then
	MANIFEST_SRC="$PLUGIN_SRC/manifest.json"
fi

cp "$PLUGIN_SRC/main.js" "$PLUGIN_DST/main.js"
cp "$MANIFEST_SRC" "$PLUGIN_DST/manifest.json"
cp "$PLUGIN_SRC/styles.css" "$PLUGIN_DST/styles.css"

if [[ "$INSTALL_SPLIT_THEME" == "1" ]]; then
	mkdir -p "$THEME_DST_DIR"
	cp "$ROOT_DIR/obsidian-miku-theme/theme.css" "$THEME_DST_FILE"
fi

echo "Installed plugin into: $VAULT_PATH"
echo "Plugin path: $PLUGIN_DST"
if [[ "$INSTALL_SPLIT_THEME" == "1" ]]; then
	echo "Theme file (split dev mode): $THEME_DST_FILE"
	echo "  Settings → Appearance → Theme → \"Miku Theme Hybrid Base\""
else
	echo "Bundled hybrid CSS in plugin styles.css (catalog-style install)."
fi
echo "URI anchor note: $ANCHOR_NOTE"
echo ""
echo "Next in Obsidian:"
echo "  Settings → Community plugins → enable \"Miku Plugin Hybrid\"."
