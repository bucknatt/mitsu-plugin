import type { MikuAsciiArtPreset } from "./settings";

/** Original monospace motifs for UI decoration only (repo-authored; not official art). */

export const ASCII_PRESETS = {
  minimal: [
    "    *       ",
    "   / \\      ",
    "  ( @ @ )    ",
    "   \\ ~ /    ",
    "  ~~| |~~   ",
    " twin tails vibe "
  ].join("\n"),

  panel: [
    "      .^.    * synth garden *",
    "     /   \\",
    "  ~ /~~~~~\\ ~",
    "   ( o   o )   teal + pink sparks",
    "    \\~~~~~/    ",
    "  ~/       \\~  ",
    " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "   keep your tempo; let ideas sing!"
  ].join("\n"),

  /** Eighth-notes and staff-ish lines */
  notes: [
    "   |'|   |'|   |'|",
    "   | |___| |___| |",
    "    \\  *   *   * /",
    "     \\___~___~/   ~your melody~",
    "        |   |",
    "        ~~~ ~~~"
  ].join("\n"),

  /** Spotlight / live feel */
  stage: [
    "         .---.---.",
    "        /  o     o  \\",
    "       |      ^      |   your song",
    "       |____ / \\ ____|",
    "         \\  lights  /",
    "          \\________/",
    "           ~ sing on ~"
  ].join("\n"),

  /** Waves + open sea motif */
  waves: [
    "  ~^~^~^~^~^~^~^~^~^~^~^~",
    " ^  /\\  /\\  /\\  /\\  /\\  ^",
    "^ ~(__)(__)(__)(__)(__)~ ^",
    " ^    ~  endless melody  ~  ^",
    "  ~^~^~^~^~^~^~^~^~^~^~^~"
  ].join("\n"),

  /** Stars around a simple face */
  sparkle: [
    "    *   \\ | /   *",
    "     \\   \\|/   /",
    "   *--- ( o_o ) ---*",
    "     /   /|\\   \\",
    "    *   / | \\   *",
    "       ~ glow and go ~"
  ].join("\n"),

  /** Ribbon / bow abstract */
  ribbon: [
    "    .--.       .--.",
    "   /    \\     /    \\",
    "  (   ^@^   ---   ^@^   )",
    "   \\  / \\  / \\  /  /",
    "    ~~/   ~^~   \\~~",
    "      ~ tie notes ~"
  ].join("\n"),

  /** Fits compact dashboard toggle */
  micro: [
    "  (*^~^*)  hybrid mode",
    "   /|\\",
    "  ~ melody in every line ~"
  ].join("\n"),

  settings: [
    "  ~~ miku plugin ~~",
    "   \\^_^/  settings",
    "    \\|/  tune your vibe"
  ].join("\n")
} as const;

/** Maps removed presets and unknown saved values to a safe default. */
export function normalizeAsciiArtPreset(preset: string): MikuAsciiArtPreset {
  if (preset === "portrait") {
    return "panel";
  }
  const valid: MikuAsciiArtPreset[] = [
    "off",
    "minimal",
    "panel",
    "notes",
    "stage",
    "waves",
    "sparkle",
    "ribbon",
    "micro"
  ];
  return valid.includes(preset as MikuAsciiArtPreset)
    ? (preset as MikuAsciiArtPreset)
    : "panel";
}

export function getDashboardAsciiArt(preset: MikuAsciiArtPreset): string | null {
  const normalized = normalizeAsciiArtPreset(preset);
  if (normalized === "off") {
    return null;
  }
  switch (normalized) {
    case "minimal":
      return ASCII_PRESETS.minimal;
    case "panel":
      return ASCII_PRESETS.panel;
    case "notes":
      return ASCII_PRESETS.notes;
    case "stage":
      return ASCII_PRESETS.stage;
    case "waves":
      return ASCII_PRESETS.waves;
    case "sparkle":
      return ASCII_PRESETS.sparkle;
    case "ribbon":
      return ASCII_PRESETS.ribbon;
    case "micro":
      return ASCII_PRESETS.micro;
    default:
      return ASCII_PRESETS.panel;
  }
}

export function getSettingsAsciiArt(): string {
  return ASCII_PRESETS.settings;
}
