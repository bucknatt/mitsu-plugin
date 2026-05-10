#!/usr/bin/env python3
"""Ensure a vault folder is listed in ~/.config/obsidian/obsidian.json (Linux/XDG paths).

Obsidian rejects obsidian://open?path=... with \"Vault not found\" when the folder
was never opened via Manage Vaults, because path resolution uses the registered vault list.
"""

from __future__ import annotations

import json
import os
import platform
import secrets
import sys
import time
from pathlib import Path


def obsidian_config_file() -> Path:
    home = Path.home()
    system = platform.system()
    if system == "Darwin":
        return home / "Library" / "Application Support" / "obsidian" / "obsidian.json"
    if system == "Windows":
        appdata = os.environ.get("APPDATA")
        if not appdata:
            raise SystemExit("APPDATA not set; cannot locate Obsidian config on Windows")
        return Path(appdata) / "Obsidian" / "obsidian.json"
    cfg = Path(os.environ.get("XDG_CONFIG_HOME", home / ".config"))
    return cfg / "obsidian" / "obsidian.json"


def main() -> None:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <absolute-or-relative-vault-path>", file=sys.stderr)
        raise SystemExit(2)
    vault = Path(sys.argv[1]).expanduser().resolve(strict=True)
    if not vault.is_dir():
        print(f"Not a directory: {vault}", file=sys.stderr)
        raise SystemExit(1)

    config_path = obsidian_config_file()
    config_path.parent.mkdir(parents=True, exist_ok=True)

    if config_path.exists():
        data = json.loads(config_path.read_text(encoding="utf-8"))
    else:
        data = {"vaults": {}}

    vaults = data.setdefault("vaults", {})
    if not isinstance(vaults, dict):
        print("'vaults' in obsidian.json is not an object", file=sys.stderr)
        raise SystemExit(1)

    config_parent = config_path.parent

    def ensure_per_vault_window_state(vault_id: str) -> None:
        """Obsidian reads ~/.config/obsidian/<vaultId>.json for window/chrome state on startup."""
        p = config_parent / f"{vault_id}.json"
        if p.exists():
            return
        p.write_text(
            json.dumps(
                {"isMaximized": True, "devTools": False, "zoom": -1},
                separators=(",", ":"),
            ),
            encoding="utf-8",
        )

    vault_str = str(vault)
    target_id = None
    for vid, entry in vaults.items():
        if not isinstance(entry, dict):
            continue
        p = entry.get("path")
        if not p:
            continue
        try:
            if Path(p).expanduser().resolve() == vault:
                target_id = vid
                break
        except OSError:
            continue

    if target_id is None:
        target_id = secrets.token_hex(8)
        vaults[target_id] = {
            "path": vault_str,
            "ts": int(time.time() * 1000),
            "open": True,
        }
    else:
        vaults[target_id]["path"] = vault_str
        vaults[target_id]["ts"] = int(time.time() * 1000)

    for vid, entry in vaults.items():
        if isinstance(entry, dict):
            entry["open"] = vid == target_id

    for vid in vaults:
        if isinstance(vid, str):
            ensure_per_vault_window_state(vid)

    config_path.write_text(json.dumps(data, separators=(",", ":")), encoding="utf-8")
    print(f"Registered vault in {config_path}: {vault_str}")


if __name__ == "__main__":
    main()
