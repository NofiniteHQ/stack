import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import clsx from 'clsx';
import {
  type KanbanColumn as CoreColumn,
  type KanbanItem as CoreItem,
  type KanbanBadge,
  type KanbanAssignee,
  type KanbanSubtasks,
  type CardMoveEvent,
  type ColumnMoveEvent,
  type KanbanBoardInstance,
  type KanbanFilterOptions,
  matchCardFilter,
  hasActiveFilter,
  moveCardBetweenColumns,
  reorderColumns,
} from '../core';

export type KanbanHandle = KanbanBoardInstance;

export interface KanbanItem {
  id: string;
  title?: string;
  description?: string;
  badge?: KanbanBadge;
  assignee?: KanbanAssignee;
  dueDate?: string;
  isOverdue?: boolean;
  subtasks?: KanbanSubtasks;
  content?: React.ReactNode;
  [key: string]: unknown;
}

export interface KanbanColumnProps {
  id: string;
  title?: string;
  allowAdd?: boolean;
  headerActions?: boolean;
  wipLimit?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items: KanbanItem[];
  [key: string]: unknown;
}

export interface KanbanProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    KanbanFilterOptions {
  columns: KanbanColumnProps[];
  onChange?: (columns: KanbanColumnProps[]) => void;
  onCardMove?: (event: CardMoveEvent) => void;
  onColumnMove?: (event: ColumnMoveEvent) => void;
  onCardAdd?: (columnId: string) => void;
  onCardClick?: (cardId: string, columnId: string, item: KanbanItem) => void;
  onColumnOptions?: (columnId: string) => void;
  onColumnAdd?: () => void;
  onColumnClear?: (columnId: string) => void;
  allowAdd?: boolean;
  allowAddColumn?: boolean;
  addColumnLabel?: string;
  headerActions?: boolean;
  enforceWipLimit?: boolean;
  canMoveCard?: (event: CardMoveEvent) => boolean;
  columnClassName?: string;
  renderCard?: (item: KanbanItem, columnId: string) => React.ReactNode;
  renderHeader?: (column: KanbanColumnProps) => React.ReactNode;
}

interface CardProps {
  item: KanbanItem;
  columnId: string;
  index: number;
  totalCards: number;
  columnIndex: number;
  totalColumns: number;
  allColumns: KanbanColumnProps[];
  onCardMove: (event: CardMoveEvent) => void;
  onCardClick?: (cardId: string, columnId: string, item: KanbanItem) => void;
  renderCard?: (item: KanbanItem, columnId: string) => React.ReactNode;
  onAnnounce?: (message: string) => void;
  onFocusCard?: (cardId: string) => void;
  enforceWipLimit?: boolean;
  canMoveCard?: (event: CardMoveEvent) => boolean;
}

