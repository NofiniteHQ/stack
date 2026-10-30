# MarkonEditor

`MarkonEditor` is a full-featured, accessible WYSIWYG authoring canvas featuring 28 toolbar actions, floating bubble menus, slash commands (`/`), gutter drag handles, and KaTeX mathematics.

```ts
// Framework-Agnostic Core
import { MarkonEditor, type MarkonEditorOptions } from '@nofinite/markon';

// React Adapter
import { MarkonEditor as ReactMarkonEditor } from '@nofinite/markon/react';
```

---

## Interactive Preview

<Preview
name="editor"
vanillaCode={`import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('editor-container');

const editor = new MarkonEditor({
element: container,
initialValue: '<h2>Project Proposal</h2><p>Type "/" to insert callouts, code blocks, or tables...</p>',
showSlashCommands: true,
showBubbleMenu: true,
showWordCount: true,
placeholder: "Type '/' for commands..."
});`}
/>

---

## 1. Framework-Agnostic Core Usage

### Direct DOM Mounting (`new MarkonEditor`)

Mount the authoring canvas directly into any HTML element:

```ts
import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#editor-root')!;

const editor = new MarkonEditor({
  element: container,
  initialValue: '# Product Roadmap 2026\n\nDetailed milestones...',
  placeholder: "Type '/' for commands...",
  showSlashCommands: true,
  showBubbleMenu: true,
  showWordCount: true,
  showSaveStatus: true,
  autoSave: {
    key: 'draft-roadmap-2026',
    debounceMs: 1000,
  },
  onChange: (html, json, text) => {
    console.log('Words:', editor.getCounts().words);
  },
  onUploadFile: async (file) => {
    // Custom S3 / R2 upload logic
    return 'https://cdn.example.com/uploads/photo.jpg';
  },
});

// Programmatic methods:
// const markdown = editor.getMarkdown();
// const html = editor.getHTML();
// const jsonAst = editor.getJSON();
// editor.setMarkdown('# Updated Document');
// editor.focus();
// editor.destroy();
```

---

## 2. React Adapter Usage

In React applications, manage document state declaratively:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export default function DocumentCanvas() {
  const [content, setContent] = useState(
    '<h2>Sprint Tasks</h2><p>Edit directly...</p>'
  );

  return (
    <div className="w-full max-w-3xl p-6 rounded-2xl border border-default bg-surface shadow-xs">
      <MarkonEditor
        content={content}
        onChange={setContent}
        slashCommands={true}
        dragHandle={true}
        wordCount={true}
        placeholder="Type '/' for commands..."
        onUploadFile={async (file: File) => {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: file,
          });
          const data = await res.json();
          return data.url;
        }}
      />
    </div>
  );
}
```

---

## Features & Configuration

### 1. Slash Commands (`/`)

Press `/` on any blank line to open a keyboard-navigable command palette:

- Headings (H1, H2, H3)
- Bulleted & Numbered Lists
- Task Checklists
- Code Blocks with language syntax highlighting
- KaTeX Math Formulas
- Blockquotes & Callout Boxes
- Data Tables with dynamic row/column insertion

### 2. Contextual Bubble Menu

Selecting text automatically reveals a floating bubble menu providing quick access to Bold, Italic, Strikethrough, Code, Color chips, Link insertion, and Typography alignment.

---

## Keyboard Shortcuts

| Shortcut                                         | Action                              |
| :----------------------------------------------- | :---------------------------------- |
| <kbd>/</kbd>                                     | Open floating slash command palette |
| <kbd>Mod</kbd> + <kbd>B</kbd>                    | Toggle Bold text                    |
| <kbd>Mod</kbd> + <kbd>I</kbd>                    | Toggle Italic text                  |
| <kbd>Mod</kbd> + <kbd>K</kbd>                    | Insert or edit link                 |
| <kbd>Mod</kbd> + <kbd>Alt</kbd> + <kbd>1</kbd>   | Format as Heading 1                 |
| <kbd>Mod</kbd> + <kbd>Alt</kbd> + <kbd>2</kbd>   | Format as Heading 2                 |
| <kbd>Mod</kbd> + <kbd>Alt</kbd> + <kbd>C</kbd>   | Insert Code Block                   |
| <kbd>Mod</kbd> + <kbd>Z</kbd>                    | Undo                                |
| <kbd>Mod</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Redo                                |
