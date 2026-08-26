import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
 title: 'Components/Forms/Input',
 component: Input,
 tags: ['autodocs'],
 args: {
 placeholder: 'Enter value',
 },
 argTypes: {
 inputSize: {
 control: 'select',
 options: ['sm', 'md', 'lg'],
 },
 disabled: { control: 'boolean' },
 required: { control: 'boolean' },
 },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
 args: {
 label: 'Name',
 },
};

export const WithDescription: Story = {
 args: {
 label: 'Password',
 type: 'password',
 description: 'Must be at least 8 characters',
 },
};

export const WithError: Story = {
 args: {
 label: 'Email',
 error: 'Invalid email address provided.',
 },
};

export const WithIcons: Story = {
 render: (args) => (
   <Input
     {...args}
     label="Search"
     leftIcon={<span style={{ fontSize: '14px' }}>🔍</span>}
     rightIcon={(
       <span style={{ fontSize: '12px', background: '#eee', padding: '2px 4px', borderRadius: '4px' }}>
         ⌘K
       </span>
     )}
   />
 ),
};

export const Small: Story = {
 args: { inputSize: 'sm' },
};

export const Large: Story = {
 args: { inputSize: 'lg' },
};

export const Disabled: Story = {
 args: { disabled: true, label: 'Disabled Input', value: 'Cannot edit this' },
};

export const Required: Story = {
 args: { label: 'Email', required: true },
};

export const Playground: Story = {
 render: () => (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
 <Input label="Name" placeholder="John Doe" />
 <Input label="Email" error="Invalid email" defaultValue="john.doe" />
 <Input label="Search" leftIcon={<span style={{ fontSize: '14px' }}>🔍</span>} placeholder="Search anything..." />
 </div>
 ),
};

/**
 * Automated Interaction Test
 * Verifies that the input accepts typed values correctly.
 */
export const InteractiveTest: Story = {
 args: {
 label: 'Username',
 placeholder: 'Type your username...',
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 
 // 1. Locate the input via its accessible label
 const input = canvas.getByLabelText('Username');
 
 // 2. Simulate user typing
 await userEvent.type(input, 'nofinite_admin');

 // 3. Verify the value was updated
 await expect(input).toHaveValue('nofinite_admin');
 },
};