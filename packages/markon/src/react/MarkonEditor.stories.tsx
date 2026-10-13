import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import 'katex/dist/katex.min.css';
import { MarkonEditor, useMarkon, MarkonRender } from './index';

// ---------------------------------------------------------------------------
// Shared High-Fidelity Enterprise AST Mock Content
// ---------------------------------------------------------------------------

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
    name: 'Sarah Chen',
    title: 'Principal Systems Architect',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    url: 'https://github.com/nofinite',
  },
  publishedAt: '2026-10-10',
  tags: ['Design Systems', 'TipTap', 'Architecture', 'ProseMirror', 'NUICSS'],
};

// ---------------------------------------------------------------------------
// Storybook Metadata
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Editor',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

// ===========================================================================
// CATEGORY 1: Core Editor Modes
// ===========================================================================

export const Default: StoryObj = {
  name: '1. Core / Full Featured Editor',
  render: () => (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold">Full Featured Authoring Surface</h2>
        <p className="text-muted text-sm">
          Complete rich-text engine with modernized vector toolbar icons,
          typography controls, color pickers, slash commands, and bubble menus.
        </p>
      </div>
      <MarkonEditor
        placeholder="Type '/' for commands or start writing..."
        minHeight="380px"
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

export const CompactMinimal: StoryObj = {
  name: '1. Core / Compact & Minimal (Comments & Notes)',
  render: () => (
    <div className="max-w-2xl mx-auto space-y-3">
      <div>
        <h3 className="text-base font-semibold">Compact Comment Box</h3>
        <p className="text-xs text-muted">
          Streamlined authoring container suitable for discussions, feedback
          threads, and quick notes.
        </p>
      </div>
      <MarkonEditor
        placeholder="Write a reply or leave a note..."
        minHeight="140px"
        showWordCount={false}
        showSaveStatus={false}
        showSlashCommands={true}
        showBubbleMenu={false}
        value="<p>Great architectural breakdown! The zero-dependency AST traversal in <code>renderMarkon</code> solves our SSR hydration bottlenecks.</p>"
      />
    </div>
  ),
};

export const ControlledState: StoryObj = {
  name: '1. Core / Controlled State Sync',
  render: () => {
    const [content, setContent] = useState(
      '<p>Type here to test <strong>controlled state</strong> synchronization without cursor jumping.</p>'
    );
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="mb-2">
          <h3 className="text-base font-semibold">
            Two-Way Controlled Binding
          </h3>
          <p className="text-xs text-muted">
            The parent component holds and updates state reactively via{' '}
            <code>onChange(html, json)</code>.
          </p>
        </div>
        <MarkonEditor
          value={content}
          onChange={(html) => setContent(html)}
          minHeight="200px"
          showWordCount={true}
        />
        <div className="p-3 rounded-xl border border-default bg-subtle text-xs font-mono break-all">
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
  name: '1. Core / Empty State & Slash Hints',
  render: () => (
    <div className="max-w-3xl mx-auto space-y-3">
      <div>
        <h3 className="text-base font-semibold">
          Clean Canvas with Slash Commands
        </h3>
        <p className="text-xs text-muted">
          Press <code>/</code> anywhere on the canvas to trigger the floating
          command palette.
        </p>
      </div>
      <MarkonEditor
        placeholder="Write something brilliant... (Type '/' for headings, tables, code, and callouts)"
        minHeight="250px"
        showWordCount={true}
        showSlashCommands={true}
      />
    </div>
  ),
};

export const ReadOnly: StoryObj = {
  name: '1. Core / Read Only Mode',
  render: () => (
    <div className="max-w-3xl mx-auto space-y-3">
      <div>
        <h3 className="text-base font-semibold">Immutable Canvas</h3>
        <p className="text-xs text-muted">
          The toolbar is disabled with aria-disabled attributes and user editing
          is locked.
        </p>
      </div>
      <MarkonEditor
        readOnly={true}
        value="<h3>Verified Architecture Spec</h3><p>This content is immutable and cannot be modified by the client.</p><blockquote><p>All design tokens and code blocks remain beautifully formatted and selectable.</p></blockquote>"
      />
    </div>
  ),
};

// ===========================================================================
// CATEGORY 2: Specialized Feature Deep-Dives
// ===========================================================================

export const TablesAndDataGrid: StoryObj = {
  name: '2. Features / Tables & Data Grid Editing',
  render: () => (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-bold">Interactive Table Management</h3>
        <p className="text-xs text-muted">
          Click inside any cell to activate the dynamic table bubble menu. Add
          or remove rows, columns, and toggle header formatting.
        </p>
      </div>
      <MarkonEditor
        minHeight="320px"
        showWordCount={true}
        value={`
          <h2>Database Replication Topology</h2>
          <p>Click inside the table to access column and row actions:</p>
          <table>
            <thead>
              <tr>
                <th>Cluster Node</th>
                <th>Region</th>
                <th>Latency (p99)</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>us-east-primary</td>
                <td>us-east-1 (N. Virginia)</td>
                <td>1.2 ms</td>
                <td>ACTIVE / PRIMARY</td>
              </tr>
              <tr>
                <td>eu-central-replica</td>
                <td>eu-central-1 (Frankfurt)</td>
                <td>74.6 ms</td>
                <td>SYNCED / STANDBY</td>
              </tr>
              <tr>
                <td>ap-southeast-replica</td>
                <td>ap-southeast-1 (Singapore)</td>
                <td>148.2 ms</td>
                <td>SYNCED / STANDBY</td>
              </tr>
            </tbody>
          </table>
        `}
      />
    </div>
  ),
};

export const MathAndFormulas: StoryObj = {
  name: '2. Features / Mathematical Formulas (LaTeX & KaTeX)',
  render: () => (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-bold">
          Scientific & Mathematical Typesetting
        </h3>
        <p className="text-xs text-muted">
          Powered by KaTeX for instant formula compilation with fractions,
          integrals, matrices, and roots.
        </p>
      </div>
      <MarkonEditor
        minHeight="340px"
        showWordCount={true}
        value={`
          <h2>Quantum Field & Optics Relations</h2>
          <p>Gaussian integral with infinite limits:</p>
          <div data-math-block="" data-equation="\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"></div>
          <p>Euler's identity linking the five fundamental mathematical constants:</p>
          <div data-math-block="" data-equation="e^{i\\pi} + 1 = 0"></div>
          <p>Special relativity mass-energy equivalence:</p>
          <div data-math-block="" data-equation="E = \\frac{m_0 c^2}{\\sqrt{1 - \\frac{v^2}{c^2}}}"></div>
        `}
      />
    </div>
  ),
};

export const CodeAndSyntax: StoryObj = {
  name: '2. Features / Multi-Language Code & Syntax Highlighting',
  render: () => (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-bold">
          Syntax Highlighting & Language Switcher
        </h3>
        <p className="text-xs text-muted">
          Lowlight syntax parsing with language badge, code copy trigger, and
          theme-adaptive OKLCH token colors.
        </p>
      </div>
      <MarkonEditor
        minHeight="360px"
        showWordCount={true}
        value={`
          <h2>Systems Programming in Rust & TypeScript</h2>
          <p>Fast AST traversal implementation in Rust:</p>
          <pre><code class="language-rust">pub struct NodeVisitor<'a> {
    depth: usize,
    buffer: &'a mut String,
}

impl<'a> NodeVisitor<'a> {
    pub fn visit(&mut self, node: &AstNode) -> Result<(), Error> {
        self.buffer.push_str(&format!("<node depth=\\"{}\\" />", self.depth));
        Ok(())
    }
}</code></pre>
          <p>High-level orchestration in TypeScript:</p>
          <pre><code class="language-typescript">interface PublicationEngine {
  readonly version: string;
  render(content: JSONContent): Promise<RenderOutput>;
}</code></pre>
        `}
      />
    </div>
  ),
};

export const CalloutsAndAlertBanners: StoryObj = {
  name: '2. Features / Callout Notes & Alert Diagnostics',
  render: () => (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-bold">Semantic Callout Banners</h3>
        <p className="text-xs text-muted">
          Five distinct callout types styled with self-contained OKLAB tints,
          crisp icons, and border accents.
        </p>
      </div>
      <MarkonEditor
        minHeight="380px"
        showWordCount={true}
        value={`
          <h2>Enterprise Security & Compliance Notices</h2>
          <div data-callout="" data-callout-type="info" class="markon-callout alert alert-info my-3">
            <div class="alert-content"><p><strong>Informational Note:</strong> All API requests require valid TLS 1.3 certificates and mTLS mutual authentication.</p></div>
          </div>
          <div data-callout="" data-callout-type="warning" class="markon-callout alert alert-warning my-3">
            <div class="alert-content"><p><strong>Operational Warning:</strong> Scheduled maintenance window begins at 02:00 UTC. Secondary read replicas will be drained.</p></div>
          </div>
          <div data-callout="" data-callout-type="danger" class="markon-callout alert alert-danger my-3">
            <div class="alert-content"><p><strong>Critical Advisory:</strong> Never commit production encryption keys or credentials to version control.</p></div>
          </div>
          <div data-callout="" data-callout-type="success" class="markon-callout alert alert-success my-3">
            <div class="alert-content"><p><strong>Deployment Complete:</strong> All 58 unit and integration test assertions passed without regression.</p></div>
          </div>
        `}
      />
    </div>
  ),
};

export const MediaAndEmbeds: StoryObj = {
  name: '2. Features / Rich Media, Videos & File Attachments',
  render: () => (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-bold">Rich Media & Video Embeds</h3>
        <p className="text-xs text-muted">
          Embed YouTube, Vimeo, and MP4 videos with responsive 16:9 aspect
          ratios, captioned images, and file attachments.
        </p>
      </div>
      <MarkonEditor
        minHeight="380px"
        showWordCount={true}
        value={`
          <h2>Multi-Media Documentation</h2>
          <p>Interactive video walkthrough:</p>
          <div class="markon-video-block my-4 mx-auto" style="width: 100%; max-width: 100%;">
            <div class="relative aspect-video w-full rounded-xl overflow-hidden border border-default bg-subtle shadow-sm">
              <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" class="w-full aspect-video rounded-xl border border-default shadow-sm" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
          <figure class="markon-rendered-image my-4 mx-auto" style="width: 100%; max-width: 100%;">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80" alt="Hardware Rack" class="rounded-xl border border-default shadow-sm w-full h-auto block" />
            <figcaption class="text-xs text-muted text-center mt-2">Figure 1.2 — Dedicated bare-metal clusters in Dublin data center</figcaption>
          </figure>
        `}
      />
    </div>
  ),
};

export const ListsAndTaskManagement: StoryObj = {
  name: '2. Features / Bullet, Numbered & Task Checklists',
  render: () => (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-bold">Reset-Proof List Typography</h3>
        <p className="text-xs text-muted">
          Guaranteed bullet discs, numbering, and interactive task checkboxes
          regardless of CSS resets.
        </p>
      </div>
      <MarkonEditor
        minHeight="320px"
        showWordCount={true}
        value={`
          <h2>Release Readiness Checklist</h2>
          <ul class="task-list">
            <li data-checked="true"><input type="checkbox" checked /> Design token synchronization with @nofinite/nuicss</li>
            <li data-checked="true"><input type="checkbox" checked /> Isomorphic AST renderer with zero DOM dependencies</li>
            <li data-checked="true"><input type="checkbox" checked /> Lucide-grade SVG vector toolbar icons</li>
            <li data-checked="false"><input type="checkbox" /> Publish to NPM registry under @nofinite/markon</li>
          </ul>
          <h3>Key Features</h3>
          <ul>
            <li>Full TipTap 3.x ProseMirror foundation</li>
            <li>Interactive table bubble menus with column/row tools</li>
            <li>Embedded KaTeX formulas and Lowlight syntax highlighting</li>
          </ul>
          <h3>Verification Steps</h3>
          <ol>
            <li>Run unit tests across all core modules</li>
            <li>Perform Playwright visual verification in Light & Dark modes</li>
            <li>Verify tarball integrity with npm pack --dry-run</li>
          </ol>
        `}
      />
    </div>
  ),
};

// ===========================================================================
// CATEGORY 3: Publication & Presentation Layouts (MarkonRender)
// ===========================================================================

export const PublicationArticle: StoryObj = {
  name: '3. Publication / Article Layout (Hero, Byline & Sticky TOC)',
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

export const PublicationDocument: StoryObj = {
  name: '3. Publication / Documentation Layout (Sidebar Nav & Kicker)',
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

export const PublicationNewsroom: StoryObj = {
  name: '3. Publication / Newsroom Layout (Headline & Dateline)',
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

export const PublicationStandalone: StoryObj = {
  name: '3. Publication / Standalone (Unadorned Content)',
  render: () => (
    <div className="max-w-3xl mx-auto p-6 bg-surface rounded-2xl border border-default shadow-sm my-6">
      <MarkonRender content={samplePublicationDoc} layout="minimal" />
    </div>
  ),
};

// ===========================================================================
// CATEGORY 4: Interactive Workflows & Headless Integrations
// ===========================================================================

export const LiveDualSurfacePipeline: StoryObj = {
  name: '4. Workflows / Live Dual-Surface Authoring Pipeline',
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

export const HeadlessHookAPI: StoryObj = {
  name: '4. Workflows / Headless Hook API (useMarkon)',
  render: () => {
    const { containerRef, wordCount, charCount, isEmpty } = useMarkon({
      initialValue:
        '<h3>Headless Hook Integration</h3><p>Build custom toolbars or headless authoring flows via <code>useMarkon()</code>.</p>',
    });

    return (
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center gap-3 text-xs text-muted p-2 rounded-lg bg-subtle border border-default">
          <span>
            Words: <strong className="text-default">{wordCount}</strong>
          </span>
          <span>
            Chars: <strong className="text-default">{charCount}</strong>
          </span>
          <span>
            Is Empty:{' '}
            <strong className="text-default">{String(isEmpty)}</strong>
          </span>
        </div>
        <div ref={containerRef} />
      </div>
    );
  },
};
