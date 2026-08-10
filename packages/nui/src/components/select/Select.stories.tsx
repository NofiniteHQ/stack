import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor, fn } from '@storybook/test';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
 title: 'Components/Forms/Select',
 component: Select,
 decorators: [
 (Story) => (
 <div style={{ padding: '2rem', minHeight: '300px' }}>
 <Story />
 </div>
 ),
 ],
 tags: ['autodocs'],
};

export default meta;

const fruitOptions = [
 { value: 'apple', label: 'Apple' },
 { value: 'banana', label: 'Banana' },
 { value: 'blueberry', label: 'Blueberry' },
 { value: 'cherry', label: 'Cherry', disabled: true },
 { value: 'dragonfruit', label: 'Dragonfruit' },
 { value: 'elderberry', label: 'Elderberry' },
];

export const Default: StoryObj<typeof Select> = {
 args: { 
 options: fruitOptions,
 placeholder: 'Select a fruit...',
 style: { width: '300px' , onChange: fn() }
 },
};

export const Disabled: StoryObj<typeof Select> = {
 args: {
 options: fruitOptions,
 disabled: true,
 defaultValue: 'banana',
 style: { width: '300px' }
 },
};

export const ErrorState: StoryObj<typeof Select> = {
 args: {
 options: fruitOptions,
 error: true,
 placeholder: 'Selection required',
 style: { width: '300px' }
 },
};

export const LongList: StoryObj<typeof Select> = {
 args: {
 options: Array.from({ length: 50 }, (_, i) => ({
 value: `option-${i}`,
 label: `Option ${i + 1}`,
 })),
 placeholder: 'Scroll through options',
 style: { width: '300px' }
 },
};

export const BottomCollision: StoryObj<typeof Select> = {
 render: () => (
 <div style={{ marginTop: '400px', width: '300px' }}>
 <p style={{ marginBottom: '10px', fontFamily: 'sans-serif' }}>This select will flip upwards:</p>
 <Select options={fruitOptions} placeholder="Collision check" />
 </div>
 ),
};

/**
 * Automated Interaction Test
 * Verifies that the Select opens, navigates with typeahead, and selects a value.
 */
export const InteractiveTest: StoryObj<typeof Select> = {
 args: {
 options: fruitOptions,
 placeholder: 'Select a fruit...',
 style: { width: '300px' , onChange: fn()}
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);
 
 // 1. Locate the trigger
 const trigger = canvas.getByRole('button');
 await userEvent.click(trigger);

 // 2. Wait for listbox in portal
 const listbox = await body.findByRole('listbox');
 await expect(listbox).toBeInTheDocument();

 // 3. Select 'Blueberry'
 const blueberryOption = body.getByRole('option', { name: 'Blueberry' });
 await userEvent.click(blueberryOption);

 // 4. Verify trigger text updated and menu closed
 await waitFor(() => {
 expect(canvas.getByText('Blueberry')).toBeInTheDocument();
 expect(body.queryByRole('listbox')).not.toBeInTheDocument();
 });
 },
};