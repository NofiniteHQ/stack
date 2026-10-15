# Block Drag Handles

**Nofinite Markon** features Notion-style gutter drag handles that allow authors to reorganize, duplicate, and transform blocks of content without touching markdown syntax.

Styled with **NUICSS** tokens and powered by `@floating-ui/dom` boundary tracking, block handles provide a tactile, spatial editing experience.

---

## Key Features

- **Hover Grip Handle:** A 6-dot grip icon (`⋮⋮`) smoothly appears in the left gutter adjacent to the block currently hovered by the user.
- **Drag-and-Drop Reordering:** Dragging the handle lifts the entire block and displays a glowing horizontal indicator line marking the drop target.
- **Contextual Action Menu:** Clicking the handle opens a floating menu with 1-click block manipulation actions.
- **Touch-Screen Friendly:** Expanded hitboxes allow tablet and mobile users to access block actions reliably.
- **Boundary Aware:** Calculates position relative to the editor container, avoiding clipping against window borders.

---

## Drag-and-Drop Workflow

```
[Hover Block] ──> [Gutter Grip Appears (⋮⋮)] ──> [Drag Initiated]
                                                        │
   ┌────────────────────────────────────────────────────┘
   ▼
[Horizontal Drop Line Indicates Target] ──> [Drop Released] ──> [ProseMirror Reordered]
```

1. **Grip Hover:** When the mouse hovers within 40px of any top-level node (paragraphs, headings, lists, tables, callouts, or code blocks), the handle animates into position.
2. **Dragging:** Pressing and holding the handle initiates a native drag session. The dragged block dims slightly (`opacity-60`), and the cursor switches to `grabbing`.
3. **Drop Line:** As you drag over other blocks, a colored drop indicator line highlights whether the node will insert above or below the target block.
4. **Reorder Commit:** Releasing the mouse commits a clean transaction in the underlying ProseMirror document state, preserving cursor position and undo history.

---

## Contextual Action Menu

Clicking the handle directly (without dragging) opens a floating context menu with quick block actions:

| Action                    | Icon        | Behavior                                           |
| :------------------------ | :---------- | :------------------------------------------------- |
| **Delete**                | Trash icon  | Removes the selected block from the document       |
| **Duplicate**             | Copy icon   | Clones the block directly underneath               |
| **Turn Into Heading 1**   | `H1`        | Converts block to a Level 1 Heading                |
| **Turn Into Heading 2**   | `H2`        | Converts block to a Level 2 Heading                |
| **Turn Into Bullet List** | Bullet icon | Transforms block into an unordered list item       |
| **Turn Into Callout**     | Alert icon  | Wraps the block inside an Info Callout             |
| **Copy Link to Block**    | Link icon   | Generates a permanent anchor URL to the block's ID |

---

## Usage in React

The drag handle is enabled by default in `<MarkonEditor />`:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export function DocumentEditor() {
  const [content, setContent] = useState(`
    <h2>Architecture Overview</h2>
    <p>Hover near this paragraph to reveal the drag handle in the left margin.</p>
    <div class="markon-callout" data-callout-type="info">
      <p>You can drag this entire callout block above the heading!</p>
    </div>
  `);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-surface border border-default rounded-2xl">
      <MarkonEditor content={content} onChange={setContent} dragHandle={true} />
    </div>
  );
}
```

---

## Vanilla JavaScript / TypeScript Setup

In headless or vanilla environments, instantiate `MarkonDragHandle` directly:

```ts
import { MarkonEditor, MarkonDragHandle } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('editor-container')!;

// 1. Initialize core editor
const editor = new MarkonEditor({
  element: container,
  content: '<p>Interactive block editor with drag handle</p>',
});

// 2. Attach drag handle instance
const dragHandle = new MarkonDragHandle({
  editor: editor.tiptap,
  container: container,
});

// Clean up when destroying editor
function cleanup() {
  dragHandle.destroy();
  editor.destroy();
}
```

---

## Styling & Customization

The drag handle and drop indicator line use semantic **NUICSS** superclasses:

```css
/* Handle styling */
.markon-drag-handle {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--fg-muted);
  border-radius: var(--radius-sm);
  transition: opacity 150ms ease, background-color 150ms ease;
}

.markon-drag-handle:hover {
  color: var(--color-primary);
  background-color: var(--bg-surface-hover);
}

/* Drop indicator line */
.markon-drop-line {
  height: 2px;
  background-color: var(--color-primary);
  box-shadow: 0 0 8px color-mix(in oklab, var(--color-primary) 50%, transparent);
}
```
