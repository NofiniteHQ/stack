# Framework-Agnostic Vanilla Core (`KanbanBoard`)

Under the hood, **Nofinite Kanban** is built upon a framework-agnostic, zero-React core class: `KanbanBoard`.

The vanilla core can be mounted directly into any standard DOM container in **Vanilla TypeScript**, **Vue**, **Svelte**, **Angular**, or multi-page legacy applications, while consuming identical **NUICSS** superclasses.

---

## Installation

```bash
npm install @nofinite/kanban @nofinite/nuicss
```

Import the unified stylesheet:

```ts
import '@nofinite/nuicss/styles.css';
```

---

## Quickstart

```ts
import { KanbanBoard, type KanbanColumn } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

// Target container element
const container = document.getElementById('kanban-root')!;

// Initial dataset
const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    wipLimit: 5,
    items: [
      {
        id: 'task-1',
        title: 'Implement Auth Tokens',
        badge: { label: 'Security', variant: 'danger' },
      },
      {
        id: 'task-2',
        title: 'Write Playwright Tests',
        badge: { label: 'QA', variant: 'success' },
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    wipLimit: 2,
    items: [{ id: 'task-3', title: 'Optimize Bundle Sizing' }],
  },
  {
    id: 'done',
    title: 'Done',
    items: [],
  },
];

// Mount the board
const board = new KanbanBoard({
  container: container,
  columns: initialColumns,
  enforceWipLimit: true,
  onCardMove: (event) => {
    console.log('Card moved:', event);
  },
  onCardClick: (event) => {
    console.log('Card clicked:', event.cardId);
  },
});
```

---

## Configuration Options (`KanbanBoardOptions`)

| Option            | Type                 | Default      | Description                                           |
| :---------------- | :------------------- | :----------- | :---------------------------------------------------- |
| `container`       | `HTMLElement`        | **Required** | The target DOM node where the board will render       |
| `columns`         | `KanbanColumn[]`     | **Required** | Array of columns and task items                       |
| `enforceWipLimit` | `boolean`            | `false`      | Hard block drops when column capacity is reached      |
| `canMoveCard`     | `(event) => boolean` | `undefined`  | Custom business logic validation function             |
| `allowAdd`        | `boolean`            | `true`       | Enables "+ Add card" button in column headers         |
| `allowAddColumn`  | `boolean`            | `false`      | Enables "+ Add Column" button at the end of the board |
| `headerActions`   | `boolean`            | `true`       | Shows contextual options menu in column headers       |
| `onCardMove`      | `(event) => void`    | `undefined`  | Fired when a card is dropped into a new position      |
| `onColumnMove`    | `(event) => void`    | `undefined`  | Fired when a column is dragged to reorder columns     |
| `onCardClick`     | `(event) => void`    | `undefined`  | Fired when an author clicks a card                    |
| `className`       | `string`             | `''`         | Custom class applied to root `.kanban-board` element  |

---

## Programmatic Instance API

The returned instance exposes methods for real-time manipulation:

```ts
// Add a card programmatically
board.addCard('todo', {
  id: 'task-4',
  title: 'Audit Web Vitals',
  badge: { label: 'Performance', variant: 'info' },
});

// Update an existing card
board.updateCard('todo', 'task-4', {
  title: 'Audit Core Web Vitals (LCP, INP, CLS)',
});

// Remove a card
board.removeCard('todo', 'task-4');

// Move card programmatically
board.moveCard({
  cardId: 'task-1',
  sourceColumnId: 'todo',
  targetColumnId: 'in-progress',
  sourceIndex: 0,
  targetIndex: 0,
});

// Apply filter query
board.setFilter({ filterQuery: 'Tokens' });

// Clean up all DOM nodes and event listeners
board.destroy();
```

---

## Integrating with Svelte & Vue

### Svelte 5 Example

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { KanbanBoard } from '@nofinite/kanban';
  import '@nofinite/nuicss/styles.css';

  let container: HTMLDivElement;
  let board: KanbanBoard;

  export let columns = [];

  onMount(() => {
    board = new KanbanBoard({
      container,
      columns,
      enforceWipLimit: true,
    });

    return () => {
      board.destroy();
    };
  });
</script>

<div bind:this={container} class="w-full h-full min-h-[500px]" />
```

### Vue 3 Composition API Example

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { KanbanBoard } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const containerRef = ref<HTMLElement | null>(null);
let board: KanbanBoard | null = null;

const props = defineProps<{ columns: any[] }>();

onMounted(() => {
  if (containerRef.value) {
    board = new KanbanBoard({
      container: containerRef.value,
      columns: props.columns,
    });
  }
});

onBeforeUnmount(() => {
  board?.destroy();
});
</script>

<template>
  <div ref="containerRef" class="w-full h-full min-h-[500px]" />
</template>
```
