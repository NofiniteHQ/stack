import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type {
  KanbanColumn,
  KanbanItem,
  CardMoveEvent,
  ColumnMoveEvent,
  KanbanBoardOptions,
  KanbanBoardInstance,
} from './types';
import { createKanbanStore } from './store';

/**
 * Escapes unsafe HTML characters to prevent XSS.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates semantic HTML markup for a Kanban board using @nofinite/nuicss tokens and superclasses.
 */
export function renderKanbanHTML(options: {
  columns: KanbanColumn[];
  allowAdd?: boolean;
  headerActions?: boolean;
  className?: string;
  columnClassName?: string;
}): string {
  const columns = options.columns || [];
  const globalAllowAdd = options.allowAdd !== false;
  const globalHeaderActions = options.headerActions !== false;

  const columnsHtml = columns
    .map((col, colIndex) => {
      const showAdd = col.allowAdd ?? globalAllowAdd;
      const showOptions = col.headerActions ?? globalHeaderActions;

      const cardsHtml = col.items
        .map((item, itemIndex) => {
          const assigneeInitials =
            item.assignee?.initials ||
            (item.assignee?.name
              ? item.assignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              : '');

          const hasFooter = item.dueDate || item.subtasks || item.assignee;

          const titleContent = item.title
            ? `<div class="kanban-card-title font-semibold text-sm leading-snug text-default group-hover:text-primary transition-colors break-words">${escapeHtml(
                item.title
              )}</div>`
            : item.content != null
            ? String(item.content)
            : '';

          return `
            <div class="kanban-card p-3.5 rounded-xl border border-default bg-surface text-default shadow-xs cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md transition-all select-none group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                 role="button"
                 tabindex="0"
                 aria-roledescription="Kanban card"
                 aria-label="${escapeHtml(item.title || 'Kanban card')}, item ${
            itemIndex + 1
          } of ${col.items.length}"
                 data-item-id="${escapeHtml(item.id)}"
                 data-column-id="${escapeHtml(col.id)}"
                 data-column-index="${colIndex}"
                 data-index="${itemIndex}">
              ${
                item.badge
                  ? `
                <div class="mb-2">
                  <span class="badge ${
                    item.badge.variant
                      ? `badge-${escapeHtml(item.badge.variant)}`
                      : 'badge-primary'
                  } px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ${escapeHtml(item.badge.label)}
                  </span>
                </div>
              `
                  : ''
              }
              ${titleContent}
              ${
                item.description
                  ? `<div class="kanban-card-desc text-xs text-muted mt-1 leading-relaxed line-clamp-2">${escapeHtml(
                      item.description
                    )}</div>`
                  : ''
              }

              ${
                hasFooter
                  ? `
                <div class="kanban-card-footer flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-default/40 text-xs text-muted">
                  <div class="kanban-card-meta flex items-center gap-2.5">
                    ${
                      item.dueDate
                        ? `
                      <span class="kanban-meta-item flex items-center gap-1 text-[11px] font-medium ${
                        item.isOverdue
                          ? 'kanban-meta-overdue text-danger font-semibold'
                          : ''
                      }">
                        <svg class="kanban-meta-icon w-3.5 h-3.5 text-muted shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${escapeHtml(item.dueDate)}</span>
                      </span>
                    `
                        : ''
                    }
                    ${
                      item.subtasks
                        ? `
                      <span class="kanban-meta-item flex items-center gap-1 text-[11px] font-medium">
                        <svg class="kanban-meta-icon w-3.5 h-3.5 text-muted shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>${item.subtasks.completed}/${item.subtasks.total}</span>
                      </span>
                    `
                        : ''
                    }
                  </div>
                  ${
                    item.assignee
                      ? `
                    <div class="kanban-card-assignee shrink-0" title="${escapeHtml(
                      item.assignee.name
                    )}">
                      ${
                        item.assignee.avatar
                          ? `<img src="${escapeHtml(
                              item.assignee.avatar
                            )}" alt="${escapeHtml(
                              item.assignee.name
                            )}" class="w-5 h-5 rounded-full object-cover border border-default" />`
                          : `<div class="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/30">${escapeHtml(
                              assigneeInitials
                            )}</div>`
                      }
                    </div>
                  `
                      : ''
                  }
                </div>
              `
                  : ''
              }
            </div>
          `;
        })
        .join('');

      return `
        <div class="kanban-column flex flex-col shrink-0 w-80 rounded-2xl border border-default bg-surface font-sans p-3 shadow-xs max-h-[85vh] transition-all relative ${
          options.columnClassName || ''
        }"
             data-column-id="${escapeHtml(col.id)}"
             data-column-index="${colIndex}">
          <!-- Column Header -->
          <div class="kanban-column-header flex items-center justify-between pb-3 px-1 border-b border-default select-none cursor-grab active:cursor-grabbing"
               data-column-handle="${escapeHtml(col.id)}">
            <div class="flex items-center gap-2 min-w-0">
              <span class="font-bold text-sm text-default tracking-tight truncate">${escapeHtml(
                col.title
              )}</span>
              <span class="badge badge-subtle px-1.5 py-0.5 rounded-full text-[11px] font-mono font-semibold text-muted bg-surface border border-default">
                ${col.items.length}
              </span>
              ${
                col.wipLimit != null && col.items.length > col.wipLimit
                  ? `<span class="badge badge-danger text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">Max ${col.wipLimit}</span>`
                  : ''
              }
            </div>
            ${
              showOptions
                ? `
              <button type="button" class="kanban-column-options btn btn-ghost btn-xs btn-icon text-muted hover:text-default"
                      data-column-id="${escapeHtml(
                        col.id
                      )}" title="Column options">
                <svg class="kanban-icon w-4 h-4 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            `
                : ''
            }
          </div>

          <!-- Droppable Card List -->
          <div class="kanban-card-list flex-1 space-y-2.5 pt-3 min-h-[140px] overflow-y-auto" data-column-id="${escapeHtml(
            col.id
          )}">
            ${
              cardsHtml ||
              `
              <div class="kanban-empty-placeholder h-24 border border-dashed border-default/60 rounded-xl flex items-center justify-center text-xs text-muted/60 select-none pointer-events-none">
                No cards
              </div>
            `
            }
          </div>

          <!-- Column Footer: Add Task -->
          ${
            showAdd
              ? `
            <div class="pt-2 border-t border-default/50 mt-1">
              <button type="button" class="kanban-add-btn flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-default hover:bg-subtle transition-colors group"
                      data-column-id="${escapeHtml(col.id)}">
                <svg class="kanban-icon w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>New Task</span>
              </button>
            </div>
          `
              : ''
          }
        </div>
      `;
    })
    .join('');

  return `
    <div class="kanban kanban-board flex items-start gap-4 overflow-x-auto pb-4 pt-1 font-sans select-none min-h-[400px] ${
      options.className || ''
    }">
      <div class="sr-only kanban-live-region" aria-live="polite" aria-atomic="true"></div>
      ${columnsHtml}
    </div>
  `.trim();
}

export function bindCardDraggable(
  element: HTMLElement,
  cardId: string,
  columnId: string,
  index: number
): () => void {
  return draggable({
    element,
    getInitialData: () => ({ type: 'card', cardId, columnId, index }),
    onDragStart: () => {
      element.classList.add('opacity-40', 'scale-95');
    },
    onDrop: () => {
      element.classList.remove('opacity-40', 'scale-95');
    },
  });
}

export function bindCardDropTarget(
  element: HTMLElement,
  cardId: string,
  columnId: string,
  index: number,
  onDrop?: (event: CardMoveEvent) => void
): () => void {
  function clearIndicators() {
    element.classList.remove(
      'kanban-card-drop-top',
      'kanban-card-drop-bottom',
      'border-t-2',
      'border-b-2',
      'border-t-primary',
      'border-b-primary'
    );
  }

  return dropTargetForElements({
    element,
    canDrop: ({ source }) => source.data.type === 'card',
    getData: ({ input, element }) => {
      const data = { type: 'card', cardId, columnId, index };
      return attachClosestEdge(data, {
        input,
        element,
        allowedEdges: ['top', 'bottom'],
      });
    },
    onDragEnter: (args) => {
      const edge = extractClosestEdge(args.self.data);
      clearIndicators();
      if (edge === 'top') {
        element.classList.add(
          'kanban-card-drop-top',
          'border-t-2',
          'border-t-primary'
        );
      } else if (edge === 'bottom') {
        element.classList.add(
          'kanban-card-drop-bottom',
          'border-b-2',
          'border-b-primary'
        );
      }
    },
    onDrag: (args) => {
      const edge = extractClosestEdge(args.self.data);
      clearIndicators();
      if (edge === 'top') {
        element.classList.add(
          'kanban-card-drop-top',
          'border-t-2',
          'border-t-primary'
        );
      } else if (edge === 'bottom') {
        element.classList.add(
          'kanban-card-drop-bottom',
          'border-b-2',
          'border-b-primary'
        );
      }
    },
    onDragLeave: () => {
      clearIndicators();
    },
    onDrop: ({ source, location, self }) => {
      clearIndicators();
      // Ensure innermost target handles the drop
      if (
        location.current.dropTargets[0]?.element === element &&
        source.data.type === 'card'
      ) {
        const edge = extractClosestEdge(self.data);
        onDrop?.({
          cardId: source.data.cardId as string,
          sourceColumnId: source.data.columnId as string,
          targetColumnId: columnId,
          sourceIndex: source.data.index as number,
          targetIndex: index,
          edge,
        });
      }
    },
  });
}

export function bindColumnDropTarget(
  element: HTMLElement,
  columnId: string,
  columnIndex: number,
  onCardDrop?: (event: CardMoveEvent) => void,
  onColumnDrop?: (event: ColumnMoveEvent) => void
): () => void {
  function clearColumnIndicators() {
    element.classList.remove(
      'kanban-col-drop-left',
      'kanban-col-drop-right',
      'border-l-2',
      'border-r-2',
      'border-l-primary',
      'border-r-primary',
      'border-primary/40'
    );
  }

  return dropTargetForElements({
    element,
    getData: ({ input, element }) => {
      const data = { type: 'column', columnId, columnIndex };
      return attachClosestEdge(data, {
        input,
        element,
        allowedEdges: ['left', 'right'],
      });
    },
    onDragEnter: (args) => {
      if (args.source.data.type === 'column') {
        const edge = extractClosestEdge(args.self.data);
        clearColumnIndicators();
        if (edge === 'left') {
          element.classList.add(
            'kanban-col-drop-left',
            'border-l-2',
            'border-l-primary'
          );
        } else if (edge === 'right') {
          element.classList.add(
            'kanban-col-drop-right',
            'border-r-2',
            'border-r-primary'
          );
        }
      } else if (args.source.data.type === 'card') {
        element.classList.add('border-primary/40');
      }
    },
    onDrag: (args) => {
      if (args.source.data.type === 'column') {
        const edge = extractClosestEdge(args.self.data);
        clearColumnIndicators();
        if (edge === 'left') {
          element.classList.add(
            'kanban-col-drop-left',
            'border-l-2',
            'border-l-primary'
          );
        } else if (edge === 'right') {
          element.classList.add(
            'kanban-col-drop-right',
            'border-r-2',
            'border-r-primary'
          );
        }
      }
    },
    onDragLeave: () => {
      clearColumnIndicators();
    },
    onDrop: ({ source, location, self }) => {
      clearColumnIndicators();
      const innerTarget = location.current.dropTargets[0];

      if (source.data.type === 'card') {
        // Only append to end if dropped onto the column container / empty space (NOT an individual card)
        if (
          innerTarget?.element === element ||
          innerTarget?.data.type === 'column' ||
          innerTarget?.element.classList.contains('kanban-card-list') ||
          innerTarget?.element.classList.contains('kanban-empty-placeholder')
        ) {
          onCardDrop?.({
            cardId: source.data.cardId as string,
            sourceColumnId: source.data.columnId as string,
            targetColumnId: columnId,
            sourceIndex: source.data.index as number,
            targetIndex: 9999,
          });
        }
      } else if (source.data.type === 'column') {
        const sourceIndex = source.data.columnIndex as number;
        const edge = extractClosestEdge(self.data);
        if (sourceIndex !== columnIndex || edge != null) {
          onColumnDrop?.({
            columnId: source.data.columnId as string,
            sourceIndex,
            targetIndex: columnIndex,
            edge,
          });
        }
      }
    },
  });
}

/**
 * Creates and attaches a fully interactive, framework-agnostic Kanban board to a DOM container.
 */
export function createKanbanBoard(
  options: KanbanBoardOptions
): KanbanBoardInstance {
  const container = options.container;
  const store = createKanbanStore(options.columns);
  let cleanups: (() => void)[] = [];

  function setupDOM(columns: KanbanColumn[]) {
    // Clear previous DnD listeners
    cleanups.forEach((c) => c());
    cleanups = [];

    // Render HTML into container
    container.innerHTML = renderKanbanHTML({
      columns,
      allowAdd: options.allowAdd,
      headerActions: options.headerActions,
      className: options.className,
      columnClassName: options.columnClassName,
    });

    const boardEl = container.querySelector('.kanban-board') as HTMLElement;
    if (!boardEl) return;

    // Bind Column Elements
    const colElements = Array.from(
      boardEl.querySelectorAll<HTMLElement>('.kanban-column')
    );

    colElements.forEach((colEl) => {
      const colId = colEl.getAttribute('data-column-id') || '';
      const colIdx = parseInt(
        colEl.getAttribute('data-column-index') || '0',
        10
      );

      // 1. Column drag handle
      const headerHandle = colEl.querySelector<HTMLElement>(
        '[data-column-handle]'
      );
      if (headerHandle) {
        const colDragCleanup = draggable({
          element: headerHandle,
          getInitialData: () => ({
            type: 'column',
            columnId: colId,
            columnIndex: colIdx,
          }),
          onDragStart: () => colEl.classList.add('opacity-40', 'scale-95'),
          onDrop: () => colEl.classList.remove('opacity-40', 'scale-95'),
        });
        cleanups.push(colDragCleanup);
      }

      // 2. Column drop target
      const colDropCleanup = bindColumnDropTarget(
        colEl,
        colId,
        colIdx,
        (cardEvent) => handleCardMove(cardEvent),
        (colEvent) => handleColumnMove(colEvent)
      );
      cleanups.push(colDropCleanup);

      // 3. Card list drop target
      const cardListEl = colEl.querySelector<HTMLElement>('.kanban-card-list');
      if (cardListEl) {
        const listDropCleanup = dropTargetForElements({
          element: cardListEl,
          getData: () => ({
            type: 'column',
            columnId: colId,
            columnIndex: colIdx,
          }),
          onDrop: ({ source, location }) => {
            const inner = location.current.dropTargets[0];
            if (inner?.element === cardListEl && source.data.type === 'card') {
              handleCardMove({
                cardId: source.data.cardId as string,
                sourceColumnId: source.data.columnId as string,
                targetColumnId: colId,
                sourceIndex: source.data.index as number,
                targetIndex: 9999,
              });
            }
          },
        });
        cleanups.push(listDropCleanup);
      }

      // 4. Bind Card Elements
      const cardElements = Array.from(
        colEl.querySelectorAll<HTMLElement>('.kanban-card')
      );

      cardElements.forEach((cardEl) => {
        const cardId = cardEl.getAttribute('data-item-id') || '';
        const itemIdx = parseInt(cardEl.getAttribute('data-index') || '0', 10);

        const cardDragCleanup = bindCardDraggable(
          cardEl,
          cardId,
          colId,
          itemIdx
        );
        const cardDropCleanup = bindCardDropTarget(
          cardEl,
          cardId,
          colId,
          itemIdx,
          (event) => handleCardMove(event)
        );

        cleanups.push(cardDragCleanup);
        cleanups.push(cardDropCleanup);
      });
    });
  }

  function handleCardMove(event: CardMoveEvent) {
    store.moveCard(event);
    options.onCardMove?.(event);
    container.dispatchEvent(
      new CustomEvent('kanban:card-move', {
        detail: event,
        bubbles: true,
      })
    );
  }

  function handleColumnMove(event: ColumnMoveEvent) {
    store.moveColumn(event);
    options.onColumnMove?.(event);
    container.dispatchEvent(
      new CustomEvent('kanban:column-move', {
        detail: event,
        bubbles: true,
      })
    );
  }

  // Click event delegation for container
  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // 1. Add task button
    const addBtn = target.closest<HTMLButtonElement>('.kanban-add-btn');
    if (addBtn) {
      e.preventDefault();
      const columnId = addBtn.getAttribute('data-column-id') || '';
      options.onCardAdd?.({ columnId });
      container.dispatchEvent(
        new CustomEvent('kanban:card-add', {
          detail: { columnId },
          bubbles: true,
        })
      );
      return;
    }

    // 2. Column options button
    const optBtn = target.closest<HTMLButtonElement>('.kanban-column-options');
    if (optBtn) {
      e.preventDefault();
      const columnId = optBtn.getAttribute('data-column-id') || '';
      options.onColumnOptions?.({ columnId });
      container.dispatchEvent(
        new CustomEvent('kanban:column-options', {
          detail: { columnId },
          bubbles: true,
        })
      );
      return;
    }

    // 3. Card click
    const cardEl = target.closest<HTMLElement>('.kanban-card');
    if (cardEl && !target.closest('button, a, input')) {
      const cardId = cardEl.getAttribute('data-item-id') || '';
      const columnId = cardEl.getAttribute('data-column-id') || '';
      const col = store.getState().find((c) => c.id === columnId);
      const item = col?.items.find((i) => i.id === cardId);
      if (item) {
        options.onCardClick?.({ cardId, columnId, item });
        container.dispatchEvent(
          new CustomEvent('kanban:card-click', {
            detail: { cardId, columnId, item },
            bubbles: true,
          })
        );
      }
    }
  }

  function announce(message: string) {
    const liveEl = container.querySelector<HTMLElement>('.kanban-live-region');
    if (liveEl) {
      liveEl.textContent = message;
    }
  }

  function restoreCardFocus(cardId: string) {
    requestAnimationFrame(() => {
      const el = container.querySelector<HTMLElement>(
        `[data-item-id="${cardId}"]`
      );
      el?.focus();
    });
  }

  function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    const cardEl = target?.closest<HTMLElement>('.kanban-card');
    if (!cardEl) return;

    const cardId = cardEl.getAttribute('data-item-id') || '';
    const colId = cardEl.getAttribute('data-column-id') || '';
    const itemIdx = parseInt(cardEl.getAttribute('data-index') || '0', 10);
    const colIdx = parseInt(
      cardEl.getAttribute('data-column-index') || '0',
      10
    );

    const columns = store.getState();
    const currentCol = columns[colIdx] || columns.find((c) => c.id === colId);
    if (!currentCol) return;
    const currentItem =
      currentCol.items[itemIdx] ||
      currentCol.items.find((i) => i.id === cardId);
    const totalCards = currentCol.items.length;

    // Card activation via Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      if (!target?.closest('button, a, input, select, textarea')) {
        e.preventDefault();
        if (currentItem) {
          options.onCardClick?.({ cardId, columnId: colId, item: currentItem });
          container.dispatchEvent(
            new CustomEvent('kanban:card-click', {
              detail: { cardId, columnId: colId, item: currentItem },
              bubbles: true,
            })
          );
        }
      }
      return;
    }

    // Accessible keyboard reordering with Alt + Arrow keys
    if (e.altKey) {
      if (e.key === 'ArrowUp' && itemIdx > 0) {
        e.preventDefault();
        const targetIndex = itemIdx - 1;
        handleCardMove({
          cardId,
          sourceColumnId: colId,
          targetColumnId: colId,
          sourceIndex: itemIdx,
          targetIndex,
          edge: 'top',
        });
        announce(
          `Moved card '${currentItem?.title || 'Card'}' to position ${
            targetIndex + 1
          } of ${totalCards} in ${currentCol.title}`
        );
        restoreCardFocus(cardId);
      } else if (e.key === 'ArrowDown' && itemIdx < totalCards - 1) {
        e.preventDefault();
        const targetIndex = itemIdx + 1;
        handleCardMove({
          cardId,
          sourceColumnId: colId,
          targetColumnId: colId,
          sourceIndex: itemIdx,
          targetIndex,
          edge: 'bottom',
        });
        announce(
          `Moved card '${currentItem?.title || 'Card'}' to position ${
            targetIndex + 1
          } of ${totalCards} in ${currentCol.title}`
        );
        restoreCardFocus(cardId);
      } else if (e.key === 'ArrowLeft' && colIdx > 0) {
        e.preventDefault();
        const targetCol = columns[colIdx - 1];
        if (targetCol) {
          const targetIndex = Math.min(itemIdx, targetCol.items.length);
          handleCardMove({
            cardId,
            sourceColumnId: colId,
            targetColumnId: targetCol.id,
            sourceIndex: itemIdx,
            targetIndex,
            edge: 'bottom',
          });
          announce(
            `Moved card '${currentItem?.title || 'Card'}' to column '${
              targetCol.title
            }', position ${targetIndex + 1} of ${targetCol.items.length + 1}`
          );
          restoreCardFocus(cardId);
        }
      } else if (e.key === 'ArrowRight' && colIdx < columns.length - 1) {
        e.preventDefault();
        const targetCol = columns[colIdx + 1];
        if (targetCol) {
          const targetIndex = Math.min(itemIdx, targetCol.items.length);
          handleCardMove({
            cardId,
            sourceColumnId: colId,
            targetColumnId: targetCol.id,
            sourceIndex: itemIdx,
            targetIndex,
            edge: 'bottom',
          });
          announce(
            `Moved card '${currentItem?.title || 'Card'}' to column '${
              targetCol.title
            }', position ${targetIndex + 1} of ${targetCol.items.length + 1}`
          );
          restoreCardFocus(cardId);
        }
      } else if (e.key === 'Home' && itemIdx > 0) {
        e.preventDefault();
        handleCardMove({
          cardId,
          sourceColumnId: colId,
          targetColumnId: colId,
          sourceIndex: itemIdx,
          targetIndex: 0,
          edge: 'top',
        });
        announce(
          `Moved card '${currentItem?.title || 'Card'}' to top of column '${
            currentCol.title
          }'`
        );
        restoreCardFocus(cardId);
      } else if (e.key === 'End' && itemIdx < totalCards - 1) {
        e.preventDefault();
        handleCardMove({
          cardId,
          sourceColumnId: colId,
          targetColumnId: colId,
          sourceIndex: itemIdx,
          targetIndex: totalCards - 1,
          edge: 'bottom',
        });
        announce(
          `Moved card '${currentItem?.title || 'Card'}' to bottom of column '${
            currentCol.title
          }'`
        );
        restoreCardFocus(cardId);
      }
    }
  }

  container.addEventListener('click', handleClick);
  container.addEventListener('keydown', handleKeyDown);

  // Subscribe to store updates to re-render DOM
  const unsubscribeStore = store.subscribe((newColumns) => {
    setupDOM(newColumns);
  });

  // Initial render
  setupDOM(store.getState());

  return {
    destroy: () => {
      cleanups.forEach((c) => c());
      cleanups = [];
      unsubscribeStore();
      container.removeEventListener('click', handleClick);
      container.removeEventListener('keydown', handleKeyDown);
      container.innerHTML = '';
    },
    update: (newColumns: KanbanColumn[]) => {
      store.setState(newColumns);
    },
    getColumns: () => store.getState(),
    moveCard: (event: CardMoveEvent) => store.moveCard(event),
    moveColumn: (event: ColumnMoveEvent) => store.moveColumn(event),
    addCard: (columnId: string, item: KanbanItem) =>
      store.addCard(columnId, item),
    removeCard: (columnId: string, cardId: string) =>
      store.removeCard(columnId, cardId),
  };
}
