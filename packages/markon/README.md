# @nofinite/markon

> Universal, framework-agnostic rich text and content authoring engine powered by TipTap and ProseMirror.

[![npm](https://img.shields.io/npm/v/@nofinite/markon?style=flat-square)](https://www.npmjs.com/package/@nofinite/markon)

---

## Features

- **Universal Core**: Framework-agnostic Vanilla DOM class. Works out of the box with plain HTML, HTMX, Vue, Svelte, and React.
- **Idiomatic React Adapter**: Dedicated `@nofinite/markon/react` export with declarative `<MarkonEditor />` component and `useMarkon` hook.
- **Design Tokens**: 100% styled with `@nofinite/nuicss` OKLCH color palettes and semantic component superclasses.
- **Formatting Tools**: Headers, blockquotes, lists, tables, links, colors, highlights, and formatting marks.
- **Accessible & Responsive**: Keyboard shortcuts and responsive layouts.

---

## Installation

```bash
npm install @nofinite/markon @nofinite/nuicss
```

---

## Usage

### In React

```tsx
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

---

## License

Apache-2.0 © Nofinite
