/**
 * @nofinite/markon - Popover Coordinator
 * Guarantees single active popover, eliminates z-index collisions and memory leaks.
 */

export interface ActivePopover {
  close: () => void;
}

let activePopover: ActivePopover | null = null;

export function registerActivePopover(popover: ActivePopover): void {
  if (activePopover && activePopover !== popover) {
    activePopover.close();
  }
  activePopover = popover;
}

export function unregisterActivePopover(popover: ActivePopover): void {
  if (activePopover === popover) {
    activePopover = null;
  }
}

export function closeAllPopovers(): void {
  if (activePopover) {
    const prev = activePopover;
    activePopover = null;
    prev.close();
  }
}
