import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(pluginRoot, "..");

for (const name of ["manifest.json", "versions.json"]) {
  const from = path.join(repoRoot, name);
  const to = path.join(pluginRoot, name);
  fs.copyFileSync(from, to);
  console.log(`Synced ${name} -> obsidian-miku-plugin/`);
}
