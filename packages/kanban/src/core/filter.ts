import type { KanbanItem, KanbanColumn, KanbanFilterOptions } from './types';

/**
 * Evaluates whether a card matches the given filter options.
 * Matches against query (title/description), assignee name/initials, badge label,
 * and optional custom filterCard predicate.
 */
export function matchCardFilter(
  item: KanbanItem,
  column: KanbanColumn,
  filters?: KanbanFilterOptions
): boolean {
  if (!filters) return true;

  // Custom filterCard predicate takes precedence
  if (filters.filterCard && !filters.filterCard(item, column)) {
    return false;
  }

  // Text search query matches title or description
  if (filters.filterQuery && filters.filterQuery.trim() !== '') {
    const q = filters.filterQuery.trim().toLowerCase();
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    if (!title.includes(q) && !desc.includes(q)) {
      return false;
    }
  }

  // Assignee filter matches assignee name or initials
  if (filters.filterAssignee && filters.filterAssignee.trim() !== '') {
    const a = filters.filterAssignee.trim().toLowerCase();
    const name = (item.assignee?.name || '').toLowerCase();
    const initials = (item.assignee?.initials || '').toLowerCase();
    if (!name.includes(a) && !initials.includes(a)) {
      return false;
    }
  }

  // Badge filter matches badge label
  if (filters.filterBadge && filters.filterBadge.trim() !== '') {
    const b = filters.filterBadge.trim().toLowerCase();
    const label = (item.badge?.label || '').toLowerCase();
    if (!label.includes(b)) {
      return false;
    }
  }

  return true;
}

/**
 * Determines whether any filter condition is active.
 */
export function hasActiveFilter(filters?: KanbanFilterOptions): boolean {
  if (!filters) return false;
  return Boolean(
    (filters.filterQuery && filters.filterQuery.trim() !== '') ||
      (filters.filterAssignee && filters.filterAssignee.trim() !== '') ||
      (filters.filterBadge && filters.filterBadge.trim() !== '') ||
      filters.filterCard
  );
}
