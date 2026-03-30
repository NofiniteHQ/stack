"use client";

import React, { useMemo, useState } from 'react';
import { cn } from '../../utils';
import './DataGrid.css';

/* ============================================================
 * Types
 * ============================================================ */

export type DataRow = Record<string, unknown> & {
  /** Strongly recommended to provide an ID for reliable row selection */
  id?: string | number;
};

export type DataGridColumn<T> = {
  /** The key must exist on the generic type T */
  key: Extract<keyof T, string>;
  title: React.ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  /** Custom render function for the cell content. Useful for formatting dates or rendering JSX. */
  render?: (row: T) => React.ReactNode;
  /** Custom sort function. If omitted, the grid falls back to a robust default string/number sort. */
  sortFn?: (a: T, b: T) => number; 
};

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  rows: T[];
  /** Controlled page number */
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  selectable?: boolean;
  /** Controlled selection state */
  selectedRowIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
  onRowClick?: (row: T) => void;
  /** Renders a floating action column on the far right of the grid */
  renderRowActions?: (row: T) => React.ReactNode;
  className?: string;
  disablePagination?: boolean;
}

type SortState = { key: string | null; dir: 'asc' | 'desc' | null };

/* ============================================================
 * Component
 * ============================================================ */

/**
 * DataGrid Component
 * * A highly performant, accessible table for displaying structured data.
 */
