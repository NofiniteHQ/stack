import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
 title: 'Components/Forms/Textarea',
 component: Textarea,
 parameters: { layout: 'padded' },
 tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof Textarea> = {
 args: {
 placeholder: 'Type your message here...',
 autoGrow: true,
 },
};

export const WithCharacterCounter: StoryObj<typeof Textarea> = {
 args: {
 placeholder: 'Limited description...',
 maxLength: 100,
 showCount: true,
 },
};

export const ErrorState: StoryObj<typeof Textarea> = {
 args: {
 defaultValue: 'Invalid input text',
 error: true,
 helperId: 'error-desc',
 },
 render: (args) => (
 <div style={{ fontFamily: 'sans-serif' }}>
 <Textarea {...args} />
 <p
 id="error-desc"
 style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', margin: 0 }}
 >
 This field is required.
 </p>
 </div>
 ),
};

export const ReadOnly: StoryObj<typeof Textarea> = {
 args: {
 value: 'This text cannot be edited by the user.',
 readOnly: true,
 },
};

/**
 * Automated Interaction Test
 * Verifies that typing updates the input value and increments the character counter.
 */
export const InteractiveTest: StoryObj<typeof Textarea> = {
 args: {
 placeholder: 'Type here...',
 maxLength: 50,
 showCount: true,
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 
 const textarea = canvas.getByRole('textbox');
 
 // Initial Counter State
 await expect(canvas.getByText('0 / 50')).toBeInTheDocument();

 // Type into the textarea
 await userEvent.type(textarea, 'Hello NUI');

 // Verify value and counter
 await expect(textarea).toHaveValue('Hello NUI');
 await expect(canvas.getByText('9 / 50')).toBeInTheDocument();
 },
};