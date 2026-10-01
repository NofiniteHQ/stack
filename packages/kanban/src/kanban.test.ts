// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import {
  reorderArray,
  moveCardBetweenColumns,
  reorderColumns,
  createKanbanBoard,
  createKanbanStore,
  renderKanbanHTML,
  type KanbanColumn,
} from './index';

describe('@nofinite/kanban reordering engine', () => {
  it('reorders array elements immutably', () => {
    const list = ['A', 'B', 'C', 'D'];
    const reordered = reorderArray(list, 0, 2);
    expect(reordered).toEqual(['B', 'C', 'A', 'D']);
    expect(list).toEqual(['A', 'B', 'C', 'D']); // Original array remains untouched
  });

  it('moves a card within the same column', () => {
    const columns: KanbanColumn[] = [
      {
        id: 'col-1',
        title: 'To Do',
        items: [
          { id: 'c1', title: 'Card 1' },
          { id: 'c2', title: 'Card 2' },
          { id: 'c3', title: 'Card 3' },
        ],
      },
    ];

    const result = moveCardBetweenColumns(columns, {
      cardId: 'c1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-1',
      sourceIndex: 0,
      targetIndex: 2,
    });

    expect(result[0].items.map((i) => i.id)).toEqual(['c2', 'c3', 'c1']);
  });

  it('moves a card across different columns', () => {
    const columns: KanbanColumn[] = [
      {
        id: 'col-1',
        title: 'To Do',
        items: [
          { id: 'c1', title: 'Card 1' },
          { id: 'c2', title: 'Card 2' },
        ],
      },
      {
        id: 'col-2',
        title: 'Done',
        items: [{ id: 'c3', title: 'Card 3' }],
      },
    ];

    const result = moveCardBetweenColumns(columns, {
      cardId: 'c1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-2',
      sourceIndex: 0,
      targetIndex: 0,
    });

    expect(result[0].items.map((i) => i.id)).toEqual(['c2']);
    expect(result[1].items.map((i) => i.id)).toEqual(['c1', 'c3']);
  });

  it('reorders columns correctly', () => {
    const columns: KanbanColumn[] = [
      { id: 'col-1', title: 'To Do', items: [] },
      { id: 'col-2', title: 'In Progress', items: [] },
      { id: 'col-3', title: 'Done', items: [] },
    ];

    const result = reorderColumns(columns, {
      columnId: 'col-1',
      sourceIndex: 0,
      targetIndex: 2,
    });

    expect(result.map((c) => c.id)).toEqual(['col-2', 'col-3', 'col-1']);
  });
});

describe('@nofinite/kanban reactive store', () => {
  it('manages columns and triggers subscribers on mutation', () => {
    const store = createKanbanStore([
      { id: 'c1', title: 'Col 1', items: [{ id: 't1', title: 'Task 1' }] },
    ]);

    let updateCount = 0;
    const unsub = store.subscribe(() => {
      updateCount++;
    });

    store.addCard('c1', { id: 't2', title: 'Task 2' });
    expect(store.getState()[0].items.length).toBe(2);
    expect(updateCount).toBe(1);

    store.updateCard('c1', 't2', { title: 'Updated Task 2' });
    expect(store.getState()[0].items[1].title).toBe('Updated Task 2');
    expect(updateCount).toBe(2);

    store.removeCard('c1', 't1');
    expect(store.getState()[0].items.length).toBe(1);
    expect(store.getState()[0].items[0].id).toBe('t2');
    expect(updateCount).toBe(3);

    unsub();
    store.addCard('c1', { id: 't3', title: 'Task 3' });
    expect(updateCount).toBe(3); // No further subscriber notifications after unsub
  });
});

describe('@nofinite/kanban DOM renderer and binder', () => {
  it('renders semantic HTML with cards, badges, and controls', () => {
    const html = renderKanbanHTML({
      columns: [
        {
          id: 'todo',
          title: 'To Do',
          items: [
            {
              id: 'task-1',
              title: 'Build Feature',
              description: 'Pragmatic DnD',
              badge: { label: 'P1', variant: 'primary' },
              dueDate: 'Oct 15',
              subtasks: { completed: 2, total: 5 },
              assignee: { name: 'Alice Doe', initials: 'AD' },
            },
          ],
        },
      ],
    });

    expect(html).toContain('kanban-board');
    expect(html).toContain('kanban-column');
    expect(html).toContain('To Do');
    expect(html).toContain('Build Feature');
    expect(html).toContain('badge-primary');
    expect(html).toContain('Oct 15');
    expect(html).toContain('2/5');
    expect(html).toContain('AD');
    expect(html).toContain('kanban-add-btn');
  });

  it('mounts to DOM, renders columns, and handles instance methods', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let cardMoved = false;
    let taskAdded = false;

    const board = createKanbanBoard({
      container,
      columns: [
        {
          id: 'col-1',
          title: 'To Do',
          items: [{ id: 'card-1', title: 'Task 1' }],
        },
        {
          id: 'col-2',
          title: 'Done',
          items: [],
        },
      ],
      onCardMove: () => {
        cardMoved = true;
      },
      onCardAdd: () => {
        taskAdded = true;
      },
    });

    // Check rendered DOM
    expect(container.querySelector('.kanban-board')).not.toBeNull();
    expect(container.querySelectorAll('.kanban-column').length).toBe(2);
    expect(container.querySelectorAll('.kanban-card').length).toBe(1);

    // Test instance methods
    board.addCard('col-2', { id: 'card-2', title: 'Task 2' });
    expect(board.getColumns()[1].items.length).toBe(1);
    expect(container.querySelectorAll('.kanban-card').length).toBe(2);

    board.moveCard({
      cardId: 'card-1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-2',
      sourceIndex: 0,
      targetIndex: 0,
    });
    expect(board.getColumns()[0].items.length).toBe(0);
    expect(board.getColumns()[1].items.length).toBe(2);

    // Test click on add task button
    const addBtn =
      container.querySelector<HTMLButtonElement>('.kanban-add-btn');
    if (addBtn) {
      addBtn.click();
      expect(taskAdded).toBe(true);
    }

    // Clean up
    board.destroy();
    expect(container.innerHTML).toBe('');
    container.remove();
  });
});
