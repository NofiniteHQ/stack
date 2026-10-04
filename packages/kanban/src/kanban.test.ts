// @vitest-environment happy-dom
import React, { createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { describe, it, expect } from 'vitest';
import {
  reorderArray,
  moveCardBetweenColumns,
  reorderColumns,
  createKanbanBoard,
  createKanbanStore,
  renderKanbanHTML,
  type KanbanColumn,
  Kanban,
  type KanbanHandle,
  matchCardFilter,
  hasActiveFilter,
  type KanbanFilterOptions,
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

  it('moves a card into an empty column accurately', () => {
    const columns: KanbanColumn[] = [
      {
        id: 'col-1',
        title: 'To Do',
        items: [{ id: 'card-1', title: 'Task 1' }],
      },
      {
        id: 'col-empty',
        title: 'Empty Column',
        items: [],
      },
    ];

    const result = moveCardBetweenColumns(columns, {
      cardId: 'card-1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-empty',
      sourceIndex: 0,
      targetIndex: 9999, // Drop on empty column appends
    });

    expect(result[0].items.length).toBe(0);
    expect(result[1].items.length).toBe(1);
    expect(result[1].items[0].id).toBe('card-1');
  });

  it('handles reorder edge insertions at head and tail', () => {
    const columns: KanbanColumn[] = [
      {
        id: 'col-1',
        title: 'Sprint',
        items: [
          { id: 'c1', title: 'Task 1' },
          { id: 'c2', title: 'Task 2' },
          { id: 'c3', title: 'Task 3' },
        ],
      },
    ];

    // Move c3 to top with edge: 'top'
    const movedToTop = moveCardBetweenColumns(columns, {
      cardId: 'c3',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-1',
      sourceIndex: 2,
      targetIndex: 0,
      edge: 'top',
    });
    expect(movedToTop[0].items.map((i) => i.id)).toEqual(['c3', 'c1', 'c2']);

    // Move c1 to bottom with edge: 'bottom'
    const movedToBottom = moveCardBetweenColumns(columns, {
      cardId: 'c1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-1',
      sourceIndex: 0,
      targetIndex: 2,
      edge: 'bottom',
    });
    expect(movedToBottom[0].items.map((i) => i.id)).toEqual(['c2', 'c3', 'c1']);
  });
});

