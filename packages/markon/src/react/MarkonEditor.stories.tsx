import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import 'katex/dist/katex.min.css';
import { MarkonEditor } from './index';

const meta: Meta = {
  title: 'Markon/RichTextEditor',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Document Editor</h2>
        <p className="text-muted text-sm">
          Universal block editor with TipTap, LaTeX math, and code highlighting.
        </p>
      </div>
      <MarkonEditor
        placeholder="Type '/' for commands or start writing..."
        minHeight="350px"
        showWordCount={true}
        showSaveStatus={true}
        value="<h2>Welcome to Markon v2.0.0</h2><p>Markon is a <strong>universal, framework-agnostic</strong> rich text editor decoupled from NUI.</p><blockquote><p>Supports blockquotes, task lists, tables, and mathematical formulas natively.</p></blockquote>"
      />
    </div>
  ),
};

export const EmptyWithPlaceholder: StoryObj = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <MarkonEditor
        placeholder="Write something brilliant..."
        minHeight="250px"
        showWordCount={true}
      />
    </div>
  ),
};

export const ReadOnly: StoryObj = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <MarkonEditor
        readOnly={true}
        value="<h3>Read Only Mode</h3><p>This content is immutable and cannot be edited by the user.</p>"
      />
    </div>
  ),
};
