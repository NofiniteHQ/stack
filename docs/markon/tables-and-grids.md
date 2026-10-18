# Tables and Grids

**Nofinite Markon** provides an interactive table editing and isomorphic rendering suite designed for structured tabular data, API specifications, benchmarks, and financial matrices.

It combines an intuitive visual dimension picker with contextual cell toolbars, cell merging/splitting, and full GitHub-Flavored Markdown table interoperability across both headless DOM/Node runtimes and React.

---

## Key Features

- **Visual Dimension Picker:** Hover-to-select grid popup supporting table sizes up to 10×10.
- **Contextual Table Toolbar:** A floating action bar that automatically appears when the text cursor enters any table cell.
- **Structural Row & Column Commands:** 1-click actions to insert rows above/below, columns left/right, and delete targeted segments.
- **Cell Merging & Splitting:** Combine adjacent rectangular cell ranges or split merged cells back into standard grid units.
- **Header Toggles:** Independently enable or disable top header rows (`<th>`) and left header columns.
- **Zero-DOM Server Table Compilation:** `renderMarkdown()` compiles GFM Markdown tables to clean semantic HTML with zero DOM dependencies.

---

## Interactive Table Toolbar

When an author clicks inside any table cell, a floating context toolbar activates with the following commands:

| Action                      | Core Command                             | Description                                                        |
| :-------------------------- | :--------------------------------------- | :----------------------------------------------------------------- |
| **Add Row Above / Below**   | `addRowBefore()` / `addRowAfter()`       | Inserts a blank row directly above or below current cell           |
| **Add Column Left / Right** | `addColumnBefore()` / `addColumnAfter()` | Inserts a blank column to left or right of current cell            |
| **Delete Row / Column**     | `deleteRow()` / `deleteColumn()`         | Removes the current row or column                                  |
| **Merge Cells**             | `mergeCells()`                           | Merges selected adjacent cells into a single spanning cell         |
| **Split Cell**              | `splitCell()`                            | Splits a previously merged cell back into its original grid units  |
| **Toggle Header**           | `toggleHeaderRow()`                      | Toggles the top row between normal cells and header cells (`<th>`) |
| **Delete Table**            | `deleteTable()`                          | Completely removes the entire table structure                      |

---

## 1. Usage in Vanilla TypeScript / DOM (Core First)

In pure JavaScript or TypeScript, table functionality is available directly via `MarkonEditor` or imperatively through the underlying editor instance:

```ts
import { MarkonEditor, renderMarkdown } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const initialMarkdown = `
## Cluster Node Specifications

| Node ID | Region | CPU Cores | Memory (GiB) | Status |
| :--- | :--- | :---: | :---: | :--- |
| \`worker-01\` | us-east-1a | 32 | 128 | Active |
| \`worker-02\` | us-east-1b | 64 | 256 | Active |
| \`worker-03\` | eu-central-1 | 16 | 64 | Standby |
`;

const container = document.getElementById('editor-root')!;

// 1. Initialize Markon Editor with Tables enabled
const editor = new MarkonEditor({
  element: container,
  content: initialMarkdown,
  tables: true, // Enables table extensions, floating cell menu, and dimension picker
  onChange: (markdown) => {
    console.log('Updated Markdown:', markdown);
  },
});

// 2. Imperative Table Commands via Core Engine
const addRowBtn = document.getElementById('add-row-btn')!;
addRowBtn.addEventListener('click', () => {
  editor.editor.chain().focus().addRowAfter().run();
});

const mergeBtn = document.getElementById('merge-cells-btn')!;
mergeBtn.addEventListener('click', () => {
  editor.editor.chain().focus().mergeCells().run();
});

// 3. Fast Headless / Server-Side Table Compilation (Zero DOM)
const { html } = renderMarkdown(initialMarkdown);
console.log('Compiled Table HTML:', html);
```

### Table HTML Output Structure

```html
<div class="markon-prose">
  <h2>Cluster Node Specifications</h2>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="text-align: left;">Node ID</th>
          <th style="text-align: left;">Region</th>
          <th style="text-align: center;">CPU Cores</th>
          <th style="text-align: center;">Memory (GiB)</th>
          <th style="text-align: left;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>worker-01</code></td>
          <td>us-east-1a</td>
          <td style="text-align: center;">32</td>
          <td style="text-align: center;">128</td>
          <td>Active</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

## 2. Usage in React

In React applications, `@nofinite/markon/react` wraps the core table extensions and contextual floating action menus into declarative components:

```tsx
'use client';

import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const initialTableContent = `
## Database Sharding Strategy

| Cluster ID | Region | Read Replicas | Status |
| :--- | :--- | :---: | :--- |
| \`shard-alpha\` | us-east-1 | 4 | Primary |
| \`shard-beta\` | eu-west-1 | 2 | Synchronized |
| \`shard-gamma\` | ap-southeast-1 | 2 | Provisioning |
`;

export function TechnicalSpecEditor() {
  const [content, setContent] = useState(initialTableContent);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <MarkonEditor
        content={content}
        onChange={setContent}
        toolbar={true}
        tables={true}
      />
    </div>
  );
}
```

---

## Framework Integration Recipes

### Vue 3 (Composition API)

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const editorEl = ref<HTMLElement | null>(null);
let editor: MarkonEditor | null = null;
const doc = ref('| Column A | Column B |\n| --- | --- |\n| Cell 1 | Cell 2 |');

onMounted(() => {
  if (editorEl.value) {
    editor = new MarkonEditor({
      element: editorEl.value,
      content: doc.value,
      tables: true,
      onChange: (val) => {
        doc.value = val;
      },
    });
  }
});

onBeforeUnmount(() => {
  editor?.destroy();
});
</script>

<template>
  <div ref="editorEl" class="markon-editor-container" />
</template>
```

### Svelte 5

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { MarkonEditor } from '@nofinite/markon';
  import '@nofinite/nuicss/styles.css';

  let container: HTMLDivElement;
  let editor: MarkonEditor;
  let markdown = $state('| Task | Owner | Status |\n| --- | --- | --- |\n| Auth | Alice | Done |');

  onMount(() => {
    editor = new MarkonEditor({
      element: container,
      content: markdown,
      tables: true,
      onChange: (val) => { markdown = val; },
    });
    return () => editor.destroy();
  });
</script>

<div bind:this={container} class="markon-editor-container"></div>
```
