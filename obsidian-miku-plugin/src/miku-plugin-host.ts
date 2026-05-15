import type { App } from "obsidian";
import type { MikuPluginSettings } from "./settings";

/** Shared plugin surface for modules and widgets (avoids unsafe casts). */
export interface MikuPluginHost {
  app: App;
  settings: MikuPluginSettings;
  saveAndRefresh(): Promise<void>;
}
