import React from 'react';

/**
 * Executes a callback handler when the user clicks or taps outside of the referenced element(s).
 * Supports both single DOM elements and arrays of elements (useful for complex UI like modals or dropdowns with triggers).
 *
 * @param refs - A single React ref or an array of React refs representing the elements to ignore.
 * @param handler - The callback function to execute when an outside click/tap is detected.
 * @returns A cleanup function that removes the attached event listeners.
 */
export function onClickOutside(
  refs: React.RefObject<HTMLElement | null> | Array<React.RefObject<HTMLElement | null>>,
  handler: (e: MouseEvent | TouchEvent) => void
) {
  function listener(e: MouseEvent | TouchEvent) {
    // Normalize to an array so we can check multiple refs easily
    const refArray = Array.isArray(refs) ? refs : [refs];
    
    // Check if the click target is inside ANY of the provided refs
    const isInsideAny = refArray.some((ref) => {
      const el = ref.current;
      return el && el.contains(e.target as Node);
    });

    // If they clicked inside any of our protected refs, do nothing
    if (isInsideAny) return;
    
    // Otherwise, they clicked outside. Fire the handler!
    handler(e);
  }

  document.addEventListener('mousedown', listener);
  document.addEventListener('touchstart', listener);

  return () => {
    document.removeEventListener('mousedown', listener);
    document.removeEventListener('touchstart', listener);
  };
}