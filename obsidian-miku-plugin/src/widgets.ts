import { Plugin, setIcon } from "obsidian";
import { MikuPluginSettings } from "./settings";

const QUOTES = [
  "Keep your notes in sync with your rhythm.",
  "Small progress every day beats a single perfect burst.",
  "Organize ideas like a setlist before the show.",
  "Create first, polish second, ship always."
];

interface ManagedWidget {
  mount(): void;
  update(settings: MikuPluginSettings): void;
  unmount(): void;
}

class StatusBarWidget implements ManagedWidget {
  private element: HTMLElement | null = null;

  constructor(private readonly plugin: Plugin) {}

  mount(): void {
    this.element = this.plugin.addStatusBarItem();
    this.element.addClass("miku-status-widget");
  }

  update(settings: MikuPluginSettings): void {
    if (!this.element) {
      return;
    }
    this.element.toggleClass("is-hidden", !settings.statusBarEnabled);
    this.element.setText(`Miku: ${settings.themeMode}`);
  }

  unmount(): void {
    this.element?.remove();
    this.element = null;
  }
}

class BannerWidget implements ManagedWidget {
  private element: HTMLDivElement | null = null;

  mount(): void {
    this.element = document.createElement("div");
    this.element.className = "miku-top-banner";
    document.body.appendChild(this.element);
  }

  update(settings: MikuPluginSettings): void {
    if (!this.element) {
      return;
    }
    this.element.toggleClass("is-hidden", !settings.bannerEnabled);
    this.element.setText(settings.bannerText);
  }

  unmount(): void {
    this.element?.remove();
    this.element = null;
  }
}

class QuoteWidget implements ManagedWidget {
  private element: HTMLDivElement | null = null;
  private timer: number | null = null;
  private quoteIndex = 0;

  mount(): void {
    this.element = document.createElement("div");
    this.element.className = "miku-quote-widget is-hidden";
    document.body.appendChild(this.element);
  }

  update(settings: MikuPluginSettings): void {
    if (!this.element) {
      return;
    }
    this.element.toggleClass("is-hidden", !settings.quoteEnabled);
    this.element.setText(`"${QUOTES[this.quoteIndex % QUOTES.length]}"`);

    if (!settings.quoteEnabled) {
      this.stopRotation();
      return;
    }

    this.stopRotation();
    const intervalMs = Math.max(10, settings.quoteIntervalSeconds) * 1000;
    this.timer = window.setInterval(() => {
      this.quoteIndex += 1;
      if (this.element) {
        this.element.setText(`"${QUOTES[this.quoteIndex % QUOTES.length]}"`);
      }
    }, intervalMs);
  }

  unmount(): void {
    this.stopRotation();
    this.element?.remove();
    this.element = null;
  }

  private stopRotation(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}

class ProfileCardWidget implements ManagedWidget {
  private element: HTMLDivElement | null = null;

  mount(): void {
    this.element = document.createElement("div");
    this.element.className = "miku-profile-card is-hidden";
    const title = document.createElement("h4");
    title.setText("Miku Assistant");
    const detail = document.createElement("p");
    detail.setText("Theme and workflow widgets are active.");
    this.element.append(title, detail);
    const icon = document.createElement("span");
    icon.addClass("miku-profile-icon");
    setIcon(icon, "sparkles");
    this.element.appendChild(icon);
    document.body.appendChild(this.element);
  }

  update(settings: MikuPluginSettings): void {
    this.element?.toggleClass("is-hidden", !settings.profileCardEnabled);
    this.element?.toggleClass("is-compact", settings.compactDashboard);
  }

  unmount(): void {
    this.element?.remove();
    this.element = null;
  }
}

export class WidgetManager {
  private readonly widgets: ManagedWidget[];

  constructor(plugin: Plugin) {
    this.widgets = [
      new StatusBarWidget(plugin),
      new BannerWidget(),
      new QuoteWidget(),
      new ProfileCardWidget()
    ];
  }

  mount(): void {
    this.widgets.forEach((widget) => widget.mount());
  }

  update(settings: MikuPluginSettings): void {
    this.widgets.forEach((widget) => widget.update(settings));
  }

  unmount(): void {
    this.widgets.forEach((widget) => widget.unmount());
  }
}
