import { ItemView, WorkspaceLeaf } from "obsidian";
import { MikuPluginSettings } from "./settings";

export const MIKU_PANEL_VIEW = "miku-dashboard-view";

export class MikuPanelView extends ItemView {
  private settings: MikuPluginSettings;

  constructor(leaf: WorkspaceLeaf, settings: MikuPluginSettings) {
    super(leaf);
    this.settings = settings;
  }

  getViewType(): string {
    return MIKU_PANEL_VIEW;
  }

  getDisplayText(): string {
    return "Miku Dashboard";
  }

  setSettings(settings: MikuPluginSettings): void {
    this.settings = settings;
    this.render();
  }

  async onOpen(): Promise<void> {
    this.render();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
  }

  private render(): void {
    const container = this.contentEl;
    container.empty();
    container.addClass("miku-dashboard");
    container.toggleClass("is-compact", this.settings.compactDashboard);

    const title = container.createEl("h2", { text: "Miku Dashboard" });
    title.addClass("miku-dashboard-title");
    container.createEl("p", {
      text: "A visual control surface for your Obsidian workflow."
    });

    const actions = container.createDiv({ cls: "miku-dashboard-actions" });
    const daily = actions.createEl("button", { text: "Open Daily Note" });
    daily.onclick = () => this.openCommand("daily-notes");
    const toggle = actions.createEl("button", { text: "Cycle Theme Mode" });
    toggle.onclick = () => this.openCommand("miku-plugin-hybrid:miku-cycle-theme");

    const progress = container.createDiv({ cls: "miku-progress" });
    progress.createEl("h4", { text: "Focus Progress" });
    progress.createEl("p", { text: "Track goals with checklist and daily note links." });

    const equalizer = container.createDiv({ cls: "miku-equalizer" });
    for (let i = 0; i < 6; i += 1) {
      equalizer.createDiv({ cls: "miku-eq-bar" });
    }
  }

  private openCommand(commandId: string): void {
    const app = this.app as {
      commands?: { executeCommandById?: (id: string) => boolean };
    };
    app.commands?.executeCommandById?.(commandId);
  }
}
