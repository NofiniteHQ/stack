# Nofinite Markon

> Modern, extensible markdown WYSIWYG editor and renderer featuring floating bubble menus, multi-language codeblocks, and full NUICSS theming.

---

## Overview

**Nofinite Markon** (`@nofinite/markon`) is an enterprise-grade rich markdown editing suite for React applications. Built upon TipTap 2, lowlight, and KaTeX math formulas, it provides an intuitive writing experience with seamless bidirectional Markdown output.

### Key Architectural Highlights

- **Zero Style Setup (Single NUICSS Engine):** Canvas typography, sticky toolbars, and floating bubble menu pills (`.markon-bubble-menu`) are styled directly by **NUICSS**. You only need `import '@nofinite/nuicss/styles.css'`.
- **Floating Contextual Bubble Menu:** When text is highlighted, an animated formatting pill appears directly over the selection for instant Bold, Italic, Strikethrough, Code, Link, and Color access.
- **16 Standardized Codeblock Languages:** Features an accessible `<select>` dropdown organized into categorized optgroups (Web & Core, Systems & Backend, Data & Ops) with syntax highlighting.
- **Symmetrical Typography Selector:** Replaces clumsy dropdowns with a sleek, symmetrical icon-only heading selector supporting instant keyboard shortcuts (`Ctrl+Alt+1` through `6`).
- **Corner-Anchored Image Resizing:** Smooth drag resizing anchored strictly to the image corner, preventing drag-duplication glitches on drop.

---

## Basic Example

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const INITIAL_MARKDOWN = `
# Engineering Constitution

Welcome to the **Nofinite** documentation system.

\`\`\`typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
}
\`\`\`
`;

export function EditorDemo() {
  const [content, setContent] = useState(INITIAL_MARKDOWN);

  return (
    <div className="card max-w-4xl mx-auto p-4">
      <MarkonEditor
        value={content}
        onChange={setContent}
        placeholder="Type rich markdown here..."
        toolbar={{
          headings: true,
          formatting: true,
          lists: true,
          codeblock: true,
          tables: true,
        }}
      />
    </div>
  );
}
```

---

## Guides & Documentation

- [Installation & Setup](./getting-started/installation.md) — Package installation and stylesheet configuration.
- [Editor & Render Setup](./getting-started/setup.md) — Configuring `MarkonEditor` and read-only `MarkonRender`.
- [Syntax & Formatting Features](./usage/markon-syntax.md) — Markdown syntax, 16 codeblock languages, and typography selector.
