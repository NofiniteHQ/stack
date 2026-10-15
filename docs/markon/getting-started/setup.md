# Editor & Renderer Setup

Learn how to configure the interactive `MarkonEditor` and the read-only `MarkonRender` component.

---

## Interactive Editor (`MarkonEditor`)

Use `MarkonEditor` for rich text input with full WYSIWYG capabilities:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';

export function DocumentEditor() {
  const [markdown, setMarkdown] = useState('# Hello World');

  return (
    <MarkonEditor
      value={markdown}
      onChange={setMarkdown}
      placeholder="Start typing..."
      autoFocus={true}
      editable={true}
    />
  );
}
```

---

## Read-Only Viewer (`MarkonRender`)

Use `MarkonRender` to display pre-formatted markdown content safely without loading editing toolbar scripts:

```tsx
import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';

export function BlogPost({ postContent }: { postContent: string }) {
  return (
    <article className="prose max-w-none">
      <MarkonRender content={postContent} />
    </article>
  );
}
```

---

## Props Reference

### `MarkonEditor` Props

| Prop          | Type                         | Default               | Description                                                   |
| :------------ | :--------------------------- | :-------------------- | :------------------------------------------------------------ |
| `value`       | `string`                     | `''`                  | Markdown text content.                                        |
| `onChange`    | `(markdown: string) => void` | `undefined`           | Callback fired on content edit.                               |
| `placeholder` | `string`                     | `'Type something...'` | Empty canvas placeholder text.                                |
| `editable`    | `boolean`                    | `true`                | Whether editing is enabled.                                   |
| `autoFocus`   | `boolean`                    | `false`               | Automatically focuses editor upon mounting.                   |
| `toolbar`     | `object`                     | All enabled           | Toolbar module toggles (headings, formatting, lists, tables). |
