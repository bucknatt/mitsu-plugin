# Obsidian Miku Plugin Hybrid

Runtime plugin for the Hatsune Miku hybrid experience.

## Features

- Dynamic mode switching: `MinimalMiku`, `Concert`, `NightNeon`, `SnowMiku`
- Status bar widget
- Optional top banner widget
- Optional quote widget with interval control
- Optional profile card widget
- Ribbon action + command for quick mode switching
- Optional **original ASCII decorations** on the dashboard (presets: Minimal, Micro, Panel, Notes, Stage, Waves, Sparkle, Ribbon) and a compact motif on the settings screen

Visual palette for the companion **Miku Theme Hybrid Base** theme is driven by [Color-Hex palette 19601](https://www.color-hex.com/color-palette/19601) (`#373b3e`, `#bec8d1`, `#86cecb`, `#137a7f`, `#e12885`) mapped into CSS variables per mode.

## No-Audio Policy

This plugin intentionally includes no audio capabilities:

- no audio assets
- no audio APIs
- no audio settings
- no audio dependencies

## Development

```bash
npm install
npm run dev
```

## Release Artifacts

- `main.js`
- `styles.css`
- `manifest.json`

## Compatibility

- `minAppVersion`: `1.5.0`
- `isDesktopOnly`: `false`
