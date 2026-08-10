import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Dropdown } from './Dropdown';

describe('Dropdown Component', () => {
 it('renders trigger', () => {
 render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>
 </Dropdown>
 );

 expect(screen.getByText('Open')).toBeInTheDocument();
 });

 it('opens menu on trigger click', async () => {
 const user = userEvent.setup({ delay: null });
 render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Item</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 );

 await user.click(screen.getByText('Open'));
 expect(screen.getByRole('menu')).toBeInTheDocument();
 });

 it('closes menu on item click', async () => {
 const user = userEvent.setup({ delay: null });
 render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Item</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 );

 await user.click(screen.getByText('Open'));
 expect(screen.getByRole('menu')).toBeInTheDocument();

 await user.click(screen.getByText('Item'));
 await waitFor(() => {
 expect(screen.queryByRole('menu')).not.toBeInTheDocument();
 });
 });

 it('calls onSelect when an item is chosen', async () => {
 const user = userEvent.setup({ delay: null });
 const onSelectSpy = vi.fn();

 render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item onSelect={onSelectSpy}>Item</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 );

 await user.click(screen.getByText('Open'));
 await user.click(screen.getByText('Item'));

 expect(onSelectSpy).toHaveBeenCalledTimes(1);
 });

 it('closes on escape', async () => {
 const user = userEvent.setup({ delay: null });
 render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Item</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 );

 await user.click(screen.getByText('Open'));
 expect(screen.getByRole('menu')).toBeInTheDocument();

 await user.keyboard('{Escape}');
 await waitFor(() => {
 expect(screen.queryByRole('menu')).not.toBeInTheDocument();
 });
 });

 it('supports keyboard navigation via ArrowKeys', async () => {
 const user = userEvent.setup({ delay: null });
 render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>One</Dropdown.Item>
 <Dropdown.Item>Two</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 );

 // Open dropdown
 await user.click(screen.getByText('Open'));

 // Wait for the automatic focus engine to place focus on the first item
 await waitFor(() => {
 expect(document.activeElement).toHaveTextContent('One');
 });

 // Arrow down to second item
 await user.keyboard('{ArrowDown}');
 expect(document.activeElement).toHaveTextContent('Two');

 // Arrow down again should wrap around to the first item
 await user.keyboard('{ArrowDown}');
 expect(document.activeElement).toHaveTextContent('One');
 });

 it('aria-expanded updates correctly on trigger', async () => {
 const user = userEvent.setup({ delay: null });
 render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Item</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 );

 const trigger = screen.getByText('Open');
 expect(trigger).toHaveAttribute('aria-expanded', 'false');

 await user.click(trigger);
 expect(trigger).toHaveAttribute('aria-expanded', 'true');

 await user.keyboard('{Escape}');
 expect(trigger).toHaveAttribute('aria-expanded', 'false');
 });

 it('has no accessibility violations', async () => {
 const { container } = render(
 <Dropdown>
 <Dropdown.Trigger>Open</Dropdown.Trigger>
 <Dropdown.Menu>
 <Dropdown.Item>Item</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 );
 expect(await axe(container)).toHaveNoViolations();
 });
});