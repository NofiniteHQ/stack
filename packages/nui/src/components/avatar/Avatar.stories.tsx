import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded', 'square'],
      description: 'Shape of avatar',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away', undefined],
      description: 'Presence indicator',
    },
    src: { control: 'text' },
    name: { control: 'text' },
    alt: { control: 'text' },
    loading: { control: 'boolean' },
    fallbackIcon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const IMAGE_URL = 'https://i.pravatar.cc/150?u=avatar-demo';

export const Default: Story = {
  args: {
    src: IMAGE_URL,
    name: 'John Doe',
  },
};

export const Initials: Story = {
  args: {
    name: 'Sarah Connor',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar size="sm" name="Small" />
      <Avatar size="md" name="Medium" />
      <Avatar size="lg" name="Large" />
      <Avatar size="xl" name="XL" />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar shape="circle" name="Circle" />
      <Avatar shape="rounded" name="Rounded" />
      <Avatar shape="square" name="Square" />
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar name="Online" status="online" />
      <Avatar name="Busy" status="busy" />
      <Avatar name="Away" status="away" />
      <Avatar name="Offline" status="offline" />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    size: 'lg',
  },
};

export const CustomFallback: Story = {
  args: {
    fallbackIcon: <span style={{ fontSize: 12 }}>USR</span>,
    size: 'md',
  },
};

export const AccessibleAltText: Story = {
  args: {
    src: IMAGE_URL,
    alt: 'User profile picture',
  },
};

/**
 * Automated Interaction Test
 * Verifies that a broken image URL forces the component to render initials.
 */
export const InteractiveFallbackTest: Story = {
  args: {
    src: 'https://this-url-is-definitely-broken.com/image.png',
    name: 'Fallback User',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Since the image is broken, the browser will fire the onError event,
    // causing our component to unmount the <img> and mount the fallback div.
    // We wait for the initials to appear in the DOM.
    const initialsFallback = await canvas.findByText('FU');
    await expect(initialsFallback).toBeInTheDocument();
  },
};