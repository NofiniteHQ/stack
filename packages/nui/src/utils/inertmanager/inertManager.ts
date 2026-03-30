/**
 * inertManager.ts
 * ----------------
 * Applies true "modalization" to the page:
 * - disables ALL siblings of the modal overlay
 * - prevents keyboard interaction (inert)
 * - prevents screen reader access (aria-hidden)
 *
 * This is REQUIRED for WCAG-level dialog compliance.
 */

/**
 * Applies `inert` and `aria-hidden` attributes to all sibling elements of the provided modal.
 * This ensures focus is trapped and the rest of the page is hidden from screen readers.
 *
 * @param modalElement - The modal or overlay HTML element whose siblings should be disabled.
 * @returns An array of the HTMLElements that were modified, which is needed for cleanup.
 */
export function applyInertToSiblings(modalElement: HTMLElement): HTMLElement[] {
  const parent = modalElement.parentElement;
  if (!parent) return [];

  const affected: HTMLElement[] = [];

  Array.from(parent.children).forEach((child) => {
    if (child !== modalElement && child instanceof HTMLElement) {
      child.setAttribute('inert', '');
      child.setAttribute('aria-hidden', 'true');
      affected.push(child);
    }
  });

  return affected;
}

/**
 * Restores previously disabled sibling elements to their normal interactive state
 * by removing the `inert` and `aria-hidden` attributes.
 *
 * @param elements - The array of HTMLElements previously modified by `applyInertToSiblings`.
 */
export function removeInertFromSiblings(elements: HTMLElement[]): void {
  elements.forEach((el) => {
    el.removeAttribute('inert');
    el.removeAttribute('aria-hidden');
  });
}