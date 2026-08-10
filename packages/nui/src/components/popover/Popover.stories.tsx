import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Popover } from './Popover';
import { Button } from '../button/Button';

const meta: Meta<typeof Popover> = {
 title: 'Components/Overlays/Popover',
 component: Popover,
 parameters: {
 layout: 'centered',
 },
 tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
 render: () => (
 <Popover>
 <Popover.Trigger>
 <Button>Click Me</Button>
 </Popover.Trigger>
 <Popover.Content>
 <div style={{ padding: '8px' }}>
 <h4 style={{ margin: '0 0 8px 0' }}>Popover Title</h4>
 <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
 This is a headless-style popover component with built-in
 positioning and focus trapping.
 </p>
 </div>
 </Popover.Content>
 </Popover>
 ),
};

export const Placements: StoryObj = {
 render: () => (
 <div
 style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(2, 1fr)',
 gap: '100px',
 padding: '100px',
 }}
 >
 {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
 <Popover key={placement}>
 <Popover.Trigger>
 <Button variant="outline">Placement: {placement}</Button>
 </Popover.Trigger>
 <Popover.Content placement={placement}>
 <div style={{ padding: '10px' }}>Content on the {placement}</div>
 </Popover.Content>
 </Popover>
 ))}
 </div>
 ),
};

export const WithCloseButton: StoryObj = {
 render: () => (
 <Popover>
 <Popover.Trigger>
 <Button>Delete Account</Button>
 </Popover.Trigger>
 <Popover.Content>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 <span style={{ fontSize: '14px' }}>Are you sure you want to proceed?</span>
 <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
 <Popover.Close>
 <Button size="sm" variant="ghost">Cancel</Button>
 </Popover.Close>
 <Popover.Close>
 <Button size="sm" variant="primary" style={{ background: '#ef4444' }}>Confirm</Button>
 </Popover.Close>
 </div>
 </div>
 </Popover.Content>
 </Popover>
 ),
};

export const CustomOffset: StoryObj = {
 render: () => (
 <Popover>
 <Popover.Trigger>
 <Button>Large Offset (40px)</Button>
 </Popover.Trigger>
 <Popover.Content offset={40} placement="top">
 <div style={{ padding: '10px' }}>I am floating far away!</div>
 </Popover.Content>
 </Popover>
 ),
};

/**
 * Automated Interaction Test
 * Verifies that the trigger opens the Popover and the Close button closes it.
 */
export const InteractiveTest: StoryObj = {
 render: () => (
 <Popover>
 <Popover.Trigger>
 <Button>Interact with me</Button>
 </Popover.Trigger>
 <Popover.Content>
 <div style={{ padding: '8px' }}>
 <p style={{ margin: '0 0 16px 0' }}>Dialog is open.</p>
 <Popover.Close>
 <Button size="sm">Close Dialog</Button>
 </Popover.Close>
 </div>
 </Popover.Content>
 </Popover>
 ),
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);
 
 // 1. Locate the trigger
 const trigger = canvas.getByRole('button', { name: /Interact with me/i });
 await expect(trigger).toHaveAttribute('aria-expanded', 'false');

 // 2. Open Popover
 await userEvent.click(trigger);
 
 // 3. Verify dialog appeared in portal
 const dialog = body.getByRole('dialog');
 await expect(dialog).toBeInTheDocument();
 await expect(trigger).toHaveAttribute('aria-expanded', 'true');

 // 4. Close via internal close button
 const closeBtn = body.getByRole('button', { name: /Close Dialog/i });
 await userEvent.click(closeBtn);

 // 5. Verify it unmounted
 await expect(dialog).not.toBeInTheDocument();
 await expect(trigger).toHaveAttribute('aria-expanded', 'false');
 },
};