import { App, PluginSettingTab, Setting } from "obsidian";
import MikuPlugin from "./main";
import { MikuThemeMode } from "./settings";

const THEME_MODES: MikuThemeMode[] = ["MinimalMiku", "Concert", "NightNeon", "SnowMiku"];

export class MikuSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: MikuPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Miku Plugin Hybrid Settings" });
    containerEl.createEl("p", {
      text: "No audio features are included by design."
    });

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
      .setDesc("Keep this subtle for readability")
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
  }
}
