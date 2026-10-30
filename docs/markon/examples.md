# Markon Publication Examples

Below are production-ready, copy-paste implementations of **Nofinite Markon** showcasing the universal publication editor and isomorphic renderer across pure vanilla TypeScript/Node environments, Edge runtimes, and React architectures.

---

## Example 1: Pure Vanilla TypeScript Editorial CMS (Core First)

A complete, zero-framework editorial workspace with live markdown preview, auto-saving drafts to `localStorage`, and real-time word/character telemetry:

```ts
import {
  MarkonEditor,
  renderMarkdown,
  MarkonDraftManager,
} from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

// 1. Setup DOM Elements
const editorMount = document.getElementById('editor-mount')!;
const previewMount = document.getElementById('preview-mount')!;
const wordCountEl = document.getElementById('word-count')!;
const saveStatusEl = document.getElementById('save-status')!;

// 2. Draft Persistence Manager
const draftManager = new MarkonDraftManager({
  storageKey: 'editorial_cms_draft_v1',
  debounceMs: 500,
});

const initialContent =
  draftManager.getDraft() ||
  `
# Architectural Decision Record: Zero-DOM Isomorphic Rendering

## Status
Accepted

## Context
Downstream web applications require ultra-fast content rendering on both server workers and browser clients without duplicating markdown parsing logic.

## Decision
Adopt **Nofinite Markon** to compile CommonMark, GFM tables, and KaTeX mathematics directly to optimized HTML strings.
`;

// 3. Initialize Core Markon Editor
const editor = new MarkonEditor({
  element: editorMount,
  content: initialContent,
  toolbar: true,
  slashCommands: true,
  blockHandles: true,
  onChange: (markdown) => {
    // Auto-save draft
    draftManager.saveDraft(markdown);
    saveStatusEl.textContent = 'Saved at ' + new Date().toLocaleTimeString();

    // Isomorphic Zero-DOM live preview compilation
    const { html, toc, wordCount } = renderMarkdown(markdown, {
      katex: true,
      highlight: true,
      gfm: true,
    });

    previewMount.innerHTML = html;
    wordCountEl.textContent = `${wordCount} words`;
  },
});

// Initial compilation render
const { html: initialHtml, wordCount: initialCount } =
  renderMarkdown(initialContent);
previewMount.innerHTML = initialHtml;
wordCountEl.textContent = `${initialCount} words`;
```

---

## Example 2: Edge & Node.js Universal Server-Side Rendering (Zero DOM)

Compile complex markdown documents with syntax highlighting and KaTeX mathematics on any Node, Bun, Deno, or Cloudflare Workers runtime with **zero browser DOM dependencies**:

```ts
// server/routes/render.ts
import { renderMarkdown } from '@nofinite/markon';

export async function handleRenderRequest(markdownText: string) {
  const startTime = performance.now();

  // Zero-DOM isomorphic compilation (< 5ms execution time)
  const result = renderMarkdown(markdownText, {
    katex: true,
    highlight: true,
    gfm: true,
  });

  const durationMs = (performance.now() - startTime).toFixed(2);

  return {
    html: result.html,
    toc: result.toc,
    stats: {
      wordCount: result.wordCount,
      readingTimeMinutes: result.readingTime,
      renderDurationMs: durationMs,
    },
  };
}
```

---

## Example 3: Engineering Article Page with Hero Cover & TOC in React

Renders an in-depth technical article using `layout="article"` with a full-bleed hero cover image, author avatar and title, reading time estimate, pre-rendered KaTeX mathematics, and a sticky Table of Contents.

```tsx
'use client';

import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const postMarkdown = `
# Designing Perceptually Uniform UI Systems with OKLCH

Modern digital interfaces require color systems that behave predictably across dark and light modes. Traditional sRGB and HSL color models suffer from non-uniform perceived brightness.

## The Mathematical Foundation of OKLCH

The cylindrical projection OKLCH represents color via three coordinates: Lightness ($L$), Chroma ($C$), and Hue ($H$).

Euler's identity links five fundamental constants:

$$e^{i\\pi} + 1 = 0$$

## Implementing Dynamic Tokens with NUICSS

In **NUICSS**, tokens leverage CSS \`color-mix()\` in the OKLAB color space to generate harmonious surface tints and contrast borders:

\`\`\`css
:root {
  --color-primary: oklch(0.62 0.24 255);
  --color-surface: oklch(0.98 0.01 240);
}
\`\`\`
`;

export function EngineeringArticlePage() {
  return (
    <div className="min-h-screen bg-surface text-default">
      <MarkonRender
        content={postMarkdown}
        format="markdown"
        layout="article"
        metadata={{
          title: 'Designing Perceptually Uniform UI Systems with OKLCH',
          subtitle:
            'Why modern design systems are abandoning sRGB for cylindrical perceptual models',
          cover: {
            src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200',
            alt: 'Spectrogram visualization',
          },
          author: {
            name: 'Dr. Elena Rostova',
            title: 'Lead Color Scientist',
            avatar:
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          },
          publishedAt: '2026-10-14',
          category: 'Color Architecture',
          tags: ['Color Science', 'OKLCH', 'NUICSS', 'Design Tokens'],
        }}
        showTOC={true}
        tocTitle="On this page"
      />
    </div>
  );
}
```

---

## Example 4: Technical API Reference Handbook in React

Renders an API handbook with top navigation breadcrumbs, structured parameter tables, method badges, and a sticky sidebar Table of Contents with active scrollspy using `layout="document"`.

```tsx
'use client';

import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const apiHandbookContent = `
# Edge Session Verification API

The Session Verification API enables microservices to validate asymmetric cryptographic signatures issued by identity providers.

## Endpoint: Verify Session Token

\`POST /v2/sessions/verify\`

| Header | Format | Required | Description |
| :--- | :--- | :---: | :--- |
| \`Authorization\` | \`Bearer <jwt>\` | Yes | Signed Ed25519 identity token |
| \`X-Request-Nonce\` | \`uuidv4\` | Yes | Cryptographic nonce preventing replay |
`;

export function ApiDocumentationPage() {
  return (
    <div className="min-h-screen bg-surface">
      <MarkonRender
        content={apiHandbookContent}
        format="markdown"
        layout="document"
        metadata={{
          title: 'Session Verification API Reference',
          category: 'Security Infrastructure',
          publishedAt: '2026-10-01',
        }}
        showTOC={true}
      />
    </div>
  );
}
```

---

## Example 5: Next.js App Router Server-Side Rendered Blog

Render Markon documents in Next.js Server Components with **zero client JavaScript overhead**:

```tsx
// app/posts/[slug]/page.tsx (Server Component)
import { renderMarkdown } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

interface PostData {
  title: string;
  bodyMarkdown: string;
}

declare function fetchPost(slug: string): Promise<PostData>;

export default async function BlogPostServerPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await fetchPost(params.slug);

  const { html, toc } = renderMarkdown(post.bodyMarkdown, {
    katex: true,
    highlight: true,
  });

  return (
    <main className="min-h-screen bg-surface max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">
        {post.title}
      </h1>
      <div
        className="markon-render-container w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
```
