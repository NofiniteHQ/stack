import { clamp } from '@nofinite/utils';
import type {
  KanbanColumn,
  CardMoveEvent,
  ColumnMoveEvent,
  Edge,
  MoveCardOptions,
} from './types';

/**
 * Pure immutability helper to reorder an item within a single array
 * Includes boundary guards against negative or out-of-bounds indices (KANBAN-M3-04, KANBAN-M3-05).
 */
export function reorderArray<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  if (
    startIndex < 0 ||
    startIndex >= list.length ||
    !Number.isFinite(startIndex)
  ) {
    return Array.from(list);
  }

  const safeEndIndex = Number.isFinite(endIndex) ? endIndex : 0;
  const clampedEndIndex = clamp(safeEndIndex, 0, list.length - 1);

  if (startIndex === clampedEndIndex) {
    return Array.from(list);
  }

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  if (removed !== undefined) {
    result.splice(clampedEndIndex, 0, removed);
  }
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
  event: CardMoveEvent,
  options?: MoveCardOptions
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

  // Boundary check on sourceIndex
  if (
    sourceIndex < 0 ||
    sourceIndex >= sourceCol.items.length ||
    !Number.isFinite(sourceIndex)
  ) {
    return columns;
  }

  // Check custom validation hook if provided
  if (options?.canMoveCard && !options.canMoveCard(event)) {
    return columns;
  }

  // Moving within the same column
  if (sourceColumnId === targetColumnId) {
    const safeTargetIndex = Number.isFinite(targetIndex)
      ? clamp(targetIndex, 0, sourceCol.items.length - 1)
      : 0;
    const newItems = reorderWithEdge({
      list: sourceCol.items,
      startIndex: sourceIndex,
      indexOfTarget: safeTargetIndex,
      closestEdgeOfTarget: edge,
      axis: 'vertical',
    });
    const newColumns = Array.from(columns);
    newColumns[sourceColIndex] = { ...sourceCol, items: newItems };
    return newColumns;
  }

  // Moving across columns
  // Check WIP limit on target column if enforceWipLimit is enabled
  if (
    options?.enforceWipLimit &&
    typeof targetCol.wipLimit === 'number' &&
    targetCol.wipLimit > 0 &&
    targetCol.items.length >= targetCol.wipLimit
  ) {
    return columns;
  }

  // Moving across columns
  const sourceItems = Array.from(sourceCol.items);
  const targetItems = Array.from(targetCol.items);

  const [removedCard] = sourceItems.splice(sourceIndex, 1);
  if (!removedCard) return columns;

  let insertIndex = Number.isFinite(targetIndex)
    ? targetIndex
    : targetItems.length;
  if (edge === 'bottom') {
    insertIndex = insertIndex + 1;
  } else if (edge === 'top') {
    // No-op for top edge: targetIndex is already the insert position
  }

  const clampedTargetIndex = clamp(insertIndex, 0, targetItems.length);
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

  if (
    sourceIndex < 0 ||
    sourceIndex >= columns.length ||
    !Number.isFinite(sourceIndex)
  ) {
    return columns;
  }

  const safeTargetIndex = Number.isFinite(targetIndex)
    ? clamp(targetIndex, 0, columns.length - 1)
    : 0;

  return reorderWithEdge({
    list: columns,
    startIndex: sourceIndex,
    indexOfTarget: safeTargetIndex,
    closestEdgeOfTarget: edge,
    axis: 'horizontal',
  });
}
