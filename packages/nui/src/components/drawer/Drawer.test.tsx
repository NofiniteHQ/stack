import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Drawer } from './Drawer';

// Mock dependencies if required, assuming utils handle DOM cleanly.
vi.mock('../../utils', async (importOriginal) => {
  const actual = await importOriginal();
  return actual as typeof import('../../utils');
});

describe('Drawer Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering & Animations', () => {
    it('does not render when closed', () => {
      const onCloseSpy = vi.fn();
      const { container } = render(<Drawer open={false} onClose={onCloseSpy}>Content</Drawer>);
      
      expect(container.innerHTML).toBe('');
      // Portals render outside container, verify nothing in document body either
      expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
    });

    it('renders drawer content and fully opens after timeout', async () => {
      const onCloseSpy = vi.fn();
      render(<Drawer open onClose={onCloseSpy}>Content</Drawer>);

      // Add { hidden: true } because the applyInertToSiblings util can sometimes 
      // mask the dialog from standard accessibility queries in a test DOM
      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog).toBeInTheDocument();
      
      // Initially renders in DOM but data-state is closed (waiting for 15ms micro-delay)
      expect(dialog).toHaveAttribute('data-state', 'closed');

      // Native wait for the 15ms transition timer to fire
      await waitFor(() => {
        expect(dialog).toHaveAttribute('data-state', 'open');
      });
      
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClose on Escape key', async () => {
      const user = userEvent.setup();
      const onCloseSpy = vi.fn();

      render(<Drawer open onClose={onCloseSpy}>Content</Drawer>);
      
      // Drawer only listens for Escape once it is fully visible
      await waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'open');
      });

      await user.keyboard('{Escape}');
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('does not close on Escape when disableEsc is true', async () => {
      const user = userEvent.setup();
      const onCloseSpy = vi.fn();

      render(<Drawer open disableEsc onClose={onCloseSpy}>Content</Drawer>);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'open');
      });

      await user.keyboard('{Escape}');
      expect(onCloseSpy).not.toHaveBeenCalled();
    });

    it('calls onClose when clicking outside', async () => {
      const user = userEvent.setup();
      const onCloseSpy = vi.fn();

      render(
        <>
          <button data-testid="outside">outside</button>
          <Drawer open onClose={onCloseSpy}>Content</Drawer>
        </>
      );
      
      await waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'open');
      });

      await user.click(screen.getByTestId('outside'));
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('does not close on outside click when disabled', async () => {
      const user = userEvent.setup();
      const onCloseSpy = vi.fn();

      render(
        <>
          <button data-testid="outside">outside</button>
          <Drawer open disableClickOutside onClose={onCloseSpy}>Content</Drawer>
        </>
      );
      
      await waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'open');
      });

      await user.click(screen.getByTestId('outside'));
      expect(onCloseSpy).not.toHaveBeenCalled();
    });
  });

  describe('Styling & Variants', () => {
    it('applies position class based on props', () => {
      const onCloseSpy = vi.fn();
      render(<Drawer open position="left" onClose={onCloseSpy}>Content</Drawer>);
      
      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog).toHaveClass('nui-drawer--left');
    });

    it('supports custom className', () => {
      const onCloseSpy = vi.fn();
      render(<Drawer open className="custom-drawer-class" onClose={onCloseSpy}>Content</Drawer>);
      
      const dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog).toHaveClass('custom-drawer-class');
    });

    it('renders overlay element with correct classes', async () => {
      const onCloseSpy = vi.fn();
      render(<Drawer open overlayClassName="custom-overlay" onClose={onCloseSpy}>Content</Drawer>);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'open');
      });

      // Overlay does not have a role by default because it has aria-hidden
      const overlay = document.querySelector('.nui-drawer-overlay');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('custom-overlay');
    });
  });
});