import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from './Toast';

// Test consumer component
const TestApp = () => {
  const { show } = useToast();
  return (
    <button
      onClick={() =>
        show('Test Message', { description: 'Test Desc', duration: 100 })
      }
    >
      Notify
    </button>
  );
};

describe('Toast System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders a toast when the show function is called', () => {
    render(
      <ToastProvider>
        <TestApp />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Notify'));

    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('Test Desc')).toBeInTheDocument();
    
    // Default variant uses role="status"
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('auto-dismisses after the specified duration + exit animation time', () => {
    render(
      <ToastProvider>
        <TestApp />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Notify'));
    expect(screen.getByText('Test Message')).toBeInTheDocument();

    // 1. Advance past the duration (100ms) to trigger the exit animation
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 2. Advance past the animation exit time (200ms) to trigger the DOM removal
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // We check synchronously! No 'await waitFor' needed because we control time.
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('pauses the auto-dismiss timer on hover', () => {
    render(
      <ToastProvider>
        <TestApp />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Notify'));
    const toast = screen.getByRole('status');

    // Hover over the toast
    fireEvent.mouseEnter(toast);

    // Try to advance time way past the 100ms duration limit
    act(() => {
      vi.advanceTimersByTime(500); 
    });

    // Should still be there because timer was cleared/paused
    expect(screen.getByText('Test Message')).toBeInTheDocument();

    // Leave the toast to resume timer
    fireEvent.mouseLeave(toast);
    
    // Advance past the newly started duration (100ms) + animation (200ms)
    act(() => {
      vi.advanceTimersByTime(300); 
    });

    // Check synchronously!
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('applies role="alert" for error variants for screen readers', () => {
    const ErrorApp = () => {
      const { show } = useToast();
      return <button onClick={() => show('Error', { variant: 'error' })}>Error Toast</button>;
    };

    render(
      <ToastProvider>
        <ErrorApp />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Error Toast'));

    // Critical WAI-ARIA check
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});