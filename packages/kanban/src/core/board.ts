import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { KanbanColumn, CardMoveEvent, ColumnMoveEvent } from './types';

export interface KanbanBoardOptions {
  container: HTMLElement;
  columns: KanbanColumn[];
  onCardMove?: (event: CardMoveEvent) => void;
  onColumnMove?: (event: ColumnMoveEvent) => void;
}

export interface KanbanBoardInstance {
  destroy: () => void;
  update: (columns: KanbanColumn[]) => void;
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
  });
}

export function bindCardDropTarget(
  element: HTMLElement,
  cardId: string,
  columnId: string,
  index: number,
  onDrop?: (event: CardMoveEvent) => void
): () => void {
  return dropTargetForElements({
    element,
    getData: () => ({ type: 'card', cardId, columnId, index }),
    canDrop: ({ source }) => source.data.type === 'card',
    onDrop: ({ source }) => {
      if (source.data.type === 'card') {
        onDrop?.({
          cardId: source.data.cardId as string,
          sourceColumnId: source.data.columnId as string,
          targetColumnId: columnId,
          sourceIndex: source.data.index as number,
          targetIndex: index,
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
  return dropTargetForElements({
    element,
    getData: () => ({ type: 'column', columnId, columnIndex }),
    onDrop: ({ source }) => {
      if (source.data.type === 'card') {
        onCardDrop?.({
          cardId: source.data.cardId as string,
          sourceColumnId: source.data.columnId as string,
          targetColumnId: columnId,
          sourceIndex: source.data.index as number,
          targetIndex: 9999, // Append to end of column
        });
      } else if (source.data.type === 'column') {
        const sourceIndex = source.data.columnIndex as number;
        if (sourceIndex !== columnIndex) {
          onColumnDrop?.({
            columnId: source.data.columnId as string,
            sourceIndex,
            targetIndex: columnIndex,
          });
        }
      }
    },
  });
}

export function createKanbanBoard(
  options: KanbanBoardOptions
): KanbanBoardInstance {
  const cleanups: (() => void)[] = [];

  const cleanupMonitor = monitorForElements({
    onDrop({ source, location }) {
      const destination = location.current.dropTargets[0];
      if (!destination) return;

      const sourceData = source.data;
      const targetData = destination.data;

      if (sourceData.type === 'card') {
        const targetColumnId = (targetData.columnId as string) || '';
        const targetIndex =
          typeof targetData.index === 'number' ? targetData.index : 9999;

        options.onCardMove?.({
          cardId: sourceData.cardId as string,
          sourceColumnId: sourceData.columnId as string,
          targetColumnId,
          sourceIndex: sourceData.index as number,
          targetIndex,
        });
      } else if (sourceData.type === 'column' && targetData.type === 'column') {
        options.onColumnMove?.({
          columnId: sourceData.columnId as string,
          sourceIndex: sourceData.columnIndex as number,
          targetIndex: targetData.columnIndex as number,
        });
      }
    },
  });

  cleanups.push(cleanupMonitor);

  return {
    destroy: () => {
      cleanups.forEach((c) => c());
    },
    update: () => {
      // Updates can re-bind or rely on reactive state loops
    },
  };
}
