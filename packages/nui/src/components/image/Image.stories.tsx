import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
  title: 'Components/Data Display/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506744626753-dfa37d25cece?w=800&q=80',
    alt: 'Beautiful landscape',
    className: 'w-64 h-48 rounded-lg',
  },
};

export const Fallback: Story = {
  args: {
    src: 'https://this-image-does-not-exist.com/bad.jpg',
    alt: 'Broken image',
    className: 'w-64 h-48 rounded-lg',
  },
};

export const CustomFallback: Story = {
  args: {
    src: 'https://this-image-does-not-exist.com/bad.jpg',
    fallback: <div className="p-4 text-center">Failed to load!</div>,
    className: 'w-64 h-48 rounded-lg',
  },
};
