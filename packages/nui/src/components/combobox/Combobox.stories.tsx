import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Combobox } from './Combobox';
import { MapPin, Globe } from 'lucide-react';

const meta: Meta<typeof Combobox> = {
 title: 'Components/Forms/Combobox',
 component: Combobox,
 parameters: { layout: 'centered' },
 decorators: [
 (Story) => (
 <div style={{ width: '320px' }}>
 <Story />
 </div>
 ),
 ],
 args: {
 // Automatically spy on onChange in the Storybook Actions panel
 onChange: fn(),
 },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const FRUITS = [
 { label: 'Apple', value: 'apple' },
 { label: 'Banana', value: 'banana' },
 { label: 'Cherry', value: 'cherry' },
 { label: 'Dragonfruit', value: 'dragon' },
];

export const Default: Story = {
 args: {
 options: FRUITS,
 placeholder: 'Pick a fruit...',
 },
};

export const WithIcons: Story = {
 args: {
 options: [
 { label: 'New York', value: 'ny' },
 { label: 'London', value: 'ldn' },
 { label: 'Tokyo', value: 'tky' },
 ],
 leftIcon: <MapPin size={16} />,
 rightIcon: <Globe size={16} />,
 },
};

export const CustomOptionRendering: Story = {
 args: {
 options: FRUITS,
 renderOption: (option, active) => (
 <div className="flex justify-between w-full" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
 <span>{option.label}</span>
 {active && (
 <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.5 }}>Press Enter</span>
 )}
 </div>
 ),
 },
};

/**
 * Automated Interaction Test: Keyboard Navigation
 * Verifies that typing and using keyboard arrows correctly selects an item.
 */
export const InteractiveKeyboardTest: Story = {
 args: {
 options: FRUITS,
 placeholder: 'Test keyboard...',
 },
 play: async ({ canvasElement, args }) => {
 const canvas = within(canvasElement);
 const input = canvas.getByRole('combobox');
 
 // Type to filter
 await userEvent.type(input, 'ba');
 
 // Arrow down and enter
 await userEvent.keyboard('{ArrowDown}');
 await userEvent.keyboard('{Enter}');
 
 await expect(input).toHaveValue('Banana');
 await expect(args.onChange).toHaveBeenCalledWith('banana');
 },
};

/**
 * Automated Interaction Test: Mouse Selection
 * Verifies that clicking an option in the listbox fires the correct events.
 */
export const InteractiveMouseTest: Story = {
 args: {
 options: FRUITS,
 placeholder: 'Test mouse...',
 },
 play: async ({ canvasElement, args }) => {
 const canvas = within(canvasElement);
 const input = canvas.getByRole('combobox');
 
 // Click to open
 await userEvent.click(input);
 
 // Find and click the option
 const option = await canvas.findByText('Cherry');
 await userEvent.click(option);
 
 await expect(input).toHaveValue('Cherry');
 await expect(args.onChange).toHaveBeenCalledWith('cherry');
 },
};