import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  globalIgnores([
    "node_modules",
    "esbuild.config.mjs",
    "eslint.config.mjs",
    "scripts/**",
    "main.js",
    "styles.css",
    "package.json",
    "package-lock.json",
    "manifest.json",
    "versions.json"
  ]),
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        activeDocument: "readonly",
        activeWindow: "readonly"
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  ...obsidianmd.configs.recommended,
  {
    files: ["src/**/*.ts"],
    rules: {
      "obsidianmd/ui/sentence-case": [
        "error",
        {
          brands: ["Miku", "Obsidian"]
        }
      ]
    }
  }
);
