export type MikuThemeMode = "MinimalMiku" | "Concert" | "NightNeon" | "SnowMiku";

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
}

export const DEFAULT_SETTINGS: MikuPluginSettings = {
  themeMode: "MinimalMiku",
  statusBarEnabled: true,
  bannerEnabled: false,
  quoteEnabled: false,
  quoteIntervalSeconds: 25,
  profileCardEnabled: false,
  compactDashboard: false,
  glowIntensity: 0.55,
  reducedMotion: false,
  bannerText: "Miku Mode Active"
};
