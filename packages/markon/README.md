<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.nofinite.com/brand/oss/markon/logos/markon-horizontal-white.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://cdn.nofinite.com/brand/oss/markon/logos/markon-horizontal.svg">
  <img alt="Markon" src="https://cdn.nofinite.com/brand/oss/markon/logos/markon-horizontal.svg" width="300">
</picture>

<br/>
<br/>

**Universal, framework-agnostic rich text WYSIWYG editor and document authoring engine powered by TipTap and ProseMirror.**

<p align="center">
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  </a>
  <a href="https://opensource.nofinite.com/markon">
    <img alt="Documentation" src="https://img.shields.io/badge/Docs-OpenSource-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="https://www.npmjs.com/package/@nofinite/markon">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40nofinite%2Fmarkon?style=for-the-badge&logo=npm&logoColor=white&labelColor=slategray&color=%23000133">
  </a>
</p>

</div>

---

## Overview

Markon is a modern document authoring and WYSIWYG rich text engine engineered for speed, modularity, and framework versatility. Built upon the robust foundation of TipTap and ProseMirror, Markon features declarative React wrappers, a zero-dependency vanilla JS class, and comprehensive styling driven by NUICSS design tokens.

- **Universal Core:** Framework-agnostic Vanilla DOM class (`MarkonEditor`). Works out of the box with plain HTML, HTMX, Vue, Svelte, and React.
- **Idiomatic React Adapter:** Dedicated `@nofinite/markon/react` export with declarative `<MarkonEditor />` component and `useMarkon` hook.
- **Design Tokens & OKLCH Theming:** 100% styled with NUICSS semantic component superclasses (`card`, `btn`, `input`) and OKLCH color palettes.
- **Rich Content Suite:** Comprehensive formatting extensions including headings, blockquotes, ordered/bullet lists, markdown tables, code blocks, hyperlinks, text highlights, and inline formatting marks.
- **Accessible & Responsive:** W3C keyboard navigation shortcuts, bubble menu toolbars, and responsive editing viewports.

---

## Installation

```bash
# pnpm
pnpm add @nofinite/markon @nofinite/nuicss

# npm
npm install @nofinite/markon @nofinite/nuicss

# yarn
yarn add @nofinite/markon @nofinite/nuicss
```

---

## Styles Setup

Markon's editor typography, bubble menus, and toolbar controls are styled natively via NUICSS. Import the stylesheet once at the root of your application (e.g., `main.tsx`, `_app.tsx`, or `layout.tsx`):

```tsx
import '@nofinite/nuicss/styles.css';
```

> **Note:** For modular or bundle-isolated setups, NUICSS also exports a dedicated subpath stylesheet: `@nofinite/nuicss/markon.css`.

---

## Quick Start

### In React

```tsx
import '@nofinite/nuicss/styles.css';
import { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';

export function EditorExample() {
  const [content, setContent] = useState('<p>Hello Markon 2.0</p>');

  return (
    <MarkonEditor
      value={content}
      onChange={(html) => setContent(html)}
      placeholder="Type something..."
    />
  );
}
```

### In Vanilla JavaScript / HTMX

```html
<div id="editor-container"></div>

<script type="module">
  import { MarkonEditor } from '@nofinite/markon';

  const editor = new MarkonEditor({
    element: document.getElementById('editor-container'),
    initialValue: '<p>Hello world!</p>',
    onChange: (html) => console.log('Content updated:', html),
  });
</script>
```

### Zero-Build CDN (ESM)

For rapid prototyping without a build step or bundler:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- NUICSS Design Tokens & Editor Stylesheet -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/styles.css"
    />
  </head>
  <body class="bg-surface p-6">
    <div id="editor-container"></div>

    <script type="module">
      import { MarkonEditor } from 'https://esm.sh/@nofinite/markon';

      const editor = new MarkonEditor({
        element: document.getElementById('editor-container'),
        initialValue: '<p>Hello from zero-build CDN!</p>',
        onChange: (html) => console.log('Content updated:', html),
      });
    </script>
  </body>
</html>
```

---

## Extensions & Capabilities

| Feature                  | Key Binding / Syntax               | Description                                                   |
| :----------------------- | :--------------------------------- | :------------------------------------------------------------ |
| **Headings**             | `#`, `##`, `###` / `Ctrl+Alt+1..3` | Semantic H1–H6 header levels with typography scaling          |
| **Lists**                | `- `, `1. `, `[ ]`                 | Bullet lists, numbered lists, and interactive task checklists |
| **Code Blocks**          | ``lang`                            | Syntax-highlighted code blocks with copy-to-clipboard         |
| **Tables**               | Markdown table syntax              | Resizable rows, columns, and header cells                     |
| **Links & Media**        | `[text](url)` / modal              | Safe auto-linking with target and rel security defaults       |
| **Floating Bubble Menu** | Text selection                     | Context-aware inline formatting toolbar for rapid authoring   |

---

## Documentation

For full setup guides, component examples, and API references, [read documentation](https://opensource.nofinite.com/markon).

---

## License

This project is licensed under the [Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
