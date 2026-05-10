# Desktop Test Environment Setup

## Vault Targets

- Active desktop vault (detected): `/home/cachy/Documents/bfh4`
- Clean test vault (local): `/home/cachy/IdeaProjects/cachy/mitsu-plugin/qa/vaults/clean-desktop`

## Install Artifacts Into a Vault

```bash
./qa/install-to-vault.sh /home/cachy/Documents/bfh4
```

or for isolated testing:

```bash
./qa/install-to-vault.sh ./qa/vaults/clean-desktop
```

## Expected Install Paths

- Plugin: `<vault>/.obsidian/plugins/miku-plugin-hybrid/`
- Theme CSS: `<vault>/.obsidian/themes/Miku Theme Hybrid Base.css`

The plugin only sets **`body.miku-plugin-enabled`** and **`data-miku-theme`** (plus widgets). Palette and workspace styling live in **`Miku Theme Hybrid Base.css`**. You must choose that entry under **Settings → Appearance → Theme**—enabling community plugins alone does **not** load it. Cycle modes with ribbon / **Cycle Miku theme mode** to see **`data-miku-theme`** palettes change once the theme is active.

## Notes

- This setup is desktop-focused and matches the release test plan scope.
- The script does not enable plugins/theme automatically; enable them from Obsidian settings.
- If `obsidian <vault>` fails with `Cannot find module 'electron'`, launch with:

```bash
./qa/launch-obsidian.sh /home/cachy/Documents/bfh4
```

This wrapper unsets `ELECTRON_RUN_AS_NODE` (common in automation shells) and adds `--no-sandbox` automatically when running as root.

### Opening a vault path from the terminal (URI vs argv)

Recent Obsidian builds treat the **first positional argument** after Chromium-style flags as an **Obsidian CLI subcommand** (same style of message as **`Command "/path/to/thing" not found`**), even when spawned via distro wrappers like **`/usr/bin/obsidian`** (Arch's script forwards **`electron … app.asar`** args). Passing **`/path/to/vault`** therefore no longer opens that folder reliably.

For QA, `./qa/launch-obsidian.sh` writes the vault folder into **`~/.config/obsidian/obsidian.json`** (unless `MIKU_SKIP_OBSIDIAN_REGISTER=1`). Obsidian otherwise answers **`Vault not found`** for `obsidian://open?path=...`, because URIs resolve only against **registered** vault paths. Then it opens **`xdg-open`** on **`obsidian://open?path=...`** using **`README.md`** at the vault root (created by `./qa/install-to-vault.sh` if missing). You need `python3` (encoding + registration), `xdg-open`, and a working `obsidian://` handler. Use `MIKU_OBSIDIAN_LEGACY_ARGV_LAUNCH=1 ./qa/launch-obsidian.sh ./path/to/vault` only to debug older installs that still honor folder-as-argv (`OBSIDIAN_GUI` selects the Electron wrapper in that fallback). Close Obsidian before first registration if you see config write conflicts.

If the terminal briefly logs **`ENOENT … ~/.config/obsidian/<vaultId>.json`**, Obsidian expects a small window-state JSON next to **`obsidian.json`** for each vault id. **`register-obsidian-vault.py`** now creates missing `<vaultId>.json` files automatically when you launch via **`./qa/launch-obsidian.sh`**.

### Community Plugins search versus side-loaded QA plugins

The **browse/search** modal lists plugins from Obsidian's **Community Plugins** catalog. Plugins installed only via **`./qa/install-to-vault.sh`** (files under `.obsidian/plugins/miku-plugin-hybrid/`) are **not** in that catalog, so **`Show installed only` + query** often shows **zero** hits even though the plugin is loaded. Confirm under **Settings → Community plugins**: the toggle list should include **Miku Plugin Hybrid**. The status bar **`Miku: MinimalMiku`** (or another mode name) confirms the bundle is executing.

After enabling **Settings → General → Command line interface**, Obsidian often adds **`~/.local/bin/obsidian`** ahead of the distro launcher on **`PATH`**; it only understands **`obsidian <command>`** automation when the GUI is already running, not cold-start **`obsidian /folder`**.

### Arch `user-flags.conf` trap

On Arch (and similar), `~/.config/obsidian/user-flags.conf` is inlined into the desktop launcher (`exec electron … app.asar $OBSIDIAN_USER_FLAGS "$@"`). A wrong token there is treated as a normal CLI argument—not an Electron/Chromium flag. For example `# -disable-gpu` can expand to `-disable-gpu` (missing the second hyphen), after which Obsidian may report something like **`Command "-disable-gpu" not found`**. Prefer valid flags (e.g. `--disable-gpu` if you really need GPU disable) or comment/remove the line entirely.