import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, expect } from '@storybook/test';
import { useState } from 'react';
import { CommandPalette, CommandSection, CommandPaletteProps } from './CommandPalette';

/* =========================================================
   Mock Data
========================================================= */

const mockSections: CommandSection[] = [
  {
    title: 'Navigation',
    items: [
      {
        id: '1',
        label: 'Go to Dashboard',
        description: 'Open main dashboard',
        shortcut: '⌘ D',
        onSelect: () => console.log('Dashboard opened'),
      },
      {
        id: '2',
        label: 'Open Settings',
        description: 'Manage account preferences',
        shortcut: '⌘ ,',
        onSelect: () => console.log('Settings opened'),
      },
    ],
  },
  {
    title: 'Actions',
    items: [
      {
        id: '3',
        label: 'Create New Project',
        description: 'Start a fresh project',
        shortcut: '⌘ N',
        onSelect: () => console.log('Project created'),
      },
      {
        id: '4',
        label: 'Logout',
        description: 'Sign out of account',
        shortcut: '⌘ L',
        onSelect: () => console.log('Logged out'),
      },
    ],
  },
];

/* =========================================================
   Meta
========================================================= */

const meta: Meta<typeof CommandPalette> = {
  title: 'Overlay/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sections: { control: 'object' },
    placeholder: { control: 'text' },
    open: { control: 'boolean' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

/* =========================================================
   Stories
========================================================= */

export const Default: Story = {
  args: {
    sections: mockSections,
    open: true,
  },
};

const ControlledWrapper = (args: CommandPaletteProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: '24px' }}>
      <button
        style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc' }}
        onClick={() => setOpen(true)}
      >
        Open Command Palette (or press Cmd+K)
      </button>

      <CommandPalette {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const Controlled: Story = {
  render: (args) => <ControlledWrapper {...args} />,
  args: {
    sections: mockSections,
  },
};

export const EmptyState: Story = {
  args: {
    sections: [],
    open: true,
  },
};

export const RichItems: Story = {
  args: {
    open: true,
    sections: [
      {
        title: 'Quick Actions',
        items: [
          {
            id: 'r1',
            label: 'Search Docs',
            description: 'Find documentation instantly',
            shortcut: '⌘ K',
            icon: <span>📚</span>,
          },
          {
            id: 'r2',
            label: 'Invite Teammate',
            description: 'Send team invitation',
            shortcut: '⌘ I',
            icon: <span>👥</span>,
          },
        ],
      },
    ],
  },
};

/**
 * Automated Interaction Test
 * Verifies that typing correctly filters out non-matching sections.
 */
export const InteractiveFilterTest: Story = {
  args: {
    sections: mockSections,
    open: true,
  },
  play: async () => {
    const input = document.querySelector('.nui-cmd-input') as HTMLInputElement;
    
    await userEvent.type(input, 'log');
    
    const logoutOption = document.querySelector('.nui-cmd-item-label');
    await expect(logoutOption).toHaveTextContent('Logout');
    
    const dashboardOption = document.evaluate(
      "//div[contains(@class, 'nui-cmd-item-label') and text()='Go to Dashboard']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    await expect(dashboardOption).toBeNull();
  },
};