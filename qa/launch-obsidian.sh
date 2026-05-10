#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <vault-path>"
  exit 1
fi

VAULT_PATH="$(realpath "$1")"

if [[ ! -d "$VAULT_PATH" ]]; then
  echo "Vault path does not exist: $VAULT_PATH"
  exit 1
fi

ANCHOR="$VAULT_PATH/README.md"

EXTRA_ARGS=()
if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
  EXTRA_ARGS+=("--no-sandbox")
fi

# Obsidian's registered CLI (~/.local/bin/obsidian, often earlier on PATH) expects
# `obsidian <command> [options]`; the distro wrapper runs Electron with the same argv.
# Newer builds treat that first positional after flags as an Obsidian CLI *command*,
# so a vault path yields: Command ".../vault" not found.
# Opening by filesystem path reliably uses the URI handler instead.
launch_uri() {
  local path="$1"
  local encoded uri
  if ! command -v python3 >/dev/null 2>&1; then
    echo "python3 is required to build obsidian://open URLs (URI percent-encoding)." >&2
    return 1
  fi
  encoded="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=""))' "$path")"
  uri="obsidian://open?path=${encoded}"
  case "$(uname -s)" in
    Darwin)
      open "$uri"
      ;;
    *)
      if ! command -v xdg-open >/dev/null 2>&1; then
        echo "xdg-open not found; cannot open URI on this OS." >&2
        return 1
      fi
      xdg-open "$uri"
      ;;
  esac
}

fallback_argv_gui() {
  if [[ -n "${OBSIDIAN_GUI:-}" ]]; then
    :
  elif [[ -x "/usr/bin/obsidian" ]]; then
    OBSIDIAN_GUI="/usr/bin/obsidian"
  else
    OBSIDIAN_GUI="obsidian"
  fi
  exec env -u ELECTRON_RUN_AS_NODE "${OBSIDIAN_GUI}" "${EXTRA_ARGS[@]}" "${VAULT_PATH}"
}

# Cursor/automation shells may export ELECTRON_RUN_AS_NODE=1, which breaks Electron
# when spawning the GUI launcher directly — not consulted for xdg-open URI opens.
if [[ "${MIKU_OBSIDIAN_LEGACY_ARGV_LAUNCH:-0}" == "1" ]]; then
  fallback_argv_gui
fi

if [[ ! -f "$ANCHOR" ]]; then
  echo "Missing $ANCHOR — run ./qa/install-to-vault.sh \"$VAULT_PATH\" first (needed for obsidian://open anchor)." >&2
  exit 1
fi

if [[ "${MIKU_SKIP_OBSIDIAN_REGISTER:-0}" != "1" ]]; then
  python3 "$SCRIPT_DIR/register-obsidian-vault.py" "$VAULT_PATH"
fi

launch_uri "$ANCHOR"
exit 0
