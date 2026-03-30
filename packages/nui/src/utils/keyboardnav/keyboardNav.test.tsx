import { fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createKeyboardNavigation } from './keyboardNav';

describe('KeyboardNavi utility', () => {
  let container: HTMLDivElement;
  let items: HTMLButtonElement[];

  /**
   * Helper to set up a list of buttons in a mock DOM environment.
   * @returns An object containing the container and the array of button elements.
   */
  function setupDOM() {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="btn-0">Item 0</button>
      <button id="btn-1">Item 1</button>
      <button id="btn-2">Item 2</button>
    `;
    document.body.appendChild(container);
    
    // Select the elements as an array
    items = Array.from(container.querySelectorAll('button'));
    
    return { container, items };
  }

  afterEach(() => {
    if (container) container.remove();
  });

  it('moves focus to NEXT item on ArrowDown', () => {
    const { container, items } = setupDOM();
    const handleSelect = vi.fn();

    // Create the handler and attach it safely
    const handler = createKeyboardNavigation({ items, onSelect: handleSelect });
    container.addEventListener('keydown', handler as EventListener);

    // Start focus at 0
    items[0].focus();
    expect(document.activeElement).toBe(items[0]);

    // Press ArrowDown
    fireEvent.keyDown(items[0], { key: 'ArrowDown', bubbles: true });

    // Should move to 1
    expect(document.activeElement).toBe(items[1]);
  });

  it('moves focus to PREVIOUS item on ArrowUp', () => {
    const { container, items } = setupDOM();
    const handleSelect = vi.fn();
    
    const handler = createKeyboardNavigation({ items, onSelect: handleSelect });
    container.addEventListener('keydown', handler as EventListener);

    // Start focus at 1
    items[1].focus();

    // Press ArrowUp
    fireEvent.keyDown(items[1], { key: 'ArrowUp', bubbles: true });

    // Should move to 0
    expect(document.activeElement).toBe(items[0]);
  });

  it('wraps from LAST to FIRST on ArrowDown', () => {
    const { container, items } = setupDOM();
    
    const handler = createKeyboardNavigation({ items, onSelect: vi.fn() });
    container.addEventListener('keydown', handler as EventListener);

    // Start focus at last (index 2)
    items[2].focus();

    // Press ArrowDown
    fireEvent.keyDown(items[2], { key: 'ArrowDown', bubbles: true });

    // Should wrap to 0
    expect(document.activeElement).toBe(items[0]);
  });

  it('wraps from FIRST to LAST on ArrowUp', () => {
    const { container, items } = setupDOM();
    
    const handler = createKeyboardNavigation({ items, onSelect: vi.fn() });
    container.addEventListener('keydown', handler as EventListener);

    // Start focus at first (index 0)
    items[0].focus();

    // Press ArrowUp
    fireEvent.keyDown(items[0], { key: 'ArrowUp', bubbles: true });

    // Should wrap to last (index 2)
    expect(document.activeElement).toBe(items[2]);
  });

  it('triggers onSelect when Enter is pressed', () => {
    const { container, items } = setupDOM();
    const handleSelect = vi.fn();
    
    const handler = createKeyboardNavigation({ items, onSelect: handleSelect });
    container.addEventListener('keydown', handler as EventListener);

    // Focus Item 1
    items[1].focus();

    // Press Enter
    fireEvent.keyDown(items[1], { key: 'Enter', bubbles: true });

    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('triggers onSelect when Space is pressed', () => {
    const { container, items } = setupDOM();
    const handleSelect = vi.fn();
    
    const handler = createKeyboardNavigation({ items, onSelect: handleSelect });
    container.addEventListener('keydown', handler as EventListener);

    items[2].focus();
    fireEvent.keyDown(items[2], { key: ' ', bubbles: true });

    expect(handleSelect).toHaveBeenCalledWith(2);
  });

  it('does nothing if focus is not on a known item', () => {
    const { container, items } = setupDOM();
    
    const handler = createKeyboardNavigation({ items, onSelect: vi.fn() });
    container.addEventListener('keydown', handler as EventListener);

    // Focus body or some other element
    container.focus(); 
    (document.activeElement as HTMLElement)?.blur(); 

    // Fire event on container
    fireEvent.keyDown(container, { key: 'ArrowDown', bubbles: true });

    // Focus should not have moved to any item unexpectedly
    expect(items.includes(document.activeElement as HTMLButtonElement)).toBe(false);
  });
});