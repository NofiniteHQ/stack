import React, { useState, useEffect, useRef } from 'react';
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
  type KanbanBadge,
  type KanbanAssignee,
  type KanbanSubtasks,
  type CardMoveEvent,
  type ColumnMoveEvent,
  moveCardBetweenColumns,
  reorderColumns,
} from '../core';

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
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  columns: KanbanColumnProps[];
  onChange?: (columns: KanbanColumnProps[]) => void;
  onCardMove?: (event: CardMoveEvent) => void;
  onColumnMove?: (event: ColumnMoveEvent) => void;
  onCardAdd?: (columnId: string) => void;
  onCardClick?: (cardId: string, columnId: string, item: KanbanItem) => void;
  onColumnOptions?: (columnId: string) => void;
  allowAdd?: boolean;
  headerActions?: boolean;
  columnClassName?: string;
  renderCard?: (item: KanbanItem, columnId: string) => React.ReactNode;
}

interface CardProps {
  item: KanbanItem;
  columnId: string;
  index: number;
  onCardMove: (event: CardMoveEvent) => void;
  onCardClick?: (cardId: string, columnId: string, item: KanbanItem) => void;
  renderCard?: (item: KanbanItem, columnId: string) => React.ReactNode;
}

function KanbanCardItem({
  item,
  columnId,
  index,
  onCardMove,
  onCardClick,
  renderCard,
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
      canDrop: ({ source }) => source.data.type === 'card',
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
  }, [item.id, columnId, index, onCardMove]);

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

  return (
    <div
      ref={ref}
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
        'kanban-card relative p-3.5 rounded-xl border border-default bg-surface text-default shadow-xs transition-all cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md select-none group',
        isDragging && 'opacity-40 scale-95 shadow-lg border-primary'
      )}
    >
      {closestEdge === 'top' && (
        <div className="absolute -top-1.5 left-1 right-1 h-1 bg-primary rounded-full z-20 pointer-events-none" />
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

          <div className="font-semibold text-sm leading-snug text-default group-hover:text-primary transition-colors break-words">
            {item.title}
          </div>

          {item.description && (
            <div className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
              {item.description}
            </div>
          )}

          {hasFooter && (
            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-default/40 text-xs text-muted">
              <div className="flex items-center gap-2.5">
                {item.dueDate && (
                  <span
                    className={clsx(
                      'flex items-center gap-1 text-[11px] font-medium',
                      item.isOverdue && 'text-danger font-semibold'
                    )}
                  >
                    <svg
                      className="w-3 h-3 text-muted shrink-0"
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
                    {item.dueDate}
                  </span>
                )}
                {item.subtasks && (
                  <span className="flex items-center gap-1 text-[11px] font-medium">
                    <svg
                      className="w-3 h-3 text-muted shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {item.subtasks.completed}/{item.subtasks.total}
                  </span>
                )}
              </div>

              {item.assignee && (
                <div className="shrink-0" title={item.assignee.name}>
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
        <div className="absolute -bottom-1.5 left-1 right-1 h-1 bg-primary rounded-full z-20 pointer-events-none" />
      )}
    </div>
  );
}

interface ColumnComponentProps {
  column: KanbanColumnProps;
  index: number;
  columnClassName?: string;
  allowAdd?: boolean;
  headerActions?: boolean;
  onCardMove: (event: CardMoveEvent) => void;
  onColumnMove: (event: ColumnMoveEvent) => void;
  onCardAdd?: (columnId: string) => void;
  onCardClick?: (cardId: string, columnId: string, item: KanbanItem) => void;
  onColumnOptions?: (columnId: string) => void;
  renderCard?: (item: KanbanItem, columnId: string) => React.ReactNode;
}

function KanbanColumnComponent({
  column,
  index,
  columnClassName,
  allowAdd,
  headerActions,
  onCardMove,
  onColumnMove,
  onCardAdd,
  onCardClick,
  onColumnOptions,
  renderCard,
}: ColumnComponentProps) {
  const colRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const [isColDragging, setIsColDragging] = useState(false);
  const [isColOver, setIsColOver] = useState(false);
  const [closestColEdge, setClosestColEdge] = useState<Edge | null>(null);

  const showAdd = column.allowAdd ?? allowAdd ?? true;
  const showOptions = column.headerActions ?? headerActions ?? true;
  const isOverWip =
    column.wipLimit != null && column.items.length > column.wipLimit;

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
  }, [column.id, column.items.length, index, onCardMove, onColumnMove]);

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
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full z-20 pointer-events-none" />
      )}
      {closestColEdge === 'right' && (
        <div className="absolute -right-2 top-0 bottom-0 w-1 bg-primary rounded-full z-20 pointer-events-none" />
      )}

      {/* Column Header */}
      <div
        ref={headerRef}
        className="p-3 font-semibold text-sm flex items-center justify-between border-b border-default select-none cursor-grab active:cursor-grabbing"
      >
        {column.header ? (
          column.header
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-default truncate font-bold text-sm tracking-tight">
                {column.title}
              </span>
              <span className="badge badge-subtle px-1.5 py-0.5 rounded-full text-[11px] font-mono font-semibold text-muted bg-surface border border-default">
                {column.items.length}
              </span>
              {isOverWip && (
                <span className="badge badge-danger text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  Max {column.wipLimit}
                </span>
              )}
            </div>

            {showOptions && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onColumnOptions?.(column.id);
                }}
                className="kanban-column-options btn btn-ghost btn-xs btn-icon text-muted hover:text-default"
                title="Column options"
              >
                <svg
                  className="w-4 h-4 shrink-0"
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
            )}
          </>
        )}
      </div>

      {/* Card List Droppable */}
      <div
        ref={cardListRef}
        className="kanban-card-list p-3 flex flex-col gap-2.5 overflow-y-auto flex-1 min-h-[140px]"
      >
        {column.items.length === 0 ? (
          <div className="kanban-empty-placeholder h-24 border border-dashed border-default/60 rounded-xl flex items-center justify-center text-xs text-muted/60 select-none pointer-events-none">
            No cards
          </div>
        ) : (
          column.items.map((item, itemIdx) => (
            <KanbanCardItem
              key={item.id}
              item={item}
              columnId={column.id}
              index={itemIdx}
              onCardMove={onCardMove}
              onCardClick={onCardClick}
              renderCard={renderCard}
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
                className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors shrink-0"
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

export function Kanban({
  columns,
  onChange,
  onCardMove,
  onColumnMove,
  onCardAdd,
  onCardClick,
  onColumnOptions,
  allowAdd = true,
  headerActions = true,
  className,
  columnClassName,
  renderCard,
  ...props
}: KanbanProps) {
  const [data, setData] = useState<KanbanColumnProps[]>(columns);

  useEffect(() => {
    setData(columns);
  }, [columns]);

  const handleCardMove = (event: CardMoveEvent) => {
    setData((prev) => {
      const updated = moveCardBetweenColumns(
        prev as unknown as CoreColumn[],
        event
      ) as unknown as KanbanColumnProps[];
      onChange?.(updated);
      onCardMove?.(event);
      return updated;
    });
  };

  const handleColumnMove = (event: ColumnMoveEvent) => {
    setData((prev) => {
      const updated = reorderColumns(
        prev as unknown as CoreColumn[],
        event
      ) as unknown as KanbanColumnProps[];
      onChange?.(updated);
      onColumnMove?.(event);
      return updated;
    });
  };

  return (
    <div
      className={clsx(
        'kanban kanban-board flex gap-4 overflow-x-auto p-4 items-start select-none font-sans min-h-[400px]',
        className
      )}
      {...props}
    >
      {data.map((col, idx) => (
        <KanbanColumnComponent
          key={col.id}
          column={col}
          index={idx}
          columnClassName={columnClassName}
          allowAdd={allowAdd}
          headerActions={headerActions}
          onCardMove={handleCardMove}
          onColumnMove={handleColumnMove}
          onCardAdd={onCardAdd}
          onCardClick={onCardClick}
          onColumnOptions={onColumnOptions}
          renderCard={renderCard}
        />
      ))}
    </div>
  );
}
