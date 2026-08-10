import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Tabs } from './Tabs';

describe('Tabs Component', () => {
 const TestTabs = () => (
 <Tabs defaultValue="account">
 <Tabs.List>
 <Tabs.Trigger value="account">Account</Tabs.Trigger>
 <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
 <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
 </Tabs.List>
 <Tabs.Content value="account">Account Content</Tabs.Content>
 <Tabs.Content value="settings">Settings Content</Tabs.Content>
 <Tabs.Content value="disabled">Disabled Content</Tabs.Content>
 </Tabs>
 );

 it('should have no accessibility violations', async () => {
 const { container } = render(<TestTabs />);
 expect(await axe(container)).toHaveNoViolations();
 });

 it('renders active content and hides inactive content on mount', () => {
 render(<TestTabs />);
 expect(screen.getByText('Account Content')).toBeInTheDocument();
 expect(screen.queryByText('Settings Content')).not.toBeInTheDocument();
 });

 it('switches content when a different tab trigger is clicked', async () => {
 const user = userEvent.setup();
 render(<TestTabs />);
 
 const settingsTab = screen.getByRole('tab', { name: 'Settings' });
 await user.click(settingsTab);
 
 expect(screen.getByText('Settings Content')).toBeInTheDocument();
 await waitFor(() => {
 expect(screen.queryByText('Account Content')).not.toBeInTheDocument();
 });
 });

 it('handles horizontal arrow key navigation with Automatic Activation', async () => {
 const user = userEvent.setup();
 render(<TestTabs />);
 
 const accountTab = screen.getByRole('tab', { name: 'Account' });
 const settingsTab = screen.getByRole('tab', { name: 'Settings' });

 // Focus the first tab
 accountTab.focus();
 
 // Press right arrow
 await user.keyboard('{ArrowRight}');

 // Because of Automatic Activation, focusing the tab should also select it
 expect(document.activeElement).toBe(settingsTab);
 expect(screen.getByText('Settings Content')).toBeInTheDocument();
 });

 it('correctly links triggers to panels via dynamically generated WAI-ARIA IDs', () => {
 render(<TestTabs />);
 
 const trigger = screen.getByRole('tab', { name: 'Account' });
 const panel = screen.getByRole('tabpanel');

 // ARIA linkage tests
 expect(trigger).toHaveAttribute('aria-controls', panel.id);
 expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
 });

 it('prevents disabled tabs from being clicked or focused', async () => {
 const user = userEvent.setup();
 render(<TestTabs />);
 
 const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
 
 // Test click bypass
 await user.click(disabledTab);
 expect(screen.queryByText('Disabled Content')).not.toBeInTheDocument();

 // Test keyboard skip
 const settingsTab = screen.getByRole('tab', { name: 'Settings' });
 settingsTab.focus();
 await user.keyboard('{ArrowRight}');
 
 // Should skip 'disabled' and wrap around to 'Account'
 const accountTab = screen.getByRole('tab', { name: 'Account' });
 expect(document.activeElement).toBe(accountTab);
 });
});