describe('@nofinite/kanban keyboard accessibility & ARIA live announcer', () => {
  it('renders cards with accessible roles and attributes', () => {
    const html = renderKanbanHTML({
      columns: [
        {
          id: 'todo',
          title: 'To Do',
          items: [{ id: 'task-1', title: 'Accessible Task' }],
        },
      ],
    });

    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-roledescription="Kanban card"');
    expect(html).toContain('aria-label="Accessible Task, item 1 of 1"');
    expect(html).toContain('kanban-live-region');
  });

  it('moves cards across columns with Alt+ArrowRight and Alt+ArrowLeft via keyboard', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let movedEvent: any = null;
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
          items: [{ id: 'card-2', title: 'Task 2' }],
        },
      ],
      onCardMove: (e) => {
        movedEvent = e;
      },
    });

    const card1 = container.querySelector<HTMLElement>(
      '[data-item-id="card-1"]'
    )!;
    expect(card1).not.toBeNull();

    // Trigger Alt+ArrowRight on card1
    card1.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        altKey: true,
        bubbles: true,
      })
    );

    expect(movedEvent).not.toBeNull();
    expect(movedEvent.sourceColumnId).toBe('col-1');
    expect(movedEvent.targetColumnId).toBe('col-2');
    expect(board.getColumns()[0].items.length).toBe(0);
    expect(board.getColumns()[1].items.length).toBe(2);

    // Verify live region announcement
    const liveEl = container.querySelector('.kanban-live-region');
    expect(liveEl?.textContent).toContain(
      "Moved card 'Task 1' to column 'Done'"
    );

    // Trigger Alt+ArrowLeft on card1 in col-2 to move it back
    const card1Moved = container.querySelector<HTMLElement>(
      '[data-item-id="card-1"]'
    )!;
    card1Moved.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        altKey: true,
        bubbles: true,
      })
    );

    expect(board.getColumns()[0].items.length).toBe(1);
    expect(board.getColumns()[0].items[0].id).toBe('card-1');
    expect(board.getColumns()[1].items.length).toBe(1);

    board.destroy();
    container.remove();
  });

  it('reorders cards within a column with Alt+ArrowDown and Alt+ArrowUp', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const board = createKanbanBoard({
      container,
      columns: [
        {
          id: 'col-1',
          title: 'To Do',
          items: [
            { id: 'card-1', title: 'Task 1' },
            { id: 'card-2', title: 'Task 2' },
          ],
        },
      ],
    });

    const card1 = container.querySelector<HTMLElement>(
      '[data-item-id="card-1"]'
    )!;
    card1.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        altKey: true,
        bubbles: true,
      })
    );

    expect(board.getColumns()[0].items.map((c) => c.id)).toEqual([
      'card-2',
      'card-1',
    ]);

    const card1AtBottom = container.querySelector<HTMLElement>(
      '[data-item-id="card-1"]'
    )!;
    card1AtBottom.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        altKey: true,
        bubbles: true,
      })
    );

    expect(board.getColumns()[0].items.map((c) => c.id)).toEqual([
      'card-1',
      'card-2',
    ]);

    board.destroy();
    container.remove();
  });

  it('triggers onCardClick on Enter and Space keypress', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let clickedCardId: string | null = null;
    const board = createKanbanBoard({
      container,
      columns: [
        {
          id: 'col-1',
          title: 'To Do',
          items: [{ id: 'card-1', title: 'Task 1' }],
        },
      ],
      onCardClick: ({ cardId }) => {
        clickedCardId = cardId;
      },
    });

    const card1 = container.querySelector<HTMLElement>(
      '[data-item-id="card-1"]'
    )!;
    card1.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      })
    );
    expect(clickedCardId).toBe('card-1');

    clickedCardId = null;
    card1.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      })
    );
    expect(clickedCardId).toBe('card-1');

    board.destroy();
    container.remove();
  });
});

describe('@nofinite/kanban targeted DOM reconciliation & scroll preservation', () => {
  it('preserves existing card DOM node references across mutations', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

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
          title: 'In Progress',
          items: [{ id: 'card-2', title: 'Task 2' }],
        },
      ],
    });

    const card1El = container.querySelector<HTMLElement>(
      '[data-item-id="card-1"]'
    );
    const card2El = container.querySelector<HTMLElement>(
      '[data-item-id="card-2"]'
    );
    expect(card1El).not.toBeNull();
    expect(card2El).not.toBeNull();

    // Move card-1 to col-2
    board.moveCard({
      cardId: 'card-1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-2',
      sourceIndex: 0,
      targetIndex: 1,
    });

    // The DOM element reference must be strictly identical (not destroyed & recreated)
    const card1AfterMove = container.querySelector<HTMLElement>(
      '[data-item-id="card-1"]'
    );
    const card2AfterMove = container.querySelector<HTMLElement>(
      '[data-item-id="card-2"]'
    );
    expect(card1AfterMove).toBe(card1El);
    expect(card2AfterMove).toBe(card2El);

    // Verify parent column and attributes updated
    expect(card1AfterMove?.getAttribute('data-column-id')).toBe('col-2');
    expect(card1AfterMove?.parentElement?.getAttribute('data-column-id')).toBe(
      'col-2'
    );

    board.destroy();
    container.remove();
  });

  it('preserves scroll position in card lists across card mutations', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const board = createKanbanBoard({
      container,
      columns: [
        {
          id: 'col-1',
          title: 'Backlog',
          items: [
            { id: 'c1', title: '1' },
            { id: 'c2', title: '2' },
            { id: 'c3', title: '3' },
          ],
        },
      ],
    });

    const listEl = container.querySelector<HTMLElement>('.kanban-card-list')!;
    // Simulate scroll offset
    listEl.scrollTop = 120;

    // Add another card
    board.addCard('col-1', { id: 'c4', title: '4' });

    // Scroll position should be retained after mutation
    expect(listEl.scrollTop).toBe(120);

    board.destroy();
    container.remove();
  });

  it('dynamically toggles WIP limit badge in column header', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const board = createKanbanBoard({
      container,
      columns: [
        {
          id: 'col-1',
          title: 'WIP Column',
          wipLimit: 1,
          items: [{ id: 'c1', title: 'Card 1' }],
        },
      ],
    });

    // Initially at capacity (1 <= 1), no danger badge
    expect(container.querySelector('.badge-danger')).toBeNull();

    // Add a second card, exceeding capacity (2 > 1)
    board.addCard('col-1', { id: 'c2', title: 'Card 2' });
    const badge = container.querySelector<HTMLElement>('.badge-danger');
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toBe('Max 1');

    // Remove card to bring it back within capacity
    board.removeCard('col-1', 'c2');
    expect(container.querySelector('.badge-danger')).toBeNull();

    board.destroy();
    container.remove();
  });
});

