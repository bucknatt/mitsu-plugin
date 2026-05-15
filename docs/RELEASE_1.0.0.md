# Release 1.0.0 (local tag created)

The annotated tag `1.0.0` exists locally on commit `f78c072` (or later if rebased).

## Publish to GitHub

```bash
git push origin main
git push origin 1.0.0
```

GitHub Actions (`.github/workflows/release.yml`) will create a **draft** release with:

- `obsidian-miku-plugin/main.js`
- `manifest.json` (repo root)
- `obsidian-miku-plugin/styles.css`

Edit the draft on GitHub, add release notes, then **Publish release**.

## Manual release (if Actions unavailable)

```bash
npm run build --prefix ./obsidian-miku-plugin
gh release create 1.0.0 \
  obsidian-miku-plugin/main.js \
  manifest.json \
  obsidian-miku-plugin/styles.css \
  --title 1.0.0 \
  --notes "Initial Community marketplace release with bundled hybrid CSS."
```

Tag name must match `manifest.json` `version` exactly (no `v` prefix).
