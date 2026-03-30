import { fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { trapFocus } from './trapFocus';

describe('trapFocus utility', () => {
  let container: HTMLDivElement;
  let cleanup: () => void;

  /**
   * Helper to set up a standard modal-like DOM structure
   * containing a mix of buttons, inputs, and links.
   */
  function setupDOM() {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="btn1">First</button>
      <input id="input2" />
      <a href="#" id="link3">Middle</a>
      <button id="btn4">Last</button>
    `;
    document.body.appendChild(container);
    return container;
  }

  afterEach(() => {
    if (cleanup) cleanup();
    if (container) container.remove();
  });

  it('focuses the first element immediately on initialization', () => {
    setupDOM();
    cleanup = trapFocus(container);

    const first = container.querySelector('#btn1') as HTMLElement;
    expect(document.activeElement).toBe(first);
  });

  it('loops focus to the start when Tabbing from the last element', () => {
    setupDOM();
    cleanup = trapFocus(container);

    const first = container.querySelector('#btn1') as HTMLElement;
    const last = container.querySelector('#btn4') as HTMLElement;

    // Manually move focus to the last element (simulating user navigation)
    last.focus();
    expect(document.activeElement).toBe(last);

    // Press Tab (no shift)
    // Fire the event on the active element, allowing it to bubble up to the container
    fireEvent.keyDown(last, { key: 'Tab', shiftKey: false, bubbles: true });

    // The utility should have caught this and moved focus back to 'first'
    expect(document.activeElement).toBe(first);
  });

  it('loops focus to the end when Shift+Tabbing from the first element', () => {
    setupDOM();
    cleanup = trapFocus(container);

    const first = container.querySelector('#btn1') as HTMLElement;
    const last = container.querySelector('#btn4') as HTMLElement;

    // Ensure focus is on the first element
    first.focus();

    // Press Shift + Tab
    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true, bubbles: true });

    // The utility should have caught this and moved focus to 'last'
    expect(document.activeElement).toBe(last);
  });

  it('does not interfere with Tab key if not on boundary elements', () => {
    setupDOM();
    cleanup = trapFocus(container);

    const input = container.querySelector('#input2') as HTMLElement;
    
    // Focus a middle element
    input.focus();
    const spy = vi.spyOn(input, 'focus');

    // Press Tab
    const event = fireEvent.keyDown(input, { key: 'Tab', shiftKey: false, bubbles: true });

    // The utility should NOT prevent default behavior here
    // It relies on the browser's default behavior to move to the next element
    expect(event).toBe(true); 
    
    // It should not have forced focus anywhere manually
    expect(spy).not.toHaveBeenCalled();
  });

  it('removes the event listener when cleanup is called', () => {
    setupDOM();
    cleanup = trapFocus(container);
    
    // Execute cleanup function returned by the utility
    cleanup();

    const last = container.querySelector('#btn4') as HTMLElement;

    // Move to the last element
    last.focus();

    // Press Tab again
    const event = fireEvent.keyDown(last, { key: 'Tab', shiftKey: false, bubbles: true });

    // Should NOT prevent default (meaning the trap is gone)
    expect(event).toBe(true);
    
    // Focus should NOT have jumped to the first element
    expect(document.activeElement).toBe(last);
  });
});