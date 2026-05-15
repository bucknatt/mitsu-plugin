# Miku Plugin Hybrid

Hatsune Miku–inspired theme modes, optional dashboard widgets, and bundled hybrid styling for [Obsidian](https://obsidian.md/).

## Install (Community plugins)

1. Open **Settings → Community plugins**.
2. Turn off **Restricted mode** (first-time setup).
3. Select **Browse**, search for **Miku** or **Hybrid**.
4. Install **Miku Plugin Hybrid**, then **Enable**.

No separate Appearance theme is required: release builds bundle palette CSS into the plugin `styles.css`.

## Features

- Theme modes: `MinimalMiku`, `Concert`, `NightNeon`, `SnowMiku`
- Ribbon and command: **Cycle Miku theme mode**
- Optional status bar, banner, quote, and profile widgets
- Dashboard with original ASCII decoration presets
- Reduced-motion and glow intensity settings

## Commands

| Command | Action |
|---------|--------|
| Cycle Miku theme mode | Rotates the active `data-miku-theme` mode |
| Open Miku dashboard | Opens the Miku panel view |

## No-audio policy

This plugin includes no audio assets, APIs, or dependencies.

## Legal

- Fan-inspired visuals and original ASCII motifs only—not official Crypton Future Media artwork or audio.
- Do not redistribute official character media without permission.
- You are responsible for compliance with applicable trademark and copyright law.

## Development (monorepo)

Source layout:

- `obsidian-miku-plugin/` — TypeScript plugin (`npm run build` merges theme CSS)
- `obsidian-miku-theme/` — Theme CSS source (bundled at build time)
- `qa/` — Install helpers and guards

```bash
npm install --prefix ./obsidian-miku-plugin
npm run build --prefix ./obsidian-miku-plugin
npm run typecheck --prefix ./obsidian-miku-plugin
./qa/install-to-vault.sh /path/to/vault
```

See [qa/test-environment.md](qa/test-environment.md) for vault install and launch notes.

## Publishing

- Catalog metadata: root `manifest.json`, `versions.json`, `LICENSE`
- Release: tag `x.y.z` (no `v` prefix) matching `manifest.json` `version`; GitHub Actions attaches `main.js`, `manifest.json`, `styles.css`
- Submit: [docs/COMMUNITY_SUBMISSION.md](docs/COMMUNITY_SUBMISSION.md)
