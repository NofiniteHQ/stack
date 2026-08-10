import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { TimePicker } from './TimePicker';

describe('TimePicker Component', () => {
 beforeEach(() => {
 // Mock scroll properties and DOM methods missing in JSDOM
 Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
 Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
 window.HTMLElement.prototype.scrollIntoView = vi.fn();
 
 vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
 top: 100, bottom: 140, left: 100, right: 200, width: 100, height: 40, x: 100, y: 100, toJSON: vi.fn(),
 });
 });

 it('renders placeholder initially', () => {
 render(<TimePicker placeholder="Pick a time" />);
 expect(screen.getByText('Pick a time')).toBeInTheDocument();
 });

 it('opens panel on click', async () => {
 const user = userEvent.setup();
 render(<TimePicker />); // Renders with default placeholder "Select time"
 
 const trigger = screen.getByRole('button', { name: /Select time/i });
 await user.click(trigger);
 
 // "12" exists in both the hour (1-12) and minute (0-59) columns, so we must use getAllByText
 expect(screen.getAllByText('12')[0]).toBeInTheDocument();
 
 // "AM" only exists in the am/pm column
 expect(screen.getByText('AM')).toBeInTheDocument();
 });

 it('selects a time and calls onChange sequentially', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<TimePicker onChange={onChangeSpy} clockType={24} />);

 await user.click(screen.getByRole('button', { name: /Select time/i }));

 // Select Hour 14
 // We use getAllByText because "14" exists in BOTH the hours (0-23) and minutes (0-59) columns
 const hour14 = screen.getAllByText('14')[0]; 
 await user.click(hour14);
 expect(onChangeSpy).toHaveBeenCalledWith('14:00');

 // Select Minute 30 
 // getByText works here because hours max out at 23, so "30" only exists in the minutes column
 const min30 = screen.getByText('30');
 await user.click(min30);
 expect(onChangeSpy).toHaveBeenCalledWith('14:30');
 });

 it('correctly pads single digits when formatting the label', () => {
 // In 24h format, 09:05 stays 09:05
 render(<TimePicker value="09:05" clockType={24} />);
 expect(screen.getByText('09:05')).toBeInTheDocument();
 });

 it('correctly formats 12h AM/PM strings for display', () => {
 // Internal state is always standard HTML format (HH:mm 24-clock)
 render(<TimePicker value="14:15" clockType={12} />);
 
 // The visual UI parses 14:15 into 02:15 PM
 expect(screen.getByText('02:15 PM')).toBeInTheDocument();
 });

 describe('Accessibility', () => {
 it('should have no violations', async () => {
 const { container } = render(<TimePicker />);
 expect(await axe(container)).toHaveNoViolations();
 });
 });
});