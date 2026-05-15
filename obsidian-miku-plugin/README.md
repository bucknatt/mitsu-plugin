# Miku Hybrid (plugin source)

TypeScript source for the **Miku Hybrid** Obsidian community plugin.

## Features

- Dynamic mode switching: `MinimalMiku`, `Concert`, `NightNeon`, `SnowMiku`
- Status bar, banner, quote, and profile widgets (optional)
- Ribbon action and command for quick mode switching
- Original ASCII dashboard presets

## Development

```bash
npm install
npm run dev      # watch build
npm run build    # production bundle + theme CSS merge
npm run typecheck
```

From the **repository root**, install into a local vault:

```bash
npm run build --prefix ./obsidian-miku-plugin
./qa/install-to-vault.sh ./qa/vaults/example-vault
```

See [../CONTRIBUTING.md](../CONTRIBUTING.md).

## Build outputs

- `main.js` — bundled plugin (gitignored; attached to GitHub Releases)
- `styles.css` — widget CSS + merged theme from `../obsidian-miku-theme/theme.css`
- `styles.widgets.css` — hand-maintained widget styles (source)
- `manifest.json` — synced from repo root on build

## No-audio policy

No audio assets, APIs, settings, or dependencies.
