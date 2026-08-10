import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import React, { useState } from 'react';
import { MultiSelect } from './MultiSelect';

const options = [
 { value: 'react', label: 'React' },
 { value: 'vue', label: 'Vue' },
 { value: 'angular', label: 'Angular' },
 { value: 'svelte', label: 'Svelte' },
 { value: 'solid', label: 'Solid', disabled: true },
];

const meta: Meta<typeof MultiSelect> = {
 title: 'Components/Forms/MultiSelect',
 component: MultiSelect,
 tags: ['autodocs'],
 parameters: {
 layout: 'centered',
 }
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
 args: { 
 options,
 placeholder: 'Select frameworks...',
 style: { width: '300px' , onChange: fn() }
 },
};

export const WithDefaultValue: Story = {
 args: {
 options,
 defaultValue: ['react', 'vue'],
 style: { width: '300px' }
 },
};

export const Controlled: Story = {
 render: function ControlledStory() {
 const [value, setValue] = useState<string[]>(['react']);

 return (
 <div style={{ width: '300px' }}>
 <MultiSelect options={options} value={value} onChange={setValue} />
 <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666', fontFamily: 'sans-serif' }}>
 <strong>State:</strong> {JSON.stringify(value)}
 </p>
 </div>
 );
 },
};

export const WithError: Story = {
 args: {
 options,
 error: true,
 style: { width: '300px' }
 },
};

export const SummaryMode: Story = {
 args: {
 options,
 defaultValue: ['react', 'vue', 'angular', 'svelte'],
 maxTags: 2,
 style: { width: '300px' }
 },
};

export const Disabled: Story = {
 args: {
 options,
 disabled: true,
 style: { width: '300px' }
 },
};

/**
 * Automated Interaction Test
 * Verifies that the MultiSelect toggles options and updates the trigger display.
 */
export const InteractiveTest: Story = {
 args: {
 options,
 placeholder: 'Select frameworks...',
 style: { width: '300px' }
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);
 
 // 1. Target the trigger
 const trigger = canvas.getByRole('button');
 await userEvent.click(trigger);

 // 2. Ensure listbox opened in portal
 const listbox = await body.findByRole('listbox');
 await expect(listbox).toBeInTheDocument();

 // 3. Select 'Vue'
 const vueOption = body.getByRole('option', { name: 'Vue' });
 await userEvent.click(vueOption);

 // 4. Verify tag appeared in trigger
 await expect(canvas.getByText('Vue')).toBeInTheDocument();

 // 5. Select 'React'
 const reactOption = body.getByRole('option', { name: 'React' });
 await userEvent.click(reactOption);

 // 6. Verify second tag appeared
 await expect(canvas.getByText('React')).toBeInTheDocument();

 // 7. Verify dropdown remained open
 await expect(listbox).toBeInTheDocument();
 },
};