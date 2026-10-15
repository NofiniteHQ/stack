# Markon Publication Renderer

**Nofinite Markon** features a high-performance, universal publication engine designed to transform rich structured content (TipTap JSON, raw HTML, or GitHub-Flavored Markdown) into publication-grade editorial layouts, technical documentation, press releases, and clean articles.

Powered by **NUICSS** design tokens and superclasses, the renderer is **completely isomorphic with zero DOM dependencies**, allowing it to execute seamlessly on server environments (Next.js Server Components, Node.js scripts, Edge workers) and hydrate interactively on the client.

---

## Key Capabilities

- **4 Specialized Publication Layouts:** Built-in semantic layouts for `'article'`, `'document'`, `'newsroom'`, and `'minimal'` presentations.
- **Universal Format Agnosticism:** Automatically parses and standardizes TipTap `JSONContent`, HTML strings, and Markdown strings.
- **Automated Sticky Table of Contents:** Generates a nested hierarchy of headings (`H1`–`H4`) with smooth scrolling and active scrollspy anchors.
- **Server-Side KaTeX Math:** Pre-renders complex mathematical LaTeX formulas (`$...$` and `$$...$$`) into accessible SVG/HTML without requiring client-side KaTeX JavaScript.
- **Lowlight Syntax Highlighting:** Built-in syntax highlighting across 16 programming languages with 1-click clipboard copy buttons.
- **Metadata Integration:** Renders hero cover images, author bylines with avatars, published timestamps, reading time estimates, category badges, and tag chips.
- **Zero Client Hydration Overhead:** Core markup renders on the server; client hydration (`MarkonRenderer.mount`) attaches lightweight clipboard handlers and smooth scroll listeners without React re-renders.

---

## Installation & Setup

Install **Nofinite Markon** alongside **NUICSS**:

```bash
npm install @nofinite/markon @nofinite/nuicss
```

Import the unified NUICSS stylesheet in your application root (e.g., `layout.tsx` or `main.tsx`):

```tsx
import '@nofinite/nuicss/styles.css';
```

---

## Quickstart

### React Component (`<MarkonRender />`)

The `<MarkonRender />` component provides a turnkey React wrapper with built-in client hydration:

```tsx
import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const markdownContent = `
# Scaling Distributed Edge Infrastructure

Modern edge computing requires zero-latency state synchronization across multi-region clusters.

## Architecture Highlights
- Autonomous edge workers running V8 isolates
- Distributed consensus via Raft protocols
- Sub-5ms global state propagation
`;

export function PublicationPage() {
  return (
    <main className="min-h-screen bg-surface p-6">
      <MarkonRender
        content={markdownContent}
        format="markdown"
        layout="article"
        metadata={{
          title: 'Scaling Distributed Edge Infrastructure',
          subtitle: 'Architectural patterns for high-throughput edge systems',
          publishedAt: '2026-10-15',
          author: {
            name: 'Sarah Chen',
            title: 'Principal Systems Architect',
            avatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          },
          category: 'Architecture',
          tags: ['Distributed Systems', 'Edge Computing', 'Performance'],
        }}
        showTOC={true}
      />
    </main>
  );
}
```

### Framework-Agnostic Core (`renderMarkon`)

For Node.js scripts, Next.js Server Components, or custom rendering pipelines, use the pure function `renderMarkon`:

```ts
import { renderMarkon, MarkonRenderer } from '@nofinite/markon';

const result = renderMarkon({
  content: '# Hello from the Server',
  format: 'markdown',
  layout: 'document',
  metadata: {
    title: 'System Manual',
    publishedAt: new Date(),
  },
  showTOC: true,
});

console.log('Generated HTML:', result.html);
console.log('Table of Contents:', result.toc);
console.log('Estimated Reading Time:', result.readingTimeMinutes, 'minutes');
console.log('Total Word Count:', result.wordCount);
```

---

## Publication Layout Modes

