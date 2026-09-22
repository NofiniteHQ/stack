import type { KanbanColumn, CardMoveEvent, ColumnMoveEvent } from './types';

/**
 * Pure immutability helper to reorder an item within a single array
 */
export function reorderArray<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Pure immutability helper to move a card within or across columns
 */
export function moveCardBetweenColumns(
  columns: KanbanColumn[],
  event: CardMoveEvent
): KanbanColumn[] {
  const { sourceColumnId, targetColumnId, sourceIndex, targetIndex } = event;

  const sourceColIndex = columns.findIndex((c) => c.id === sourceColumnId);
  const targetColIndex = columns.findIndex((c) => c.id === targetColumnId);

  if (sourceColIndex === -1 || targetColIndex === -1) {
    return columns;
  }

  const sourceCol = columns[sourceColIndex];
  const targetCol = columns[targetColIndex];

  // Moving within the same column
  if (sourceColumnId === targetColumnId) {
    const newItems = reorderArray(sourceCol.items, sourceIndex, targetIndex);
    const newColumns = Array.from(columns);
    newColumns[sourceColIndex] = { ...sourceCol, items: newItems };
    return newColumns;
  }

  // Moving across columns
  const sourceItems = Array.from(sourceCol.items);
  const targetItems = Array.from(targetCol.items);

  const [removedCard] = sourceItems.splice(sourceIndex, 1);
  if (!removedCard) return columns;

  const clampedTargetIndex = Math.max(
    0,
    Math.min(targetIndex, targetItems.length)
  );
  targetItems.splice(clampedTargetIndex, 0, removedCard);

  const newColumns = Array.from(columns);
  newColumns[sourceColIndex] = { ...sourceCol, items: sourceItems };
  newColumns[targetColIndex] = { ...targetCol, items: targetItems };

  return newColumns;
}

/**
 * Pure immutability helper to reorder columns
 */
export function reorderColumns(
  columns: KanbanColumn[],
  event: ColumnMoveEvent
): KanbanColumn[] {
  return reorderArray(columns, event.sourceIndex, event.targetIndex);
}
