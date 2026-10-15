# Nofinite Markon

> Modern, extensible markdown WYSIWYG editor with floating bubble menus, multi-language codeblocks, and full NUICSS theming.

---

## Overview

**Nofinite Markon** (`@nofinite/markon`) is an enterprise-grade Markdown editor for React applications. It features:

- **Zero Style Setup:** Canvas typography, sticky toolbars, and floating bubble menu pills are styled directly by **NUICSS**.
- **Floating Bubble Menu:** Contextual formatting menu pill that appears smoothly over selected text.
- **Multi-Language Codeblocks:** Categorized syntax highlight support across 16 core programming languages.
- **Drag & Drop Media:** Corner-anchored image resizing with drag-duplication prevention.
- **Bidirectional Markdown:** Seamlessly loads and outputs clean GitHub-flavored Markdown.

---

## Quickstart

### 1. Installation

```bash
npm install @nofinite/markon @nofinite/nuicss
# or
pnpm add @nofinite/markon @nofinite/nuicss
```

### 2. Stylesheet Import

Import the unified NUICSS stylesheet:

```tsx
import '@nofinite/nuicss/styles.css';
```

_(Optional: For modular tree-shaking, you can import `@nofinite/nuicss/dist/markon.css` instead)._

### 3. Usage Example

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon';

export function DocumentEditor() {
  const [content, setContent] = useState(`
# Welcome to Nofinite Markon

Start typing rich markdown here. Select text to trigger the **floating bubble menu**, or insert code blocks below:

\`\`\`typescript
const greeting: string = "Hello from Markon!";
console.log(greeting);
\`\`\`
  `);

  return (
    <div className="card max-w-4xl mx-auto p-4">
      <MarkonEditor
        value={content}
        onChange={setContent}
        placeholder="Write something brilliant..."
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

## Key Features

### Floating Bubble Menu (`.markon-bubble-menu`)

When text is highlighted, Markon displays a floating formatting pill directly above the selection, allowing quick access to Bold, Italic, Strikethrough, Code, Link, and Color annotations without reaching for the top toolbar.

### 16 Standardized Codeblock Languages

Markon features an accessible `<select>` dropdown organized into categorized optgroups:

- **Web & Core:** TypeScript, JavaScript, HTML, CSS, JSON, Markdown
- **Systems & Backend:** Python, Go, Rust, Java, C++, C#
- **Data & Ops:** SQL, Bash/Shell, YAML, Dockerfile

### Symmetrical Typography Selector

The heading dropdown is replaced with an elegant, symmetrical icon-only button that smoothly opens a popup selector with instant keyboard shortcuts (`Ctrl+Alt+1` through `6`).
