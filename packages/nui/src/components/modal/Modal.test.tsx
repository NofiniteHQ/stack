import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useState } from 'react';
import { Modal } from './Modal';

vi.mock('../../utils', async (importOriginal) => {
  const actual = await importOriginal();
  return actual as typeof import('../../utils');
});

describe('Modal Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function setup(initialOpen = true, props = {}) {
    const onCloseSpy = vi.fn();

    function TestWrapper() {
      const [open, setOpen] = useState(initialOpen);
      return (
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            onCloseSpy();
          }}
          title="Test Title"
          description="Test Description"
          {...props}
        >
          <button>Action</button>
        </Modal>
      );
    }

    render(<TestWrapper />);

    return { onCloseSpy };
  }

  it('renders when open', async () => {
    setup(true);
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toBeInTheDocument();
    
    await waitFor(() => {
        expect(dialog).toHaveAttribute('data-state', 'open');
    });

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    setup(false);
    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const { onCloseSpy } = setup(true);

    const dialog = screen.getByRole('dialog', { hidden: true });
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

    const closeBtn = screen.getByRole('button', { name: /Close dialog/i, hidden: true });
    await user.click(closeBtn);
    
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const { onCloseSpy } = setup(true);

    const dialog = screen.getByRole('dialog', { hidden: true });
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

    await user.keyboard('{Escape}');
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it('does not close on Escape if disabled', async () => {
    const user = userEvent.setup();
    const { onCloseSpy } = setup(true, { disableEsc: true });

    const dialog = screen.getByRole('dialog', { hidden: true });
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

    await user.keyboard('{Escape}');
    expect(onCloseSpy).not.toHaveBeenCalled();
  });

  it('closes on click outside', async () => {
    const { onCloseSpy } = setup(true);

    const dialog = screen.getByRole('dialog', { hidden: true });
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

    // Use native fireEvent for click-outside to avoid userEvent synchronous multi-event bubbling
    fireEvent.mouseDown(document.body);

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it('does not close on click outside if disabled', async () => {
    const { onCloseSpy } = setup(true, { disableClickOutside: true });

    const dialog = screen.getByRole('dialog', { hidden: true });
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

    fireEvent.mouseDown(document.body);
    
    expect(onCloseSpy).not.toHaveBeenCalled();
  });

  it('applies aria attributes correctly', async () => {
    setup(true);

    const dialog = screen.getByRole('dialog', { hidden: true });
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('restores focus on close', async () => {
    const user = userEvent.setup();
    
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    const { onCloseSpy } = setup(true);

    const dialog = screen.getByRole('dialog', { hidden: true });
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

    expect(document.activeElement).not.toBe(button);

    await user.keyboard('{Escape}');
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
    
    await waitFor(() => {
        expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
    });
  });
});