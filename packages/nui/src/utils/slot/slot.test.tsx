import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slot, Slottable } from './slot';

describe('Slot Component', () => {
  it('renders the child element seamlessly', () => {
    render(
      <Slot>
        <div data-testid="child">Hello World</div>
      </Slot>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(child.tagName).toBe('DIV');
    expect(child).toHaveTextContent('Hello World');
  });

  it('merges classNames correctly', () => {
    render(
      <Slot className="slot-class">
        <div data-testid="child" className="child-class">
          Content
        </div>
      </Slot>
    );

    const child = screen.getByTestId('child');
    // Using your `cn` utility, it should combine both classes
    expect(child).toHaveClass('slot-class');
    expect(child).toHaveClass('child-class');
  });

  it('merges inline styles correctly', () => {
    render(
      <Slot style={{ color: 'red', backgroundColor: 'black' }}>
        <div data-testid="child" style={{ color: 'blue', fontSize: '16px' }}>
          Content
        </div>
      </Slot>
    );

    const child = screen.getByTestId('child');
    // Child's style should override Slot's style for conflicting keys (color)
    expect(child).toHaveStyle({
      color: 'blue',
      backgroundColor: 'black',
      fontSize: '16px',
    });
  });

  it('chains event handlers (fires both child and slot events)', () => {
    const slotClickSpy = vi.fn();
    const childClickSpy = vi.fn();

    render(
      <Slot onClick={slotClickSpy}>
        <button data-testid="child" onClick={childClickSpy}>
          Click Me
        </button>
      </Slot>
    );

    fireEvent.click(screen.getByTestId('child'));

    // Both handlers MUST fire. This is critical for things like Dropdown Triggers
    // where the user wants to add their own onClick on top of the library's onClick.
    expect(childClickSpy).toHaveBeenCalledTimes(1);
    expect(slotClickSpy).toHaveBeenCalledTimes(1);
  });

  it('forwards refs correctly to the cloned child', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Slot ref={ref}>
        <button data-testid="child">Button</button>
      </Slot>
    );

    const child = screen.getByTestId('child');
    
    // The ref passed to the Slot should attach to the actual DOM node of the child
    expect(ref.current).toBe(child);
  });

  describe('with Slottable', () => {
    it('injects the child element while preserving sibling elements (like icons)', () => {
      render(
        <Slot>
          <span data-testid="icon-left">Left</span>
          <Slottable>
            <button data-testid="actual-target">Button Text</button>
          </Slottable>
          <span data-testid="icon-right">Right</span>
        </Slot>
      );

      const target = screen.getByTestId('actual-target');
      const leftIcon = screen.getByTestId('icon-left');
      const rightIcon = screen.getByTestId('icon-right');

      // The target should be the root element now
      expect(target).toBeInTheDocument();
      expect(target.tagName).toBe('BUTTON');

      // The icons and original text should now be *inside* the target
      expect(target).toContainElement(leftIcon);
      expect(target).toContainElement(rightIcon);
      expect(target).toHaveTextContent('LeftButton TextRight');
    });
  });

  it('returns null if no valid child is provided', () => {
    const { container } = render(
      <Slot>
        {/* Empty or invalid children like raw strings shouldn't crash the Slot */}
        {null}
      </Slot>
    );

    expect(container).toBeEmptyDOMElement();
  });
});