import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, MikuPluginSettings } from "./settings";
import { MikuSettingTab } from "./settings-tab";
import { MIKU_PANEL_VIEW, MikuPanelView } from "./miku-panel";
import type { MikuPluginHost } from "./miku-plugin-host";
import { ModuleRegistry } from "./modules";
import { normalizeAsciiArtPreset } from "./ascii-art";
import { ThemeManager } from "./theme-manager";

export default class MikuPlugin extends Plugin implements MikuPluginHost {
  settings: MikuPluginSettings = { ...DEFAULT_SETTINGS };
  private readonly themeManager = new ThemeManager();
  private moduleRegistry: ModuleRegistry | null = null;

  async onload(): Promise<void> {
    await this.loadPluginSettings();

    this.themeManager.apply(this.settings);
    this.moduleRegistry = new ModuleRegistry(
      this,
      this,
      () => this.openDashboardView(),
      () => this.saveAndRefresh()
    );
    await this.moduleRegistry.mountAll();
    await this.moduleRegistry.updateAll(this.settings);

    this.addRibbonIcon("sparkles", "Open Miku dashboard", () => {
      void this.openDashboardView();
    });

    this.addCommand({
      id: "miku-cycle-theme",
      name: "Cycle Miku theme mode",
      callback: async () => {
        await this.cycleTheme();
      }
    });
    this.addCommand({
      id: "miku-open-dashboard",
      name: "Open Miku dashboard",
      callback: async () => {
        await this.openDashboardView();
      }
    });

    this.addSettingTab(new MikuSettingTab(this.app, this));
  }

  onunload(): void {
    void this.moduleRegistry?.unmountAll();
    this.moduleRegistry = null;
    this.themeManager.cleanup();
  }

  async saveAndRefresh(): Promise<void> {
    await this.saveData(this.settings);
    this.themeManager.apply(this.settings);
    await this.moduleRegistry?.updateAll(this.settings);
    this.getDashboardView()?.setSettings(this.settings);
  }

  private getDashboardLeaf(): WorkspaceLeaf | undefined {
    return this.app.workspace.getLeavesOfType(MIKU_PANEL_VIEW)[0];
  }

  private getDashboardView(): MikuPanelView | undefined {
    const view = this.getDashboardLeaf()?.view;
    return view instanceof MikuPanelView ? view : undefined;
  }

  private async loadPluginSettings(): Promise<void> {
    const loaded = (await this.loadData()) as Partial<MikuPluginSettings> | null;
    this.settings = { ...DEFAULT_SETTINGS, ...(loaded ?? {}) };
    this.settings.asciiArtPreset = normalizeAsciiArtPreset(this.settings.asciiArtPreset);
  }

  private async cycleTheme(): Promise<void> {
    const modes = ["MinimalMiku", "Concert", "NightNeon", "SnowMiku"] as const;
    const index = modes.indexOf(this.settings.themeMode);
    const next = modes[(index + 1) % modes.length];
    this.settings.themeMode = next;
    await this.saveAndRefresh();
    new Notice(`Miku theme switched to ${next}`);
  }

  private async openDashboardView(): Promise<void> {
    let leaf = this.getDashboardLeaf();

    if (!leaf) {
      const newLeaf = this.app.workspace.getRightLeaf(false);
      if (newLeaf) {
        await newLeaf.setViewState({
          type: MIKU_PANEL_VIEW,
          active: true
        });
        leaf = newLeaf;
      }
    }

    if (leaf) {
      void this.app.workspace.revealLeaf(leaf);
      this.getDashboardView()?.setSettings(this.settings);
    }
  }
}
