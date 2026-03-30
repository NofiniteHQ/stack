import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import React from 'react';
import { MegaMenu } from './MegaMenu';

const meta: Meta<typeof MegaMenu> = {
  title: 'Components/MegaMenu',
  component: MegaMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  }
};

export default meta;
type Story = StoryObj<typeof MegaMenu>;

export const Default: Story = {
  render: () => (
    <MegaMenu>
      <MegaMenu.Trigger>Products</MegaMenu.Trigger>
      <MegaMenu.Content>
        <div style={{ display: 'grid', gap: 8, minWidth: 200 }}>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Analytics</a>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>AI Platform</a>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Automation</a>
        </div>
      </MegaMenu.Content>
    </MegaMenu>
  ),
};

export const ComplexLayout: Story = {
  render: () => (
    <MegaMenu>
      <MegaMenu.Trigger>Platform</MegaMenu.Trigger>
      <MegaMenu.Content>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            minWidth: 600,
          }}
        >
          <div>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Developers</strong>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Build faster with our SDKs & APIs.</p>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Security</strong>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Zero trust infrastructure for your apps.</p>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Observability</strong>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Real-time logs, metrics, and tracing.</p>
          </div>
        </div>
      </MegaMenu.Content>
    </MegaMenu>
  ),
};

/**
 * Automated Interaction Test
 * Verifies that the MegaMenu toggles open and closes on interaction.
 */
export const InteractiveTest: Story = {
  render: () => (
    <MegaMenu>
      <MegaMenu.Trigger>Services</MegaMenu.Trigger>
      <MegaMenu.Content>
        <div style={{ display: 'grid', gap: 8, minWidth: 200 }}>
          <a href="#">Consulting</a>
          <a href="#">Migration</a>
          <a href="#">Support</a>
        </div>
      </MegaMenu.Content>
    </MegaMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Target the trigger
    const trigger = canvas.getByRole('button', { name: /Services/i });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // 2. Open the menu
    await userEvent.click(trigger);
    
    const menu = canvas.getByRole('menu');
    await expect(menu).toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // 3. Close the menu via Escape
    await userEvent.keyboard('{Escape}');
    await expect(menu).not.toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};