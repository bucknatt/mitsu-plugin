import { App, PluginSettingTab, Setting } from "obsidian";
import { getSettingsAsciiArt, normalizeAsciiArtPreset } from "./ascii-art";
import MikuPlugin from "./main";
import { MikuAsciiArtPreset, MikuThemeMode } from "./settings";

const THEME_MODES: MikuThemeMode[] = ["MinimalMiku", "Concert", "NightNeon", "SnowMiku"];

const ASCII_PRESET_OPTIONS: { id: MikuAsciiArtPreset; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "minimal", label: "Minimal (small)" },
  { id: "micro", label: "Micro (3 lines, compact UI)" },
  { id: "panel", label: "Panel (hero)" },
  { id: "notes", label: "Notes (staff & stars)" },
  { id: "stage", label: "Stage (spotlight)" },
  { id: "waves", label: "Waves" },
  { id: "sparkle", label: "Sparkle frame" },
  { id: "ribbon", label: "Ribbon bows" }
];

export class MikuSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: MikuPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Miku Hybrid Settings" });
    containerEl.createEl("p", {
      text: "No audio features are included by design."
    });

    if (this.plugin.settings.asciiArtInSettings) {
      const pre = containerEl.createEl("pre", { cls: "miku-ascii miku-ascii--settings" });
      pre.textContent = getSettingsAsciiArt();
    }

    new Setting(containerEl)
      .setName("Theme mode")
      .setDesc("Choose the active Miku mode")
      .addDropdown((dropdown) => {
        THEME_MODES.forEach((mode) => dropdown.addOption(mode, mode));
        dropdown.setValue(this.plugin.settings.themeMode);
        dropdown.onChange(async (value) => {
          this.plugin.settings.themeMode = value as MikuThemeMode;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Status bar widget")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.statusBarEnabled);
        toggle.onChange(async (value) => {
          this.plugin.settings.statusBarEnabled = value;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Top banner widget")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.bannerEnabled);
        toggle.onChange(async (value) => {
          this.plugin.settings.bannerEnabled = value;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Banner text")
      .setDesc("Shown at top when banner is enabled")
      .addText((text) => {
        text.setValue(this.plugin.settings.bannerText);
        text.onChange(async (value) => {
          this.plugin.settings.bannerText = value.trim() || "Miku Mode Active";
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Quote widget")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.quoteEnabled);
        toggle.onChange(async (value) => {
          this.plugin.settings.quoteEnabled = value;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Quote interval (seconds)")
      .addSlider((slider) => {
        slider.setLimits(10, 120, 5);
        slider.setValue(this.plugin.settings.quoteIntervalSeconds);
        slider.setDynamicTooltip();
        slider.onChange(async (value) => {
          this.plugin.settings.quoteIntervalSeconds = value;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Profile card widget")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.profileCardEnabled);
        toggle.onChange(async (value) => {
          this.plugin.settings.profileCardEnabled = value;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Compact dashboard")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.compactDashboard);
        toggle.onChange(async (value) => {
          this.plugin.settings.compactDashboard = value;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Glow intensity")
      .setDesc("Scales graph/highlight glow plus global glow strength; lower if text feels busy")
      .addSlider((slider) => {
        slider.setLimits(0.1, 1, 0.05);
        slider.setValue(this.plugin.settings.glowIntensity);
        slider.setDynamicTooltip();
        slider.onChange(async (value) => {
          this.plugin.settings.glowIntensity = value;
          await this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Reduced motion")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.reducedMotion);
        toggle.onChange(async (value) => {
          this.plugin.settings.reducedMotion = value;
          await this.plugin.saveAndRefresh();
        });
      });

    containerEl.createEl("h3", { text: "ASCII decoration" });
    containerEl.createEl("p", {
      text: "Tiny original monospace motifs (not licensed character art)."
    });

    new Setting(containerEl)
      .setName("ASCII art preset (dashboard)")
      .setDesc("Shown at the top of the Miku dashboard view.")
      .addDropdown((dropdown) => {
        ASCII_PRESET_OPTIONS.forEach(({ id, label }) => dropdown.addOption(id, label));
        dropdown.setValue(normalizeAsciiArtPreset(this.plugin.settings.asciiArtPreset));
        dropdown.onChange(async (value) => {
          this.plugin.settings.asciiArtPreset = value as MikuAsciiArtPreset;
          await this.plugin.saveAndRefresh();
          this.display();
        });
      });

    new Setting(containerEl)
      .setName("ASCII art on this settings page")
      .setDesc("Show a compact motif above (refreshes this screen).")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.asciiArtInSettings);
        toggle.onChange(async (value) => {
          this.plugin.settings.asciiArtInSettings = value;
          await this.plugin.saveAndRefresh();
          this.display();
        });
      });
  }
}
