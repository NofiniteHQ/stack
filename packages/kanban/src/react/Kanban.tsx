import React, { useState, useEffect, useRef } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
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
  const [isOver, setIsOver] = useState(false);

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
      getData: () => ({ type: 'card', cardId: item.id, columnId, index }),
      canDrop: ({ source }) => source.data.type === 'card',
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: ({ source }) => {
        setIsOver(false);
        if (source.data.type === 'card') {
          onCardMove({
            cardId: source.data.cardId as string,
            sourceColumnId: source.data.columnId as string,
            targetColumnId: columnId,
            sourceIndex: source.data.index as number,
            targetIndex: index,
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
        'p-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-xs transition-all cursor-grab active:cursor-grabbing select-none',
        isDragging &&
          'opacity-40 scale-95 shadow-lg border-[var(--color-primary)]',
        isOver && 'border-t-2 border-t-[var(--color-primary)] pt-4'
      )}
    >
      {item.content}
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
  const [isColDragging, setIsColDragging] = useState(false);
  const [isColOver, setIsColOver] = useState(false);

  useEffect(() => {
    const colEl = colRef.current;
    const headerEl = headerRef.current;
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

    // Entire column body acts as drop target
    const cleanupDrop = dropTargetForElements({
      element: colEl,
      getData: () => ({
        type: 'column',
        columnId: column.id,
        columnIndex: index,
      }),
      onDragEnter: () => setIsColOver(true),
      onDragLeave: () => setIsColOver(false),
      onDrop: ({ source }) => {
        setIsColOver(false);
        if (source.data.type === 'column') {
          const sourceIdx = source.data.columnIndex as number;
          if (sourceIdx !== index) {
            onColumnMove({
              columnId: source.data.columnId as string,
              sourceIndex: sourceIdx,
              targetIndex: index,
            });
          }
        } else if (source.data.type === 'card') {
          // If dropped on column container, append to end
          onCardMove({
            cardId: source.data.cardId as string,
            sourceColumnId: source.data.columnId as string,
            targetColumnId: column.id,
            sourceIndex: source.data.index as number,
            targetIndex: column.items.length,
          });
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
        'w-80 flex-shrink-0 flex flex-col rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-xs max-h-[85vh] transition-all',
        isColDragging && 'opacity-40 scale-95 border-[var(--color-primary)]',
        isColOver && 'border-2 border-dashed border-[var(--color-primary)]',
        columnClassName
      )}
    >
      <div
        ref={headerRef}
        className="p-3 font-semibold text-sm flex items-center justify-between border-b border-[var(--border-default)] cursor-grab active:cursor-grabbing select-none"
      >
        {column.header ? (
          column.header
        ) : (
          <>
            <span className="text-[var(--color-primary)] truncate">
              {column.title}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] font-mono">
              {column.items.length}
            </span>
          </>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 overflow-y-auto flex-1 min-h-[120px]">
        {column.items.map((item, itemIdx) => (
          <KanbanCardItem
            key={item.id}
            item={item}
            columnId={column.id}
            index={itemIdx}
            onCardMove={onCardMove}
          />
        ))}
      </div>

      {column.footer && (
        <div className="p-2 border-t border-[var(--border-default)] bg-[var(--bg-subtle)] rounded-b-xl">
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
    const updated = moveCardBetweenColumns(
      data as unknown as CoreColumn[],
      event
    ) as unknown as KanbanColumnProps[];
    setData(updated);
    onChange?.(updated);
  };

  const handleColumnMove = (event: ColumnMoveEvent) => {
    const updated = reorderColumns(
      data as unknown as CoreColumn[],
      event
    ) as unknown as KanbanColumnProps[];
    setData(updated);
    onChange?.(updated);
  };

  return (
    <div
      className={clsx(
        'flex gap-4 overflow-x-auto p-4 items-start select-none font-sans min-h-[400px]',
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
