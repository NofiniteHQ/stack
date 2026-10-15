# Nofinite Markon

> Enterprise rich text editing and isomorphic publication engine. Features Notion-style slash commands, gutter drag handles, multi-language codeblocks, KaTeX math typesetting, and a standalone 4-layout publication renderer.

---

## Overview

**Nofinite Markon** (`@nofinite/markon`) is a comprehensive content editing and publication suite. It bridges the gap between authoring rich, structured documents and publishing them into beautiful, responsive web pages.

### Architectural Invariants

- **Single Styling Engine:** 100% styled by **NUICSS** (`@nofinite/nuicss`). Zero secondary stylesheets required—simply `import '@nofinite/nuicss/styles.css'`.
- **Zero DOM Server Renderer:** The standalone publication engine (`renderMarkon` / `<MarkonRender />`) renders TipTap JSON, HTML, or Markdown into production-grade HTML on the server (Next.js Server Components, Edge, Node.js) with zero DOM dependencies.
- **Bi-Directional Format Agnosticism:** Seamlessly convert between TipTap JSONContent, sanitized HTML, and GitHub-Flavored Markdown.

---

## Key Features

- **Standalone Publication Engine (`<MarkonRender />`):** 4 built-in publication layouts (`'article'`, `'document'`, `'newsroom'`, `'minimal'`), automated sticky Table of Contents with scrollspy, pre-rendered KaTeX math, and code copy buttons.
- **Notion-Style Slash Commands:** Type `/` to open an animated command palette with 20 built-in commands or register custom application workflows.
- **Gutter Block Drag Handles:** Hover handles (`⋮⋮`) for tactile drag-and-drop block reordering, selection, and contextual block transformations.
- **Data Tables & Visual Picker:** 10×10 visual dimension picker, floating cell context menus, cell merging, and column operations.
- **Semantic Callouts & Accordions:** 4 advisory variants (`info`, `success`, `warning`, `danger`) and collapsible toggle sections.
- **Rich Media & File Cards:** Corner-anchored image resizing, responsive video embeds (YouTube, Vimeo, MP4), and downloadable attachment cards.
- **Draft Auto-Save & Recovery:** Debounced persistence with live save states (`saving`, `saved`, `error`) and crash recovery banners.

---

## Quickstart

```tsx
import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const markdown = `
# Designing with Perceptual Color Spaces
Euler's equation $e^{i\\pi} + 1 = 0$ is considered one of the most elegant mathematical formulations.
`;

export function PublicationView() {
  return (
    <main className="p-6 bg-surface">
      <MarkonRender
        content={markdown}
        format="markdown"
        layout="article"
        metadata={{
          title: 'Designing with Perceptual Color Spaces',
          publishedAt: '2026-10-15',
          author: 'Engineering Team',
        }}
        showTOC={true}
      />
    </main>
  );
}
```

---

## Documentation Directory

### Publication & Renderer Suite _(The Limelight)_

- **[Publication Renderer (`MarkonRender`)](./renderer.md)** — Complete deep dive into the isomorphic AST publication engine, 4 layout modes, KaTeX math, code copy buttons, and SSR architecture.
- **[Publication Examples](./examples.md)** — Production-grade copy-paste implementations for blogs, API handbooks, newsroom releases, and Next.js App Router Server Components.

### Editor & Interactive Capabilities

- **[Slash Commands](./slash-commands.md)** — Keyboard-driven `/` command palette, built-in commands registry, and custom action extensions.
- **[Block Drag Handles](./block-handles.md)** — Notion-style gutter drag handles, drop indicator lines, and contextual block action menus.
- **[Tables and Grids](./tables-and-grids.md)** — 10×10 visual dimension picker, cell merging/splitting, and floating table toolbars.
- **[Callouts & Collapsible Sections](./callouts-and-details.md)** — 4 semantic alert boxes (`info`, `success`, `warning`, `danger`) and toggle accordions.
- **[Media & File Uploads](./media-and-uploads.md)** — Interactive image resizing, video embeds, downloadable file cards, and upload placeholders.
- **[Draft Auto-Save & Recovery](./draft-management.md)** — Debounced persistence, save state indicators, and crash recovery workflows.

### Getting Started & Setup

- **[Installation & Setup](./getting-started/installation.md)** — Installing packages and configuring the single NUICSS stylesheet.
- **[Editor Setup](./getting-started/setup.md)** — Initializing `<MarkonEditor />` and core editor instances.
- **[Syntax & Formatting](./usage/markon-syntax.md)** — Supported Markdown syntax and 16 codeblock languages.
- **[CDN Distribution](./getting-started/cdn.md)** — Loading Markon via unpkg/jsdelivr in vanilla HTML applications.
