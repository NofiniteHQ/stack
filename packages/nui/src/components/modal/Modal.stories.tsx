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
 <p className="mb-4 mt-0 text-muted">Modal body content goes here.</p>
 <div className="flex justify-end gap-2">
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
 render: () => (
 <ControlledTemplate
 title="Confirm Action"
 />
 ),
};

export const DisableEsc: Story = {
 render: () => (
 <ControlledTemplate
 title="Mandatory Action"
 description="You cannot close this by pressing Escape."
 disableEsc
 />
 ),
};

export const DisableClickOutside: Story = {
 render: () => (
 <ControlledTemplate
 title="Mandatory Action"
 description="You cannot close this by clicking outside."
 disableClickOutside
 />
 ),
};

export const InteractiveTest: Story = {
 render: () => (
 <ControlledTemplate
 title="Interactive Test"
 description="Ensure focus trapping and closing works."
 />
 ),
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);

 const openBtn = canvas.getByRole('button', { name: /Open Modal/i });
 await userEvent.click(openBtn);

 const dialog = await within(document.body).findByRole('dialog');
 await expect(dialog).toBeInTheDocument();

 const confirmBtn = within(dialog).getByRole('button', { name: /Confirm Action/i });
 await expect(confirmBtn).toHaveFocus();

 await userEvent.keyboard('{Escape}');
 await waitFor(() => {
 expect(document.body.querySelector('[role="dialog"]')).not.toBeInTheDocument();
 });
 },
};
