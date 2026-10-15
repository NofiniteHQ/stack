/**
 * @nofinite/kanban - Types
 * Universal, framework-agnostic task board and Kanban suite.
 */

export type KanbanBadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'subtle';

export interface KanbanBadge {
  label: string;
  variant?: KanbanBadgeVariant;
}

export interface KanbanAssignee {
  name: string;
  avatar?: string;
  initials?: string;
}

export interface KanbanSubtasks {
  total: number;
  completed: number;
}

export interface KanbanItem {
  id: string;
  title?: string;
  description?: string;
  badge?: KanbanBadge;
  assignee?: KanbanAssignee;
  dueDate?: string;
  isOverdue?: boolean;
  subtasks?: KanbanSubtasks;
  content?: any;
  [key: string]: unknown;
}

export interface KanbanColumn {
  id: string;
  title?: string;
  items: KanbanItem[];
  allowAdd?: boolean;
  headerActions?: boolean;
  wipLimit?: number;
  header?: unknown;
  footer?: unknown;
  [key: string]: unknown;
}

export type Edge = 'top' | 'right' | 'bottom' | 'left';

export interface CardMoveEvent {
  cardId: string;
  sourceColumnId: string;
  targetColumnId: string;
  sourceIndex: number;
  targetIndex: number;
  edge?: Edge | null;
}

export interface ColumnMoveEvent {
  columnId: string;
  sourceIndex: number;
  targetIndex: number;
  edge?: Edge | null;
}

export interface CardAddEvent {
  columnId: string;
}

export interface CardClickEvent {
  cardId: string;
  columnId: string;
  item: KanbanItem;
}

export interface ColumnOptionsEvent {
  columnId: string;
}

export interface MoveCardOptions {
  enforceWipLimit?: boolean;
  canMoveCard?: (event: CardMoveEvent) => boolean;
}

export interface KanbanStoreOptions {
  enforceWipLimit?: boolean;
  canMoveCard?: (event: CardMoveEvent) => boolean;
}

export interface KanbanBoardEvents {
  onCardMove?: (event: CardMoveEvent) => void;
  onColumnMove?: (event: ColumnMoveEvent) => void;
  onCardAdd?: (event: CardAddEvent) => void;
  onCardClick?: (event: CardClickEvent) => void;
  onColumnOptions?: (event: ColumnOptionsEvent) => void;
  onColumnAdd?: () => void;
  onColumnClear?: (columnId: string) => void;
  canMoveCard?: (event: CardMoveEvent) => boolean;
}

export interface KanbanFilterOptions {
  filterQuery?: string;
  filterAssignee?: string;
  filterBadge?: string;
  filterCard?: (item: KanbanItem, column: KanbanColumn) => boolean;
}

export interface KanbanRenderOptions extends KanbanFilterOptions {
  columns: KanbanColumn[];
  allowAdd?: boolean;
  allowAddColumn?: boolean;
  onColumnAdd?: () => void;
  addColumnLabel?: string;
  headerActions?: boolean;
  className?: string;
  columnClassName?: string;
}

export interface KanbanBoardOptions
  extends KanbanBoardEvents,
    KanbanFilterOptions {
  container: HTMLElement;
  columns: KanbanColumn[];
  allowAdd?: boolean;
  allowAddColumn?: boolean;
  addColumnLabel?: string;
  headerActions?: boolean;
  enforceWipLimit?: boolean;
  className?: string;
  columnClassName?: string;
}

export interface KanbanBoardInstance {
  destroy: () => void;
  update: (columns: KanbanColumn[]) => void;
  getColumns: () => KanbanColumn[];
  setColumns?: (columns: KanbanColumn[]) => void;
  moveCard: (event: CardMoveEvent) => boolean;
  moveColumn: (event: ColumnMoveEvent) => void;
  addCard: (columnId: string, item: KanbanItem) => void;
  removeCard: (columnId: string, cardId: string) => void;
  updateCard?: (
    columnId: string,
    cardId: string,
    partial: Partial<KanbanItem>
  ) => void;
  addColumn?: (column: KanbanColumn) => void;
  removeColumn?: (columnId: string) => void;
  clearColumn?: (columnId: string) => void;
  focusCard?: (cardId: string) => void;
  setFilter?: (filter: KanbanFilterOptions) => void;
  getFilter?: () => KanbanFilterOptions;
}
