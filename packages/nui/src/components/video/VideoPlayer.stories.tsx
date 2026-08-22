import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from './VideoPlayer';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const YouTube: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  render: (args) => (
    <div className="w-full max-w-3xl mx-auto">
      <VideoPlayer {...args} />
    </div>
  )
};

export const Vimeo: Story = {
  args: {
    url: 'https://vimeo.com/64895205',
  },
  render: (args) => (
    <div className="w-full max-w-3xl mx-auto">
      <VideoPlayer {...args} />
    </div>
  )
};
