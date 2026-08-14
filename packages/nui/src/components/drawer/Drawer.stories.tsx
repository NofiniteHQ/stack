import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Drawer, DrawerProps } from './Drawer';
import { Button } from '../button/Button';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
 title: 'Components/Overlays/Drawer',
 component: Drawer,
 parameters: {
  layout: 'centered',
 },
 args: {
  transitionDuration: 0.3,
 },
 argTypes: {
  transitionDuration: {
   control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
   description: 'Animation duration in seconds',
  },
 },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

/* ---------- Wrapper for controlled story ---------- */
const ControlledDrawer = (args: Partial<DrawerProps>) => {
 const [open, setOpen] = useState(false);

 return (
 <>
 <Button 
 onClick={() => setOpen(true)}
 >
 Open Drawer
 </Button>

 <Drawer {...args} open={open} onClose={() => setOpen(false)}>
 <div className="flex flex-col gap-4">
 <p className="text-default font-sans text-sm m-0">
 This is some standard auxiliary content. You can place forms, lists, or any other elements here.
 </p>
 <div className="h-32 bg-subtle rounded-md border border-glassBorder flex items-center justify-center text-muted text-sm">
 Placeholder Content
 </div>
 </div>
 </Drawer>
 </>
 );
};

/* ---------- Stories ---------- */

export const Default: Story = {
 render: (args) => <ControlledDrawer {...args} />,
 args: {
 title: 'Drawer Content',
 description: 'This is auxiliary content loaded inside the Drawer.',
 },
};

export const Left: Story = {
 render: (args) => <ControlledDrawer {...args} />,
 args: { position: 'left', onClose: fn(), title: 'Left Drawer' },
};

export const Top: Story = {
 render: (args) => <ControlledDrawer {...args} />,
 args: { position: 'top', title: 'Top Drawer' },
};

export const Bottom: Story = {
 render: (args) => <ControlledDrawer {...args} />,
 args: { position: 'bottom', title: 'Bottom Drawer' },
};

export const DisableEsc: Story = {
 render: (args) => <ControlledDrawer {...args} />,
 args: { disableEsc: true, title: 'No Escape', description: 'Pressing escape will not close this drawer.' },
};

export const DisableClickOutside: Story = {
 render: (args) => <ControlledDrawer {...args} />,
 args: { disableClickOutside: true, title: 'No Click Outside', description: 'Clicking outside will not close this drawer.' },
};

/**
 * Automated Interaction Test
 * Verifies that the trigger opens the Drawer and renders correctly in the Portal.
 */
export const InteractiveTest: Story = {
 render: (args) => <ControlledDrawer {...args} />,
 args: {
 title: 'Drawer Content',
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 
 // 1. Find and click trigger
 const openButton = canvas.getByRole('button', { name: /Open Drawer/i });
 await userEvent.click(openButton);

 // 2. Because Drawer uses a Portal, we must search the document body
 const body = within(document.body);
 
 // Wait for the dialog to appear in the DOM
 const dialog = await body.findByRole('dialog');
 await expect(dialog).toBeInTheDocument();
 await expect(dialog).toHaveClass('translate-x-0');

 // 3. Close the drawer (using the new native close button)
 const closeButton = body.getByRole('button', { name: /Close dialog/i });
 await userEvent.click(closeButton);
 
 // Dialog state updates to closed immediately (initiating animation)
 await expect(dialog).toHaveClass('translate-x-full');
 },
};
