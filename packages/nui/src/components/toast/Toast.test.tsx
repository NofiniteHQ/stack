/* eslint-disable no-empty */
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
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
 try {
 act(() => {
 vi.runAllTimers();
 });
 } catch (e) {}
 vi.useRealTimers();
 });

 it('should have no accessibility violations', async () => {
 vi.useRealTimers();
 const { container } = render(
 <ToastProvider>
 <TestApp />
 </ToastProvider>
 );
 fireEvent.click(screen.getByText('Notify'));
 await screen.findByText('Test Message');
 expect(await axe(container)).toHaveNoViolations();
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

 it('auto-dismisses after the specified duration + exit animation time', async () => {
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

 vi.useRealTimers();
 
 await waitFor(() => {
 expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
 });
 
 vi.useFakeTimers();
 });

 it('pauses the auto-dismiss timer on hover', async () => {
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
 
 // Advance past the newly started duration (100ms)
 act(() => {
 vi.advanceTimersByTime(100); 
 });

 vi.useRealTimers();
 
 await waitFor(() => {
 expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
 });
 
 vi.useFakeTimers();
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