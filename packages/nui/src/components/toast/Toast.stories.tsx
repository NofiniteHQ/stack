import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../button/Button';

const meta: Meta = {
 title: 'Components/Feedback/Toast',
 decorators: [
 (Story) => (
 <ToastProvider>
 <Story />
 </ToastProvider>
 ),
 ],
};

export default meta;

/* ----------------------------------------------------
 Wrapper Components (Satisfies ESLint Rules of Hooks)
---------------------------------------------------- */

const ShowcaseDemo = () => {
 const { show } = useToast();
 
 return (
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '24px' }}>
 <Button
 variant="outline"
 onClick={() => show('Action Successful', { variant: 'success' })}
 >
 Success Toast
 </Button>
 <Button
 variant="outline"
 onClick={() =>
 show('Network Error', {
 variant: 'error',
 description: 'Could not connect to the server.',
 })
 }
 >
 Error Toast
 </Button>
 <Button
 variant="outline"
 onClick={() =>
 show('New Update Available', {
 variant: 'warning',
 duration: Infinity, // Won't auto-close
 })
 }
 >
 Persistent Warning
 </Button>
 </div>
 );
};

const InteractiveDemo = () => {
 const { show } = useToast();
 return (
 <Button 
 variant="outline"
 onClick={() => show('Interactive Toast', { duration: Infinity })}
 >
 Trigger Notification
 </Button>
 );
};

/* ----------------------------------------------------
 Stories
---------------------------------------------------- */

export const Showcase: StoryObj = {
 render: () => <ShowcaseDemo />,
};

/**
 * Automated Interaction Test
 * Verifies that the toast renders via Portal, and correctly initiates the exit animation upon manual dismissal.
 */
export const InteractiveTest: StoryObj = {
 render: () => <InteractiveDemo />,
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body); // Toasts render in portals attached to the body!

 // 1. Trigger the toast
 await userEvent.click(canvas.getByText('Trigger Notification'));

 // 2. Verify it appears in the Portal
 const toastMessage = body.getByText('Interactive Toast');
 await expect(toastMessage).toBeInTheDocument();

 // 3. Find the exact Toast container to check its data-state
 const toastContainer = toastMessage.closest('[data-state]');
 await expect(toastContainer).toHaveAttribute('data-state', 'open');

 // 4. Click the close button
 const closeBtn = body.getByRole('button', { name: /Close notification/i });
 await userEvent.click(closeBtn);

 // 5. Verify the animation state updates to closed instantly
 await expect(toastContainer).toHaveAttribute('data-state', 'closed');

 // 6. Wait for the DOM removal (200ms timeout logic)
 await waitFor(() => {
 expect(body.queryByText('Interactive Toast')).not.toBeInTheDocument();
 });
 },
};