#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Running lifecycle/performance guard checks..."

# Ensure plugin lifecycle calls registry mount/unmount.
rg "mountAll\\(\\)" "$ROOT_DIR/obsidian-miku-plugin/src/main.ts" >/dev/null
rg "unmountAll\\(\\)" "$ROOT_DIR/obsidian-miku-plugin/src/main.ts" >/dev/null

# Ensure quote interval is cleaned up.
rg "clearInterval" "$ROOT_DIR/obsidian-miku-plugin/src/widgets.ts" >/dev/null
rg "stopRotation\\(\\)" "$ROOT_DIR/obsidian-miku-plugin/src/widgets.ts" >/dev/null

# Ensure dashboard leaves are detached on unmount path.
rg "detachLeavesOfType\\(MIKU_PANEL_VIEW\\)" "$ROOT_DIR/obsidian-miku-plugin/src/modules.ts" >/dev/null

# Basic anti-polling guard.
if rg "setInterval\\(|setTimeout\\(" "$ROOT_DIR/obsidian-miku-plugin/src" >/dev/null; then
  # Allow quote widget interval only.
  COUNT="$(rg "setInterval\\(|setTimeout\\(" "$ROOT_DIR/obsidian-miku-plugin/src" | wc -l | tr -d ' ')"
  if [[ "$COUNT" -gt 1 ]]; then
    echo "Unexpected repeated timers detected: $COUNT"
    exit 1
  fi
fi

echo "Lifecycle/performance guards passed."
