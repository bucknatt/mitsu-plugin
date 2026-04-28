# Obsidian Hatsune Miku Hybrid

This repository contains a hybrid split implementation:

- `obsidian-miku-plugin/`: runtime plugin (theme switching, widgets, dashboard)
- `obsidian-miku-theme/`: visual theme package (palette, typography, components, animations)

## Scope

- Full visual Hatsune Miku inspired experience
- Optional widget modules and dashboard tools
- Strict no-audio policy for legal/performance clarity

## Release Artifacts

### Plugin package

- `obsidian-miku-plugin/main.js`
- `obsidian-miku-plugin/styles.css`
- `obsidian-miku-plugin/manifest.json`

### Theme package

- `obsidian-miku-theme/theme.css`
- `obsidian-miku-theme/manifest.json`

## Development

```bash
npm install --prefix ./obsidian-miku-plugin
npm run build --prefix ./obsidian-miku-plugin
npm run typecheck --prefix ./obsidian-miku-plugin
```

## Performance and Guardrails

- Event-driven UI updates only (no constant DOM polling)
- Widget lifecycle is mount/update/unmount based
- Reduced-motion mode is supported
- Avoid copyrighted official audio or proprietary assets

## Legal Safety Notes

- Use inspired palettes and original assets
- Do not redistribute official Crypton media without permission
- Keep bundled artwork/iconography either original or licensed
