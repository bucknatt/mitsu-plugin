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
    "   keep your tempo; ship notes!"
  ].join("\n"),

  /** Eighth-notes and staff-ish lines */
  notes: [
    "   |'|   |'|   |'|",
    "   | |___| |___| |",
    "    \\  *   *   * /",
    "     \\___~___~/   ~setlist~",
    "        |   |",
    "        ~~~ ~~~"
  ].join("\n"),

  /** Spotlight / live feel */
  stage: [
    "         .---.---.",
    "        /  o     o  \\",
    "       |      ^      |   your vault",
    "       |____ / \\ ____|",
    "         \\  lights  /",
    "          \\________/",
    "           ~ encore ~"
  ].join("\n"),

  /** Waves + vault label */
  waves: [
    "  ~^~^~^~^~^~^~^~^~^~^~^~",
    " ^  /\\  /\\  /\\  /\\  /\\  ^",
    "^ ~(__)(__)(__)(__)(__)~ ^",
    " ^    ~  obsidian sea  ~  ^",
    "  ~^~^~^~^~^~^~^~^~^~^~^~"
  ].join("\n"),

  /** Stars around a simple face */
  sparkle: [
    "   *   \\ | /   *",
    "    \\   \\|/   /",
    "  *--- ( o_o ) ---*",
    "    /   /|\\   \\",
    "   *   / | \\   *",
    "      ~spark vault~"
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
    " (*^~^*)  ~miku-hybrid~",
    "  /|\\",
    " encore in .md"
  ].join("\n"),

  settings: [
    "  ~~ miku hybrid ~~",
    "   \\^_^/  tweaks",
    "    \\|/",
  ].join("\n")
} as const;

export function getDashboardAsciiArt(preset: MikuAsciiArtPreset): string | null {
  if (preset === "off") {
    return null;
  }
  switch (preset) {
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
