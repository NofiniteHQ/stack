/**
 * scrollLock
 * ----------
 * Utility to temporarily disable document scrolling. 
 * Essential for maintaining context when modals, drawers, or fullscreen overlays are open.
 * Prevents the background content from moving while the user interacts with the overlay.
 */
export const scrollLock = {
  /**
   * Locks the page scroll by applying `overflow: hidden` directly to the body's inline style.
   */
  lock(): void {
    document.body.style.overflow = 'hidden';
  },
  
  /**
   * Unlocks the page scroll by clearing the inline `overflow` style.
   * This allows the body to fall back to its default state defined in the CSS stylesheets.
   */
  unlock(): void {
    document.body.style.overflow = '';
  },
};