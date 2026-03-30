import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { useState } from 'react';
import { FileUploader } from './FileUploader';

const meta: Meta<typeof FileUploader> = {
  title: 'Inputs/FileUploader',
  component: FileUploader,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onChange: { action: 'files changed' },
  },
};

export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const file = new File(['hello'], 'example-document.pdf', { type: 'application/pdf' });
    // Assign a size so the byte formatter displays correctly
    Object.defineProperty(file, 'size', { value: 1048576 }); 

    return <FileUploader defaultValue={[file]} />;
  },
};

export const Controlled: Story = {
  render: () => {
    const Wrapper = () => {
      const [files, setFiles] = useState<File[]>([]);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <FileUploader value={files} onChange={setFiles} multiple />
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontSize: '14px', fontFamily: 'sans-serif' }}>
                    <strong>External State:</strong> {files.length} file(s) selected
                </p>
            </div>
        </div>
      );
    };
    return <Wrapper />;
  },
};

export const MaxSize: Story = {
  args: {
    maxSize: 1024,
    placeholder: 'Max size allowed: 1KB',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Upload your tax documents here',
  },
};

/**
 * Automated Interaction Test
 * Simulates uploading a file and then removing it via the UI.
 */
export const InteractiveTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 1. Locate the hidden native input
    const input = canvas.getByTestId('nui-file-input');

    // 2. Create a mock file
    const file = new File(['(⌐□_□)'], 'cool-sunglasses.txt', { type: 'text/plain' });

    // 3. Upload the file
    await userEvent.upload(input, file);

    // Verify it appeared in the list
    const fileName = await canvas.findByText('cool-sunglasses.txt');
    await expect(fileName).toBeInTheDocument();

    // 4. Remove the file
    const removeBtn = canvas.getByRole('button', { name: /Remove cool-sunglasses\.txt/i });
    await userEvent.click(removeBtn);

    // Verify the list is empty
    await expect(fileName).not.toBeInTheDocument();
  },
};