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
