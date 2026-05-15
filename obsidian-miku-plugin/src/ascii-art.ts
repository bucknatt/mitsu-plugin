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
    "   *   \\ | /   *",
    "    \\   \\|/   /",
    "  *--- ( o_o ) ---*",
    "    /   /|\\   \\",
    "   *   / | \\   *",
    "      ~ hearts at glow ~"
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
    " melody in every line"
  ].join("\n"),

  portrait: [
    "　　　 　　/＾>》, -―‐‐＜＾}",
    "　　　 　./:::::::/,≠´:::::;::::::::ヽ.",
    "　　　　/:::::::〃::::::::::／}::::丿ハ",
    "　　　 ./:::::::::i{l|:::::／　ﾉ／ }::::::}   .ᐟ.ᐟ",
    "　　    /:::::::::::瓜イ⸝⸝o　 ´  O, ':::::ﾉ  < woah im getting attention!!111!! )",
    "　     ./:::::::::::::|ﾉﾍ.{､　 ヮ_.ノﾉイ",
    "　     |:::::::::::::::| ／,}｀ｽ/￣￣￣￣/",
    " 　    |::::::::::::::::|(_::::つ/             /　　",
    "            ￣￣￣￣￣＼/＿＿＿＿/"
  ].join("\n"),

  settings: [
    "  ~~ miku plugin ~~",
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
    case "portrait":
      return ASCII_PRESETS.portrait;
    default:
      return ASCII_PRESETS.panel;
  }
}

export function getSettingsAsciiArt(): string {
  return ASCII_PRESETS.settings;
}
