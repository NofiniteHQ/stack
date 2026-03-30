import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { nui } from './dialogStore';
import { DialogProvider } from './DialogProvider';
import { ToastProvider } from '../toast/Toast'; // Adjust path
import { Button } from '../button/Button';

// 1. Create an Interactive Demo Component
const GlobalApiDemo = () => {
  const handleAlert = async () => {
    await nui.alert('Your session is about to expire.', { title: 'Session Timeout' });
    nui.toast('Alert dismissed.');
  };

  const handleConfirm = async () => {
    const isConfirmed = await nui.confirm('Would you like to save your changes?', {
      title: 'Unsaved Changes',
      confirmText: 'Save',
    });
    
    if (isConfirmed) {
      nui.success('Changes saved successfully.');
    } else {
      nui.toast('Action cancelled.');
    }
  };

  const handleDangerConfirm = async () => {
    const isConfirmed = await nui.confirm('Are you sure you want to delete this repository?', {
      title: 'Delete Repository',
      confirmText: 'Yes, Delete',
      isDanger: true,
    });
    
    if (isConfirmed) {
      nui.error('Repository deleted.');
    }
  };

  const showAllToasts = async () => {
    nui.toast('This is a default notification.');
    setTimeout(() => nui.success('Task completed successfully!'), 500);
    setTimeout(() => nui.warn('Disk space is running low.'), 1000);
    setTimeout(() => nui.error('Failed to connect to the database.'), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <div>
        <h3 style={{ fontFamily: 'sans-serif', marginBottom: '1rem' }}>Dialog API</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={handleAlert}>Show Alert</Button>
          <Button onClick={handleConfirm} variant="outline">Show Confirm</Button>
          <Button onClick={handleDangerConfirm} variant="danger">Show Danger Confirm</Button>
        </div>
      </div>

      <div>
        <h3 style={{ fontFamily: 'sans-serif', marginBottom: '1rem' }}>Toast API</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={showAllToasts} variant="primary">Show All Toasts</Button>
          <Button onClick={() => nui.success('Quick success!')} variant="outline">Quick Success</Button>
        </div>
      </div>
    </div>
  );
};

// 2. Storybook Meta Configuration
const meta: Meta = {
  title: 'Global API/nui',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The `nui` object provides imperative, globally accessible methods for triggering WAI-ARIA compliant Dialogs and Toasts from anywhere in your application—even outside of React components.',
      },
    },
  },
  // Decorators ensure the Providers are wrapped around the demo in Storybook
  decorators: [
    (Story) => (
      <ToastProvider>
        <DialogProvider />
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * Interactive playground demonstrating all `nui` global methods.
 */
export const InteractiveDemo: Story = {
  render: () => <GlobalApiDemo />,
};