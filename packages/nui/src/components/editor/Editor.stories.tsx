import type { Meta, StoryObj } from '@storybook/react';
import { Editor } from './Editor';
import { useState } from 'react';

const meta: Meta<typeof Editor> = {
 title: 'Components/Forms/Editor',
 component: Editor,
 tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Editor>;

export const Default: Story = {
 render: () => {
 const [val, setVal] = useState('<p>Hello <strong>World</strong>!</p>');
 return <Editor value={val} onChange={setVal} placeholder="Write something..." />;
 }
};
