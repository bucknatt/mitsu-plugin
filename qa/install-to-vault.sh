#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT_PATH="${1:-$ROOT_DIR/qa/vaults/example-vault}"

PLUGIN_SRC="$ROOT_DIR/obsidian-miku-plugin"
PLUGIN_DST="$VAULT_PATH/.obsidian/plugins/miku-plugin-hybrid"
THEME_DST_DIR="$VAULT_PATH/.obsidian/themes"
THEME_DST_FILE="$THEME_DST_DIR/Miku Theme Hybrid Base.css"
INSTALL_SPLIT_THEME="${MIKU_INSTALL_SPLIT_THEME:-0}"

if [[ ! -f "$PLUGIN_SRC/main.js" || ! -f "$PLUGIN_SRC/styles.css" ]]; then
	echo "Missing build artifacts. Run: npm run build --prefix ./obsidian-miku-plugin" >&2
	exit 1
fi

mkdir -p "$PLUGIN_DST" "$VAULT_PATH"

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
else
	echo "Bundled hybrid CSS in plugin styles.css."
fi
echo ""
echo "Open the vault in Obsidian, then enable \"Miku Hybrid\" under Community plugins."
