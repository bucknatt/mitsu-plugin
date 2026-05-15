import type { App } from "obsidian";

type AppWithCommands = App & {
  commands: {
    executeCommandById(commandId: string): boolean;
  };
};

/** Runtime command palette API (not declared on App in published obsidian typings). */
export function executeCommand(app: App, commandId: string): void {
  (app as AppWithCommands).commands.executeCommandById(commandId);
}
