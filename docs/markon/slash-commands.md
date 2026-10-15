# Slash Commands

**Nofinite Markon** includes a Notion-style contextual command palette activated by typing `/` anywhere in an empty line or at the end of a block.

The slash command menu allows authors to rapidly format text, insert structural elements, embed rich media, and execute custom workflows entirely from the keyboard.

---

## Overview

When the author types `/`, a floating suggestions popover appears adjacent to the text caret. As the author types, the menu fuzzy-filters available commands in real time.

- **Trigger:** Type `/` on a new line or after whitespace.
- **Navigation:** Use <kbd>↑</kbd> and <kbd>↓</kbd> arrow keys to navigate options.
- **Selection:** Press <kbd>Enter</kbd> or <kbd>Tab</kbd> to execute the selected command.
- **Dismissal:** Press <kbd>Escape</kbd> or continue typing normal prose to close the menu.

---

## Built-In Commands Registry

The default registry includes 20 production-ready commands:

| Command      | Icon / Title            | Description                       | Resulting Action                                 |
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

---

## Using Slash Commands in React

The slash command palette is enabled by default in `<MarkonEditor />`:

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
        placeholder="Type '/' for commands, or start writing..."
      />
    </div>
  );
}
```

---

## Registering Custom Slash Commands

You can register custom commands alongside the built-ins by providing an array of `SlashCommandItem` objects:

```tsx
import React from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import { defaultSlashCommands, type SlashCommandItem } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

// Define custom business commands
const customCommands: SlashCommandItem[] = [
  ...defaultSlashCommands,
  {
    title: 'AI Draft Assistant',
    description: 'Generate outline or draft content with AI',
    command: (editor, range) => {
      // Clear the slash command query text
      editor.chain().focus().deleteRange(range).run();

      // Execute custom application logic
      window.dispatchEvent(
        new CustomEvent('open-ai-prompt-dialog', {
          detail: { editor },
        })
      );
    },
  },
  {
    title: 'Customer Metric Card',
    description: 'Insert an interactive KPI telemetry card',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'info' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '📊 Telemetry Metric: Active Daily Users: 42,500 (+12%)',
                },
              ],
            },
          ],
        })
        .run();
    },
  },
];

export function CustomCommandsEditor() {
  return (
    <MarkonEditor
      customSlashCommands={customCommands}
      placeholder="Type '/' to access custom actions..."
    />
  );
}
```

---

## Keyboard Accessibility & UX Standards

The slash command menu strictly conforms to W3C ARIA Combobox design standards:

1. **Focus Trapping Avoidance:** The text caret retains focus inside the editor while arrow keys cycle through the floating dropdown.
2. **Auto-Scroll Active Item:** When scrolling through a long list of filtered commands, the active selection automatically stays visible within the popover viewport.
3. **Collision Detection:** The menu uses `@floating-ui/dom` with `flip()` and `shift()` middleware to prevent clipping against browser boundaries or container edges.
