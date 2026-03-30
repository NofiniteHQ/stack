/**
 * Restores keyboard focus to a previously focused element.
 * --------------------------------------------------------
 * This is a strict WCAG accessibility requirement for modals, dialogs, and popovers.
 * When an overlay closes, the user's focus must be returned to the element 
 * that originally triggered the overlay, preventing screen readers and keyboard 
 * users from losing their place on the page.
 *
 * @param element - The HTML element to receive focus. Safely ignores `null` or `undefined`.
 */
export function restoreFocus(element: HTMLElement | null): void {
  element?.focus();
}