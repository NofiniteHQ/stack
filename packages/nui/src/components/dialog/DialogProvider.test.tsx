import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DialogProvider } from './DialogProvider';
import { nui, dialogStore } from './dialogStore';
import * as ToastModule from '../toast/Toast';
import type { ToastOptions } from '../toast/Toast';

/* -------------------------------------------------------------------------- */
/* Mocks                                                                      */
/* -------------------------------------------------------------------------- */

vi.mock('../toast/Toast', () => ({
  useToast: vi.fn(),
}));

interface MockModalProps {
  open: boolean;
  children: React.ReactNode;
  title?: React.ReactNode;
  onClose: () => void;
}

vi.mock('../modal/Modal', () => ({
  Modal: ({ open, children, title, onClose }: MockModalProps) => {
    if (!open) return null;
    return (
      <div data-testid="mock-modal">
        {title && <h2>{title}</h2>}
        <button data-testid="mock-close" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    );
  },
}));

/* -------------------------------------------------------------------------- */
/* Test Suite                                                                 */
/* -------------------------------------------------------------------------- */

describe('DialogProvider', () => {
  // Define a strictly-typed mock function for the toast integration
  const mockShowToast = vi.fn<
    (message: React.ReactNode, options?: ToastOptions) => string
  >(() => {
    return 'mock-toast-id';
  });

  beforeEach(() => {
    // Ensure a clean store state before each test execution
    dialogStore.setState({ isOpen: false, resolve: null });
    mockShowToast.mockClear();

    vi.mocked(ToastModule.useToast).mockReturnValue({
      show: mockShowToast,
      dismiss: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

describe('nui.alert()', () => {
    it('renders the alert dialog and resolves the promise to true upon dismissal', async () => {
      render(<DialogProvider />);

      let alertPromise!: Promise<boolean>;

      // 1. Wrap the trigger in act() so React synchronously finishes rendering the Modal
      act(() => {
        alertPromise = nui.alert('System update required', { title: 'Alert' });
      });

      // Now the DOM is guaranteed to have the modal!
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      expect(screen.getByText('Alert')).toBeInTheDocument();
      expect(screen.getByText('System update required')).toBeInTheDocument();

      // 2. Wrap the close action in act() because it updates the state to { isOpen: false }
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      });

      const result = await alertPromise;
      expect(result).toBe(true);
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });
  });

  describe('nui.confirm()', () => {
    it('resolves the promise to false when the user clicks Cancel', async () => {
      render(<DialogProvider />);

      let confirmPromise!: Promise<boolean>;

      act(() => {
        confirmPromise = nui.confirm('Delete file?');
      });

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      });

      const result = await confirmPromise;
      expect(result).toBe(false);
    });

    it('resolves the promise to true when the user clicks Confirm', async () => {
      render(<DialogProvider />);

      let confirmPromise!: Promise<boolean>;

      act(() => {
        confirmPromise = nui.confirm('Delete file?');
      });

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      });

      const result = await confirmPromise;
      expect(result).toBe(true);
    });

    it('applies danger variant styling to the confirm button when isDanger is true', async () => {
      render(<DialogProvider />);

      act(() => {
        nui.confirm('Delete user?', { isDanger: true });
      });

      await waitFor(() => {
        const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
        expect(confirmBtn.className).toContain('nui-btn--danger');
      });
    });
  });
  
  describe('Toast Event Bridge', () => {
    it('intercepts vanilla nui.toast() events and proxies them to the React useToast hook', () => {
      render(<DialogProvider />);

      nui.success('Profile updated', { duration: 5000 });

      expect(mockShowToast).toHaveBeenCalledTimes(1);
      expect(mockShowToast).toHaveBeenCalledWith('Profile updated', {
        variant: 'success',
        duration: 5000,
      });
    });

    it('correctly maps all nui toast variants to the appropriate configuration objects', () => {
      render(<DialogProvider />);

      nui.toast('Default message');
      nui.error('Error message');
      nui.warn('Warning message');

      expect(mockShowToast).toHaveBeenCalledTimes(3);
      expect(mockShowToast).toHaveBeenNthCalledWith(
        1,
        'Default message',
        expect.objectContaining({ variant: 'default' })
      );
      expect(mockShowToast).toHaveBeenNthCalledWith(
        2,
        'Error message',
        expect.objectContaining({ variant: 'error' })
      );
      expect(mockShowToast).toHaveBeenNthCalledWith(
        3,
        'Warning message',
        expect.objectContaining({ variant: 'warning' })
      );
    });
  });
});
