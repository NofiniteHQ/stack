import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Popover } from './Popover';

describe('Popover Component', () => {
  // Removed beforeEach/afterEach mocks for Floating UI

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
    await waitFor(() => {
      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes content when the Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);

    await user.click(screen.getByRole('button', { name: /open popover/i }));

    const closeBtn = screen.getByRole('button', { name: /close/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    });
  });

  it('closes when the Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);

    await user.click(screen.getByRole('button', { name: /open popover/i }));
    expect(screen.getByText('Popover Content')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    });
  });

  it('applies correct placement data attribute safely', async () => {
    const origClientWidth = Object.getOwnPropertyDescriptor(
      document.documentElement,
      'clientWidth'
    );
    const origClientHeight = Object.getOwnPropertyDescriptor(
      document.documentElement,
      'clientHeight'
    );
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 1024,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 768,
      configurable: true,
    });
    const rectSpy = vi
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockReturnValue({
        top: 100,
        bottom: 140,
        left: 100,
        right: 200,
        width: 100,
        height: 40,
        x: 100,
        y: 100,
        toJSON: vi.fn(),
      });

    try {
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

      expect(content).toHaveAttribute('data-placement', 'right');
    } finally {
      rectSpy.mockRestore();
      if (origClientWidth) {
        Object.defineProperty(
          document.documentElement,
          'clientWidth',
          origClientWidth
        );
      }
      if (origClientHeight) {
        Object.defineProperty(
          document.documentElement,
          'clientHeight',
          origClientHeight
        );
      }
    }
  });

  it('links trigger and content via aria-controls', async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);

    const trigger = screen.getByRole('button', { name: /open popover/i });
    await user.click(trigger);

    const content = screen.getByRole('dialog');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PopoverDemo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