function KanbanCardItem({
  item,
  columnId,
  index,
  totalCards,
  columnIndex,
  totalColumns,
  allColumns,
  onCardMove,
  onCardClick,
  renderCard,
  onAnnounce,
  onFocusCard,
  enforceWipLimit,
  canMoveCard,
}: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupDrag = draggable({
      element: el,
      canDrag: ({ element }) =>
        !element.closest('button, a, input, select, textarea'),
      getInitialData: () => ({
        type: 'card',
        cardId: item.id,
        columnId,
        index,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    const cleanupDrop = dropTargetForElements({
      element: el,
      canDrop: ({ source }) => {
        if (source.data.type !== 'card') return false;
        const sourceColId = source.data.columnId as string;
        if (sourceColId !== columnId) {
          if (enforceWipLimit) {
            const targetCol = allColumns.find((c) => c.id === columnId);
            if (
              targetCol &&
              typeof targetCol.wipLimit === 'number' &&
              targetCol.wipLimit > 0 &&
              targetCol.items.length >= targetCol.wipLimit
            ) {
              return false;
            }
          }
          if (canMoveCard) {
            const allowed = canMoveCard({
              cardId: source.data.cardId as string,
              sourceColumnId: sourceColId,
              targetColumnId: columnId,
              sourceIndex: source.data.index as number,
              targetIndex: index,
            });
            if (!allowed) return false;
          }
        }
        return true;
      },
      getData: ({ input, element }) => {
        const data = { type: 'card', cardId: item.id, columnId, index };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['top', 'bottom'],
        });
      },
      onDragEnter: (args) => {
        setClosestEdge(extractClosestEdge(args.self.data));
      },
      onDrag: (args) => {
        setClosestEdge(extractClosestEdge(args.self.data));
      },
      onDragLeave: () => {
        setClosestEdge(null);
      },
      onDrop: ({ source, location, self }) => {
        setClosestEdge(null);
        if (
          location.current.dropTargets[0]?.element === el &&
          source.data.type === 'card'
        ) {
          const edge = extractClosestEdge(self.data);
          onCardMove({
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

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [
    item.id,
    columnId,
    index,
    onCardMove,
    enforceWipLimit,
    canMoveCard,
    allColumns,
  ]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Keyboard accessibility for card activation
    if (e.key === 'Enter' || e.key === ' ') {
      if (
        !(e.target as HTMLElement).closest('button, a, input, select, textarea')
      ) {
        e.preventDefault();
        onCardClick?.(item.id, columnId, item);
      }
      return;
    }

    if (e.altKey) {
      const currentColumn = allColumns[columnIndex];
      const currentColTitle = currentColumn?.title || 'column';

      if (e.key === 'ArrowUp' && index > 0) {
        e.preventDefault();
        const targetIndex = index - 1;
        const moveEvent: CardMoveEvent = {
          cardId: item.id,
          sourceColumnId: columnId,
          targetColumnId: columnId,
          sourceIndex: index,
          targetIndex,
          edge: 'top',
        };
        if (canMoveCard && !canMoveCard(moveEvent)) {
          onAnnounce?.('Cannot move card: move is not permitted.');
          return;
        }
        onCardMove(moveEvent);
        onAnnounce?.(
          `Moved card '${item.title || 'Card'}' to position ${
            targetIndex + 1
          } of ${totalCards} in ${currentColTitle}`
        );
        onFocusCard?.(item.id);
      } else if (e.key === 'ArrowDown' && index < totalCards - 1) {
        e.preventDefault();
        const targetIndex = index + 1;
        const moveEvent: CardMoveEvent = {
          cardId: item.id,
          sourceColumnId: columnId,
          targetColumnId: columnId,
          sourceIndex: index,
          targetIndex,
          edge: 'bottom',
        };
        if (canMoveCard && !canMoveCard(moveEvent)) {
          onAnnounce?.('Cannot move card: move is not permitted.');
          return;
        }
        onCardMove(moveEvent);
        onAnnounce?.(
          `Moved card '${item.title || 'Card'}' to position ${
            targetIndex + 1
          } of ${totalCards} in ${currentColTitle}`
        );
        onFocusCard?.(item.id);
      } else if (e.key === 'ArrowLeft' && columnIndex > 0) {
        e.preventDefault();
        const targetCol = allColumns[columnIndex - 1];
        if (targetCol) {
          const targetIndex = Math.min(index, targetCol.items.length);
          const moveEvent: CardMoveEvent = {
            cardId: item.id,
            sourceColumnId: columnId,
            targetColumnId: targetCol.id,
            sourceIndex: index,
            targetIndex,
            edge: 'bottom',
          };
          if (canMoveCard && !canMoveCard(moveEvent)) {
            onAnnounce?.('Cannot move card: move is not permitted.');
            return;
          }
          if (
            enforceWipLimit &&
            typeof targetCol.wipLimit === 'number' &&
            targetCol.wipLimit > 0 &&
            targetCol.items.length >= targetCol.wipLimit
          ) {
            onAnnounce?.(
              `Cannot move card: column "${
                targetCol.title || 'column'
              }" has reached its limit of ${targetCol.wipLimit} cards.`
            );
            return;
          }
          onCardMove(moveEvent);
          onAnnounce?.(
            `Moved card '${item.title || 'Card'}' to column '${
              targetCol.title || 'column'
            }', position ${targetIndex + 1} of ${targetCol.items.length + 1}`
          );
          onFocusCard?.(item.id);
        }
      } else if (e.key === 'ArrowRight' && columnIndex < totalColumns - 1) {
        e.preventDefault();
        const targetCol = allColumns[columnIndex + 1];
        if (targetCol) {
          const targetIndex = Math.min(index, targetCol.items.length);
          const moveEvent: CardMoveEvent = {
            cardId: item.id,
            sourceColumnId: columnId,
            targetColumnId: targetCol.id,
            sourceIndex: index,
            targetIndex,
            edge: 'bottom',
          };
          if (canMoveCard && !canMoveCard(moveEvent)) {
            onAnnounce?.('Cannot move card: move is not permitted.');
            return;
          }
          if (
            enforceWipLimit &&
            typeof targetCol.wipLimit === 'number' &&
            targetCol.wipLimit > 0 &&
            targetCol.items.length >= targetCol.wipLimit
          ) {
            onAnnounce?.(
              `Cannot move card: column "${
                targetCol.title || 'column'
              }" has reached its limit of ${targetCol.wipLimit} cards.`
            );
            return;
          }
          onCardMove(moveEvent);
          onAnnounce?.(
            `Moved card '${item.title || 'Card'}' to column '${
              targetCol.title || 'column'
            }', position ${targetIndex + 1} of ${targetCol.items.length + 1}`
          );
          onFocusCard?.(item.id);
        }
      } else if (e.key === 'Home' && index > 0) {
        e.preventDefault();
        const moveEvent: CardMoveEvent = {
          cardId: item.id,
          sourceColumnId: columnId,
          targetColumnId: columnId,
          sourceIndex: index,
          targetIndex: 0,
          edge: 'top',
        };
        if (canMoveCard && !canMoveCard(moveEvent)) {
          onAnnounce?.('Cannot move card: move is not permitted.');
          return;
        }
        onCardMove(moveEvent);
        onAnnounce?.(
          `Moved card '${
            item.title || 'Card'
          }' to top of column '${currentColTitle}'`
        );
        onFocusCard?.(item.id);
      } else if (e.key === 'End' && index < totalCards - 1) {
        e.preventDefault();
        const moveEvent: CardMoveEvent = {
          cardId: item.id,
          sourceColumnId: columnId,
          targetColumnId: columnId,
          sourceIndex: index,
          targetIndex: totalCards - 1,
          edge: 'bottom',
        };
        if (canMoveCard && !canMoveCard(moveEvent)) {
          onAnnounce?.('Cannot move card: move is not permitted.');
          return;
        }
        onCardMove(moveEvent);
        onAnnounce?.(
          `Moved card '${
            item.title || 'Card'
          }' to bottom of column '${currentColTitle}'`
        );
        onFocusCard?.(item.id);
      }
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      data-item-id={item.id}
      data-column-id={columnId}
      aria-roledescription="Kanban card"
      aria-label={`${item.title || 'Kanban card'}, item ${
        index + 1
      } of ${totalCards}`}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (
          !(e.target as HTMLElement).closest(
            'button, a, input, select, textarea'
          )
        ) {
          onCardClick?.(item.id, columnId, item);
        }
      }}
      className={clsx(
        'kanban-card relative p-3.5 rounded-xl border border-default bg-surface text-default shadow-xs transition-all cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isDragging && 'opacity-40 scale-95 shadow-lg border-primary'
      )}
    >
      {closestEdge === 'top' && (
        <div className="kanban-drop-indicator-top absolute -top-1.5 left-1 right-1 h-1 bg-primary rounded-full z-20 pointer-events-none" />
      )}

      {renderCard ? (
        renderCard(item, columnId)
      ) : item.title ? (
        <>
          {item.badge && (
            <div className="mb-2">
              <span
                className={clsx(
                  'badge px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                  item.badge.variant
                    ? `badge-${item.badge.variant}`
                    : 'badge-primary'
                )}
              >
                {item.badge.label}
              </span>
            </div>
          )}

          <div className="kanban-card-title font-semibold text-sm leading-snug text-default group-hover:text-primary transition-colors break-words">
            {item.title}
          </div>

          {item.description && (
            <div className="kanban-card-desc text-xs text-muted mt-1 leading-relaxed line-clamp-2">
              {item.description}
            </div>
          )}

          {hasFooter && (
            <div className="kanban-card-footer flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-default/40 text-xs text-muted">
              <div className="kanban-card-meta flex items-center gap-2.5">
                {item.dueDate && (
                  <span
                    className={clsx(
                      'kanban-meta-item flex items-center gap-1 text-[11px] font-medium',
                      item.isOverdue &&
                        'kanban-meta-overdue text-danger font-semibold'
                    )}
                  >
                    <svg
                      className="kanban-meta-icon w-3.5 h-3.5 text-muted shrink-0"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{item.dueDate}</span>
                  </span>
                )}
                {item.subtasks && (
                  <span className="kanban-meta-item flex items-center gap-1 text-[11px] font-medium">
                    <svg
                      className="kanban-meta-icon w-3.5 h-3.5 text-muted shrink-0"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>
                      {item.subtasks.completed}/{item.subtasks.total}
                    </span>
                  </span>
                )}
              </div>

              {item.assignee && (
                <div
                  className="kanban-card-assignee shrink-0"
                  title={item.assignee.name}
                >
                  {item.assignee.avatar ? (
                    <img
                      src={item.assignee.avatar}
                      alt={item.assignee.name}
                      className="w-5 h-5 rounded-full object-cover border border-default"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/30">
                      {assigneeInitials}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        item.content
      )}

      {closestEdge === 'bottom' && (
        <div className="kanban-drop-indicator-bottom absolute -bottom-1.5 left-1 right-1 h-1 bg-primary rounded-full z-20 pointer-events-none" />
      )}
    </div>
  );
}

interface ColumnComponentProps {
  column: KanbanColumnProps;
  index: number;
  totalColumns: number;
  allColumns: KanbanColumnProps[];
  columnClassName?: string;
  allowAdd?: boolean;
  headerActions?: boolean;
  enforceWipLimit?: boolean;
  canMoveCard?: (event: CardMoveEvent) => boolean;
  filterOptions?: KanbanFilterOptions;
  onCardMove: (event: CardMoveEvent) => void;
  onColumnMove: (event: ColumnMoveEvent) => void;
  onCardAdd?: (columnId: string) => void;
  onCardClick?: (cardId: string, columnId: string, item: KanbanItem) => void;
  onColumnOptions?: (columnId: string) => void;
  onColumnClear?: (columnId: string) => void;
  renderCard?: (item: KanbanItem, columnId: string) => React.ReactNode;
  renderHeader?: (column: KanbanColumnProps) => React.ReactNode;
  onAnnounce?: (message: string) => void;
  onFocusCard?: (cardId: string) => void;
}

function KanbanColumnComponent({
  column,
  index,
  totalColumns,
  allColumns,
  columnClassName,
  allowAdd,
  headerActions,
  enforceWipLimit,
  canMoveCard,
  filterOptions,
  onCardMove,
  onColumnMove,
  onCardAdd,
  onCardClick,
  onColumnOptions,
  onColumnClear,
  renderCard,
  renderHeader,
  onAnnounce,
  onFocusCard,
}: ColumnComponentProps) {
  const colRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isColDragging, setIsColDragging] = useState(false);
  const [isColOver, setIsColOver] = useState(false);
  const [closestColEdge, setClosestColEdge] = useState<Edge | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const showAdd = column.allowAdd ?? allowAdd ?? true;
  const showOptions = column.headerActions ?? headerActions ?? true;
  const isOverWip =
    column.wipLimit != null && column.items.length > column.wipLimit;

  const isFiltered = hasActiveFilter(filterOptions);
  const visibleItems = isFiltered
    ? column.items.filter((item) =>
        matchCardFilter(
          item as unknown as CoreItem,
          column as unknown as CoreColumn,
          filterOptions
        )
      )
    : column.items;

  useEffect(() => {
    const colEl = colRef.current;
    const headerEl = headerRef.current;
    const cardListEl = cardListRef.current;
    if (!colEl || !headerEl) return;

    // Header acts as drag handle for column
    const cleanupDrag = draggable({
      element: headerEl,
      canDrag: ({ element }) =>
        !element.closest('button, a, input, select, textarea'),
      getInitialData: () => ({
        type: 'column',
        columnId: column.id,
        columnIndex: index,
      }),
      onDragStart: () => setIsColDragging(true),
      onDrop: () => setIsColDragging(false),
    });

    // Entire column body acts as drop target with hitbox
    const cleanupDrop = dropTargetForElements({
      element: colEl,
      canDrop: ({ source }) => {
        if (source.data.type === 'column') return true;
        if (source.data.type === 'card') {
          const sourceColId = source.data.columnId as string;
          if (sourceColId !== column.id) {
            if (
              enforceWipLimit &&
              typeof column.wipLimit === 'number' &&
              column.wipLimit > 0 &&
              column.items.length >= column.wipLimit
            ) {
              return false;
            }
            if (canMoveCard) {
              const allowed = canMoveCard({
                cardId: source.data.cardId as string,
                sourceColumnId: sourceColId,
                targetColumnId: column.id,
                sourceIndex: source.data.index as number,
                targetIndex: 9999,
              });
              if (!allowed) return false;
            }
          }
          return true;
        }
        return false;
      },
      getData: ({ input, element }) => {
        const data = {
          type: 'column',
          columnId: column.id,
          columnIndex: index,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        });
      },
      onDragEnter: (args) => {
        if (args.source.data.type === 'column') {
          setClosestColEdge(extractClosestEdge(args.self.data));
        } else if (args.source.data.type === 'card') {
          setIsColOver(true);
        }
      },
      onDrag: (args) => {
        if (args.source.data.type === 'column') {
          setClosestColEdge(extractClosestEdge(args.self.data));
        }
      },
      onDragLeave: () => {
        setIsColOver(false);
        setClosestColEdge(null);
      },
      onDrop: ({ source, location, self }) => {
        setIsColOver(false);
        setClosestColEdge(null);
        const innerTarget = location.current.dropTargets[0];

        if (source.data.type === 'column') {
          const sourceIdx = source.data.columnIndex as number;
          const edge = extractClosestEdge(self.data);
          if (sourceIdx !== index || edge != null) {
            onColumnMove({
              columnId: source.data.columnId as string,
              sourceIndex: sourceIdx,
              targetIndex: index,
              edge,
            });
          }
        } else if (source.data.type === 'card') {
          // If dropped on column container or empty card list, append to end
          if (
            innerTarget?.element === colEl ||
            innerTarget?.data.type === 'column' ||
            innerTarget?.element === cardListEl
          ) {
            onCardMove({
              cardId: source.data.cardId as string,
              sourceColumnId: source.data.columnId as string,
              targetColumnId: column.id,
              sourceIndex: source.data.index as number,
              targetIndex: 9999,
            });
          }
        }
      },
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [
    column.id,
    column.items.length,
    column.wipLimit,
    index,
    onCardMove,
    onColumnMove,
    enforceWipLimit,
    canMoveCard,
  ]);

  return (
    <div
      ref={colRef}
      className={clsx(
        'kanban-column relative w-80 flex-shrink-0 flex flex-col rounded-2xl border border-default bg-surface shadow-xs max-h-[85vh] transition-all',
        isColDragging && 'opacity-40 scale-95 border-primary',
        isColOver && 'border-primary/40',
        columnClassName
      )}
    >
      {closestColEdge === 'left' && (
        <div className="kanban-drop-indicator-left absolute -left-1.5 top-0 bottom-0 w-0.5 bg-primary rounded-full z-20 pointer-events-none" />
      )}
      {closestColEdge === 'right' && (
        <div className="kanban-drop-indicator-right absolute -right-1.5 top-0 bottom-0 w-0.5 bg-primary rounded-full z-20 pointer-events-none" />
      )}

      {/* Column Header */}
      <div
        ref={headerRef}
        className="kanban-column-header p-3 font-semibold text-sm flex items-center justify-between border-b border-default select-none cursor-grab active:cursor-grabbing"
      >
        {renderHeader ? (
          renderHeader(column)
        ) : column.header ? (
          column.header
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-default truncate font-bold text-sm tracking-tight">
                {column.title}
              </span>
              <span className="badge badge-subtle px-1.5 py-0.5 rounded-full text-[11px] font-mono font-semibold text-muted bg-surface border border-default">
                {isFiltered && visibleItems.length !== column.items.length
                  ? `${visibleItems.length}/${column.items.length}`
                  : column.items.length}
              </span>
              {isOverWip && (
                <span className="badge badge-danger text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  Max {column.wipLimit}
                </span>
              )}
            </div>

            {showOptions && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                    onColumnOptions?.(column.id);
                  }}
                  className="kanban-column-options btn btn-ghost btn-xs btn-icon text-muted hover:text-default"
                  title="Column options"
                >
                  <svg
                    className="kanban-icon w-4 h-4 shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="kanban-column-menu absolute right-0 top-full mt-1 w-44 rounded-xl border border-default bg-surface shadow-lg py-1.5 z-30 font-sans"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onCardAdd?.(column.id);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-default hover:bg-subtle flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <svg
                        className="kanban-icon w-3.5 h-3.5 text-muted shrink-0"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>Add Card</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onColumnClear?.(column.id);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-danger/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <svg
                        className="kanban-icon w-3.5 h-3.5 text-danger shrink-0"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Clear Cards</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Card List Droppable */}
      <div
        ref={cardListRef}
        className="kanban-card-list p-3 flex flex-col gap-2.5 overflow-y-auto flex-1 min-h-[140px]"
      >
        {visibleItems.length === 0 ? (
          <div className="kanban-empty-placeholder h-24 border border-dashed border-default/60 rounded-xl flex items-center justify-center text-xs text-muted/60 select-none pointer-events-none">
            {column.items.length > 0 ? 'No matching cards' : 'No cards'}
          </div>
        ) : (
          visibleItems.map((item, itemIdx) => (
            <KanbanCardItem
              key={item.id}
              item={item}
              columnId={column.id}
              index={itemIdx}
              totalCards={visibleItems.length}
              columnIndex={index}
              totalColumns={totalColumns}
              allColumns={allColumns}
              onCardMove={onCardMove}
              onCardClick={onCardClick}
              renderCard={renderCard}
              onAnnounce={onAnnounce}
              onFocusCard={onFocusCard}
              enforceWipLimit={enforceWipLimit}
              canMoveCard={canMoveCard}
            />
          ))
        )}
      </div>

      {/* Column Footer */}
      {column.footer ? (
        <div className="p-2 border-t border-default bg-subtle rounded-b-2xl">
          {column.footer}
        </div>
      ) : (
        showAdd && (
          <div className="pt-2 px-3 pb-3 border-t border-default/50 mt-1">
            <button
              type="button"
              onClick={() => onCardAdd?.(column.id)}
              className="kanban-add-btn flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-default hover:bg-subtle transition-colors group cursor-pointer"
            >
              <svg
                className="kanban-icon w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors shrink-0"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>New Task</span>
            </button>
          </div>
        )
      )}
    </div>
  );
}

export const Kanban = React.forwardRef<KanbanBoardInstance, KanbanProps>(
  function Kanban(
    {
      columns,
      onChange,
      onCardMove,
      onColumnMove,
      onCardAdd,
      onCardClick,
      onColumnOptions,
      onColumnAdd,
      onColumnClear,
      allowAdd = true,
      allowAddColumn = false,
      addColumnLabel = '+ Add Column',
      headerActions = true,
      enforceWipLimit = false,
      canMoveCard,
      filterQuery,
      filterAssignee,
      filterBadge,
      filterCard,
      className,
      columnClassName,
      renderCard,
      renderHeader,
      ...props
    },
    ref
  ) {
    const [data, setData] = useState<KanbanColumnProps[]>(columns);
    const [announcement, setAnnouncement] = useState<string>('');
    const boardRef = useRef<HTMLDivElement | null>(null);
    const dataRef = useRef<KanbanColumnProps[]>(columns);
    const [filterState, setFilterState] = useState<KanbanFilterOptions>({
      filterQuery,
      filterAssignee,
      filterBadge,
      filterCard,
    });

    useEffect(() => {
      setFilterState({
        filterQuery,
        filterAssignee,
        filterBadge,
        filterCard,
      });
    }, [filterQuery, filterAssignee, filterBadge, filterCard]);

    useEffect(() => {
      setData(columns);
      dataRef.current = columns;
    }, [columns]);

    const focusCard = (cardId: string) => {
      requestAnimationFrame(() => {
        const el = boardRef.current?.querySelector<HTMLElement>(
          `[data-item-id="${cardId}"]`
        );
        el?.focus();
      });
    };

    const handleColumnClear = (columnId: string) => {
      setData((prev) => {
        const updated = prev.map((col) =>
          col.id === columnId ? { ...col, items: [] } : col
        );
        dataRef.current = updated;
        onChange?.(updated);
        onColumnClear?.(columnId);
        return updated;
      });
    };

    const handleCardMove = (event: CardMoveEvent): boolean => {
      if (canMoveCard && !canMoveCard(event)) {
        return false;
      }
      if (enforceWipLimit && event.sourceColumnId !== event.targetColumnId) {
        const targetCol = data.find((c) => c.id === event.targetColumnId);
        if (
          targetCol &&
          typeof targetCol.wipLimit === 'number' &&
          targetCol.wipLimit > 0 &&
          targetCol.items.length >= targetCol.wipLimit
        ) {
          return false;
        }
      }
      let moved = false;
      setData((prev) => {
        const updated = moveCardBetweenColumns(
          prev as unknown as CoreColumn[],
          event,
          { enforceWipLimit, canMoveCard }
        ) as unknown as KanbanColumnProps[];
        if (updated === (prev as unknown as CoreColumn[])) {
          return prev;
        }
        moved = true;
        dataRef.current = updated;
        onChange?.(updated);
        onCardMove?.(event);
        return updated;
      });
      return moved;
    };

    const handleColumnMove = (event: ColumnMoveEvent) => {
      setData((prev) => {
        const updated = reorderColumns(
          prev as unknown as CoreColumn[],
          event
        ) as unknown as KanbanColumnProps[];
        dataRef.current = updated;
        onChange?.(updated);
        onColumnMove?.(event);
        return updated;
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        destroy: () => {
          setData([]);
          dataRef.current = [];
        },
        update: (newColumns: CoreColumn[]) => {
          const mapped = newColumns as unknown as KanbanColumnProps[];
          setData(mapped);
          dataRef.current = mapped;
          onChange?.(mapped);
        },
        getColumns: () => dataRef.current as unknown as CoreColumn[],
        setColumns: (newColumns: CoreColumn[]) => {
          const mapped = newColumns as unknown as KanbanColumnProps[];
          setData(mapped);
          dataRef.current = mapped;
          onChange?.(mapped);
        },
        moveCard: (event: CardMoveEvent): boolean => {
          return handleCardMove(event);
        },
        moveColumn: (event: ColumnMoveEvent) => {
          handleColumnMove(event);
        },
        addCard: (columnId: string, item: any) => {
          setData((prev) => {
            const col = prev.find((c) => c.id === columnId);
            if (
              enforceWipLimit &&
              col &&
              typeof col.wipLimit === 'number' &&
              col.wipLimit > 0 &&
              col.items.length >= col.wipLimit
            ) {
              return prev;
            }
            const updated = prev.map((c) =>
              c.id === columnId ? { ...c, items: [...c.items, item] } : c
            );
            dataRef.current = updated;
            onChange?.(updated);
            return updated;
          });
        },
        removeCard: (columnId: string, cardId: string) => {
          setData((prev) => {
            const updated = prev.map((c) =>
              c.id === columnId
                ? { ...c, items: c.items.filter((i) => i.id !== cardId) }
                : c
            );
            dataRef.current = updated;
            onChange?.(updated);
            return updated;
          });
        },
        updateCard: (columnId: string, cardId: string, partial: any) => {
          setData((prev) => {
            const updated = prev.map((c) =>
              c.id === columnId
                ? {
                    ...c,
                    items: c.items.map((i) =>
                      i.id === cardId ? { ...i, ...partial } : i
                    ),
                  }
                : c
            );
            dataRef.current = updated;
            onChange?.(updated);
            return updated;
          });
        },
        addColumn: (column: CoreColumn) => {
          setData((prev) => {
            const updated = [...prev, column as unknown as KanbanColumnProps];
            dataRef.current = updated;
            onChange?.(updated);
            return updated;
          });
        },
        removeColumn: (columnId: string) => {
          setData((prev) => {
            const updated = prev.filter((c) => c.id !== columnId);
            dataRef.current = updated;
            onChange?.(updated);
            return updated;
          });
        },
        clearColumn: (columnId: string) => {
          handleColumnClear(columnId);
        },
        focusCard: (cardId: string) => {
          focusCard(cardId);
        },
        setFilter: (newFilter: KanbanFilterOptions) => {
          setFilterState(newFilter);
        },
        getFilter: () => ({ ...filterState }),
      }),
      [
        canMoveCard,
        enforceWipLimit,
        onChange,
        onCardMove,
        onColumnMove,
        onColumnClear,
        filterState,
      ]
    );

    return (
      <div
        ref={boardRef}
        className={clsx(
          'kanban kanban-board flex gap-4 overflow-x-auto p-4 items-start select-none font-sans min-h-[400px]',
          className
        )}
        {...props}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
        {data.map((col, idx) => (
          <KanbanColumnComponent
            key={col.id}
            column={col}
            index={idx}
            totalColumns={data.length}
            allColumns={data}
            columnClassName={columnClassName}
            allowAdd={allowAdd}
            headerActions={headerActions}
            enforceWipLimit={enforceWipLimit}
            canMoveCard={canMoveCard}
            filterOptions={filterState}
            onCardMove={handleCardMove}
            onColumnMove={handleColumnMove}
            onCardAdd={onCardAdd}
            onCardClick={onCardClick}
            onColumnOptions={onColumnOptions}
            onColumnClear={handleColumnClear}
            renderCard={renderCard}
            renderHeader={renderHeader}
            onAnnounce={setAnnouncement}
            onFocusCard={focusCard}
          />
        ))}

        {allowAddColumn && (
          <div className="kanban-add-column-container shrink-0 w-80">
            <button
              type="button"
              onClick={() => onColumnAdd?.()}
              className="kanban-add-column-btn group flex flex-col items-center justify-center gap-2 w-full h-32 rounded-2xl border-2 border-dashed border-default hover:border-primary/60 bg-surface/40 hover:bg-surface text-muted hover:text-default transition-all p-4 select-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-subtle group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <svg
                  className="kanban-icon w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="text-xs font-semibold">{addColumnLabel}</span>
            </button>
          </div>
        )}
      </div>
    );
  }
);
