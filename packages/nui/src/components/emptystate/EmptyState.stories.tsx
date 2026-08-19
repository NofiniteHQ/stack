import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { FolderSearch, Inbox, Search, Plus } from 'lucide-react';
import { Button } from '../button/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Data Display/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <FolderSearch size={48} strokeWidth={1.5} />,
    title: 'No projects found',
    description: 'Get started by creating a new project or importing an existing one from GitHub.',
    actions: <Button variant="primary">Create Project</Button>,
  },
};

export const InsideContainer: Story = {
  render: (args) => (
    <div className="w-[600px] border border-default rounded-xl bg-surface p-10 shadow-sm flex items-center justify-center min-h-[400px]">
      <EmptyState {...args} />
    </div>
  ),
  args: {
    icon: <Inbox size={48} strokeWidth={1.5} />,
    title: 'Your inbox is empty',
    description: 'You have read all your messages. Check back later for new updates from your team.',
  },
};

export const Minimal: Story = {
  args: {
    title: 'No search results',
    description: 'Try adjusting your filters or search query.',
  },
};

export const WithMultipleActions: Story = {
  args: {
    icon: <Search size={48} strokeWidth={1.5} />,
    title: 'No data matching filters',
    description: 'We couldn\'t find any records that match your current filter configuration.',
    actions: (
      <>
        <Button variant="outline">Clear Filters</Button>
        <Button variant="primary">Adjust Query</Button>
      </>
    ),
  },
};
