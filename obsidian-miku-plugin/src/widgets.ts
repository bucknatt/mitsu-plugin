import { Notice, Plugin, setIcon } from "obsidian";
import type { MikuPluginHost } from "./miku-plugin-host";
import type { MikuPluginSettings, MikuThemeMode } from "./settings";
import { applyDragPosition, clearDragPosition, readDragPosition } from "./widget-layout";

const PROFILE_TIPS = [
  "Tip: Ribbon sparkles opens the dashboard.",
  "Tip: Cycle theme modes from the palette or palette command.",
  "Tip: Glow intensity lives in plugin settings.",
  "Tip: Enable the plugin for bundled hybrid palette styling."
];

const MODE_BLURB: Record<MikuThemeMode, string> = {
  MinimalMiku: "Clean teal lane — palettes stay soft.",
  Concert: "High-energy stage palette — crank the glow!",
  NightNeon: "Violet/teal neon — late session mode.",
  SnowMiku: "Frosted pastels — airy contrast."
};

const QUOTES = [
  "Keep your goals in sync with your rhythm.",
  "Small progress every day beats a single perfect burst.",
  "Organize ideas like a setlist before the show.",
  "Let your code compile to the tempo of cyan and pink.",
  "The future is a blank score — you write the notes.",
  "Connecting the world through music — one commit at a time.",
  "0 and 1 can still dream in cyan.",
  "Even if colors fade, keep your melody vibrant.",
  "Twin tails of ideas — branch and merge with style.",
  "Welcome to the wonderland of frost, neon, and stage lights.",
  "Sing your refactor into existence.",
  "39 lines changed? Make them count.",
  "Hydrate, stretch, then ship the chorus.",
  "Your IDE is the stage: the theme is the lights."
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
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private dragging = false;

  constructor(
    private readonly host: MikuPluginHost,
    private readonly saveAndRefresh: () => Promise<void>
  ) {}

  mount(): void {
    this.element = activeDocument.createElement("div");
    this.element.className = "miku-top-banner";
    this.element.setAttribute("title", "Drag to move banner");
    this.element.addEventListener("pointerdown", (event) => this.onPointerDown(event));
    activeWindow.addEventListener("pointermove", this.onPointerMove);
    activeWindow.addEventListener("pointerup", this.onPointerUp);
    activeDocument.body.appendChild(this.element);
  }

  update(settings: MikuPluginSettings): void {
    if (!this.element) {
      return;
    }
    this.element.toggleClass("is-hidden", !settings.bannerEnabled);
    this.element.setText(settings.bannerText);

    if (settings.bannerPosition) {
      applyDragPosition(this.element, settings.bannerPosition.x, settings.bannerPosition.y);
    } else if (!this.element.classList.contains("is-dragging")) {
      clearDragPosition(this.element);
    }
  }

  unmount(): void {
    activeWindow.removeEventListener("pointermove", this.onPointerMove);
    activeWindow.removeEventListener("pointerup", this.onPointerUp);
    this.element?.remove();
    this.element = null;
  }

  private onPointerDown(event: PointerEvent): void {
    if (!this.element || event.button !== 0) {
      return;
    }
    const rect = this.element.getBoundingClientRect();
    this.dragOffsetX = event.clientX - rect.left;
    this.dragOffsetY = event.clientY - rect.top;
    this.dragging = true;
    this.element.classList.add("is-dragging");
    this.element.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging || !this.element) {
      return;
    }
    const maxX = Math.max(8, activeWindow.innerWidth - this.element.offsetWidth - 8);
    const maxY = Math.max(8, activeWindow.innerHeight - this.element.offsetHeight - 8);
    const nextX = Math.min(maxX, Math.max(8, event.clientX - this.dragOffsetX));
    const nextY = Math.min(maxY, Math.max(8, event.clientY - this.dragOffsetY));
    applyDragPosition(this.element, nextX, nextY);
  };

  private onPointerUp = (): void => {
    if (!this.dragging || !this.element) {
      return;
    }
    this.dragging = false;
    this.element.classList.remove("is-dragging");
    const { x, y } = readDragPosition(this.element);
    this.host.settings.bannerPosition = { x, y };
    void this.saveAndRefresh();
  };
}

class QuoteWidget implements ManagedWidget {
  private element: HTMLDivElement | null = null;
  private timer: number | null = null;
  private quoteIndex = 0;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private dragging = false;

  constructor(
    private readonly host: MikuPluginHost,
    private readonly saveAndRefresh: () => Promise<void>
  ) {}

  mount(): void {
    this.element = activeDocument.createElement("div");
    this.element.className = "miku-quote-widget is-hidden";
    this.element.setAttribute("title", "Drag to move quote");
    this.element.addEventListener("pointerdown", (event) => this.onPointerDown(event));
    activeWindow.addEventListener("pointermove", this.onPointerMove);
    activeWindow.addEventListener("pointerup", this.onPointerUp);
    activeDocument.body.appendChild(this.element);
  }

