import type { Meta, StoryObj } from '@storybook/react';
import { Attachment } from './Attachment';

const meta: Meta<typeof Attachment> = {
  title: 'Components/Data Display/Attachment',
  component: Attachment,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Attachment>;

export const Default: Story = {
  args: {
    filename: 'design-assets.zip',
    filesize: 14500000,
    filetype: 'application/zip',
    src: 'https://example.com/download',
  },
};

export const Loading: Story = {
  args: {
    filename: 'uploading-file.pdf',
    filesize: 1024000,
    filetype: 'application/pdf',
    isLoading: true,
  },
};