The renderer provides 4 distinct layout modes via the `layout` option:

| Layout       | Purpose                                                              | Chrome & Visual Elements                                                                                          |
| :----------- | :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `'article'`  | Editorial blogs, magazines, and long-form thought leadership         | Full-bleed hero cover image, author avatar and byline, reading time badge, category tag, sticky Table of Contents |
| `'document'` | Technical manuals, API handbooks, and internal documentation         | Header breadcrumbs, last-modified timestamp, sticky sidebar TOC with active scrollspy                             |
| `'newsroom'` | Official press releases, investor relations, and editorial bulletins | Bold kicker badge, prominent headline, dateline header with author credentials                                    |
| `'minimal'`  | Clean prose container for embeds, comments, and modal previews       | Zero decorative chrome or header metadata; raw styled typographic container                                       |

### 1. Article Layout (`layout="article"`)

Designed for editorial blogs and magazine features. Includes a cover image header, author byline card, reading time pill, and a responsive two-column layout with a sticky Table of Contents.

```tsx
<MarkonRender
  content={postContent}
  layout="article"
  metadata={{
    title: 'Next-Generation Design Systems with OKLCH',
    subtitle:
      'Why perceptually uniform color spaces are replacing sRGB in modern web software',
    cover: {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
      alt: 'Abstract color gradient geometry',
      caption:
        'Perceptual color distribution across three-dimensional OKLCH space.',
    },
    author: {
      name: 'Alex Rivera',
      title: 'Design Systems Lead',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      url: 'https://github.com/alexrivera',
    },
    publishedAt: '2026-10-12',
    category: 'Design Systems',
    tags: ['CSS', 'Color Science', 'OKLCH', 'NUICSS'],
  }}
  showTOC={true}
  tocTitle="Contents"
/>
```

### 2. Document Layout (`layout="document"`)

Ideal for engineering documentation, API references, and architecture guides. Positions navigation breadcrumbs at the top and a sticky Table of Contents on the side.

```tsx
<MarkonRender
  content={apiDocsContent}
  layout="document"
  metadata={{
    title: 'Authentication & Session Security API',
    subtitle:
      'Reference implementation for stateless JWT rotation and CSRF protection',
    category: 'Security Architecture',
    publishedAt: '2026-09-30',
  }}
  showTOC={true}
  tocTitle="On This Page"
/>
```

### 3. Newsroom Layout (`layout="newsroom"`)

Built for corporate news, product announcements, and press statements. Features a bold kicker tag, high-impact headline, and a structured dateline header.

```tsx
<MarkonRender
  content={pressReleaseContent}
  layout="newsroom"
  metadata={{
    badge: 'PRODUCT RELEASE',
    title: 'Announcing Nofinite Ecosystem 2.0 with Universal CSS Invariants',
    publishedAt: '2026-10-15',
    author: 'Nofinite Engineering Team',
    tags: ['Announcement', 'Release', 'Open Source'],
  }}
  showTOC={false}
/>
```

### 4. Minimal Layout (`layout="minimal"`)

Renders clean, styled prose without any cover images, author cards, or metadata headers. Ideal for embedding rendered user notes, comment threads, or modal dialog bodies.

```tsx
<MarkonRender content={commentBody} layout="minimal" showTOC={false} />
```

---

## Publication Metadata Schema (`MarkonMetadata`)

The `metadata` prop accepts a structured configuration object:

```ts
export interface MarkonAuthor {
  name: string;
  avatar?: string;
  title?: string;
  url?: string;
}

export interface MarkonCover {
  src: string;
  alt?: string;
  caption?: string;
}

export interface MarkonMetadata {
  title?: string;
  subtitle?: string;
  description?: string;
  cover?: MarkonCover | string;
  author?: MarkonAuthor | string;
  publishedAt?: string | Date;
  readingTime?: number | string;
  tags?: string[];
  category?: string;
  badge?: string;
}
```

---

## Server-Side KaTeX Math Rendering

