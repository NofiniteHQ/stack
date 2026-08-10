import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor, fn } from '@storybook/test';
import React, { useState, useRef } from 'react';
import { Modal, ModalProps } from './Modal';
import { Button } from '../button/Button';

const meta: Meta<typeof Modal> = {
 title: 'Components/Overlays/Modal',
 component: Modal,
 tags: ['autodocs'],
 parameters: {
 layout: 'centered',
 }
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ControlledTemplate(args: Partial<ModalProps>) {
 const [open, setOpen] = useState(false);
 const initialFocusRef = useRef<HTMLButtonElement>(null);

 return (
 <>
 <Button onClick={() => setOpen(true)}>Open Modal</Button>

 <Modal
 {...args}
 open={open}
 onClose={() => setOpen(false)}
 initialFocusRef={initialFocusRef}
 >
 <p style={{ margin: '0 0 16px', color: '#475569' }}>Modal body content goes here.</p>
 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
 <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
 <Button ref={initialFocusRef} variant="primary" onClick={() => setOpen(false)}>Confirm Action</Button>
 </div>
 </Modal>
 </>
 );
}

export const Default: Story = {
 render: () => (
 <ControlledTemplate
 title="Confirm Action"
 description="This action cannot be undone."
 />
 ),
};

export const WithoutDescription: Story = {
 render: () => <ControlledTemplate title="Simple Dialog" />,
};

export const DisableEsc: Story = {
 render: () => (
 <ControlledTemplate
 title="ESC Disabled"
 description="You must click close."
 disableEsc
 />
 ),
};

export const DisableClickOutside: Story = {
 render: () => (
 <ControlledTemplate
 title="Click Outside Disabled"
 description="Overlay click won't close."
 disableClickOutside
 />
 ),
};

/**
 * Automated Interaction Test
 * Verifies that the trigger opens the Modal in a Portal and that it can be closed.
 */
export const InteractiveTest: Story = {
 render: () => (
 <ControlledTemplate
 title="Interactive Modal"
 description="Testing WAI-ARIA properties and interactions."
 />
 ),
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);
 
 // 1. Open the modal
 const openBtn = canvas.getByRole('button', { name: /Open Modal/i });
 await userEvent.click(openBtn);

 // 2. Wait for modal to render in Portal
 await waitFor(async () => {
 const dialog = body.getByRole('dialog');
 await expect(dialog).toBeInTheDocument();
 });

 // 3. Find and click the close button
 const closeBtn = body.getByRole('button', { name: /Close dialog/i });
 await userEvent.click(closeBtn);
 
 // 4. Verify transition to closed state
 await waitFor(async () => {
 await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
 });
 },
};