export function DataGrid<T>({
  columns,
  rows,
  page: controlledPage,
  pageSize = 10,
  onPageChange,
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  onRowClick,
  renderRowActions,
  className,
  disablePagination = false,
}: DataGridProps<T>) {
  const [sort, setSort] = useState<SortState>({ key: null, dir: null });
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = controlledPage ?? internalPage;

  const [internalSelection, setInternalSelection] = useState<Set<string | number>>(new Set());
  const selection = selectedRowIds ?? internalSelection;

  /* ----------------------------------------------------
     Data Processing Engine
  ---------------------------------------------------- */
  const totalPages = useMemo(() => {
    if (disablePagination || rows.length === 0) return 1;
    return Math.ceil(rows.length / pageSize);
  }, [rows.length, pageSize, disablePagination]);

  const sortedRows = useMemo(() => {
    if (!sort.key || !sort.dir) return [...rows];

    const key = sort.key as keyof T;
    const dir = sort.dir === 'asc' ? 1 : -1;
    const column = columns.find(c => c.key === key);

    return [...rows].sort((a, b) => {
      // 1. Custom Sort Function override
      if (column?.sortFn) {
        return sort.dir === 'asc' ? column.sortFn(a, b) : column.sortFn(b, a);
      }

      // 2. Default Universal Sort
      const va = a[key];
      const vb = b[key];

      if (va === vb) return 0;
      if (va === undefined || va === null) return -1 * dir;
      if (vb === undefined || vb === null) return 1 * dir;

      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      if (va instanceof Date && vb instanceof Date) return (va.getTime() - vb.getTime()) * dir;

      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [rows, sort, columns]);

  const paginatedRows = useMemo(() => {
    if (disablePagination) return sortedRows;
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize, disablePagination]);

  /* ----------------------------------------------------
     Event Handlers
  ---------------------------------------------------- */
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const getRowId = (r: T, idx: number) => {
    // Safely cast to extract ID, fallback to index if missing
    const row = r as { id?: string | number };
    return row.id ?? `row-${idx}`;
  };

  const toggleSort = (key: string) => {
    setSort((prev) => {
      // Cycle state: asc -> desc -> un-sorted
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: null };
    });
  };

  const setPage = (page: number) => {
    const next = Math.max(1, Math.min(totalPages, page));
    if (controlledPage === undefined) setInternalPage(next);
    onPageChange?.(next);
  };

  const toggleSelectRow = (id: string | number) => {
    const update = (set: Set<string | number>) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    };

    if (selectedRowIds) {
      onSelectionChange?.(update(selection));
    } else {
      setInternalSelection((prev) => {
        const next = update(prev);
        onSelectionChange?.(next);
        return next;
      });
    }
  };

  const selectAllOnPage = () => {
    const ids = paginatedRows.map((r, i) => getRowId(r, i));
    const allSelected = ids.every((id) => selection.has(id));

    const update = (set: Set<string | number>) => {
      const next = new Set(set);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    };

    if (selectedRowIds) {
      onSelectionChange?.(update(selection));
    } else {
      setInternalSelection((prev) => {
        const next = update(prev);
        onSelectionChange?.(next);
        return next;
      });
    }
  };

  const onKeyDownTable = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (paginatedRows.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => prev === null ? 0 : Math.min(paginatedRows.length - 1, prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev === null ? 0 : Math.max(0, prev - 1)));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex !== null) {
          const row = paginatedRows[focusedIndex];
          const id = getRowId(row, focusedIndex);
          if (selectable) toggleSelectRow(id);
          onRowClick?.(row);
        }
        break;
      default:
        break;
    }
  };

  const showActions = Boolean(renderRowActions);
  const isAllPageSelected = paginatedRows.length > 0 && paginatedRows.every((r, i) => selection.has(getRowId(r, i)));

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */
  return (
    <div className={cn("nui-datagrid-root", className)}>
      <div 
        className="nui-datagrid-table-wrapper"
        onKeyDown={onKeyDownTable}
        tabIndex={0}
      >
        <table className="nui-datagrid-table" role="grid" aria-rowcount={rows.length}>
          
          {/* HEADER */}
          <thead className="nui-datagrid-thead">
            <tr role="row">
              {selectable && (
                <th className="nui-datagrid-th nui-datagrid-th--select" scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all on page"
                    onChange={selectAllOnPage}
                    checked={isAllPageSelected}
                    className="nui-datagrid-checkbox"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    className="nui-datagrid-th"
                    style={{ 
                      width: col.width,
                      textAlign: col.align || 'left'
                    }}
                    scope="col"
                    aria-sort={isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div 
                      className={cn(
                        "nui-datagrid-th-content",
                        col.sortable && "sortable",
                        col.align === 'right' && "justify-end",
                        col.align === 'center' && "justify-center"
                      )}
                      onClick={() => col.sortable && toggleSort(col.key)}
                    >
                      <span className="nui-datagrid-th-title">{col.title}</span>
                      {col.sortable && (
                        <span className={cn("nui-datagrid-sort-icon", isSorted && "active")}>
                          {isSorted && sort.dir === 'desc' ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {showActions && <th className="nui-datagrid-th nui-datagrid-th--actions" scope="col"></th>}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="nui-datagrid-tbody" role="rowgroup">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)} className="nui-datagrid-empty">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => {
                const rid = getRowId(row, idx);
                const isSelected = selection.has(rid);
                const isFocused = focusedIndex === idx;

                return (
                  <tr
                    key={String(rid)}
                    role="row"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    className={cn(
                      "nui-datagrid-tr",
                      isSelected && "selected",
                      isFocused && "focused",
                      onRowClick && "clickable"
                    )}
                    onClick={() => {
                      if (selectable) toggleSelectRow(rid);
                      onRowClick?.(row);
                      setFocusedIndex(idx);
                    }}
                  >
                    {selectable && (
                      <td className="nui-datagrid-td nui-datagrid-td--select">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSelectRow(rid)}
                          aria-label={`Select row`}
                          className="nui-datagrid-checkbox"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        role="gridcell"
                        className="nui-datagrid-td"
                        style={{ textAlign: col.align || 'left' }}
                      >
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    ))}

                    {showActions && (
                      <td className="nui-datagrid-td nui-datagrid-td--actions" onClick={(e) => e.stopPropagation()}>
                        {renderRowActions?.(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {!disablePagination && totalPages > 1 && (
        <div className="nui-datagrid-pagination">
          <span className="nui-datagrid-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <div className="nui-datagrid-page-controls">
            <button
              className="nui-datagrid-page-btn"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button
              className="nui-datagrid-page-btn"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}