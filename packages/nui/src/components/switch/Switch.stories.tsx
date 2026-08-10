import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Switch } from './Switch';
import { Button } from '../button/Button';

const meta: Meta<typeof Switch> = {
 title: 'Components/Forms/Switch',
 component: Switch,
 parameters: { layout: 'centered' },
 tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof Switch> = {
 args: {
 label: 'Enable Bluetooth',
 description: 'Allow this device to connect to others.',
 },
};

export const Small: StoryObj<typeof Switch> = {
 args: {
 size: 'sm',
 label: 'Small variant',
 defaultChecked: true,
 },
};

export const Controlled: StoryObj<typeof Switch> = {
 render: function ControlledSwitch() {
 const [checked, setChecked] = useState(false);
 return (
 <Switch
 checked={checked}
 onChange={setChecked}
 label={checked ? 'System Active' : 'System Standby'}
 description="This relies on React state rather than internal state."
 />
 );
 },
};

export const FormIntegration: StoryObj<typeof Switch> = {
 render: () => (
 <form
 onSubmit={(e) => {
 e.preventDefault();
 const formData = new FormData(e.currentTarget);
 alert(`Submitted value: ${formData.get('marketing_emails')}`);
 }}
 style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
 >
 <Switch
 name="marketing_emails"
 label="Email Marketing"
 description="Receive updates on the latest NUI components."
 value="subscribed"
 defaultChecked
 />
 <Button 
 type="submit" 
 variant="primary"
 className="mt-4"
 >
 Save Settings
 </Button>
 </form>
 ),
};

/**
 * Automated Interaction Test
 * Verifies that the state updates seamlessly via both mouse and keyboard.
 */
export const InteractiveTest: StoryObj<typeof Switch> = {
 args: {
 label: 'Interactive Switch',
 description: 'Click me or use the keyboard.',
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const switchBtn = canvas.getByRole('switch');
 const label = canvas.getByText('Interactive Switch');
 
 // Initial state
 await expect(switchBtn).toHaveAttribute('aria-checked', 'false');
 
 // Test label click proxy
 await userEvent.click(label);
 await expect(switchBtn).toHaveAttribute('aria-checked', 'true');
 
 
 // Test keyboard interaction (Space)
 await userEvent.keyboard('[Space]');
 await expect(switchBtn).toHaveAttribute('aria-checked', 'false');

 // Test keyboard interaction (Enter)
 await userEvent.keyboard('{Enter}');
 await expect(switchBtn).toHaveAttribute('aria-checked', 'true');
 }
};