describe('@nofinite/kanban Phase 4: Enforceable WIP limits & validation hooks', () => {
  const initialColumns: KanbanColumn[] = [
    {
      id: 'col-todo',
      title: 'To Do',
      items: [
        { id: 'c1', title: 'Task 1' },
        { id: 'c2', title: 'Task 2' },
      ],
    },
    {
      id: 'col-doing',
      title: 'In Progress',
      wipLimit: 2,
      items: [
        { id: 'c3', title: 'Task 3' },
        { id: 'c4', title: 'Task 4' },
      ],
    },
    {
      id: 'col-done',
      title: 'Done',
      wipLimit: 3,
      items: [{ id: 'c5', title: 'Task 5' }],
    },
  ];

  it('pure moveCardBetweenColumns blocks moves into over-capacity columns when enforceWipLimit is true', () => {
    // col-doing has 2 items and wipLimit is 2
    const resultBlocked = moveCardBetweenColumns(
      initialColumns,
      {
        cardId: 'c1',
        sourceColumnId: 'col-todo',
        targetColumnId: 'col-doing',
        sourceIndex: 0,
        targetIndex: 0,
      },
      { enforceWipLimit: true }
    );

    // Columns should remain unchanged
    expect(resultBlocked).toBe(initialColumns);
    expect(resultBlocked[0].items.length).toBe(2);
    expect(resultBlocked[1].items.length).toBe(2);

    // If enforceWipLimit is false/omitted, move is permitted
    const resultAllowed = moveCardBetweenColumns(initialColumns, {
      cardId: 'c1',
      sourceColumnId: 'col-todo',
      targetColumnId: 'col-doing',
      sourceIndex: 0,
      targetIndex: 0,
    });
    expect(resultAllowed[0].items.length).toBe(1);
    expect(resultAllowed[1].items.length).toBe(3);
  });

  it('allows moving into target column that has remaining capacity under WIP limit', () => {
    // col-done has 1 item and wipLimit is 3 -> capacity available
    const result = moveCardBetweenColumns(
      initialColumns,
      {
        cardId: 'c1',
        sourceColumnId: 'col-todo',
        targetColumnId: 'col-done',
        sourceIndex: 0,
        targetIndex: 1,
      },
      { enforceWipLimit: true }
    );

    expect(result[0].items.length).toBe(1);
    expect(result[2].items.length).toBe(2);
    expect(result[2].items.map((i) => i.id)).toContain('c1');
  });

  it('allows intra-column reordering within a column at WIP capacity', () => {
    // col-doing is at capacity (2/2), but reordering inside col-doing does not increase its count
    const result = moveCardBetweenColumns(
      initialColumns,
      {
        cardId: 'c3',
        sourceColumnId: 'col-doing',
        targetColumnId: 'col-doing',
        sourceIndex: 0,
        targetIndex: 1,
      },
      { enforceWipLimit: true }
    );

    expect(result[1].items.length).toBe(2);
    expect(result[1].items[0].id).toBe('c4');
    expect(result[1].items[1].id).toBe('c3');
  });

  it('blocks moves when custom canMoveCard returns false', () => {
    // Only allow moves for card 'c1', reject everything else
    const canMoveCard = (e: { cardId: string }) => e.cardId === 'c1';

    const blocked = moveCardBetweenColumns(
      initialColumns,
      {
        cardId: 'c2',
        sourceColumnId: 'col-todo',
        targetColumnId: 'col-done',
        sourceIndex: 1,
        targetIndex: 0,
      },
      { canMoveCard }
    );
    expect(blocked).toBe(initialColumns);

    const allowed = moveCardBetweenColumns(
      initialColumns,
      {
        cardId: 'c1',
        sourceColumnId: 'col-todo',
        targetColumnId: 'col-done',
        sourceIndex: 0,
        targetIndex: 0,
      },
      { canMoveCard }
    );
    expect(allowed[2].items.map((i) => i.id)).toContain('c1');
  });

  it('createKanbanStore enforces WIP limit on moveCard and addCard', () => {
    const store = createKanbanStore(initialColumns, { enforceWipLimit: true });

    // Attempt moving into full column (col-doing at 2/2)
    const success = store.moveCard({
      cardId: 'c1',
      sourceColumnId: 'col-todo',
      targetColumnId: 'col-doing',
      sourceIndex: 0,
      targetIndex: 0,
    });
    expect(success).toBe(false);
    expect(store.getState()[1].items.length).toBe(2);

    // Attempt addCard into full column
    store.addCard('col-doing', { id: 'c-new', title: 'Overflow' });
    expect(store.getState()[1].items.length).toBe(2);

    // Move into column with capacity (col-done at 1/3)
    const moveSuccess = store.moveCard({
      cardId: 'c1',
      sourceColumnId: 'col-todo',
      targetColumnId: 'col-done',
      sourceIndex: 0,
      targetIndex: 0,
    });
    expect(moveSuccess).toBe(true);
    expect(store.getState()[2].items.length).toBe(2);
  });

  it('createKanbanBoard blocks keyboard moves and announces WIP limit refusal', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const board = createKanbanBoard({
      container,
      columns: initialColumns,
      enforceWipLimit: true,
    });

    const liveRegion = container.querySelector<HTMLElement>(
      '.kanban-live-region'
    )!;
    const c1Card = container.querySelector<HTMLElement>('[data-item-id="c1"]')!;

    // Alt + ArrowRight from col-todo (idx 0) to col-doing (idx 1, full at 2/2)
    c1Card.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        altKey: true,
        bubbles: true,
      })
    );

    // Announcement must reflect WIP limit block
    expect(liveRegion.textContent).toBe(
      'Cannot move card: column "In Progress" has reached its limit of 2 cards.'
    );

    // Card c1 must still be in col-todo
    expect(c1Card.getAttribute('data-column-id')).toBe('col-todo');

    board.destroy();
    container.remove();
  });

  it('createKanbanBoard blocks keyboard moves when canMoveCard returns false', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const board = createKanbanBoard({
      container,
      columns: initialColumns,
      canMoveCard: () => false, // reject all moves
    });

    const liveRegion = container.querySelector<HTMLElement>(
      '.kanban-live-region'
    )!;
    const c1Card = container.querySelector<HTMLElement>('[data-item-id="c1"]')!;

    // Attempt Alt + ArrowDown within column
    c1Card.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        altKey: true,
        bubbles: true,
      })
    );

    expect(liveRegion.textContent).toBe(
      'Cannot move card: move is not permitted.'
    );

    board.destroy();
    container.remove();
  });
});

