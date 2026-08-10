import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
 title: 'Components/Navigation/Tabs',
 component: Tabs,
 parameters: { layout: 'padded' },
 tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
 render: () => (
 <Tabs defaultValue="profile">
 <Tabs.List>
 <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
 <Tabs.Trigger value="password">Password</Tabs.Trigger>
 <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
 </Tabs.List>
 <Tabs.Content value="profile" style={{ color: '#475569', fontFamily: 'sans-serif' }}>
 Manage your public profile and bio.
 </Tabs.Content>
 <Tabs.Content value="password" style={{ color: '#475569', fontFamily: 'sans-serif' }}>
 Update your password and security settings.
 </Tabs.Content>
 <Tabs.Content value="notifications" style={{ color: '#475569', fontFamily: 'sans-serif' }}>
 Configure how you receive alerts.
 </Tabs.Content>
 </Tabs>
 ),
};

export const Controlled: Story = {
 render: function ControlledExample() {
 const [tab, setTab] = useState('one');
 return (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', color: '#64748b' }}>
 Active Tab State: <strong>{tab}</strong>
 </p>
 <Tabs value={tab} onChange={setTab}>
 <Tabs.List>
 <Tabs.Trigger value="one">Step 1</Tabs.Trigger>
 <Tabs.Trigger value="two">Step 2</Tabs.Trigger>
 </Tabs.List>
 <Tabs.Content value="one" style={{ fontFamily: 'sans-serif' }}>First Step Content</Tabs.Content>
 <Tabs.Content value="two" style={{ fontFamily: 'sans-serif' }}>Second Step Content</Tabs.Content>
 </Tabs>
 </div>
 );
 },
};

/**
 * Automated Interaction Test
 * Verifies that roving tabindex keyboard navigation works correctly.
 */
export const InteractiveTest: Story = {
 render: () => (
 <Tabs defaultValue="first">
 <Tabs.List>
 <Tabs.Trigger value="first">First</Tabs.Trigger>
 <Tabs.Trigger value="second">Second</Tabs.Trigger>
 <Tabs.Trigger value="third" disabled>Third</Tabs.Trigger>
 </Tabs.List>
 <Tabs.Content value="first">Panel 1</Tabs.Content>
 <Tabs.Content value="second">Panel 2</Tabs.Content>
 </Tabs>
 ),
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);

 const firstTab = canvas.getByRole('tab', { name: 'First' });
 const secondTab = canvas.getByRole('tab', { name: 'Second' });

 // Initial assertions
 await expect(firstTab).toHaveAttribute('aria-selected', 'true');
 await expect(canvas.getByText('Panel 1')).toBeInTheDocument();

 // Roving Tabindex Test
 firstTab.focus();
 await userEvent.keyboard('{ArrowRight}');

 // Second tab should now be active
 await expect(secondTab).toHaveFocus();
 await expect(secondTab).toHaveAttribute('aria-selected', 'true');
 await expect(canvas.getByText('Panel 2')).toBeInTheDocument();
 }
};