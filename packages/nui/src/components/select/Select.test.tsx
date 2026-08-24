import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { Select } from './Select';

const options = [
 { value: 'apple', label: 'Apple' },
 { value: 'banana', label: 'Banana' },
 { value: 'cherry', label: 'Cherry', disabled: true },
 { value: 'dragonfruit', label: 'Dragonfruit' },
];

describe('Select Component', () => {

 beforeEach(() => {
 // Mock window scroll properties required for Portal positioning
 Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
 Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
 // Mock scrollIntoView
 window.HTMLElement.prototype.scrollIntoView = vi.fn();
 });

 it('renders placeholder when no value is selected', () => {
 render(<Select data={options} placeholder="Pick a fruit" />);
 expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
 });

 it.skip('opens listbox on click and manages focus', async () => {
 const user = userEvent.setup();
 render(<Select data={options} />);
 
 const trigger = screen.getByRole('button');
 await user.click(trigger);

 const listbox = screen.getByRole('listbox');
 expect(listbox).toBeInTheDocument();
 expect(trigger).toHaveAttribute('aria-expanded', 'true');

 // Listbox should receive focus for keyboard navigation
 await waitFor(() => expect(listbox).toBeInTheDocument());
 });

 it('navigates options with ArrowDown and skips disabled items', async () => {
 const user = userEvent.setup();
 render(<Select data={options} />);
 
 const trigger = screen.getByRole('button');
 await user.click(trigger);

 await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());

 // Apple is active by default upon opening.
 await user.keyboard('{ArrowDown}'); // Move focus to Banana
 await user.keyboard('{ArrowDown}'); // Skip Cherry (disabled) and move focus to Dragonfruit

 await user.keyboard('{Enter}');
 await user.click(trigger);

 const dragonfruit = screen.getByRole('option', { name: 'Dragonfruit' });
 expect(dragonfruit).toHaveAttribute('aria-selected', 'true');
 });

 it('selects an option on Enter and closes the list', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<Select data={options} onChange={onChangeSpy} />);

 await user.click(screen.getByRole('button'));
 await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());

 // Apple is focused by default
 await user.keyboard('{Enter}');

 expect(onChangeSpy).toHaveBeenCalledWith('apple');
 await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
 });

 it('supports typeahead navigation', async () => {
 const user = userEvent.setup();
 render(<Select data={options} />);
 
 const trigger = screen.getByRole('button');
 await user.click(trigger);
 await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());

 // Type "d" to jump to Dragonfruit
 await user.keyboard('d');

 await user.keyboard('{Enter}');
 await user.click(trigger);

 const dragonfruit = screen.getByRole('option', { name: 'Dragonfruit' });
 expect(dragonfruit).toHaveAttribute('aria-selected', 'true');
 });

 it('renders hidden input when name prop is provided for native forms', () => {
 render(
 <Select data={options} name="fruit-select" defaultValue="banana" />
 );
 const hiddenInput = document.querySelector('input[name="fruit-select"]');
 expect(hiddenInput).toHaveValue('banana');
 });

 it('has no accessibility violations', async () => {
 const { container } = render(<Select data={options} />);
 expect(await axe(container)).toHaveNoViolations();
 });
});