  update(settings: MikuPluginSettings): void {
    if (!this.element) {
      return;
    }
    this.element.toggleClass("is-hidden", !settings.quoteEnabled);
    this.element.setText(`"${QUOTES[this.quoteIndex % QUOTES.length]}"`);
    if (settings.quotePosition) {
      applyDragPosition(this.element, settings.quotePosition.x, settings.quotePosition.y);
    } else if (!this.element.classList.contains("is-dragging")) {
      clearDragPosition(this.element);
    }

    if (!settings.quoteEnabled) {
      this.stopRotation();
      return;
    }

    this.stopRotation();
    const intervalMs = Math.max(5, settings.quoteIntervalSeconds) * 1000;
    this.timer = window.setInterval(() => {
      this.quoteIndex += 1;
      if (this.element) {
        this.element.setText(`"${QUOTES[this.quoteIndex % QUOTES.length]}"`);
      }
    }, intervalMs);
  }

  unmount(): void {
    activeWindow.removeEventListener("pointermove", this.onPointerMove);
    activeWindow.removeEventListener("pointerup", this.onPointerUp);
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

  private onPointerDown(event: PointerEvent): void {
    if (!this.element || event.button !== 0) {
      return;
    }
    const rect = this.element.getBoundingClientRect();
    this.dragOffsetX = event.clientX - rect.left;
    this.dragOffsetY = event.clientY - rect.top;
    this.dragging = true;
    this.element.classList.add("is-dragging");
    this.element.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging || !this.element) {
      return;
    }
    const maxX = Math.max(8, activeWindow.innerWidth - this.element.offsetWidth - 8);
    const maxY = Math.max(8, activeWindow.innerHeight - this.element.offsetHeight - 8);
    const nextX = Math.min(maxX, Math.max(8, event.clientX - this.dragOffsetX));
    const nextY = Math.min(maxY, Math.max(8, event.clientY - this.dragOffsetY));
    applyDragPosition(this.element, nextX, nextY);
  };

  private onPointerUp = (): void => {
    if (!this.dragging || !this.element) {
      return;
    }
    this.dragging = false;
    this.element.classList.remove("is-dragging");
    const { x, y } = readDragPosition(this.element);
    this.host.settings.quotePosition = { x, y };
    void this.saveAndRefresh();
  };
}

class ProfileCardWidget implements ManagedWidget {
  private element: HTMLDivElement | null = null;
  private badgeEl: HTMLSpanElement | null = null;
  private subtitleEl: HTMLParagraphElement | null = null;
  private chipsEl: HTMLDivElement | null = null;
  private tipEl: HTMLParagraphElement | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private dragging = false;
  private movedWhileDragging = false;
  private suppressNextClick = false;

  constructor(
    private readonly host: MikuPluginHost,
    private readonly openDashboard: () => Promise<void>,
    private readonly saveAndRefresh: () => Promise<void>
  ) {}

