import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import React from 'react';
import { MegaMenu } from './MegaMenu';

const meta: Meta<typeof MegaMenu> = {
  title: 'Components/Navigation/MegaMenu',
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
      <div className="flex gap-2">
        <MegaMenu.Item value="products">
          <MegaMenu.Trigger>Products</MegaMenu.Trigger>
          <MegaMenu.Content className="p-0">
            <div className="p-2" style={{ display: 'grid', gap: 4, minWidth: 200 }}>
              <MegaMenu.Link href="#">Analytics</MegaMenu.Link>
              <MegaMenu.Link href="#">AI Platform</MegaMenu.Link>
              <MegaMenu.Link href="#">Automation</MegaMenu.Link>
            </div>
          </MegaMenu.Content>
        </MegaMenu.Item>

        <MegaMenu.Item value="company">
          <MegaMenu.Trigger>Company</MegaMenu.Trigger>
          <MegaMenu.Content className="p-0">
            <div className="p-2" style={{ display: 'grid', gap: 4, minWidth: 200 }}>
              <MegaMenu.Link href="#">About Us</MegaMenu.Link>
              <MegaMenu.Link href="#">Careers</MegaMenu.Link>
              <MegaMenu.Link href="#">Contact</MegaMenu.Link>
            </div>
          </MegaMenu.Content>
        </MegaMenu.Item>
      </div>
      
      {/* The floating viewport that resizes smoothly */}
      <MegaMenu.Viewport />
    </MegaMenu>
  ),
};

/**
 * Complex Layout with Multiple Triggers
 * Demonstrates the shared viewport morphing layout architecture.
 */
export const ComplexLayout: Story = {
  render: () => (
    <MegaMenu>
      <div className="flex gap-2 p-2 bg-surface border border-default rounded-md shadow-sm">
        {/* === TRIGGER 1: Products === */}
        <MegaMenu.Item value="features">
          <MegaMenu.Trigger>Features</MegaMenu.Trigger>
          <MegaMenu.Content className="p-0 w-[900px]">
            <div className="flex">
              {/* Main Grid Area */}
              <div className="grid grid-cols-4 gap-8 p-6 flex-1">
                {/* Column 1 */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">Core</h4>
                  <MegaMenu.Link href="#" className="p-2 -mx-2">
                    <div className="text-primary font-medium text-sm">Engine</div>
                    <div className="text-muted text-xs font-normal">High-performance data</div>
                  </MegaMenu.Link>
                  <MegaMenu.Link href="#" className="p-2 -mx-2">
                    <div className="text-primary font-medium text-sm">Pipelines</div>
                    <div className="text-muted text-xs font-normal">Automated workflows</div>
                  </MegaMenu.Link>
                  <MegaMenu.Link href="#" className="p-2 -mx-2">
                    <div className="text-primary font-medium text-sm">Dashboard</div>
                    <div className="text-muted text-xs font-normal">Real-time metrics</div>
                  </MegaMenu.Link>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">Growth</h4>
                  <MegaMenu.Link href="#" className="p-2 -mx-2">
                    <div className="text-primary font-medium text-sm">Marketing</div>
                    <div className="text-muted text-xs font-normal">Campaign management</div>
                  </MegaMenu.Link>
                  <MegaMenu.Link href="#" className="p-2 -mx-2">
                    <div className="text-primary font-medium text-sm">Analytics</div>
                    <div className="text-muted text-xs font-normal">Conversion tracking</div>
                  </MegaMenu.Link>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">Security</h4>
                  <MegaMenu.Link href="#" className="p-2 -mx-2">
                    <div className="text-primary font-medium text-sm">Access Control</div>
                    <div className="text-muted text-xs font-normal">Role-based policies</div>
                  </MegaMenu.Link>
                </div>

                {/* Column 4 */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">Extensions</h4>
                  <MegaMenu.Link href="#" className="p-2 -mx-2">
                    <div className="text-primary font-medium text-sm">Plugins</div>
                    <div className="text-muted text-xs font-normal">Community add-ons</div>
                  </MegaMenu.Link>
                </div>
              </div>

              {/* Sidebar Area */}
              <div className="w-[260px] bg-subtle p-6 border-l border-default">
                <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">Updates</h4>
                <div className="flex flex-col gap-1 mb-6">
                  <MegaMenu.Link href="#" className="p-2 -mx-2 hover:bg-surface">
                    <div className="text-primary font-medium text-sm">Changelog</div>
                    <div className="text-muted text-xs font-normal">See what's new</div>
                  </MegaMenu.Link>
                </div>
              </div>
            </div>
          </MegaMenu.Content>
        </MegaMenu.Item>

        {/* === TRIGGER 2: Platform === */}
        <MegaMenu.Item value="platform">
          <MegaMenu.Trigger>Platform</MegaMenu.Trigger>
          {/* Notice this content block is much smaller to demonstrate resizing */}
          <MegaMenu.Content className="p-6 min-w-[500px]">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">By Scale</h4>
                <MegaMenu.Link href="#" className="p-2 -mx-2">Enterprises</MegaMenu.Link>
                <MegaMenu.Link href="#" className="p-2 -mx-2">Startups</MegaMenu.Link>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">By Industry</h4>
                <MegaMenu.Link href="#" className="p-2 -mx-2">E-commerce</MegaMenu.Link>
                <MegaMenu.Link href="#" className="p-2 -mx-2">SaaS</MegaMenu.Link>
                <MegaMenu.Link href="#" className="p-2 -mx-2">Marketplaces</MegaMenu.Link>
              </div>
            </div>
          </MegaMenu.Content>
        </MegaMenu.Item>
        
        {/* === TRIGGER 3: Resources === */}
        <MegaMenu.Item value="resources">
          <MegaMenu.Trigger>Resources</MegaMenu.Trigger>
          {/* Another distinct size */}
          <MegaMenu.Content className="p-6 min-w-[300px]">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold mb-2 border-b border-default pb-2">Documentation</h4>
              <MegaMenu.Link href="#" className="p-2 -mx-2">API Reference</MegaMenu.Link>
              <MegaMenu.Link href="#" className="p-2 -mx-2">Guides</MegaMenu.Link>
              <MegaMenu.Link href="#" className="p-2 -mx-2">Community</MegaMenu.Link>
            </div>
          </MegaMenu.Content>
        </MegaMenu.Item>
      </div>

      {/* The floating viewport that resizes smoothly */}
      <MegaMenu.Viewport />
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
      <div className="flex gap-2">
        <MegaMenu.Item value="services">
          <MegaMenu.Trigger>Services</MegaMenu.Trigger>
          <MegaMenu.Content className="p-0 min-w-[200px]">
            <div className="p-2" style={{ display: 'grid', gap: 4 }}>
              <MegaMenu.Link href="#">Consulting</MegaMenu.Link>
              <MegaMenu.Link href="#">Migration</MegaMenu.Link>
              <MegaMenu.Link href="#">Support</MegaMenu.Link>
            </div>
          </MegaMenu.Content>
        </MegaMenu.Item>
      </div>
      <MegaMenu.Viewport />
    </MegaMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Target the trigger
    const trigger = canvas.getByRole('button', { name: /Services/i });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // 2. Open the menu (Hover)
    await userEvent.hover(trigger);
    
    // Allow React state to flush Portals
    await new Promise((r) => setTimeout(r, 100));
    
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // 3. Close the menu via Escape
    await userEvent.keyboard('{Escape}');
    
    // Allow state to flush
    await new Promise((r) => setTimeout(r, 100));
    
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};