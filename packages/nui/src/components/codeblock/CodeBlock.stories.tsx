import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './CodeBlock';

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/Data Display/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {
  args: {
    language: "javascript",
    code: "console.log(\"Hello World\");\nconst x = 42;",
    children: 'console.log("Hello World");\nconst x = 42;',
    className: ""
  },
};

export const ReadOnlyLanguage: Story = {
  args: {
    language: 'typescript',
    code: 'type Point = { x: number; y: number };',
    children: 'type Point = { x: number; y: number };',
    readOnlyLanguage: true,
  },
};
