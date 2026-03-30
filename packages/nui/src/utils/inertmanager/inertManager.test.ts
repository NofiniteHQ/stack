import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { applyInertToSiblings, removeInertFromSiblings } from './inertManager';

describe('inertManager utility', () => {
  let container: HTMLDivElement;
  let modal: HTMLDivElement;
  let sibling1: HTMLDivElement;
  let sibling2: HTMLDivElement;

  beforeEach(() => {
    // Setup a realistic DOM structure
    // <body>
    //   <div id="root"> (container)
    //     <div id="app-content">Sibling 1</div>
    //     <div id="sidebar">Sibling 2</div>
    //     <div id="modal-overlay">Modal</div>
    //   </div>
    // </body>
    container = document.createElement('div');
    container.id = 'root';
    
    sibling1 = document.createElement('div');
    sibling1.id = 'app-content';
    
    sibling2 = document.createElement('div');
    sibling2.id = 'sidebar';
    
    modal = document.createElement('div');
    modal.id = 'modal-overlay';

    container.appendChild(sibling1);
    container.appendChild(sibling2);
    container.appendChild(modal);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('applies inert and aria-hidden to all siblings', () => {
    const affected = applyInertToSiblings(modal);

    // Verify Sibling 1
    expect(sibling1).toHaveAttribute('inert', '');
    expect(sibling1).toHaveAttribute('aria-hidden', 'true');

    // Verify Sibling 2
    expect(sibling2).toHaveAttribute('inert', '');
    expect(sibling2).toHaveAttribute('aria-hidden', 'true');

    // Verify Modal itself is touched? NO.
    expect(modal).not.toHaveAttribute('inert');
    expect(modal).not.toHaveAttribute('aria-hidden');

    // Verify return value
    expect(affected).toHaveLength(2);
    expect(affected).toContain(sibling1);
    expect(affected).toContain(sibling2);
  });

  it('removes inert and aria-hidden correctly', () => {
    // Apply first
    const affected = applyInertToSiblings(modal);
    
    // Verify they are set
    expect(sibling1).toHaveAttribute('inert');

    // Remove
    removeInertFromSiblings(affected);

    // Verify clean
    expect(sibling1).not.toHaveAttribute('inert');
    expect(sibling1).not.toHaveAttribute('aria-hidden');
    
    expect(sibling2).not.toHaveAttribute('inert');
    expect(sibling2).not.toHaveAttribute('aria-hidden');
  });

  it('does nothing if modal has no parent (safety check)', () => {
    const orphan = document.createElement('div');
    const affected = applyInertToSiblings(orphan);

    expect(affected).toEqual([]);
  });
});