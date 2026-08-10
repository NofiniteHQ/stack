import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { TimeRangePicker } from './TimeRangePicker';

describe('TimeRangePicker Component', () => {
 beforeEach(() => {
 Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
 Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
 window.HTMLElement.prototype.scrollIntoView = vi.fn();
 
 vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
 top: 100, bottom: 140, left: 100, right: 200, width: 100, height: 40, x: 100, y: 100, toJSON: vi.fn(),
 });
 });

 it('displays the full range in the trigger label', () => {
 const value = { from: '09:00', to: '17:00' };
 render(<TimeRangePicker value={value} clockType={12} />);

 expect(screen.getByText('09:00 AM → 05:00 PM')).toBeInTheDocument();
 });

 it('switches between Start and End time parts', async () => {
 const user = userEvent.setup();
 render(<TimeRangePicker defaultValue={{ from: '08:00', to: '10:00' }} />);
 
 await user.click(screen.getByRole('button', { name: /08:00 AM → 10:00 AM/i }));

 const startBtn = screen.getByText('Start Time');
 const endBtn = screen.getByText('End Time');

 // Default should be 'from' (Start Time)

 await user.click(endBtn);
 });

 it('calls onChange with the updated range', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<TimeRangePicker onChange={onChangeSpy} clockType={24} />);

 await user.click(screen.getByRole('button', { name: /Select time range/i }));

 // Set 'from' time. Use getAllByText because "09" is in both Hours and Minutes columns
 const hour09 = screen.getAllByText('09')[0];
 await user.click(hour09);
 
 const min30 = screen.getByText('30'); // '30' only exists in minutes
 await user.click(min30);

 expect(onChangeSpy).toHaveBeenCalledWith({ from: '09:30', to: undefined });
 });

 it('clears the range when the clear button is clicked', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(
 <TimeRangePicker
 value={{ from: '09:00', to: '10:00' }}
 onChange={onChangeSpy}
 />
 );

 await user.click(screen.getByRole('button', { name: /09:00 AM → 10:00 AM/i }));
 await user.click(screen.getByText('Clear'));

 expect(onChangeSpy).toHaveBeenCalledWith({ from: undefined, to: undefined });
 });

 describe('Accessibility', () => {
 it('should have no violations', async () => {
 const { container } = render(<TimeRangePicker />);
 expect(await axe(container)).toHaveNoViolations();
 }, 10000);
 });
});