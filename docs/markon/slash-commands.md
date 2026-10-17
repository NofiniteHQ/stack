# Slash Commands

**Nofinite Markon** includes a Notion-style contextual command palette activated by typing `/` anywhere on an empty line or after whitespace.

The slash command menu enables authors to quickly format text, insert structural elements, embed rich media, and execute custom workflows entirely from the keyboard.

```ts
// Framework-Agnostic Core
import { MarkonEditor, createSlashCommandExtension } from '@nofinite/markon';

// React Adapter
import { MarkonEditor as ReactMarkonEditor } from '@nofinite/markon/react';
```

---

## Overview

- **Trigger:** Type `/` on a new line or after whitespace.
- **Navigation:** Use <kbd>↑</kbd> and <kbd>↓</kbd> arrow keys to navigate options.
- **Selection:** Press <kbd>Enter</kbd> or <kbd>Tab</kbd> to execute the selected command.
- **Dismissal:** Press <kbd>Escape</kbd> or continue typing to dismiss the popover.

---

## 1. Framework-Agnostic Core Usage

Enable slash commands when initializing `MarkonEditor`:

```ts
import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#editor')!;

const editor = new MarkonEditor({
  element: container,
  initialValue: '<p>Type <code>/</code> for commands...</p>',
  showSlashCommands: true, // Enabled by default
  placeholder: "Type '/' for commands...",
});
```

---

## 2. React Adapter Usage

In React applications, configure slash commands via component props:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export function EditorWithCommands() {
  const [content, setContent] = useState(
    '<p>Type <code>/</code> to see commands...</p>'
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <MarkonEditor
        content={content}
        onChange={setContent}
        slashCommands={true}
        placeholder="Type '/' for commands..."
      />
    </div>
  );
}
```

---

## Built-In Commands Registry

The default registry includes 20 production-ready commands:

| Command      | Title                   | Description                       | Resulting Action                                 |
| :----------- | :---------------------- | :-------------------------------- | :----------------------------------------------- |
| `/h1`        | **Heading 1**           | Large section heading             | Inserts `<h1>` node                              |
| `/h2`        | **Heading 2**           | Medium section heading            | Inserts `<h2>` node                              |
| `/h3`        | **Heading 3**           | Small section heading             | Inserts `<h3>` node                              |
| `/bullet`    | **Bullet List**         | Unordered bulleted list           | Toggles unordered `<ul>` list                    |
| `/number`    | **Numbered List**       | Ordered numerical list            | Toggles ordered `<ol>` list                      |
| `/todo`      | **Task List**           | Interactive checklist with boxes  | Inserts task list with checkboxes                |
| `/quote`     | **Blockquote**          | Editorial block quote             | Inserts `<blockquote>` node                      |
| `/code`      | **Code Block**          | Syntax-highlighted code container | Inserts fenced code block with language selector |
| `/table`     | **Table (3x3)**         | Data table with header row        | Inserts 3x3 table with headers                   |
| `/math`      | **Math Formula**        | LaTeX / KaTeX block               | Inserts mathematical formula editor              |
| `/video`     | **Video Embed**         | Responsive YouTube, Vimeo, MP4    | Opens modal for video URL                        |
| `/toggle`    | **Collapsible Section** | Notion-style accordion            | Inserts `<details>` and `<summary>`              |
| `/image`     | **Image**               | Media image with alignment        | Opens file picker or URL modal                   |
| `/file`      | **File Attachment**     | Downloadable document pill        | Opens file attachment picker                     |
| `/divider`   | **Horizontal Rule**     | Visual dividing line              | Inserts `<hr>` separator                         |
| `/highlight` | **Highlight**           | Pastel color text background      | Applies semantic text highlight                  |
| `/info`      | **Info Callout**        | Blue informational note box       | Inserts Info alert container                     |
| `/success`   | **Success Callout**     | Green confirmation tip box        | Inserts Success alert container                  |
| `/warning`   | **Warning Callout**     | Amber advisory caution box        | Inserts Warning alert container                  |
| `/danger`    | **Danger Callout**      | Red error or danger box           | Inserts Danger alert container                   |
