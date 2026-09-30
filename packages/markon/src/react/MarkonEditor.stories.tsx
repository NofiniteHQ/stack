import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import 'katex/dist/katex.min.css';
import { MarkonEditor, useMarkon } from './index';

const meta: Meta = {
  title: 'Markon/MarkonEditor',
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
          Universal rich text and content authoring engine powered by TipTap,
          LaTeX math, and lowlight syntax highlighting.
        </p>
      </div>
      <MarkonEditor
        placeholder="Type '/' for commands or start writing..."
        minHeight="350px"
        showWordCount={true}
        showSaveStatus={true}
        showSlashCommands={true}
        showBubbleMenu={true}
        value={
          '<h2>Welcome to Markon v2.0.0</h2><p>Markon is a <strong>universal, framework-agnostic</strong> rich text editor styled with semantic <code>@nofinite/nuicss</code> superclasses.</p><blockquote><p>Supports blockquotes, task lists, tables, syntax-highlighted code, and mathematical formulas natively.</p></blockquote><div data-math-block="" data-equation="E = mc^2"></div>'
        }
      />
    </div>
  ),
};

export const ControlledState: StoryObj = {
  render: () => {
    const [content, setContent] = useState(
      '<p>Type here to test <strong>controlled state</strong> synchronization without cursor jumping.</p>'
    );
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <MarkonEditor
          value={content}
          onChange={(html) => setContent(html)}
          minHeight="200px"
          showWordCount={true}
        />
        <div className="p-3 rounded-lg border border-default bg-subtle text-xs font-mono break-all">
          <strong className="text-muted block mb-1">
            Live Parent State (HTML):
          </strong>
          {content}
        </div>
      </div>
    );
  },
};

export const EmptyWithPlaceholder: StoryObj = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <MarkonEditor
        placeholder="Write something brilliant... (Type / for commands)"
        minHeight="250px"
        showWordCount={true}
        showSlashCommands={true}
      />
    </div>
  ),
};

export const HookUsage: StoryObj = {
  render: () => {
    const { containerRef, wordCount, charCount, isEmpty } = useMarkon({
      initialValue:
        '<h3>Headless Hook API</h3><p>Manage editor state via <code>useMarkon()</code>.</p>',
    });

    return (
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span>
            Words: <strong>{wordCount}</strong>
          </span>
          <span>
            Chars: <strong>{charCount}</strong>
          </span>
          <span>
            Is Empty: <strong>{String(isEmpty)}</strong>
          </span>
        </div>
        <div ref={containerRef} />
      </div>
    );
  },
};

export const ReadOnly: StoryObj = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <MarkonEditor
        readOnly={true}
        value="<h3>Read Only Mode</h3><p>This content is immutable and cannot be edited by the user.</p><blockquote><p>Quotes and code remain fully styled.</p></blockquote>"
      />
    </div>
  ),
};
