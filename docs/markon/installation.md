# Installation & Setup

Get started with `@nofinite/markon`.

**Nofinite Markon** is engineered as a **universal, framework-agnostic** authoring canvas and publication engine. The core library (`@nofinite/markon`) runs seamlessly in Vanilla TypeScript, Node.js scripts, Vue 3, Svelte 5, Astro, or Edge Workers with zero framework overhead. The React adapter (`@nofinite/markon/react`) provides declarative components for React 18 & 19.

---

## 1. Package Installation

Install `@nofinite/markon` alongside `@nofinite/nuicss` using your preferred package manager:

```bash
# pnpm
pnpm add @nofinite/markon @nofinite/nuicss

# npm
npm install @nofinite/markon @nofinite/nuicss

# yarn
yarn add @nofinite/markon @nofinite/nuicss

# bun
bun add @nofinite/markon @nofinite/nuicss
```

> **Optional Peer Dependency:** `react` and `react-dom` are strictly **optional** peer dependencies (`peerDependenciesMeta.react.optional: true`). If developing with Vanilla JS, Svelte, Vue, or SSR Node.js, you do not need to install React.

---

## 2. Stylesheet Setup

Editor typography, floating bubble menus, slash command palettes, table action bars, and callout styles are pre-compiled into **NUICSS**.

Include `@nofinite/nuicss` in your application stylesheet (`globals.css` or `main.ts`):

```css
/* In your CSS */
@import '@nofinite/nuicss';
```

Or in your JavaScript/TypeScript entry point:

```ts
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Invariant:** Do **not** import `@nofinite/markon/styles.css`. All necessary typography classes and design tokens are natively bundled in NUICSS.

---

## 3. Verification

### Option A: Framework-Agnostic Core Verification (Vanilla JS / TS / DOM)

Verify that the editor canvas mounts directly into a raw HTML container:

```html
<div id="editor" style="width: 100%; min-height: 300px;"></div>

<script type="module">
  import { MarkonEditor, renderMarkdown } from '@nofinite/markon';
  import '@nofinite/nuicss/styles.css';

  // 1. Mount interactive editor
  const editor = new MarkonEditor({
    element: document.getElementById('editor'),
    initialValue: '# Hello Markon\n\nStart typing with slash commands...',
    showSlashCommands: true,
    showBubbleMenu: true,
  });

  // 2. Or compile Markdown to publication HTML (zero DOM required)
  const html = renderMarkdown('# Fast SSR\n\nRuns in Node.js or Edge.');
  console.log('Compiled HTML:', html);
</script>
```

### Option B: React Verification (`@nofinite/markon/react`)

If developing in React or Next.js, verify the declarative components:

```tsx
'use client';

import React, { useState } from 'react';
import { MarkonEditor, MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export default function DocumentPage() {
  const [content, setContent] = useState(
    '<h2>Test Header</h2><p>Markon is active.</p>'
  );

  return (
    <div className="w-full max-w-3xl p-6 rounded-xl border border-default bg-surface space-y-4">
      <MarkonEditor
        content={content}
        onChange={setContent}
        slashCommands={true}
      />
      <MarkonRender content={content} layout="article" />
    </div>
  );
}
```
