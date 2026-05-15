# Contributing

Thanks for helping improve **Miku Hybrid**. This repo contains the community plugin source plus the theme CSS that is bundled at build time.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Obsidian](https://obsidian.md/) for manual testing

## Setup

```bash
git clone https://github.com/bucknatt/mitsu-plugin.git
cd mitsu-plugin
npm install --prefix ./obsidian-miku-plugin
```

## Build

From the repository root:

```bash
npm run build --prefix ./obsidian-miku-plugin
npm run typecheck --prefix ./obsidian-miku-plugin
./qa/static-guards.sh
```

`npm run build` syncs root `manifest.json` / `versions.json` into `obsidian-miku-plugin/`, bundles TypeScript to `main.js`, and merges `obsidian-miku-theme/theme.css` into `styles.css`.

## Test in a vault (local install)

```bash
mkdir -p ./qa/vaults/example-vault
./qa/install-to-vault.sh ./qa/vaults/example-vault
```

Open that folder as a vault in Obsidian, then **Settings → Community plugins → Enable** **Miku Hybrid**.

Optional legacy split-theme test (CSS only in Appearance, not bundled):

```bash
MIKU_INSTALL_SPLIT_THEME=1 ./qa/install-to-vault.sh /path/to/your-vault
```

## Release

See [docs/RELEASE.md](docs/RELEASE.md) and [docs/COMMUNITY_SUBMISSION.md](docs/COMMUNITY_SUBMISSION.md).

Catalog metadata lives at the **repository root**: `manifest.json`, `versions.json`, `LICENSE`, `README.md`.

## Repository layout

| Path | Purpose |
|------|---------|
| `manifest.json` | Community directory manifest (source of truth) |
| `obsidian-miku-plugin/` | Plugin TypeScript, widget CSS, build scripts |
| `obsidian-miku-theme/` | Theme CSS source (merged into plugin `styles.css`) |
| `qa/` | Maintainer scripts (`install-to-vault.sh`, `static-guards.sh`) |
