const POSITION_PROPS = ["left", "top", "right", "bottom", "transform"] as const;

/** Apply dragged fixed coordinates (use HTMLElement.setCssProps per Obsidian guidelines). */
export function applyDragPosition(el: HTMLElement, x: number, y: number): void {
  el.addClass("miku-is-drag-positioned");
  el.setCssProps({
    left: `${x}px`,
    top: `${y}px`,
    right: "auto",
    bottom: "auto",
    transform: "none"
  });
}

/** Restore CSS default placement from styles.css. */
export function clearDragPosition(el: HTMLElement): void {
  el.removeClass("miku-is-drag-positioned");
  const reset: Record<string, string> = {};
  for (const key of POSITION_PROPS) {
    reset[key] = "";
  }
  el.setCssProps(reset);
}

export function readDragPosition(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return { x: Math.round(rect.left), y: Math.round(rect.top) };
}
