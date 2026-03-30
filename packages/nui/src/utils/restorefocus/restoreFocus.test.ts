import { describe, it, expect, vi } from 'vitest';
import { restoreFocus } from './restoreFocus';

describe('restoreFocus utility', () => {
  it('calls focus on the provided element', () => {
    // 1. Create a dummy element to act as the trigger button
    const el = document.createElement('button');
    
    // 2. Spy on the native DOM focus method
    const focusSpy = vi.spyOn(el, 'focus');

    // 3. Execute utility
    restoreFocus(el);

    // 4. Verify the native method was triggered exactly once
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('does nothing if element is null', () => {
    // This test ensures no "Cannot read properties of null" errors are thrown
    // which is common if the trigger element was removed from the DOM before the modal closed.
    expect(() => restoreFocus(null)).not.toThrow();
  });
  
  it('does nothing if element is undefined', () => {
    // @ts-expect-error - explicitly testing undefined for JS consumers and robustness
    expect(() => restoreFocus(undefined)).not.toThrow();
  });
});