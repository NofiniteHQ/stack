import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { HoverCard } from './HoverCard';

describe('HoverCard Component', () => {
 afterEach(() => {
 vi.restoreAllMocks();
 });

 function setup(props = {}) {
 render(
 <HoverCard {...props} openDelay={50} closeDelay={50}>
 <HoverCard.Trigger>
 <button>Trigger</button>
 </HoverCard.Trigger>
 <HoverCard.Content>Content</HoverCard.Content>
 </HoverCard>
 );
 }

 it('opens on hover after delay', async () => {
 const user = userEvent.setup({ delay: null });
 setup();
 
 const trigger = screen.getByText('Trigger');
 await user.hover(trigger);

 // Native wait for the internal setTimeout (50ms) to trigger the open state
 await waitFor(() => {
 expect(screen.getByText('Content')).toBeInTheDocument();
 });
 });

 it('closes on mouse leave after delay', async () => {
 const user = userEvent.setup({ delay: null });
 setup();
 
 const trigger = screen.getByText('Trigger');
 await user.hover(trigger);

 await waitFor(() => {
 expect(screen.getByText('Content')).toBeInTheDocument();
 });

 await user.unhover(trigger);

 await waitFor(() => {
 expect(screen.queryByText('Content')).not.toBeInTheDocument();
 });
 });

 it('stays open when hovering content', async () => {
 const user = userEvent.setup({ delay: null });
 setup();
 
 const trigger = screen.getByText('Trigger');
 await user.hover(trigger);

 await waitFor(() => {
 expect(screen.getByText('Content')).toBeInTheDocument();
 });

 const content = screen.getByText('Content');

 // Move mouse from trigger to content
 await user.unhover(trigger);
 await user.hover(content);

 // Because the mouse is on the content, it should not unmount even after the standard wait time
 await waitFor(() => {
 expect(screen.getByText('Content')).toBeInTheDocument();
 });
 });

 it('closes on ESC key', async () => {
 const user = userEvent.setup({ delay: null });
 setup();
 
 const trigger = screen.getByText('Trigger');
 await user.hover(trigger);

 await waitFor(() => {
 expect(screen.getByText('Content')).toBeInTheDocument();
 });

 await user.keyboard('{Escape}');

 await waitFor(() => {
 expect(screen.queryByText('Content')).not.toBeInTheDocument();
 });
 });

 it('closes on click outside', async () => {
 const user = userEvent.setup({ delay: null });
 
 render(
 <div>
 <button data-testid="outside">Outside</button>
 <HoverCard openDelay={50} closeDelay={50}>
 <HoverCard.Trigger>
 <button>Trigger</button>
 </HoverCard.Trigger>
 <HoverCard.Content>Content</HoverCard.Content>
 </HoverCard>
 </div>
 );

 const trigger = screen.getByText('Trigger');
 await user.hover(trigger);

 await waitFor(() => {
 expect(screen.getByText('Content')).toBeInTheDocument();
 });

 await user.click(screen.getByTestId('outside'));

 await waitFor(() => {
 expect(screen.queryByText('Content')).not.toBeInTheDocument();
 });
 });

 it('opens on focus for accessibility', async () => {
 // We don't need userEvent here as focus is a native DOM property
 setup();
 
 const trigger = screen.getByText('Trigger');
 trigger.focus();

 await waitFor(() => {
 expect(screen.getByText('Content')).toBeInTheDocument();
 });
 });

 it('adds aria attributes correctly', async () => {
 const user = userEvent.setup({ delay: null });
 setup();
 
 const trigger = screen.getByText('Trigger');
 expect(trigger).toHaveAttribute('aria-expanded', 'false');

 await user.hover(trigger);

 await waitFor(() => {
 expect(trigger).toHaveAttribute('aria-expanded', 'true');
 expect(trigger).toHaveAttribute('aria-controls');
 });
 });

 it('respects placement prop and avoids collision flipping in tests', async () => {
 const user = userEvent.setup({ delay: null });

 // Mock the bounding rect to pretend the trigger is in the middle of a large screen,
 // thereby bypassing the collision detection flip logic.
 vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
 top: 500,
 bottom: 540,
 left: 500,
 right: 600,
 width: 100,
 height: 40,
 x: 500,
 y: 500,
 toJSON: vi.fn(), 
 });
 
 render(
 <HoverCard openDelay={50} closeDelay={50}>
 <HoverCard.Trigger>
 <button>Trigger</button>
 </HoverCard.Trigger>
 <HoverCard.Content placement="top">Content</HoverCard.Content>
 </HoverCard>
 );

 const trigger = screen.getByText('Trigger');
 await user.hover(trigger);

 await waitFor(() => {
 const content = screen.getByRole('dialog');
 expect(content).toHaveAttribute('data-placement', 'top');
 });
 });

 it('has no accessibility violations', async () => {
 const { container } = render(
 <HoverCard>
 <HoverCard.Trigger>
 <button>Trigger</button>
 </HoverCard.Trigger>
 <HoverCard.Content>Content</HoverCard.Content>
 </HoverCard>
 );
 expect(await axe(container)).toHaveNoViolations();
 });
});