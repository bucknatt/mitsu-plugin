import {
  App,
  DropdownComponent,
  PluginSettingTab,
  Setting,
  SliderComponent,
  TextComponent,
  ToggleComponent
} from "obsidian";
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

    new Setting(containerEl).setDesc("No audio features are included by design.");

    if (this.plugin.settings.asciiArtInSettings) {
      const pre = containerEl.createEl("pre", { cls: "miku-ascii miku-ascii--settings" });
      pre.textContent = getSettingsAsciiArt();
    }

    new Setting(containerEl)
      .setName("Theme mode")
      .setDesc("Choose the active Miku mode")
      .addDropdown((dropdown: DropdownComponent) => {
        for (const mode of THEME_MODES) {
          dropdown.addOption(mode, mode);
        }
        dropdown.setValue(this.plugin.settings.themeMode);
        dropdown.onChange((value: string) => {
          this.plugin.settings.themeMode = value as MikuThemeMode;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Status bar widget")
      .addToggle((toggle: ToggleComponent) => {
        toggle.setValue(this.plugin.settings.statusBarEnabled);
        toggle.onChange((value: boolean) => {
          this.plugin.settings.statusBarEnabled = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Top banner widget")
      .addToggle((toggle: ToggleComponent) => {
        toggle.setValue(this.plugin.settings.bannerEnabled);
        toggle.onChange((value: boolean) => {
          this.plugin.settings.bannerEnabled = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Banner text")
      .setDesc("Shown at top when banner is enabled")
      .addText((text: TextComponent) => {
        text.setValue(this.plugin.settings.bannerText);
        text.onChange((value: string) => {
          this.plugin.settings.bannerText = value.trim() || "Miku Mode Active";
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Quote widget")
      .addToggle((toggle: ToggleComponent) => {
        toggle.setValue(this.plugin.settings.quoteEnabled);
        toggle.onChange((value: boolean) => {
          this.plugin.settings.quoteEnabled = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Quote interval (seconds)")
      .addSlider((slider: SliderComponent) => {
        slider.setLimits(5, 120, 5);
        slider.setValue(this.plugin.settings.quoteIntervalSeconds);
        slider.setDynamicTooltip();
        slider.onChange((value: number) => {
          this.plugin.settings.quoteIntervalSeconds = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Profile card widget")
      .addToggle((toggle: ToggleComponent) => {
        toggle.setValue(this.plugin.settings.profileCardEnabled);
        toggle.onChange((value: boolean) => {
          this.plugin.settings.profileCardEnabled = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Compact dashboard")
      .addToggle((toggle: ToggleComponent) => {
        toggle.setValue(this.plugin.settings.compactDashboard);
        toggle.onChange((value: boolean) => {
          this.plugin.settings.compactDashboard = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Glow intensity")
      .setDesc("Scales graph/highlight glow plus global glow strength; lower if text feels busy")
      .addSlider((slider: SliderComponent) => {
        slider.setLimits(0.1, 1, 0.05);
        slider.setValue(this.plugin.settings.glowIntensity);
        slider.setDynamicTooltip();
        slider.onChange((value: number) => {
          this.plugin.settings.glowIntensity = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl)
      .setName("Reduced motion")
      .addToggle((toggle: ToggleComponent) => {
        toggle.setValue(this.plugin.settings.reducedMotion);
        toggle.onChange((value: boolean) => {
          this.plugin.settings.reducedMotion = value;
          void this.plugin.saveAndRefresh();
        });
      });

    new Setting(containerEl).setName("ASCII decoration").setHeading();

    new Setting(containerEl).setDesc(
      "Tiny original monospace motifs (not licensed character art)."
    );

    new Setting(containerEl)
      .setName("ASCII art preset (dashboard)")
      .setDesc("Shown at the top of the Miku dashboard view.")
      .addDropdown((dropdown: DropdownComponent) => {
        for (const { id, label } of ASCII_PRESET_OPTIONS) {
          dropdown.addOption(id, label);
        }
        dropdown.setValue(normalizeAsciiArtPreset(this.plugin.settings.asciiArtPreset));
        dropdown.onChange((value: string) => {
          this.plugin.settings.asciiArtPreset = value as MikuAsciiArtPreset;
          void this.plugin.saveAndRefresh().then(() => this.display());
        });
      });

    new Setting(containerEl)
      .setName("ASCII art on this settings page")
      .setDesc("Show a compact motif above (refreshes this screen).")
      .addToggle((toggle: ToggleComponent) => {
        toggle.setValue(this.plugin.settings.asciiArtInSettings);
        toggle.onChange((value: boolean) => {
          this.plugin.settings.asciiArtInSettings = value;
          void this.plugin.saveAndRefresh().then(() => this.display());
        });
      });
  }
}
