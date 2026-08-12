import type { Meta, StoryObj } from '@storybook/react';
import { LinkPreview } from './LinkPreview';

const meta = {
  title: 'Components/Data Display/LinkPreview',
  component: LinkPreview,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "https://nofinite.com",
    title: "",
    description: "",
    image: "",
    loading: false,
    error: false
  },
};

export const Loading: Story = {
  args: {
    url: 'https://example.com',
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    url: 'https://example.com',
    error: true,
  },
};

export const NoImage: Story = {
  args: {
    url: 'https://example.com/no-image',
    title: 'Article without a cover image',
    description: 'This preview demonstrates what happens when the OpenGraph metadata does not include a valid og:image tag.',
  },
};

export const AutoUnfurl: Story = {
  args: {
    url: 'https://github.com',
  },
};