  mount(): void {
    this.element = activeDocument.createElement("div");
    this.element.className = "miku-profile-card is-hidden";
    this.element.setAttribute("role", "button");
    this.element.setAttribute("tabindex", "0");
    this.element.setAttribute(
      "aria-label",
      "Miku lane profile — open Miku dashboard"
    );
    this.element.setAttribute("title", "Open Miku dashboard");
    this.element.addEventListener("pointerdown", (event) => this.onPointerDown(event));
    activeWindow.addEventListener("pointermove", this.onPointerMove);
    activeWindow.addEventListener("pointerup", this.onPointerUp);

    this.element.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.tryOpenDashboard();
      }
    });

    const headerRow = activeDocument.createElement("div");
    headerRow.addClass("miku-profile-card__header");
    const title = activeDocument.createElement("h4");
    title.setText("Miku lane");
    this.badgeEl = activeDocument.createElement("span");
    this.badgeEl.addClass("miku-profile-badge");
    headerRow.append(title, this.badgeEl);

    this.subtitleEl = activeDocument.createElement("p");
    this.subtitleEl.addClass("miku-profile-card__subtitle");

    this.chipsEl = activeDocument.createElement("div");
    this.chipsEl.addClass("miku-profile-card__chips");

    const divider = activeDocument.createElement("div");
    divider.addClass("miku-profile-card__divider");

    this.tipEl = activeDocument.createElement("p");
    this.tipEl.addClass("miku-profile-card__tip");

    const foot = activeDocument.createElement("div");
    foot.addClass("miku-profile-card__foot");
    const icon = activeDocument.createElement("span");
    icon.addClass("miku-profile-icon");
    setIcon(icon, "sparkles");
    const hint = activeDocument.createElement("span");
    hint.addClass("miku-profile-card__cta");
    hint.setText("Click / tap for dashboard");
    foot.append(icon, hint);

    this.element.append(
      headerRow,
      this.subtitleEl,
      this.chipsEl,
      divider,
      this.tipEl,
      foot
    );

    this.element.addEventListener("click", () => {
      if (this.suppressNextClick) {
        this.suppressNextClick = false;
        return;
      }
      this.tryOpenDashboard();
    });
    activeDocument.body.appendChild(this.element);
  }

  update(settings: MikuPluginSettings): void {
    if (this.element) {
      this.element.toggleClass("is-hidden", !settings.profileCardEnabled);
      this.element.toggleClass("is-compact", settings.compactDashboard);
      this.element.setAttribute(
        "tabindex",
        settings.profileCardEnabled ? "0" : "-1"
      );
      if (settings.profileCardPosition) {
        applyDragPosition(
          this.element,
          settings.profileCardPosition.x,
          settings.profileCardPosition.y
        );
      } else if (!this.element.classList.contains("is-dragging")) {
        clearDragPosition(this.element);
      }
    }

    if (!this.badgeEl || !this.subtitleEl || !this.chipsEl || !this.tipEl) {
      return;
    }

    const mode = settings.themeMode;
    this.badgeEl.setText(mode.replace(/([a-z])([A-Z])/g, "$1 $2"));

    this.subtitleEl.setText(MODE_BLURB[mode]);

    const pct = Math.round(settings.glowIntensity * 100);
    const ascii =
      settings.asciiArtPreset === "off"
        ? "ASCII off"
        : `ASCII · ${settings.asciiArtPreset}`;

    const motion = settings.reducedMotion ? "Calm motion" : "Glow pulse on";

    this.chipsEl.replaceChildren();
    const chipGlow = activeDocument.createElement("span");
    chipGlow.addClass("miku-profile-chip");
    chipGlow.addClass("miku-profile-chip--glow");
    chipGlow.setText(`Glow ${pct}%`);
    const chipAscii = activeDocument.createElement("span");
    chipAscii.addClass("miku-profile-chip");
    chipAscii.setText(ascii);
    const chipMotion = activeDocument.createElement("span");
    chipMotion.addClass("miku-profile-chip");
    chipMotion.setText(motion);
    this.chipsEl.append(chipGlow, chipAscii, chipMotion);

    const modes: MikuThemeMode[] = [
      "MinimalMiku",
      "Concert",
      "NightNeon",
      "SnowMiku"
    ];
    const modeIdx = modes.indexOf(settings.themeMode);
    const tipIdx = modeIdx >= 0 ? modeIdx : 0;
    this.tipEl.setText(PROFILE_TIPS[tipIdx]);
  }

  private tryOpenDashboard(): void {
    void this.openDashboard().catch(() => {
      new Notice("Use command palette → open Miku dashboard.");
    });
  }

  unmount(): void {
    activeWindow.removeEventListener("pointermove", this.onPointerMove);
    activeWindow.removeEventListener("pointerup", this.onPointerUp);
    this.element?.remove();
    this.element = null;
    this.badgeEl = null;
    this.subtitleEl = null;
    this.chipsEl = null;
    this.tipEl = null;
  }

  private onPointerDown(event: PointerEvent): void {
    if (!this.element || event.button !== 0) {
      return;
    }
    const rect = this.element.getBoundingClientRect();
    this.dragOffsetX = event.clientX - rect.left;
    this.dragOffsetY = event.clientY - rect.top;
    this.dragging = true;
    this.movedWhileDragging = false;
    this.element.classList.add("is-dragging");
    this.element.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging || !this.element) {
      return;
    }
    const maxX = Math.max(8, activeWindow.innerWidth - this.element.offsetWidth - 8);
    const maxY = Math.max(8, activeWindow.innerHeight - this.element.offsetHeight - 8);
    const nextX = Math.min(maxX, Math.max(8, event.clientX - this.dragOffsetX));
    const nextY = Math.min(maxY, Math.max(8, event.clientY - this.dragOffsetY));
    this.movedWhileDragging = true;
    applyDragPosition(this.element, nextX, nextY);
  };

  private onPointerUp = (): void => {
    if (!this.dragging || !this.element) {
      return;
    }
    this.dragging = false;
    this.element.classList.remove("is-dragging");
    if (!this.movedWhileDragging) {
      return;
    }
    this.suppressNextClick = true;
    const { x, y } = readDragPosition(this.element);
    this.host.settings.profileCardPosition = { x, y };
    void this.saveAndRefresh();
  };
}

export class WidgetManager {
  private readonly widgets: ManagedWidget[];

  constructor(
    host: MikuPluginHost,
    plugin: Plugin,
    openDashboard: () => Promise<void>,
    saveAndRefresh: () => Promise<void>
  ) {
    this.widgets = [
      new StatusBarWidget(plugin),
      new BannerWidget(host, saveAndRefresh),
      new QuoteWidget(host, saveAndRefresh),
      new ProfileCardWidget(host, openDashboard, saveAndRefresh)
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
