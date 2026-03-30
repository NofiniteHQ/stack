"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '../../utils';
import './Table.css';

/* ============================================================
 * Types
 * ============================================================ */

export interface TableColumn<T> {
  /** The key from your data object that this column maps to */
  key: keyof T;
  /** The text displayed in the table header */
  label: string;
  /** Enables clicking the header to sort the table by this column */
  sortable?: boolean;
  /** Aligns the text in the column header and cells. Defaults to 'left' */
  align?: 'left' | 'center' | 'right';
  /** Custom render function for the cell. Useful for formatting (e.g., currency) or custom UI (e.g., status badges) */
  render?: (row: T) => React.ReactNode;
  /** Optional custom sorting function to override the default alphabetic/numeric sort */
  sortFn?: (a: T, b: T) => number;
}

export interface TableProps<T> {
  /** Array of column configuration objects */
  columns: TableColumn<T>[];
  /** Array of data objects to render */
  data: T[];
  /** A unique identifier for each row (string/number key, or a function that returns a string) */
  rowKey: keyof T | ((row: T) => string);
  /** Text or React Node to display when the data array is empty */
  emptyText?: React.ReactNode;
  /** Custom class applied to the <table> element */
  className?: string;
}

type SortState<T> = {
  key: keyof T;
  direction: 'asc' | 'desc';
} | null;

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Table Component
 * * A highly generic data table that supports automatic sorting and custom cell rendering.
 * * Uses strict TypeScript generics (`<T>`) so it can perfectly map to any data shape passed into it.
 */
export function Table<T>({
  columns,
  data,
  rowKey,
  emptyText = 'No data available',
  className,
}: TableProps<T>) {
  const [sort, setSort] = useState<SortState<T>>(null);

  /* ----------------------------------------------------
     Sorting Logic
  ---------------------------------------------------- */
  const sortedData = useMemo(() => {
    if (!sort) return data;

    const { key, direction } = sort;
    const column = columns.find((c) => c.key === key);

    return [...data].sort((a, b) => {
      // 1. Fallback to custom sort function if provided
      if (column?.sortFn) {
        return direction === 'asc' ? column.sortFn(a, b) : column.sortFn(b, a);
      }

      const aVal = a[key];
      const bVal = b[key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return direction === 'asc' ? -1 : 1;
      if (bVal === null || bVal === undefined) return direction === 'asc' ? 1 : -1;

      // 2. Type-safe numeric sorting
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // 3. Type-safe string sorting (perfect for alphabetic ordering)
      const aStr = String(aVal);
      const bStr = String(bVal);
      const diff = aStr.localeCompare(bStr);
      
      return direction === 'asc' ? diff : -diff;
    });
  }, [data, sort, columns]);

  /* ----------------------------------------------------
     Event Handlers
  ---------------------------------------------------- */
  const toggleSort = (col: TableColumn<T>) => {
    if (!col.sortable) return;

    setSort((prev) => {
      // If clicking a new column, or clicking for the first time, sort ASC
      if (!prev || prev.key !== col.key) {
        return { key: col.key, direction: 'asc' };
      }
      // If currently ASC, flip to DESC
      if (prev.direction === 'asc') {
        return { key: col.key, direction: 'desc' };
      }
      // If currently DESC, clear the sort
      return null;
    });
  };

  const getRowId = (row: T): string => {
    return typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey]);
  };

  /* ----------------------------------------------------
     Render Helpers
  ---------------------------------------------------- */
  const renderSortIcon = (col: TableColumn<T>) => {
    if (!col.sortable) return null;

    const isActive = sort?.key === col.key;
    const dir = sort?.direction;

    return (
      <span className={cn("nui-table__sort-icon", isActive && "active")} aria-hidden="true">
        {isActive && dir === 'asc' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        ) : isActive && dir === 'desc' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        )}
      </span>
    );
  };

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */
  return (
    <div className="nui-table-wrapper">
      <table className={cn("nui-table", className)}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={String(col.key)} 
                scope="col"
                style={{ textAlign: col.align || 'left' }}
                aria-sort={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    className="nui-table__sort-button"
                    onClick={() => toggleSort(col)}
                    style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}
                  >
                    {col.label}
                    {renderSortIcon(col)}
                  </button>
                ) : (
                  <span className="nui-table__header-label">{col.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td className="nui-table__empty" colSpan={columns.length}>
                <div className="nui-table__empty-content">
                  {emptyText}
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr key={getRowId(row)} className="nui-table__row">
                {columns.map((col) => (
                  <td 
                    key={String(col.key)}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}