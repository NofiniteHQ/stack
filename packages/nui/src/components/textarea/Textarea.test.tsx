import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
 it('should have no accessibility violations', async () => {
 const { container } = render(<Textarea aria-label="Test Textarea" />);
 expect(await axe(container)).toHaveNoViolations();
 });
 beforeEach(() => {
 // JSDOM does not implement window.scrollTo, which is used in the autoGrow logic
 window.scrollTo = vi.fn();
 });

 it('renders correctly and handles user typing', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<Textarea placeholder="Enter text..." onChange={onChangeSpy} />);

 const textarea = screen.getByPlaceholderText('Enter text...');
 
 await user.type(textarea, 'Hello');

 expect(onChangeSpy).toHaveBeenCalledTimes(5); // Once per keystroke
 expect(textarea).toHaveValue('Hello');
 });

 it('displays character count and max length correctly', async () => {
 const user = userEvent.setup();
 render(<Textarea defaultValue="Hi" maxLength={10} showCount />);

 // Check initial state
 expect(screen.getByText('2 / 10')).toBeInTheDocument();

 const textarea = screen.getByRole('textbox');
 await user.type(textarea, '!');

 // Check updated state
 expect(screen.getByText('3 / 10')).toBeInTheDocument();
 });

 it('applies error WAI-ARIA attributes when the error prop is true', () => {
 render(<Textarea error />);
 const textarea = screen.getByRole('textbox');
 
 expect(textarea).toHaveAttribute('aria-invalid', 'true');
 });

 it('safely handles undefined controlled values without crashing the counter', () => {
 // Provide undefined explicitly as is common before API data loads
 render(<Textarea value={undefined} showCount />);
 
 expect(screen.getByText('0')).toBeInTheDocument();
 });

 it('supports forwarded refs', () => {
 const ref = { current: null };
 render(<Textarea ref={ref} />);
 expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
 });
});