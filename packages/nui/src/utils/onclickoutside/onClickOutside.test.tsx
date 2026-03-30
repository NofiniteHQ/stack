import { useRef, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { onClickOutside } from './onClickOutside';

/**
 * Helper component: Tests behavior with a single referenced element.
 */
const SingleRefComponent = ({ onOutsideClick }: { onOutsideClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onClickOutside(ref, onOutsideClick);
  }, [onOutsideClick]);

  return (
    <div>
      <div data-testid="outside">Outside Area</div>
      <div ref={ref} data-testid="target">Target Element</div>
    </div>
  );
};

/**
 * Helper component: Tests behavior with multiple referenced elements (e.g., a Trigger + Popover).
 */
const MultiRefComponent = ({ onOutsideClick }: { onOutsideClick: () => void }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onClickOutside([triggerRef, popoverRef], onOutsideClick);
  }, [onOutsideClick]);

  return (
    <div>
      <div data-testid="outside">Outside Area</div>
      <button ref={triggerRef} data-testid="trigger">Trigger</button>
      <div ref={popoverRef} data-testid="popover">Popover Content</div>
    </div>
  );
};

describe('onClickOutside utility', () => {
  it('calls handler when clicking outside a single target', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<SingleRefComponent onOutsideClick={handler} />);

    // Click the sibling div (outside)
    await user.click(screen.getByTestId('outside'));
    
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does NOT call handler when clicking inside the single target', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<SingleRefComponent onOutsideClick={handler} />);

    // Click the target div (inside)
    await user.click(screen.getByTestId('target'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('ignores clicks inside MULTIPLE referenced targets (e.g., Trigger + Portal)', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<MultiRefComponent onOutsideClick={handler} />);

    // 1. Click Trigger -> Ignored
    await user.click(screen.getByTestId('trigger'));
    expect(handler).not.toHaveBeenCalled();

    // 2. Click Popover -> Ignored
    await user.click(screen.getByTestId('popover'));
    expect(handler).not.toHaveBeenCalled();

    // 3. Click Outside -> Handled!
    await user.click(screen.getByTestId('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('cleans up event listener on unmount', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const { unmount } = render(<SingleRefComponent onOutsideClick={handler} />);

    // Verify it works first
    await user.click(document.body);
    expect(handler).toHaveBeenCalledTimes(1);
    handler.mockClear();

    // Unmount component
    unmount();

    // Click outside again
    await user.click(document.body);

    // Should NOT trigger anymore
    expect(handler).not.toHaveBeenCalled();
  });
});