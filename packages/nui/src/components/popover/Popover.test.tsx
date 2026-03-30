import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Popover } from './Popover';

describe('Popover Component', () => {
  beforeEach(() => {
    // Mock window scroll properties
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    
    // Mock viewport dimensions so collision detection doesn't think the screen is 0px wide
    Object.defineProperty(document.documentElement, 'clientWidth', { value: 1024, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 768, configurable: true });
    
    // Mock the bounding rect to pretend elements are safely in the middle of our 1024x768 screen.
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 300,
      bottom: 340,
      left: 400,
      right: 500,
      width: 100,
      height: 40,
      x: 400,
      y: 300,
      toJSON: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const PopoverDemo = () => (
    <Popover>
      <Popover.Trigger>
        <button>Open Popover</button>
      </Popover.Trigger>
      <Popover.Content>
        <div>Popover Content</div>
        <Popover.Close>
          <button>Close</button>
        </Popover.Close>
      </Popover.Content>
    </Popover>
  );

  it('does not render content by default', () => {
    render(<PopoverDemo />);
    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
  });

  it('opens content when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);
    
    const trigger = screen.getByRole('button', { name: /open popover/i });
    await user.click(trigger);

    expect(screen.getByText('Popover Content')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes content when trigger is clicked again', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);
    
    const trigger = screen.getByRole('button', { name: /open popover/i });

    await user.click(trigger); // Open
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
    
    await user.click(trigger); // Close
    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes content when the Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);
    
    await user.click(screen.getByRole('button', { name: /open popover/i }));

    const closeBtn = screen.getByRole('button', { name: /close/i });
    await user.click(closeBtn);

    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
  });

  it('closes when the Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);
    
    await user.click(screen.getByRole('button', { name: /open popover/i }));
    expect(screen.getByText('Popover Content')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
  });

  it('applies correct placement data attribute safely', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>
          <button>Trigger</button>
        </Popover.Trigger>
        <Popover.Content placement="right">Content</Popover.Content>
      </Popover>
    );

    await user.click(screen.getByText('Trigger'));
    const content = screen.getByRole('dialog');

    // With clientWidth mocked to 1024, there is plenty of room on the right,
    // so the algorithm will safely honor the "right" placement prop.
    expect(content).toHaveAttribute('data-placement', 'right');
  });

  it('links trigger and content via aria-controls', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);
    
    const trigger = screen.getByRole('button', { name: /open popover/i });
    await user.click(trigger);
    
    const content = screen.getByRole('dialog');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
  });
});