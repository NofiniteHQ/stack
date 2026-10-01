import type {
  KanbanColumn,
  CardMoveEvent,
  ColumnMoveEvent,
  Edge,
} from './types';

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
 * Reorders a list respecting directional edge hitboxes (top/bottom or left/right).
 * Implements the standard Pragmatic Drag-and-Drop algorithm for list positioning.
 */
export function reorderWithEdge<T>({
  list,
  startIndex,
  indexOfTarget,
  closestEdgeOfTarget,
  axis,
}: {
  list: T[];
  startIndex: number;
  indexOfTarget: number;
  closestEdgeOfTarget: Edge | null;
  axis: 'vertical' | 'horizontal';
}): T[] {
  if (closestEdgeOfTarget == null) {
    return reorderArray(list, startIndex, indexOfTarget);
  }

  const isAfter =
    axis === 'vertical'
      ? closestEdgeOfTarget === 'bottom'
      : closestEdgeOfTarget === 'right';

  let destinationIndex = isAfter ? indexOfTarget + 1 : indexOfTarget;

  // Moving downwards shifts indices when the source item is removed first
  if (startIndex < destinationIndex) {
    destinationIndex -= 1;
  }

  if (destinationIndex === startIndex) {
    return list;
  }

  return reorderArray(list, startIndex, destinationIndex);
}

/**
 * Pure immutability helper to move a card within or across columns, respecting hitboxes.
 */
export function moveCardBetweenColumns(
  columns: KanbanColumn[],
  event: CardMoveEvent
): KanbanColumn[] {
  const {
    sourceColumnId,
    targetColumnId,
    sourceIndex,
    targetIndex,
    edge = null,
  } = event;

  const sourceColIndex = columns.findIndex((c) => c.id === sourceColumnId);
  const targetColIndex = columns.findIndex((c) => c.id === targetColumnId);

  if (sourceColIndex === -1 || targetColIndex === -1) {
    return columns;
  }

  const sourceCol = columns[sourceColIndex];
  const targetCol = columns[targetColIndex];

  // Moving within the same column
  if (sourceColumnId === targetColumnId) {
    const newItems = reorderWithEdge({
      list: sourceCol.items,
      startIndex: sourceIndex,
      indexOfTarget: targetIndex,
      closestEdgeOfTarget: edge,
      axis: 'vertical',
    });
    const newColumns = Array.from(columns);
    newColumns[sourceColIndex] = { ...sourceCol, items: newItems };
    return newColumns;
  }

  // Moving across columns
  const sourceItems = Array.from(sourceCol.items);
  const targetItems = Array.from(targetCol.items);

  const [removedCard] = sourceItems.splice(sourceIndex, 1);
  if (!removedCard) return columns;

  let insertIndex = targetIndex;
  if (edge === 'bottom') {
    insertIndex = targetIndex + 1;
  } else if (edge === 'top') {
    insertIndex = targetIndex;
  }

  const clampedTargetIndex = Math.max(
    0,
    Math.min(insertIndex, targetItems.length)
  );
  targetItems.splice(clampedTargetIndex, 0, removedCard);

  const newColumns = Array.from(columns);
  newColumns[sourceColIndex] = { ...sourceCol, items: sourceItems };
  newColumns[targetColIndex] = { ...targetCol, items: targetItems };

  return newColumns;
}

/**
 * Pure immutability helper to reorder columns, respecting horizontal edge hitboxes.
 */
export function reorderColumns(
  columns: KanbanColumn[],
  event: ColumnMoveEvent
): KanbanColumn[] {
  const { sourceIndex, targetIndex, edge = null } = event;

  return reorderWithEdge({
    list: columns,
    startIndex: sourceIndex,
    indexOfTarget: targetIndex,
    closestEdgeOfTarget: edge,
    axis: 'horizontal',
  });
}
