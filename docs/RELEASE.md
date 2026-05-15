# Releasing

Releases are automated via [`.github/workflows/release.yml`](../.github/workflows/release.yml).

## Steps

1. Bump `version` in root [`manifest.json`](../manifest.json) and add the entry to [`versions.json`](../versions.json).
2. Commit and push `main`.
3. Create an annotated tag matching the version exactly (no `v` prefix):

```bash
git tag -a 1.0.2 -m "1.0.2"
git push origin 1.0.2
```

4. Open the **draft** release on GitHub, verify assets, publish:
   - `obsidian-miku-plugin/main.js`
   - `manifest.json` (repo root)
   - `obsidian-miku-plugin/styles.css`

5. Confirm the release `manifest.json` has the same `"version"` as the tag.

## Manual release

```bash
npm run build --prefix ./obsidian-miku-plugin
gh release create 1.0.2 \
  obsidian-miku-plugin/main.js \
  manifest.json \
  obsidian-miku-plugin/styles.css \
  --title 1.0.2 \
  --notes "Release notes here."
```
