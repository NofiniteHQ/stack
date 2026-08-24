import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { MegaMenu } from './MegaMenu';

describe('MegaMenu Component', () => {
 it.skip('should have no accessibility violations', async () => {
 const { container } = render(
 <MegaMenu>
 <MegaMenu.Trigger>Menu</MegaMenu.Trigger>
 <MegaMenu.Content>Content</MegaMenu.Content>
 </MegaMenu>
 );
 expect(await axe(container)).toHaveNoViolations();
 });

 it.skip('renders trigger button correctly', () => {
 render(
 <MegaMenu>
 <MegaMenu.Trigger>Menu</MegaMenu.Trigger>
 <MegaMenu.Content>Content</MegaMenu.Content>
 </MegaMenu>
 );

 expect(screen.getByRole('button')).toHaveTextContent('Menu');
 });

 it.skip('toggles menu visibility on trigger click', async () => {
 const user = userEvent.setup();
 render(
 <MegaMenu>
 <MegaMenu.Trigger>Menu</MegaMenu.Trigger>
 <MegaMenu.Content>Content</MegaMenu.Content>
 </MegaMenu>
 );

 // Initial state: closed
 expect(screen.queryByRole('menu')).not.toBeInTheDocument();

 // Click to open
 await user.click(screen.getByRole('button', { name: /Menu/i }));
 expect(screen.getByRole('menu')).toBeInTheDocument();

 // Click to close
 await user.click(screen.getByRole('button', { name: /Menu/i }));
 expect(screen.queryByRole('menu')).not.toBeInTheDocument();
 });

 it.skip('closes when a click occurs outside the menu', async () => {
 const user = userEvent.setup();
 render(
 <div>
 <MegaMenu>
 <MegaMenu.Trigger>Menu</MegaMenu.Trigger>
 <MegaMenu.Content>Content</MegaMenu.Content>
 </MegaMenu>
 <button data-testid="outside">outside</button>
 </div>
 );

 // Open menu
 await user.click(screen.getByRole('button', { name: /Menu/i }));
 expect(screen.getByRole('menu')).toBeInTheDocument();

 // Click outside
 await user.click(screen.getByTestId('outside'));
 expect(screen.queryByRole('menu')).not.toBeInTheDocument();
 });

 it.skip('closes on Escape key press and restores focus to trigger', async () => {
 const user = userEvent.setup();
 render(
 <MegaMenu>
 <MegaMenu.Trigger>Menu</MegaMenu.Trigger>
 <MegaMenu.Content>Content</MegaMenu.Content>
 </MegaMenu>
 );

 const trigger = screen.getByRole('button', { name: /Menu/i });
 
 // Open menu
 await user.click(trigger);
 expect(screen.getByRole('menu')).toBeInTheDocument();

 // Press Escape
 await user.keyboard('{Escape}');
 expect(screen.queryByRole('menu')).not.toBeInTheDocument();
 
 // WAI-ARIA Standard: Focus must return to the trigger
 expect(document.activeElement).toBe(trigger);
 });

 it.skip('sets WAI-ARIA attributes correctly on the trigger', async () => {
 const user = userEvent.setup();
 render(
 <MegaMenu>
 <MegaMenu.Trigger>Menu</MegaMenu.Trigger>
 <MegaMenu.Content>Content</MegaMenu.Content>
 </MegaMenu>
 );

 const trigger = screen.getByRole('button', { name: /Menu/i });

 // Should default to false
 expect(trigger).toHaveAttribute('aria-expanded', 'false');

 // Should update to true when opened
 await user.click(trigger);
 expect(trigger).toHaveAttribute('aria-expanded', 'true');
 expect(trigger).toHaveAttribute('aria-controls'); // verify linkage ID is generated
 });

 it.skip('forwards the ref to the root element', () => {
 const ref = createRef<HTMLDivElement>();

 render(
 <MegaMenu ref={ref}>
 <MegaMenu.Trigger>Menu</MegaMenu.Trigger>
 <MegaMenu.Content>Content</MegaMenu.Content>
 </MegaMenu>
 );

 expect(ref.current).toBeInstanceOf(HTMLDivElement);
 });
});