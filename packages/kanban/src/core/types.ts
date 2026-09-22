/**
 * @nofinite/kanban - Types
 */

export interface KanbanItem {
  id: string;
  content: unknown;
  [key: string]: unknown;
}

export interface KanbanColumn {
  id: string;
  title?: string;
  header?: unknown;
  footer?: unknown;
  items: KanbanItem[];
  [key: string]: unknown;
}

export interface CardMoveEvent {
  cardId: string;
  sourceColumnId: string;
  targetColumnId: string;
  sourceIndex: number;
  targetIndex: number;
}

export interface ColumnMoveEvent {
  columnId: string;
  sourceIndex: number;
  targetIndex: number;
}
