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
  type CardMoveEvent,
  type ColumnMoveEvent,
  moveCardBetweenColumns,
  reorderColumns,
} from '../core';

export interface KanbanItem {
  id: string;
  content: React.ReactNode;
}

export interface KanbanColumnProps {
  id: string;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items: KanbanItem[];
}

export interface KanbanProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  columns: KanbanColumnProps[];
  onChange?: (columns: KanbanColumnProps[]) => void;
  columnClassName?: string;
}

interface CardProps {
  item: KanbanItem;
  columnId: string;
  index: number;
  onCardMove: (event: CardMoveEvent) => void;
}

function KanbanCardItem({ item, columnId, index, onCardMove }: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupDrag = draggable({
      element: el,
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
        // Innermost drop target ensures no duplicate or clobbered updates
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

  return (
    <div
      ref={ref}
      className={clsx(
        'kanban-card relative p-3 rounded-xl border border-default bg-surface shadow-xs transition-all cursor-grab active:cursor-grabbing select-none',
        isDragging && 'opacity-40 scale-95 shadow-lg border-primary'
      )}
    >
      {closestEdge === 'top' && (
        <div className="absolute -top-1.5 left-1 right-1 h-1 bg-primary rounded-full z-20 pointer-events-none" />
      )}
      {item.content}
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
  onCardMove: (event: CardMoveEvent) => void;
  onColumnMove: (event: ColumnMoveEvent) => void;
}

function KanbanColumnComponent({
  column,
  index,
  columnClassName,
  onCardMove,
  onColumnMove,
}: ColumnComponentProps) {
  const colRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const [isColDragging, setIsColDragging] = useState(false);
  const [isColOver, setIsColOver] = useState(false);
  const [closestColEdge, setClosestColEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const colEl = colRef.current;
    const headerEl = headerRef.current;
    const cardListEl = cardListRef.current;
    if (!colEl || !headerEl) return;

    // Header acts as drag handle for column
    const cleanupDrag = draggable({
      element: headerEl,
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
              targetIndex: column.items.length,
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

      <div
        ref={headerRef}
        className="p-3 font-semibold text-sm flex items-center justify-between border-b border-default cursor-grab active:cursor-grabbing select-none"
      >
        {column.header ? (
          column.header
        ) : (
          <>
            <span className="text-primary truncate font-bold">
              {column.title}
            </span>
            <span className="badge badge-subtle px-1.5 py-0.5 rounded-full text-xs font-mono font-semibold text-muted bg-surface border border-default">
              {column.items.length}
            </span>
          </>
        )}
      </div>

      <div
        ref={cardListRef}
        className="kanban-card-list p-3 flex flex-col gap-2.5 overflow-y-auto flex-1 min-h-[140px]"
      >
        {column.items.length === 0 ? (
          <div className="h-24 border border-dashed border-default/60 rounded-xl flex items-center justify-center text-xs text-muted/60 select-none pointer-events-none">
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
            />
          ))
        )}
      </div>

      {column.footer && (
        <div className="p-2 border-t border-default bg-subtle rounded-b-2xl">
          {column.footer}
        </div>
      )}
    </div>
  );
}

export function Kanban({
  columns,
  onChange,
  className,
  columnClassName,
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
          onCardMove={handleCardMove}
          onColumnMove={handleColumnMove}
        />
      ))}
    </div>
  );
}
