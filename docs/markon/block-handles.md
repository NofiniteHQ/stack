# Block Drag Handles

**Nofinite Markon** features Notion-style gutter drag handles (`⋮⋮`) that allow authors to reorganize, duplicate, and transform blocks of content without touching markdown syntax.

Styled with **NUICSS** tokens and powered by `@floating-ui/dom` boundary tracking, block handles provide a tactile, spatial editing experience.

```ts
// Framework-Agnostic Core
import { MarkonEditor, MarkonDragHandle } from '@nofinite/markon';

// React Adapter
import { MarkonEditor as ReactMarkonEditor } from '@nofinite/markon/react';
```

---

## Key Features

- **Hover Grip Handle:** A 6-dot grip icon (`⋮⋮`) smoothly appears in the left gutter adjacent to the block currently hovered by the user.
- **Drag-and-Drop Reordering:** Dragging the handle lifts the entire block and displays a glowing horizontal indicator line marking the drop target.
- **Contextual Action Menu:** Clicking the handle opens a floating menu with 1-click block manipulation actions.
- **Touch-Screen Friendly:** Expanded hitboxes allow tablet and mobile users to access block actions reliably.

---

## 1. Framework-Agnostic Core Usage

The block drag handle is natively bundled into the vanilla DOM editor core:

```ts
import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#editor')!;

const editor = new MarkonEditor({
  element: container,
  initialValue: `
    <h2>Architecture Overview</h2>
    <p>Hover near this paragraph to reveal the drag handle in the left margin.</p>
  `,
  placeholder: 'Start writing...',
});
```

---

## 2. React Adapter Usage

In React applications, enable the handle via the `dragHandle` prop:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export function DocumentEditor() {
  const [content, setContent] = useState(`
    <h2>Architecture Overview</h2>
    <p>Hover near this paragraph to reveal the drag handle in the left margin.</p>
  `);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-surface border border-default rounded-2xl">
      <MarkonEditor content={content} onChange={setContent} dragHandle={true} />
    </div>
  );
}
```

---

## Contextual Action Menu

Clicking the handle directly (without dragging) opens a floating context menu with quick block actions:

| Action                    | Behavior                                           |
| :------------------------ | :------------------------------------------------- |
| **Delete**                | Removes the selected block from the document       |
| **Duplicate**             | Clones the block directly underneath               |
| **Turn Into Heading 1**   | Converts block to a Level 1 Heading                |
| **Turn Into Heading 2**   | Converts block to a Level 2 Heading                |
| **Turn Into Bullet List** | Transforms block into an unordered list item       |
| **Turn Into Callout**     | Wraps the block inside an Info Callout             |
| **Copy Link to Block**    | Generates a permanent anchor URL to the block's ID |
