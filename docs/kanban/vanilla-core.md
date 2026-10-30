# Framework-Agnostic Core (`createKanbanBoard`)

Under the hood, **Nofinite Kanban** is built upon a framework-agnostic, zero-React core: `createKanbanBoard`.

The vanilla core mounts directly into any standard DOM container in **Vanilla TypeScript**, **Vue 3**, **Svelte 5**, **SolidJS**, or **Angular**, while consuming identical **NUICSS** superclasses.

```ts
import {
  createKanbanBoard,
  type KanbanColumn,
  type KanbanItem,
  type KanbanBoardInstance,
} from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';
```

---

## 1. Quickstart (Vanilla TypeScript / DOM)

```ts
import { createKanbanBoard, type KanbanColumn } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('kanban-root')!;

const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    wipLimit: 5,
    items: [
      {
        id: 'task-1',
        title: 'Implement Auth Tokens',
        badge: { text: 'Security', variant: 'danger' },
      },
      {
        id: 'task-2',
        title: 'Write Playwright Tests',
        badge: { text: 'QA', variant: 'success' },
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

const board: KanbanBoardInstance = createKanbanBoard(container, {
  columns: initialColumns,
  enforceWipLimit: true,
  onCardMove: (event) => console.log('Card moved:', event),
  onColumnMove: (event) => console.log('Column moved:', event),
});

// Imperative controls:
// board.addCard('todo', { id: 'task-4', title: 'Deploy to Cloudflare' });
// board.setFilter({ query: 'Tokens' });
// board.destroy();
```

---

## 2. Vue 3 Composition API Integration

Integrate effortlessly into Vue 3 templates using a template `ref`:

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  createKanbanBoard,
  type KanbanBoardInstance,
  type KanbanColumn,
} from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const containerRef = ref<HTMLElement | null>(null);
let board: KanbanBoardInstance | null = null;

const props = defineProps<{ columns: KanbanColumn[] }>();
const emit = defineEmits(['change']);

onMounted(() => {
  if (containerRef.value) {
    board = createKanbanBoard(containerRef.value, {
      columns: props.columns,
      onCardMove: () => emit('change', board?.getColumns()),
      onColumnMove: () => emit('change', board?.getColumns()),
    });
  }
});

watch(
  () => props.columns,
  (newCols) => {
    board?.setColumns(newCols);
  },
  { deep: true }
);

onBeforeUnmount(() => {
  board?.destroy();
});
</script>

<template>
  <div ref="containerRef" class="w-full h-full min-h-[500px]" />
</template>
```

---

## 3. Svelte 5 Integration

Use standard Svelte `$effect` and action mounting:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createKanbanBoard, type KanbanBoardInstance, type KanbanColumn } from '@nofinite/kanban';
  import '@nofinite/nuicss/styles.css';

  let { columns = $bindable() }: { columns: KanbanColumn[] } = $props();
  let container: HTMLElement;
  let board: KanbanBoardInstance;

  onMount(() => {
    board = createKanbanBoard(container, {
      columns,
      onCardMove: () => {
        columns = board.getColumns();
      }
    });

    return () => board.destroy();
  });
</script>

<div bind:this={container} class="w-full h-full min-h-[550px]" />
```
