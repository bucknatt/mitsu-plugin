import { Plugin } from "obsidian";
import { MIKU_PANEL_VIEW, MikuPanelView } from "./miku-panel";
import { DEFAULT_SETTINGS, MikuPluginSettings } from "./settings";
import { WidgetManager } from "./widgets";

export interface ManagedModule {
  mount(): void | Promise<void>;
  update(settings: MikuPluginSettings): void | Promise<void>;
  unmount(): void | Promise<void>;
}

class WidgetModule implements ManagedModule {
  private readonly widgetManager: WidgetManager;

  constructor(
    plugin: Plugin,
    openDashboard: () => Promise<void>,
    saveAndRefresh: () => Promise<void>
  ) {
    this.widgetManager = new WidgetManager(plugin, openDashboard, saveAndRefresh);
  }

  mount(): void {
    this.widgetManager.mount();
  }

  update(settings: MikuPluginSettings): void {
    this.widgetManager.update(settings);
  }

  unmount(): void {
    this.widgetManager.unmount();
  }
}

class DashboardModule implements ManagedModule {
  private panelView: MikuPanelView | null = null;

  constructor(private readonly plugin: Plugin) {}

  mount(): void {
    this.plugin.registerView(MIKU_PANEL_VIEW, (leaf) => {
      const host = this.plugin as unknown as {
        settings: MikuPluginSettings;
        saveAndRefresh(): Promise<void>;
      };
      this.panelView = new MikuPanelView(leaf, host);
      return this.panelView;
    });
  }

  update(settings: MikuPluginSettings): void {
    const leaves = this.plugin.app.workspace.getLeavesOfType(MIKU_PANEL_VIEW);
    if (leaves.length > 0) {
      const view = leaves[0]?.view;
      if (view instanceof MikuPanelView) {
        view.setSettings(settings);
      }
    } else if (this.panelView) {
      this.panelView.setSettings(settings);
    }
  }

  unmount(): void {
    this.plugin.app.workspace.detachLeavesOfType(MIKU_PANEL_VIEW);
    this.panelView = null;
  }

  private getSettings(): MikuPluginSettings {
    const plugin = this.plugin as unknown as { settings?: MikuPluginSettings };
    return plugin.settings ?? { ...DEFAULT_SETTINGS };
  }
}

export class ModuleRegistry {
  private readonly modules: ManagedModule[];

  constructor(
    plugin: Plugin,
    openDashboard: () => Promise<void>,
    saveAndRefresh: () => Promise<void>
  ) {
    this.modules = [
      new WidgetModule(plugin, openDashboard, saveAndRefresh),
      new DashboardModule(plugin)
    ];
  }

  async mountAll(): Promise<void> {
    for (const module of this.modules) {
      await module.mount();
    }
  }

  async updateAll(settings: MikuPluginSettings): Promise<void> {
    for (const module of this.modules) {
      await module.update(settings);
    }
  }

  async unmountAll(): Promise<void> {
    for (const module of this.modules) {
      await module.unmount();
    }
  }
}
