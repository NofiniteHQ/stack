import type {
  KanbanColumn,
  KanbanItem,
  CardMoveEvent,
  ColumnMoveEvent,
} from './types';
import { moveCardBetweenColumns, reorderColumns } from './reorder';

export interface KanbanStore {
  getState: () => KanbanColumn[];
  setState: (columns: KanbanColumn[]) => void;
  subscribe: (listener: (columns: KanbanColumn[]) => void) => () => void;
  moveCard: (event: CardMoveEvent) => void;
  moveColumn: (event: ColumnMoveEvent) => void;
  addCard: (columnId: string, item: KanbanItem) => void;
  removeCard: (columnId: string, cardId: string) => void;
  updateCard: (
    columnId: string,
    cardId: string,
    partial: Partial<KanbanItem>
  ) => void;
}

export function createKanbanStore(
  initialColumns: KanbanColumn[] = []
): KanbanStore {
  let state = Array.from(initialColumns);
  const listeners = new Set<(columns: KanbanColumn[]) => void>();

  function notify() {
    for (const listener of listeners) {
      listener(state);
    }
  }

  return {
    getState: () => state,
    setState: (columns: KanbanColumn[]) => {
      state = Array.from(columns);
      notify();
    },
    subscribe: (listener: (columns: KanbanColumn[]) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    moveCard: (event: CardMoveEvent) => {
      state = moveCardBetweenColumns(state, event);
      notify();
    },
    moveColumn: (event: ColumnMoveEvent) => {
      state = reorderColumns(state, event);
      notify();
    },
    addCard: (columnId: string, item: KanbanItem) => {
      const colIndex = state.findIndex((c) => c.id === columnId);
      if (colIndex === -1) return;
      const col = state[colIndex];
      const newCol = {
        ...col,
        items: [...col.items, item],
      };
      const newState = Array.from(state);
      newState[colIndex] = newCol;
      state = newState;
      notify();
    },
    removeCard: (columnId: string, cardId: string) => {
      const colIndex = state.findIndex((c) => c.id === columnId);
      if (colIndex === -1) return;
      const col = state[colIndex];
      const newCol = {
        ...col,
        items: col.items.filter((i) => i.id !== cardId),
      };
      const newState = Array.from(state);
      newState[colIndex] = newCol;
      state = newState;
      notify();
    },
    updateCard: (
      columnId: string,
      cardId: string,
      partial: Partial<KanbanItem>
    ) => {
      const colIndex = state.findIndex((c) => c.id === columnId);
      if (colIndex === -1) return;
      const col = state[colIndex];
      const itemIndex = col.items.findIndex((i) => i.id === cardId);
      if (itemIndex === -1) return;

      const newItems = Array.from(col.items);
      newItems[itemIndex] = { ...newItems[itemIndex], ...partial };
      const newCol = { ...col, items: newItems };
      const newState = Array.from(state);
      newState[colIndex] = newCol;
      state = newState;
      notify();
    },
  };
}
