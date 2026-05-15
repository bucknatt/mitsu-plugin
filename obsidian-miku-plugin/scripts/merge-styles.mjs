import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(pluginRoot, "..");

const widgetsPath = path.join(pluginRoot, "styles.widgets.css");
const themePath = path.join(repoRoot, "obsidian-miku-theme", "theme.css");
const outPath = path.join(pluginRoot, "styles.css");

const widgets = fs.readFileSync(widgetsPath, "utf8");
const theme = fs.readFileSync(themePath, "utf8");

const merged = `${widgets.trim()}

/* --- Miku hybrid theme (bundled from obsidian-miku-theme/theme.css) --- */

${theme.trim()}
`;

fs.writeFileSync(outPath, merged.endsWith("\n") ? merged : `${merged}\n`);
console.log(`Wrote ${outPath} (${widgets.length} + ${theme.length} bytes sources)`);
