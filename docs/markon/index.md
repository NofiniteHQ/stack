# Nofinite Markon

> Zero-DOM isomorphic Markdown compiler, TipTap publication editor, and editorial reading engine.

---

## Interactive Preview

<Preview
name="editor"
vanillaCode={`import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('editor-container');

// Mount rich authoring canvas directly to DOM
const editor = new MarkonEditor({
element: container,
initialValue: '<h2>Project Vision</h2><p>Start writing with rich formatting...</p>',
showSlashCommands: true,
showBubbleMenu: true,
placeholder: "Type '/' for commands..."
});

// Programmatic export:
// const markdown = editor.getMarkdown();
// const html = editor.getHTML();
// editor.destroy();`}
/>

---

## Architecture: Authoring & Publication Pipeline

**Nofinite Markon** provides an end-to-end publishing pipeline split across two complementary subsystems:

```
[Authoring Canvas]                [Compiled Document AST]              [Publication Engine]
  MarkonEditor      ─── Exports ───>  TipTap JSON AST   ─── Renders ───>  renderMarkdown()
(Slash commands, DND)                or Markdown String                 (Article, Newsroom, Docs)
```

1. **Authoring Layer ([`MarkonEditor`](/markon/editor)):** A rich, keyboard-driven authoring canvas featuring Notion-style slash commands (`/`), gutter block drag handles (`⋮⋮`), interactive table pickers, and debounced draft auto-saving.
2. **UI Publication Layer ([`MarkonRender`](/markon/render)):** The visual presentation engine for compiled Markon JSON and Markdown documents. It transforms abstract ASTs into publication-grade editorial layouts (`article`, `document`, `newsroom`, `minimal`), generating automated sticky Table of Contents with scrollspy, compiling server-side KaTeX mathematics, and formatting author bylines and hero cover images.

---

## Quickstart

### 1. Framework-Agnostic Core (`@nofinite/markon`)

Mount the editor canvas directly to any HTML DOM node, or compile Markdown to HTML with zero DOM dependencies in **Vanilla JavaScript**, **TypeScript**, **Node.js**, **Vue 3**, **Svelte 5**, or **Astro**:

```ts
import { MarkonEditor, renderMarkdown } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

// A. Interactive Authoring Canvas in pure DOM
const container = document.getElementById('editor')!;
const editor = new MarkonEditor({
  element: container,
  initialValue: '# Hello World\n\nType `/` for slash commands...',
  showSlashCommands: true,
  showBubbleMenu: true,
  onChange: (html, json, text) => {
    console.log('Document updated:', text);
  },
});

// B. Isomorphic Publication Compiler (runs in Node.js, SSR, or browser)
const publicationHtml = renderMarkdown(
  '# Architectural Whitepaper\n\n$$e^{i\\pi} + 1 = 0$$',
  {
    layout: 'article',
    showTOC: true,
  }
);
```

### 2. React Adapter (`@nofinite/markon/react`)

Declarative React JSX components for React 18 & 19:

```tsx
import React, { useState } from 'react';
import { MarkonEditor, MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export default function DocumentEditor() {
  const [content, setContent] = useState(
    '<h2>Project Vision</h2><p>Start writing with rich formatting...</p>'
  );

  return (
    <div className="w-full max-w-3xl p-6 rounded-2xl border border-default bg-surface shadow-xs space-y-6">
      <MarkonEditor
        content={content}
        onChange={setContent}
        slashCommands={true}
        dragHandle={true}
        placeholder="Type '/' for commands..."
      />

      {/* Render compiled article */}
      <MarkonRender content={content} layout="article" />
    </div>
  );
}
```

---

## Core Capabilities

- **Framework-Agnostic Isomorphic Core**: The root `@nofinite/markon` package runs in pure DOM or server-side Node.js with zero React requirements.
- **4 Specialized Publication Layouts**: Built-in responsive presentation modes for articles, technical documentation, press releases, and minimal embeds.
- **Notion-Style Slash Commands (`/`)**: Type `/` anywhere on a blank line to open a floating command palette for headings, tables, callout boxes, code blocks, and math equations.
- **Gutter Block Drag Handles**: Hover handles for tactile drag-and-drop block reordering, selection, and contextual block transformations.
- **Interactive Data Tables**: 10×10 visual dimension picker, cell merging/splitting, and contextual table action toolbars.
- **Pre-Rendered KaTeX Math**: Math equations are compiled server-side into accessible SVG/HTML without requiring client-side KaTeX runtime scripts.
- **Lowlight Syntax Highlighting**: High-speed AST syntax highlighting across 16 programming languages with 1-click clipboard copy buttons.
- **Draft Auto-Save & Recovery**: Background debounced persistence with live status indicators (`saving`, `saved`, `error`) and crash recovery dialogs.

---

## Documentation Directory

### Advanced Architecture & Deep Guides

- [Markon Publication Renderer](/markon/render) — Complete guide to compiled publication layouts (`article`, `document`, `newsroom`, `minimal`) and SSR execution.
- [Slash Commands Palette](/markon/slash-commands) — Notion-style floating `/` command palette and extension options.
- [Gutter Block Drag Handles](/markon/block-handles) — Tactile block drag handles (`⋮⋮`) and reordering mechanics.
- [Tables & Grids](/markon/tables-and-grids) — Interactive matrix pickers, row/column operations, and cell styling.
- [Callouts & Collapsible Details](/markon/callouts-and-details) — GitHub-style callouts (`:::info`) and interactive accordions.
- [Draft Management & Auto-Save](/markon/draft-management) — Local persistence, debounced auto-saving, and crash recovery.
- [Media & File Uploads](/markon/media-and-uploads) — Direct S3/R2 uploads, drag-and-drop images, and video embedding.
- [Production Examples](/markon/examples) — Production-grade CMS editors, newsroom publication pipelines, and technical documentation hubs.

### Primitives & Setup

- [Installation & Setup](/markon/installation) — Package installation, styling configuration, and peer dependencies.
- [MarkonEditor Authoring Canvas](/markon/editor) — Full API reference for the rich text editor canvas.
