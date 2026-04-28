# Release Test Report (Desktop)

Date: 2026-04-28

## 1) Environment and Install Setup

- Prepared clean test vault: `qa/vaults/clean-desktop`
- Prepared install helper: `qa/install-to-vault.sh`
- Installed artifacts into clean vault:
  - `.obsidian/plugins/miku-plugin-hybrid/{main.js,manifest.json,styles.css}`
  - `.obsidian/themes/Miku Theme Hybrid Base.css`

Status: PASS

## 2) Build and Static Checks

- `npm run typecheck --prefix ./obsidian-miku-plugin` -> PASS
- `npm run build --prefix ./obsidian-miku-plugin` -> PASS
- `./qa/static-guards.sh` -> PASS
  - Verified hybrid attribute/token linkage signatures
  - Verified module lifecycle signatures
  - Verified command/view registration signatures
  - Verified no audio-policy violations

Status: PASS

## 3) Manual Matrix Execution

Attempted to execute desktop manual tests via local Obsidian process.

Result:
- Failed to launch in this environment due to host/runtime packaging issue:
  - `Error: Cannot find module 'electron'`

Status: BLOCKED (environment-level)

## 4) Lifecycle and Performance Validation

Validated by static/runtime-safe checks in this environment:
- Lifecycle contracts present in module registry (`mount/update/unmount`) and used from plugin `onload/onunload`.
- Quote widget clears interval on disable/unmount.
- Theme manager cleanup removes class/data attributes/token override.
- No audio code paths or dependencies detected.

Status: PASS (static/lifecycle guard level)

## 5) Release Sign-off Readiness

Artifact integrity:
- Plugin bundle exists and install script copies expected files.
- Theme CSS artifact exists and install script copies expected file.
- README docs include matching install/artifact guidance for both packages.

Remaining sign-off requirement:
- Run manual desktop UI matrix on a working Obsidian desktop installation.

Status: CONDITIONAL PASS

## Command Evidence Snapshot

- `npm run typecheck --prefix ./obsidian-miku-plugin` -> PASS
- `npm run build --prefix ./obsidian-miku-plugin` -> PASS
- `./qa/static-guards.sh` -> PASS
- `./qa/lifecycle-perf-check.sh` -> PASS
- `./qa/install-to-vault.sh ./qa/vaults/clean-desktop` -> PASS
- `obsidian <vault>` launch in this environment -> BLOCKED (`Cannot find module 'electron'`)

## Manual Matrix Checklist (To run on working desktop Obsidian)

- Enable plugin and theme in clean vault, verify no console errors.
- Switch all theme modes and verify `data-miku-theme` effects.
- Toggle every setting and verify live updates + persistence after restart.
- Verify each widget mount/unmount and no stale DOM after plugin disable.
- Open dashboard via ribbon and command; verify single-leaf behavior.
- Run `miku-cycle-theme` repeatedly and verify wrap-around + notice sync.
