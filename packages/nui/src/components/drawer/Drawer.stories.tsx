import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Drawer, DrawerProps } from './Drawer';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
  title: 'Overlay/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

/* ---------- Wrapper for controlled story ---------- */
const ControlledDrawer = (args: Partial<DrawerProps>) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        Open Drawer
      </button>

      <Drawer {...args} open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontFamily: 'sans-serif' }}>Drawer Content</h3>
          <p style={{ margin: 0, color: '#666', fontFamily: 'sans-serif' }}>
            This is auxiliary content loaded inside the Drawer.
          </p>
          <button 
            onClick={() => setOpen(false)}
            style={{ padding: '8px 16px', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            Close
          </button>
        </div>
      </Drawer>
    </>
  );
};

/* ---------- Stories ---------- */

export const Default: Story = {
  render: (args) => <ControlledDrawer {...args} />,
};

export const Left: Story = {
  render: (args) => <ControlledDrawer {...args} />,
  args: { position: 'left' },
};

export const Top: Story = {
  render: (args) => <ControlledDrawer {...args} />,
  args: { position: 'top' },
};

export const Bottom: Story = {
  render: (args) => <ControlledDrawer {...args} />,
  args: { position: 'bottom' },
};

export const DisableEsc: Story = {
  render: (args) => <ControlledDrawer {...args} />,
  args: { disableEsc: true },
};

export const DisableClickOutside: Story = {
  render: (args) => <ControlledDrawer {...args} />,
  args: { disableClickOutside: true },
};

/**
 * Automated Interaction Test
 * Verifies that the trigger opens the Drawer and renders correctly in the Portal.
 */
export const InteractiveTest: Story = {
  render: (args) => <ControlledDrawer {...args} />,
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
    await expect(dialog).toHaveAttribute('data-state', 'open');

    // 3. Close the drawer
    const closeButton = body.getByRole('button', { name: /Close/i });
    await userEvent.click(closeButton);
    
    // Dialog state updates to closed immediately (initiating animation)
    await expect(dialog).toHaveAttribute('data-state', 'closed');
  },
};