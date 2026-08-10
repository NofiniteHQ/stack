import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { Spinner } from './Spinner';
import { Button } from '../button/Button';

const meta: Meta<typeof Spinner> = {
 title: 'Components/Feedback/Spinner',
 component: Spinner,
 parameters: { layout: 'centered' },
 tags: ['autodocs'],
 argTypes: {
 size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
 variant: { control: 'select', options: ['primary', 'muted', 'inverse'] },
 label: { control: 'text' },
 },
};

export default meta;

export const Default: StoryObj<typeof Spinner> = {
 args: {
 size: 'md',
 variant: 'primary',
 },
};

export const AllSizes: StoryObj = {
 render: () => (
 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
 <Spinner size="sm" />
 <Spinner size="md" />
 <Spinner size="lg" />
 <Spinner size="xl" />
 </div>
 ),
};

export const Variants: StoryObj = {
 render: () => (
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: '20px',
 padding: '20px',
 }}
 >
 <Spinner variant="primary" />
 <Spinner variant="muted" />
 <div style={{ background: '#333', padding: '10px', borderRadius: '4px' }}>
 <Spinner variant="inverse" />
 </div>
 </div>
 ),
};

export const InsideButton: StoryObj = {
 render: () => (
 <Button
 disabled
 variant="primary"
 >
 <Spinner size="sm" variant="inverse" />
 Processing...
 </Button>
 ),
};

/**
 * Automated Rendering Test
 * Verifies that the ARIA attributes are perfectly mapped on mount.
 */
export const AutomatedTest: StoryObj = {
 args: {
 label: 'Custom Loading Label',
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 
 // role="status" should be present
 const spinner = canvas.getByRole('status');
 await expect(spinner).toBeInTheDocument();
 
 // Label should be properly assigned
 await expect(spinner).toHaveAttribute('aria-label', 'Custom Loading Label');
 }
};