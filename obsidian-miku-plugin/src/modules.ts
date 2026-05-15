import { Plugin } from "obsidian";
import { MIKU_PANEL_VIEW, MikuPanelView } from "./miku-panel";
import type { MikuPluginHost } from "./miku-plugin-host";
import { MikuPluginSettings } from "./settings";
import { WidgetManager } from "./widgets";

export interface ManagedModule {
  mount(): void | Promise<void>;
  update(settings: MikuPluginSettings): void | Promise<void>;
  unmount(): void | Promise<void>;
}

class WidgetModule implements ManagedModule {
  private readonly widgetManager: WidgetManager;

  constructor(
    host: MikuPluginHost,
    plugin: Plugin,
    openDashboard: () => Promise<void>,
    saveAndRefresh: () => Promise<void>
  ) {
    this.widgetManager = new WidgetManager(host, plugin, openDashboard, saveAndRefresh);
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
  constructor(
    private readonly plugin: Plugin,
    private readonly host: MikuPluginHost
  ) {}

  mount(): void {
    this.plugin.registerView(MIKU_PANEL_VIEW, (leaf) => new MikuPanelView(leaf, this.host));
  }

  update(settings: MikuPluginSettings): void {
    const leaves = this.plugin.app.workspace.getLeavesOfType(MIKU_PANEL_VIEW);
    const view = leaves[0]?.view;
    if (view instanceof MikuPanelView) {
      view.setSettings(settings);
    }
  }

  unmount(): void {
    this.plugin.app.workspace.detachLeavesOfType(MIKU_PANEL_VIEW);
  }
}

export class ModuleRegistry {
  private readonly modules: ManagedModule[];

  constructor(
    host: MikuPluginHost,
    plugin: Plugin,
    openDashboard: () => Promise<void>,
    saveAndRefresh: () => Promise<void>
  ) {
    this.modules = [
      new WidgetModule(host, plugin, openDashboard, saveAndRefresh),
      new DashboardModule(plugin, host)
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