Mathematical equations are rendered directly during HTML compilation. There is no requirement for heavy client-side KaTeX libraries:

```markdown
Euler's identity links five fundamental constants:

$$e^{i\pi} + 1 = 0$$

Einstein's mass-energy equivalence formula $E = mc^2$ demonstrates that mass and energy are interchangeable.
```

When `renderMath: true` (default), mathematical blocks and inline equations are converted to accessible, responsive SVG and HTML structures styled with **NUICSS** tokens.

---

## Lowlight Code Syntax Highlighting

The renderer includes syntax highlighting for 16 major programming languages:

- `typescript` / `javascript`
- `python`
- `rust`
- `go`
- `html` / `css`
- `json` / `yaml`
- `sql`
- `bash`
- `cpp` / `csharp` / `java`
- `markdown`

Every code block automatically includes a language badge and a responsive **Copy** button. When clicked, it copies the clean code to the user's clipboard and displays an animated confirmation state.

---

## Client Hydration (`MarkonRenderer.mount`)

When using the server-rendered HTML in a custom frontend or non-React environment, activate clipboard copy buttons and smooth Table of Contents scrolling with `MarkonRenderer.mount`:

```ts
import { MarkonRenderer } from '@nofinite/markon';

// Mount interactivity onto an existing DOM element
const container = document.getElementById('publication-container');
const cleanup = MarkonRenderer.mount(container);

// Later, when unmounting or navigating away:
cleanup();
```

---

## Next.js Server Components (App Router)

Because `renderMarkon` has zero DOM dependencies, you can render publication pages entirely on the server with zero client JavaScript:

```tsx
// app/blog/[slug]/page.tsx (Server Component)
import { renderMarkon } from '@nofinite/markon';
import { getPostBySlug } from '@/lib/posts';
import '@nofinite/nuicss/styles.css';

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  const { html, readingTimeMinutes } = renderMarkon({
    content: post.markdown,
    format: 'markdown',
    layout: 'article',
    metadata: {
      title: post.title,
      subtitle: post.summary,
      publishedAt: post.date,
      author: post.author,
      cover: post.coverImage,
      tags: post.tags,
    },
    showTOC: true,
  });

  return (
    <article
      className="markon-render-container w-full max-w-6xl mx-auto py-10 px-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

---

## API Reference

### `<MarkonRender />` Props

| Prop            | Type                                                 | Default          | Description                                            |
| :-------------- | :--------------------------------------------------- | :--------------- | :----------------------------------------------------- |
| `content`       | `any`                                                | **Required**     | TipTap JSONContent, HTML string, or Markdown string    |
| `format`        | `'json' \| 'html' \| 'markdown' \| 'auto'`           | `'auto'`         | Content format (auto-detected if omitted)              |
| `metadata`      | `MarkonMetadata`                                     | `undefined`      | Publication metadata (cover, author, date, tags, etc.) |
| `layout`        | `'article' \| 'document' \| 'newsroom' \| 'minimal'` | `'article'`      | Visual publication layout mode                         |
| `showTOC`       | `boolean`                                            | `true`           | Whether to display the Table of Contents               |
| `tocTitle`      | `string`                                             | `'On this page'` | Header label for the Table of Contents                 |
| `includeStyles` | `boolean`                                            | `true`           | Embeds self-contained publication styling              |
| `highlightCode` | `boolean`                                            | `true`           | Enables syntax highlighting on code blocks             |
| `renderMath`    | `boolean`                                            | `true`           | Enables server-side KaTeX formula rendering            |
| `className`     | `string`                                             | `''`             | Custom CSS class applied to root container             |
| `onRendered`    | `(result: RenderResult) => void`                     | `undefined`      | Callback fired with TOC, word count, and reading time  |

### `RenderResult` Structure

```ts
export interface RenderResult {
  html: string;
  toc: TOCItem[];
  readingTimeMinutes: number;
  wordCount: number;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}
```