describe('@nofinite/kanban Phase 5: Column management, imperative APIs & React forwardRef', () => {
  it('KanbanStore imperatively manages columns and updates cards', () => {
    const store = createKanbanStore([
      { id: 'c1', title: 'To Do', items: [{ id: 't1', title: 'Task 1' }] },
    ]);

    // addColumn
    store.addColumn({ id: 'c2', title: 'Done', items: [] });
    expect(store.getState().length).toBe(2);
    expect(store.getState()[1].id).toBe('c2');

    // updateCard
    store.updateCard('c1', 't1', { title: 'Task 1 Updated', isOverdue: true });
    expect(store.getState()[0].items[0].title).toBe('Task 1 Updated');
    expect(store.getState()[0].items[0].isOverdue).toBe(true);

    // clearColumn
    store.clearColumn('c1');
    expect(store.getState()[0].items.length).toBe(0);

    // removeColumn
    store.removeColumn('c2');
    expect(store.getState().length).toBe(1);
    expect(store.getState()[0].id).toBe('c1');
  });

  it('createKanbanBoard renders Add Column button and handles click events', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let addColumnCalled = false;
    let customEventFired = false;

    container.addEventListener('kanban:column-add', () => {
      customEventFired = true;
    });

    const board = createKanbanBoard({
      container,
      columns: [{ id: 'c1', title: 'To Do', items: [] }],
      allowAddColumn: true,
      addColumnLabel: '+ Create New List',
      onColumnAdd: () => {
        addColumnCalled = true;
      },
    });

    const addColBtn = container.querySelector<HTMLButtonElement>(
      '.kanban-add-column-btn'
    );
    expect(addColBtn).not.toBeNull();
    expect(addColBtn?.textContent).toContain('+ Create New List');

    addColBtn?.click();
    expect(addColumnCalled).toBe(true);
    expect(customEventFired).toBe(true);

    board.destroy();
    container.remove();
  });

  it('createKanbanBoard exposes imperative methods and dynamically updates DOM', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const board = createKanbanBoard({
      container,
      columns: [
        { id: 'c1', title: 'Col 1', items: [{ id: 't1', title: 'Card 1' }] },
      ],
    });

    // addColumn
    board.addColumn({ id: 'c2', title: 'Col 2', items: [] });
    expect(board.getColumns().length).toBe(2);
    expect(container.querySelectorAll('.kanban-column').length).toBe(2);

    // updateCard
    board.updateCard('c1', 't1', { title: 'Card 1 Renamed' });
    const cardTitleEl = container.querySelector('.kanban-card-title');
    expect(cardTitleEl?.textContent).toBe('Card 1 Renamed');

    // clearColumn
    board.clearColumn('c1');
    expect(board.getColumns()[0].items.length).toBe(0);
    const placeholder = container.querySelector('.kanban-empty-placeholder');
    expect(placeholder).not.toBeNull();

    // removeColumn
    board.removeColumn('c2');
    expect(board.getColumns().length).toBe(1);
    expect(container.querySelectorAll('.kanban-column').length).toBe(1);

    board.destroy();
    container.remove();
  });

  it('React <Kanban> forwardRef exposes imperative handle methods and column options popover', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const ref = createRef<KanbanHandle>();
    let colClearCalled = false;
    let colAddCalled = false;

    flushSync(() => {
      root.render(
        React.createElement(Kanban, {
          ref,
          columns: [
            {
              id: 'c1',
              title: 'Backlog',
              items: [{ id: 'k1', title: 'Card K1' }],
            },
          ],
          allowAddColumn: true,
          onColumnClear: () => {
            colClearCalled = true;
          },
          onColumnAdd: () => {
            colAddCalled = true;
          },
        })
      );
    });

    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.getColumns).toBe('function');
    expect(typeof ref.current?.addCard).toBe('function');
    expect(typeof ref.current?.updateCard).toBe('function');
    expect(typeof ref.current?.clearColumn).toBe('function');
    expect(typeof ref.current?.addColumn).toBe('function');

    // Verify Add Column button exists and works
    const addColBtn = container.querySelector<HTMLButtonElement>(
      '.kanban-add-column-btn'
    );
    expect(addColBtn).not.toBeNull();
    addColBtn?.click();
    expect(colAddCalled).toBe(true);

    // Imperatively add card via ref
    flushSync(() => {
      ref.current?.addCard('c1', { id: 'k2', title: 'Imperative Card' });
    });
    expect(ref.current?.getColumns()[0].items.length).toBe(2);

    // Imperatively update card via ref
    flushSync(() => {
      ref.current?.updateCard('c1', 'k2', { title: 'Updated Imperative Card' });
    });
    expect(ref.current?.getColumns()[0].items[1].title).toBe(
      'Updated Imperative Card'
    );

    // Imperatively clear column via ref
    flushSync(() => {
      ref.current?.clearColumn('c1');
    });
    expect(ref.current?.getColumns()[0].items.length).toBe(0);
    expect(colClearCalled).toBe(true);

    // Imperatively add column via ref
    flushSync(() => {
      ref.current?.addColumn({ id: 'c2', title: 'In Progress', items: [] });
    });
    expect(ref.current?.getColumns().length).toBe(2);

    // Imperatively remove column via ref
    flushSync(() => {
      ref.current?.removeColumn('c2');
    });
    expect(ref.current?.getColumns().length).toBe(1);

    flushSync(() => {
      root.unmount();
    });
    container.remove();
  });
});

