import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import 'katex/dist/katex.min.css';
import { MarkonEditor, useMarkon, MarkonRender } from './index';

const samplePublicationDoc = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Executive Summary' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Modern enterprise content platforms demand high-fidelity publishing pipelines that seamlessly transition from interactive rich-text authoring to publication-grade document rendering. Markon delivers this unified bridge across web, documentation, and editorial surfaces.',
        },
      ],
    },
    {
      type: 'callout',
      attrs: { type: 'info' },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Architecture Notice: Single source of truth is strictly anchored in @nofinite/nuicss tokens and superclasses. Zero hardcoded colors or ad-hoc style patches.',
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [
        { type: 'text', text: 'Design Tokens & Mathematical Foundations' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Color spatial calculations in OKLCH perceptual space and physical optics modeling conform to the standard Hamiltonian energy relation:',
        },
      ],
    },
    {
      type: 'mathBlock',
      attrs: {
        equation:
          'H = -\\sum_{i,j} J_{ij} \\sigma_i \\sigma_j - \\mu \\sum_i h_i \\sigma_i',
      },
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Implementation Architecture' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Here is the typed pipeline implementation in TypeScript using the isomorphic MarkonRenderer engine:',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'typescript' },
      content: [
        {
          type: 'text',
          text: 'import { renderMarkon, MarkonRenderer } from "@nofinite/markon";\n\n// Universal isomorphic rendering with full layout & metadata injection\nconst { html, toc, readingTimeMinutes } = renderMarkon({\n  content: editorState.getJSON(),\n  layout: "article",\n  metadata: {\n    title: "Mastering Design Tokens",\n    category: "ENGINEERING",\n    publishedAt: new Date()\n  }\n});',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'System Performance Benchmark' }],
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Feature' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Legacy Pipeline' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Markon 2.0' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Improvement' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Render Speed (AST)' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '42ms (DOM-bound)' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '< 2ms (Isomorphic AST)' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '21x faster' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Bundle Size' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '180 KB' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '26 KB' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '85% reduction' }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'details',
      attrs: { open: true },
      content: [
        {
          type: 'detailsSummary',
          content: [
            { type: 'text', text: 'Deployment & SSR Compatibility Notes' },
          ],
        },
        {
          type: 'detailsContent',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'MarkonRenderer has zero browser DOM dependencies during HTML generation. It runs seamlessly inside Next.js App Router Server Components, Node.js edge handlers, or Cloudflare Workers.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const sampleMetadata = {
  title: 'Architecting Publication-Grade Content with Markon',
  subtitle:
    'How Nofinite powers resilient, high-fidelity publication workflows across apps, blogs, and documentation engines.',
  category: 'ARCHITECTURE',
  cover: {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    alt: 'Abstract Architecture',
    caption:
      'High-contrast design system tokens rendered through Markon & NUICSS',
  },
  author: {
    name: 'Karan Sharma',
    title: 'Principal Systems Architect',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    url: 'https://github.com/nofinite',
  },
  publishedAt: '2026-10-01',
  tags: ['Design Systems', 'TipTap', 'Architecture', 'ProseMirror', 'NUICSS'],
};

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

export const ArticlePublication: StoryObj = {
  render: () => (
    <div className="w-full bg-page min-h-screen">
      <MarkonRender
        content={samplePublicationDoc}
        metadata={sampleMetadata}
        layout="article"
      />
    </div>
  ),
};

export const DocumentPublication: StoryObj = {
  render: () => (
    <div className="w-full bg-page min-h-screen">
      <MarkonRender
        content={samplePublicationDoc}
        metadata={{
          ...sampleMetadata,
          category: 'SDK ARCHITECTURE GUIDE',
        }}
        layout="document"
      />
    </div>
  ),
};

export const NewsroomPublication: StoryObj = {
  render: () => (
    <div className="w-full bg-page min-h-screen">
      <MarkonRender
        content={samplePublicationDoc}
        metadata={{
          ...sampleMetadata,
          badge: 'OFFICIAL PRESS RELEASE',
        }}
        layout="newsroom"
      />
    </div>
  ),
};

export const LiveAuthoringPipeline: StoryObj = {
  render: () => {
    const [content, setContent] = useState<any>(samplePublicationDoc);

    return (
      <div className="w-full min-h-screen p-6 bg-page space-y-6">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="badge badge-primary text-xs font-bold uppercase tracking-wider mb-2">
            Interactive Dual-Surface Pipeline
          </span>
          <h2 className="text-2xl font-black text-default">
            Markon Authoring & Publication Engine
          </h2>
          <p className="text-sm text-muted mt-1">
            Write on the left with enterprise TipTap editing. Watch the right
            instantly render publication-grade HTML with KaTeX, syntax
            highlighting, and metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="p-4 rounded-2xl border border-default bg-surface shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Interactive Authoring Surface
            </h3>
            <MarkonEditor
              minHeight="500px"
              placeholder="Start drafting your article..."
              showWordCount={true}
              showSaveStatus={true}
              showSlashCommands={true}
              showBubbleMenu={true}
              onChange={(_html, json) => setContent(json)}
            />
          </div>

          <div className="p-4 rounded-2xl border border-default bg-surface shadow-sm overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Published Publication Surface
            </h3>
            <MarkonRender
              content={content}
              metadata={sampleMetadata}
              layout="article"
            />
          </div>
        </div>
      </div>
    );
  },
};
