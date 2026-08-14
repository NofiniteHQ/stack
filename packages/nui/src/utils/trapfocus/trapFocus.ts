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
  // Query all standard interactive HTML elements within the container
  const focusable = container.querySelectorAll<HTMLElement>(
    `a[href], button:not([disabled]), textarea,
     input, select, [tabindex]:not([tabindex="-1"])`
  );

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handle(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    // Shift+Tab → If focused on the first element, loop around to the last element
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }

    // Tab → If focused on the last element, loop around to the first element
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Attach the boundary logic
  container.addEventListener('keydown', handle);

  // Automatically shift the user's focus into the trap when initialized,
  // ONLY if focus has not already been moved into the container manually.
  if (!container.contains(document.activeElement)) {
    first?.focus();
  }

  // Return the cleanup handler
  return () => container.removeEventListener('keydown', handle);
}