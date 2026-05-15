import { MikuPluginSettings } from "./settings";

const ROOT_CLASS = "miku-plugin-enabled";

export class ThemeManager {
  apply(settings: MikuPluginSettings): void {
    const body = activeDocument.body;
    body.classList.add(ROOT_CLASS);
    body.dataset.mikuTheme = settings.themeMode;
    body.dataset.mikuReducedMotion = settings.reducedMotion ? "true" : "false";
    body.style.setProperty("--miku-glow-intensity", String(settings.glowIntensity));
  }

  cleanup(): void {
    const body = activeDocument.body;
    body.classList.remove(ROOT_CLASS);
    delete body.dataset.mikuTheme;
    delete body.dataset.mikuReducedMotion;
    body.style.removeProperty("--miku-glow-intensity");
  }
}
