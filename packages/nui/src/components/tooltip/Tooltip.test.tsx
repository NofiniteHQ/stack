import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
 beforeEach(() => {
 vi.useFakeTimers();
 // Mock dimensions for positioning math
 Object.defineProperty(document.documentElement, 'clientWidth', { value: 1024, configurable: true });
 Object.defineProperty(document.documentElement, 'clientHeight', { value: 768, configurable: true });
 vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
 top: 500, bottom: 540, left: 500, right: 600, width: 100, height: 40, x: 500, y: 500, toJSON: vi.fn(),
 });
 });

 afterEach(() => {
 vi.runOnlyPendingTimers();
 vi.useRealTimers();
 });

 it('renders children and shows label on hover after delay', () => {
 render(
 <Tooltip label="Helpful info" delay={100}>
 <button>Hover me</button>
 </Tooltip>
 );

 const button = screen.getByRole('button');
 
 // Use synchronous fireEvent to avoid userEvent + fake timer deadlocks
 fireEvent.mouseEnter(button);

 // Should not be visible immediately due to delay
 expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

 // Fast forward past the 100ms delay
 act(() => {
 vi.advanceTimersByTime(150);
 });

 expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful info');
 });

 it('links trigger and tooltip via aria-describedby on focus', () => {
 render(
 <Tooltip label="Description" delay={0}>
 <button>Target</button>
 </Tooltip>
 );

 const button = screen.getByRole('button');
 
 // WAI-ARIA states tooltips must appear on focus too
 fireEvent.focus(button);

 act(() => {
 vi.advanceTimersByTime(10); // Clear the 0 delay tick
 });

 const tooltip = screen.getByRole('tooltip');
 expect(button).toHaveAttribute('aria-describedby', tooltip.id);
 });

 it('hides when the Escape key is pressed', async () => {
 render(
 <Tooltip label="Description" delay={0}>
 <button>Target</button>
 </Tooltip>
 );

 const button = screen.getByRole('button');
 fireEvent.mouseEnter(button);
 
 act(() => {
 vi.advanceTimersByTime(10);
 });

 expect(screen.getByRole('tooltip')).toBeInTheDocument();

 // User presses escape (synchronously)
 fireEvent.keyDown(document, { key: 'Escape' });
 
 vi.useRealTimers();
 
 await waitFor(() => {
 expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
 });
 
 vi.useFakeTimers();
 });

 it('has no accessibility violations', async () => {
 vi.useRealTimers();
 const { container } = render(
 <Tooltip label="Helpful info">
 <button>Hover me</button>
 </Tooltip>
 );
 expect(await axe(container)).toHaveNoViolations();
 vi.useFakeTimers();
 });
});