export type MikuThemeMode = "MinimalMiku" | "Concert" | "NightNeon" | "SnowMiku";

export type MikuAsciiArtPreset =
  | "off"
  | "minimal"
  | "panel"
  | "notes"
  | "stage"
  | "waves"
  | "sparkle"
  | "ribbon"
  | "micro";

export interface MikuDashboardGoal {
  id: string;
  text: string;
  done: boolean;
}

export interface MikuWidgetPosition {
  x: number;
  y: number;
}

export interface MikuPluginSettings {
  themeMode: MikuThemeMode;
  statusBarEnabled: boolean;
  bannerEnabled: boolean;
  quoteEnabled: boolean;
  quoteIntervalSeconds: number;
  profileCardEnabled: boolean;
  compactDashboard: boolean;
  glowIntensity: number;
  reducedMotion: boolean;
  bannerText: string;
  asciiArtPreset: MikuAsciiArtPreset;
  asciiArtInSettings: boolean;
  dashboardGoals: MikuDashboardGoal[];
  bannerPosition: MikuWidgetPosition | null;
  profileCardPosition: MikuWidgetPosition | null;
  quotePosition: MikuWidgetPosition | null;
}

export const DEFAULT_SETTINGS: MikuPluginSettings = {
  themeMode: "MinimalMiku",
  statusBarEnabled: true,
  bannerEnabled: false,
  quoteEnabled: false,
  quoteIntervalSeconds: 25,
  profileCardEnabled: false,
  compactDashboard: false,
  glowIntensity: 0.82,
  reducedMotion: false,
  bannerText: "Miku Mode Active",
  asciiArtPreset: "minimal",
  asciiArtInSettings: false,
  dashboardGoals: [
    { id: "goal-daily", text: "Review daily note", done: false },
    { id: "goal-capture", text: "Capture 3 ideas", done: false },
    { id: "goal-ship", text: "Ship one small improvement", done: false }
  ],
  bannerPosition: null,
  profileCardPosition: null,
  quotePosition: null
};
