# Release Test Report (Desktop)

Date: 2026-05-15

## 1) Environment and Install Setup

- Clean test vault: `qa/vaults/clean-desktop`
- Install helper: `qa/install-to-vault.sh` (catalog-style: plugin only, bundled `styles.css`)
- Installed artifacts:
  - `.obsidian/plugins/miku-plugin-hybrid/{main.js,manifest.json,styles.css}` (manifest `1.0.0`)
  - No separate Appearance theme file (bundled hybrid CSS)

Status: PASS

## 2) Build and Static Checks

- `npm run typecheck --prefix ./obsidian-miku-plugin` -> PASS
- `npm run build --prefix ./obsidian-miku-plugin` -> PASS (esbuild + theme CSS merge)
- `./qa/static-guards.sh` -> PASS
  - Hybrid DOM hooks in `theme-manager.ts`
  - `body[data-miku-theme=` in theme source and merged `styles.css`
  - Bundled theme marker in `styles.css`
  - Module lifecycle and command registration
  - No audio-policy violations

Status: PASS

## 3) Manual Matrix Execution

Obsidian GUI launch not run in this CI/agent environment (`Cannot find module 'electron'` when attempted previously).

Status: BLOCKED (environment-level) — run [manual matrix](#manual-matrix-checklist) on a desktop Obsidian install before marketplace sign-off.

## 4) Lifecycle and Performance Validation

- `./qa/lifecycle-perf-check.sh` -> PASS
- Theme manager cleanup, quote interval teardown, no audio paths (static guards)

Status: PASS

## 5) Release Sign-off Readiness

| Item | Status |
|------|--------|
| Root `manifest.json`, `LICENSE`, `README.md` | Ready |
| Merged `styles.css` in plugin package | Ready |
| GitHub Actions `release.yml` | Ready |
| GitHub Release `1.0.0` tag | Pending push (see below) |
| community.obsidian.md submission | Human step — [docs/COMMUNITY_SUBMISSION.md](../../docs/COMMUNITY_SUBMISSION.md) |

Status: CONDITIONAL PASS (automated); manual UI matrix required on host with Obsidian.

## Command Evidence Snapshot

- `npm run typecheck --prefix ./obsidian-miku-plugin` -> PASS
- `npm run build --prefix ./obsidian-miku-plugin` -> PASS
- `./qa/static-guards.sh` -> PASS
- `./qa/lifecycle-perf-check.sh` -> PASS
- `./qa/install-to-vault.sh ./qa/vaults/clean-desktop` -> PASS

## Manual Matrix Checklist

- Enable **Miku Plugin Hybrid** only (no Appearance theme); verify palette/modes.
- Cycle all theme modes; confirm `data-miku-theme` and status bar label.
- Toggle settings; persist after restart.
- Widget mount/unmount; no stale DOM after disable.
- Dashboard via ribbon and command.
- Optional: `MIKU_INSTALL_SPLIT_THEME=1 ./qa/install-to-vault.sh <vault>` for split theme dev test.
