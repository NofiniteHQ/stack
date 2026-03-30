/**
 * Configuration options for the keyboard navigation utility.
 */
export interface KeyboardNavigationOptions {
  /** Array of focusable HTML elements to navigate between. */
  items: HTMLElement[];
  /** Callback function triggered when an item is selected via Enter or Space key. */
  onSelect: (index: number) => void;
}

/**
 * createKeyboardNavigation
 * -------------------------
 * Creates a keyboard event handler that enables arrow-key navigation 
 * between a provided list of HTML elements. It supports wrapping from 
 * the last item to the first, and vice versa.
 * * Compliant with basic WAI-ARIA authoring practices for list/menu navigation.
 *
 * @param options - The configuration options containing the items and selection callback.
 * @returns A function meant to be attached to a 'keydown' event listener.
 */
export function createKeyboardNavigation(options: KeyboardNavigationOptions) {
  return function (e: KeyboardEvent) {
    const { items, onSelect } = options;
    const current = items.indexOf(document.activeElement as HTMLElement);

    if (current === -1) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(current + 1) % items.length].focus();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(current - 1 + items.length) % items.length].focus();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(current);
    }
  };
}