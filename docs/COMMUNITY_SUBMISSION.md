# Community Plugin submission checklist

Submit **Miku Hybrid** at [community.obsidian.md](https://community.obsidian.md/).

## Prerequisites

- [ ] GitHub repo is public (`bucknatt/mitsu-plugin` or your publish repo)
- [ ] Root `manifest.json`, `LICENSE`, and marketplace `README.md` on default branch
- [ ] Push `main` and tag `1.0.0` — see [RELEASE_1.0.0.md](RELEASE_1.0.0.md)
- [ ] GitHub Release **`1.0.0`** published with assets: `main.js`, `manifest.json`, `styles.css`
- [ ] Release tag **equals** `manifest.json` `version` (no `v` prefix)
- [ ] Obsidian account + GitHub account linked on community.obsidian.md

## Submit

1. Sign in at [community.obsidian.md](https://community.obsidian.md/).
2. **Plugins → New plugin**.
3. Repository URL: `https://github.com/bucknatt/mitsu-plugin` (adjust if using a dedicated publish repo).
4. Agree to [Developer policies](https://docs.obsidian.md/Developer+policies).
5. **Submit** and resolve automated review feedback.
6. **Publish** in the directory UI when review passes.

## Plugin id

`miku-plugin-hybrid` (must match root `manifest.json` `id`).

`name` must not include the word **Plugin** (directory rule). Current display name: **Miku Hybrid**.

## If review requests changes

1. Fix on default branch.
2. Bump `version` in `manifest.json` and `versions.json`.
3. Run `npm run build --prefix ./obsidian-miku-plugin`.
4. Commit, tag (e.g. `1.0.1`), push tag; GitHub Actions creates a new draft release.
5. Publish the release and resubmit/update in the directory.