describe('@nofinite/kanban Phase 6: Search & Filter Suite', () => {
  const sampleColumn: KanbanColumn = {
    id: 'col-dev',
    title: 'In Development',
    items: [
      {
        id: 't1',
        title: 'Implement AES-GCM Key Vault',
        description: 'Hardware key isolation and cryptographic validation.',
        badge: { label: 'Security', variant: 'primary' },
        assignee: { name: 'Elena Rostova', initials: 'ER' },
      },
      {
        id: 't2',
        title: 'Optimize WebGL OKLCH Shaders',
        description: 'SIMD batching for ultra-fast canvas renders.',
        badge: { label: 'Performance', variant: 'warning' },
        assignee: { name: 'Sophia Miller', initials: 'SM' },
      },
      {
        id: 't3',
        title: 'E2E Cypress Test Suite',
        description: 'Full integration tests for task board drag operations.',
        badge: { label: 'QA', variant: 'info' },
        assignee: { name: 'Marcus Chen', initials: 'MC' },
      },
    ],
  };

  it('matchCardFilter accurately matches text queries, assignees, badges, and custom predicates', () => {
    // 1. Title search (case-insensitive)
    expect(
      matchCardFilter(sampleColumn.items[0], sampleColumn, {
        filterQuery: 'aes-gcm',
      })
    ).toBe(true);
    expect(
      matchCardFilter(sampleColumn.items[1], sampleColumn, {
        filterQuery: 'aes-gcm',
      })
    ).toBe(false);

    // 2. Description search
    expect(
      matchCardFilter(sampleColumn.items[1], sampleColumn, {
        filterQuery: 'simd batching',
      })
    ).toBe(true);

    // 3. Assignee search (by name or initials)
    expect(
      matchCardFilter(sampleColumn.items[0], sampleColumn, {
        filterAssignee: 'elena',
      })
    ).toBe(true);
    expect(
      matchCardFilter(sampleColumn.items[0], sampleColumn, {
        filterAssignee: 'er',
      })
    ).toBe(true);
    expect(
      matchCardFilter(sampleColumn.items[1], sampleColumn, {
        filterAssignee: 'elena',
      })
    ).toBe(false);

    // 4. Badge search
    expect(
      matchCardFilter(sampleColumn.items[0], sampleColumn, {
        filterBadge: 'security',
      })
    ).toBe(true);
    expect(
      matchCardFilter(sampleColumn.items[1], sampleColumn, {
        filterBadge: 'security',
      })
    ).toBe(false);

    // 5. Custom predicate
    expect(
      matchCardFilter(sampleColumn.items[0], sampleColumn, {
        filterCard: (item) => item.id === 't1',
      })
    ).toBe(true);
    expect(
      matchCardFilter(sampleColumn.items[1], sampleColumn, {
        filterCard: (item) => item.id === 't1',
      })
    ).toBe(false);

    // 6. hasActiveFilter helper
    expect(hasActiveFilter(undefined)).toBe(false);
    expect(hasActiveFilter({})).toBe(false);
    expect(hasActiveFilter({ filterQuery: '  ' })).toBe(false);
    expect(hasActiveFilter({ filterQuery: 'vault' })).toBe(true);
    expect(hasActiveFilter({ filterAssignee: 'sophia' })).toBe(true);
    expect(hasActiveFilter({ filterBadge: 'qa' })).toBe(true);
  });

  it('renderKanbanHTML applies filters, updates counter badges and empty placeholders', () => {
    const htmlFiltered = renderKanbanHTML({
      columns: [sampleColumn],
      filterQuery: 'Shaders',
    });

    expect(htmlFiltered).toContain('Optimize WebGL OKLCH Shaders');
    expect(htmlFiltered).not.toContain('Implement AES-GCM Key Vault');
    expect(htmlFiltered).toContain('1/3'); // Filtered badge count

    const htmlNoMatch = renderKanbanHTML({
      columns: [sampleColumn],
      filterQuery: 'NonExistentKeywordXYZ',
    });

    expect(htmlNoMatch).toContain('No matching cards');
    expect(htmlNoMatch).toContain('0/3');
  });

  it('createKanbanBoard dynamically toggles card visibility and badge counts via setFilter', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const board = createKanbanBoard({
      container,
      columns: [sampleColumn],
    });

    const badgeEl = container.querySelector<HTMLElement>(
      '.kanban-column-header .badge-subtle'
    );
    expect(badgeEl?.textContent?.trim()).toBe('3');

    // Apply filterQuery
    board.setFilter!({ filterQuery: 'Shaders' });
    expect(badgeEl?.textContent).toBe('1/3');

    const t1El = container.querySelector<HTMLElement>('[data-item-id="t1"]');
    const t2El = container.querySelector<HTMLElement>('[data-item-id="t2"]');
    expect(t1El?.style.display).toBe('none');
    expect(t2El?.style.display).toBe('');

    // Apply filterAssignee
    board.setFilter!({ filterAssignee: 'Elena' });
    expect(badgeEl?.textContent).toBe('1/3');
    expect(t1El?.style.display).toBe('');
    expect(t2El?.style.display).toBe('none');

    // Filter resulting in 0 matches shows "No matching cards"
    board.setFilter!({ filterQuery: 'UnknownNonMatchingText' });
    expect(badgeEl?.textContent).toBe('0/3');
    const placeholder = container.querySelector<HTMLElement>(
      '.kanban-empty-placeholder'
    );
    expect(placeholder?.textContent).toBe('No matching cards');

    // Clear filter
    board.setFilter!({});
    expect(badgeEl?.textContent).toBe('3');
    expect(t1El?.style.display).toBe('');
    expect(t2El?.style.display).toBe('');
    expect(container.querySelector('.kanban-empty-placeholder')).toBeNull();

    board.destroy();
    container.remove();
  });

  it('React <Kanban> filters cards via props and imperative ref setFilter', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const ref = createRef<KanbanHandle>();

    flushSync(() => {
      root.render(
        React.createElement(Kanban, {
          ref,
          columns: [sampleColumn],
          filterQuery: 'AES-GCM',
        })
      );
    });

    const badgeEl = container.querySelector<HTMLElement>(
      '.kanban-column-header .badge-subtle'
    );
    expect(badgeEl?.textContent).toBe('1/3');
    expect(container.textContent).toContain('Implement AES-GCM Key Vault');
    expect(container.textContent).not.toContain('Optimize WebGL OKLCH Shaders');

    // Imperative setFilter via ref
    flushSync(() => {
      ref.current?.setFilter?.({ filterBadge: 'Performance' });
    });

    expect(badgeEl?.textContent).toBe('1/3');
    expect(container.textContent).toContain('Optimize WebGL OKLCH Shaders');
    expect(container.textContent).not.toContain('Implement AES-GCM Key Vault');

    // Reset filter via ref
    flushSync(() => {
      ref.current?.setFilter?.({});
    });

    expect(badgeEl?.textContent).toBe('3');
    expect(container.textContent).toContain('Implement AES-GCM Key Vault');
    expect(container.textContent).toContain('Optimize WebGL OKLCH Shaders');
    expect(container.textContent).toContain('E2E Cypress Test Suite');

    flushSync(() => {
      root.unmount();
    });
    container.remove();
  });
});
