/**
 * trapFocus
 * ---------
 * A WCAG-compliant focus trap utility for modals, dialogs, and off-canvas menus.
 * Prevents keyboard-only users (and screen readers) from tabbing out of the active
 * component and interacting with background elements.
 *
 * @param container - The DOM element containing the focusable items.
 * @returns A cleanup function to remove the 'keydown' event listener when the container unmounts.
 */
export function trapFocus(container: HTMLElement): () => void {
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusable(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        el.getAttribute('aria-hidden') !== 'true'
    );
  }

  function handle(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    // Dynamically query focusable elements to handle dynamic DOM mutations
    const focusable = getFocusable();
    if (focusable.length === 0) {
      e.preventDefault();
      container.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Shift+Tab → If focused on the first element (or container), loop around to the last element
    if (
      e.shiftKey &&
      (document.activeElement === first || document.activeElement === container)
    ) {
      e.preventDefault();
      last.focus();
    }

    // Tab → If focused on the last element, loop around to the first element
    else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Attach the boundary logic
  container.addEventListener('keydown', handle);

  // Automatically shift the user's focus into the trap when initialized,
  // ONLY if focus has not already been moved into the container manually.
  if (!container.contains(document.activeElement)) {
    const initial = getFocusable()[0];
    if (initial) {
      initial.focus();
    } else {
      container.focus();
    }
  }

  // Return the cleanup handler
  return () => container.removeEventListener('keydown', handle);
}
