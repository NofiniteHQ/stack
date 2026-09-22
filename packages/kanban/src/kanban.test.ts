// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import {
  reorderArray,
  moveCardBetweenColumns,
  reorderColumns,
  createKanbanBoard,
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
          { id: 'c1', content: 'Card 1' },
          { id: 'c2', content: 'Card 2' },
          { id: 'c3', content: 'Card 3' },
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
          { id: 'c1', content: 'Card 1' },
          { id: 'c2', content: 'Card 2' },
        ],
      },
      {
        id: 'col-2',
        title: 'Done',
        items: [{ id: 'c3', content: 'Card 3' }],
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

describe('@nofinite/kanban DOM binder', () => {
  it('creates and destroys board monitors cleanly', () => {
    const container = document.createElement('div');
    const board = createKanbanBoard({
      container,
      columns: [{ id: 'col-1', title: 'Col', items: [] }],
    });

    expect(board).toBeDefined();
    expect(typeof board.destroy).toBe('function');
    board.destroy();
  });
});
