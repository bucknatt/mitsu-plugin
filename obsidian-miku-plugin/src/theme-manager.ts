import { MikuPluginSettings } from "./settings";

const ROOT_CLASS = "miku-plugin-enabled";

export class ThemeManager {
  apply(settings: MikuPluginSettings): void {
    document.body.classList.add(ROOT_CLASS);
    document.body.dataset.mikuTheme = settings.themeMode;
    document.body.dataset.mikuReducedMotion = settings.reducedMotion ? "true" : "false";
    document.body.style.setProperty("--miku-glow-intensity", String(settings.glowIntensity));
  }

  cleanup(): void {
    document.body.classList.remove(ROOT_CLASS);
    delete document.body.dataset.mikuTheme;
    delete document.body.dataset.mikuReducedMotion;
    document.body.style.removeProperty("--miku-glow-intensity");
  }
}
