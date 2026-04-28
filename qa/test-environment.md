# Desktop Test Environment Setup

## Vault Targets

- Active desktop vault (detected): `/home/cachy/Documents/bfh4`
- Clean test vault (local): `/home/cachy/IdeaProjects/cachy/mitsu-plugin/qa/vaults/clean-desktop`

## Install Artifacts Into a Vault

```bash
./qa/install-to-vault.sh /home/cachy/Documents/bfh4
```

or for isolated testing:

```bash
./qa/install-to-vault.sh ./qa/vaults/clean-desktop
```

## Expected Install Paths

- Plugin: `<vault>/.obsidian/plugins/miku-plugin-hybrid/`
- Theme CSS: `<vault>/.obsidian/themes/Miku Theme Hybrid Base.css`

## Notes

- This setup is desktop-focused and matches the release test plan scope.
- The script does not enable plugins/theme automatically; enable them from Obsidian settings.
