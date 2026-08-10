// src/components/checkbox/Checkbox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
 title: 'Components/Forms/Checkbox',
 component: Checkbox,
 tags: ['autodocs'],
 parameters: {
 layout: 'centered',
 },
 args: {
 onChange: fn(),
 },
 argTypes: {
 className: { table: { disable: true } },
 },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
 args: {
 label: 'Accept terms and conditions',
 },
};

export const DefaultChecked: Story = {
 args: {
 defaultChecked: true,
 label: 'Subscribed to newsletter',
 },
};

const ControlledWrapper = () => {
 const [checked, setChecked] = useState(false);

 return (
 <Checkbox
 checked={checked}
 onChange={setChecked}
 label={`Controlled checkbox: ${checked ? 'ON' : 'OFF'}`}
 />
 );
};

export const Controlled: Story = {
 render: () => <ControlledWrapper />,
};

const IndeterminateWrapper = () => {
 const [checked, setChecked] = useState(false);
 const [indeterminate, setIndeterminate] = useState(true);

 return (
 <Checkbox
 checked={checked}
 indeterminate={indeterminate}
 onChange={(val) => {
 setChecked(val);
 setIndeterminate(false);
 }}
 label="Partially selected"
 />
 );
};

export const Indeterminate: Story = {
 render: () => <IndeterminateWrapper />,
};

export const Disabled: Story = {
 args: {
 disabled: true,
 label: 'Disabled checkbox',
 },
};

export const WithoutLabel: Story = {
 args: {},
};

/**
 * Automated Interaction Test
 * Verifies that the uncontrolled checkbox updates its state when clicked.
 */
export const InteractiveTest: Story = {
 args: {
 label: 'Click me to test',
 },
 play: async ({ canvasElement, args }) => {
 const canvas = within(canvasElement);
 const checkbox = canvas.getByRole('checkbox');
 
 await expect(checkbox).not.toBeChecked();
 
 await userEvent.click(checkbox);
 
 await expect(checkbox).toBeChecked();
 await expect(args.onChange).toHaveBeenCalledWith(true);
 },
};