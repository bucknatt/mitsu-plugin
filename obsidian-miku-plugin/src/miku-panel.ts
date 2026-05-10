import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import { getDashboardAsciiArt } from "./ascii-art";
import type { MikuDashboardGoal, MikuPluginSettings } from "./settings";

export const MIKU_PANEL_VIEW = "miku-dashboard-view";

interface DashboardHost {
  settings: MikuPluginSettings;
  saveAndRefresh(): Promise<void>;
}

export class MikuPanelView extends ItemView {
  private settings: MikuPluginSettings;
  private host: DashboardHost;

  constructor(leaf: WorkspaceLeaf, host: DashboardHost) {
    super(leaf);
    this.host = host;
    this.settings = host.settings;
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

    const ascii = getDashboardAsciiArt(this.settings.asciiArtPreset);
    if (ascii) {
      const pre = container.createEl("pre", {
        cls: `miku-ascii miku-ascii--${this.settings.asciiArtPreset}`
      });
      pre.textContent = ascii;
    }

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
    progress.createEl("p", { text: "Track goals with your dashboard checklist." });

    const checklistActions = progress.createDiv({ cls: "miku-checklist-actions" });
    const newGoalInput = checklistActions.createEl("input", {
      type: "text",
      placeholder: "New goal..."
    });
    newGoalInput.addClass("miku-checklist-input");
    const addGoal = checklistActions.createEl("button", { text: "+ Add goal" });
    addGoal.onclick = () => {
      void this.addGoal(newGoalInput);
    };
    newGoalInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void this.addGoal(newGoalInput);
      }
    });
    const clearDone = checklistActions.createEl("button", { text: "Clear done" });
    clearDone.onclick = () => {
      void this.clearDoneGoals();
    };

    const checklist = progress.createEl("ul", { cls: "miku-checklist" });
    if (this.settings.dashboardGoals.length === 0) {
      checklist.createEl("li", {
        cls: "miku-checklist-empty",
        text: "No goals yet. Add one with + Add goal."
      });
    } else {
      for (const goal of this.settings.dashboardGoals) {
        const item = checklist.createEl("li", {
          cls: `miku-checklist-item${goal.done ? " is-done" : ""}`
        });
        const label = item.createEl("label", { cls: "miku-checklist-label" });
        const checkbox = label.createEl("input", { type: "checkbox" });
        checkbox.checked = goal.done;
        checkbox.onchange = () => {
          void this.toggleGoal(goal.id, checkbox.checked);
        };
        label.createSpan({ text: goal.text });
      }
    }

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

  private async toggleGoal(id: string, done: boolean): Promise<void> {
    const next = this.settings.dashboardGoals.map((goal) =>
      goal.id === id ? { ...goal, done } : goal
    );
    await this.saveGoals(next);
  }

  private async addGoal(inputEl: HTMLInputElement): Promise<void> {
    const trimmed = inputEl.value.trim();
    if (!trimmed) {
      new Notice("Type a goal first.");
      return;
    }
    const next: MikuDashboardGoal[] = [
      ...this.settings.dashboardGoals,
      {
        id: `goal-${Date.now()}`,
        text: trimmed,
        done: false
      }
    ];
    inputEl.value = "";
    await this.saveGoals(next);
    new Notice("Goal added.");
  }

  private async clearDoneGoals(): Promise<void> {
    const before = this.settings.dashboardGoals.length;
    const next = this.settings.dashboardGoals.filter((goal) => !goal.done);
    await this.saveGoals(next);
    const removed = before - next.length;
    new Notice(removed > 0 ? `Removed ${removed} completed goal(s).` : "No completed goals to clear.");
  }

  private async saveGoals(goals: MikuDashboardGoal[]): Promise<void> {
    this.host.settings.dashboardGoals = goals;
    this.settings = this.host.settings;
    await this.host.saveAndRefresh();
  }
}
