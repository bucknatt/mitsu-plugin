#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <vault-path>"
  exit 1
fi

VAULT_PATH="$1"

if [[ ! -d "$VAULT_PATH" ]]; then
  echo "Vault path does not exist: $VAULT_PATH"
  exit 1
fi

EXTRA_ARGS=()
if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
  EXTRA_ARGS+=("--no-sandbox")
fi

# Cursor/automation shells may export ELECTRON_RUN_AS_NODE=1, which breaks
# Electron apps by making them run as plain Node.
exec env -u ELECTRON_RUN_AS_NODE obsidian "${EXTRA_ARGS[@]}" "$VAULT_PATH"
