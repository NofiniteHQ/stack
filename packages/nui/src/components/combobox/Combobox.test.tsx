import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Combobox } from './Combobox';

const OPTIONS = [
 { label: 'Apple', value: 'apple' },
 { label: 'Banana', value: 'banana' },
 { label: 'Cherry', value: 'cherry' },
];

describe('Combobox Component', () => {
 describe('Filtering & Input', () => {
 it('filters options based on input value', async () => {
 const user = userEvent.setup();
 render(<Combobox options={OPTIONS} />);
 const input = screen.getByRole('combobox');

 await user.type(input, 'ba');

 const listbox = screen.getByRole('listbox');
 const options = within(listbox).getAllByRole('option');

 expect(options).toHaveLength(1);
 expect(options[0]).toHaveTextContent('Banana');
 });
 });

 describe('Keyboard Navigation', () => {
 it('navigates through options using ArrowDown/ArrowUp', async () => {
 const user = userEvent.setup();
 render(<Combobox options={OPTIONS} />);
 const input = screen.getByRole('combobox');

 await user.click(input); // Open list
 await user.keyboard('{ArrowDown}'); // Highlight Apple
 await user.keyboard('{ArrowDown}'); // Highlight Banana

 expect(input).toHaveAttribute(
 'aria-activedescendant',
 expect.stringContaining('option-1')
 );
 });

 it('selects an option on Enter key', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<Combobox options={OPTIONS} onChange={onChangeSpy} />);
 const input = screen.getByRole('combobox');

 await user.type(input, 'app');
 await user.keyboard('{ArrowDown}'); // Highlight Apple
 await user.keyboard('{Enter}');

 expect(onChangeSpy).toHaveBeenCalledWith('apple');
 await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
 });

 it('reverts label on Escape key if no selection was made', async () => {
 const user = userEvent.setup();
 render(<Combobox options={OPTIONS} defaultValue="apple" />);
 const input = screen.getByRole('combobox') as HTMLInputElement;

 // Clear input and type something invalid
 await user.clear(input);
 await user.type(input, 'not a fruit');
 await user.keyboard('{Escape}');

 expect(input.value).toBe('Apple');
 });

 it('has no accessibility violations', async () => {
 const { container } = render(<Combobox options={OPTIONS} />);
 expect(await axe(container)).toHaveNoViolations();
 });
 });
});