# Theme CSS source (contributors)

Palette and workspace styling for **Miku Hybrid**. This folder is **not** a separate Community install for end users.

Release builds merge [`theme.css`](theme.css) into the plugin’s `styles.css` via `obsidian-miku-plugin/scripts/merge-styles.mjs`.

## Editing

- Source modules: `src/*.css`
- Shipped bundle: `theme.css` (keep in sync when editing `src/`)

## Theme modes

CSS reacts to `body[data-miku-theme]` set by the plugin:

- `MinimalMiku`, `Concert`, `NightNeon`, `SnowMiku`

## No-audio policy

No audio assets or audio-related functionality.
