"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';
import { Checkbox } from '../checkbox/Checkbox';

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
 <div className={cn("flex flex-col w-full border border-default rounded-lg bg-surface shadow-sm font-sans overflow-hidden", className)}>
 <div 
 className="w-full overflow-x-auto outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
 onKeyDown={onKeyDownTable}
 tabIndex={0}
 >
 <table className="w-full border-collapse text-left text-sm" role="grid" aria-rowcount={rows.length}>
 
 {/* HEADER */}
 <thead className="bg-subtle border-b border-default">
 <tr role="row">
 {selectable && (
 <th className="px-4 py-3 font-medium text-subtle whitespace-nowrap select-none w-12 text-center pr-0" scope="col">
 <Checkbox
 aria-label="Select all on page"
 onChange={selectAllOnPage}
 checked={isAllPageSelected}
 />
 </th>
 )}

 {columns.map((col) => {
 const isSorted = sort.key === col.key;
 return (
 <th
 key={col.key}
 className="px-4 py-3 font-medium text-subtle whitespace-nowrap select-none"
 style={{ 
 width: col.width,
 textAlign: col.align || 'left'
 }}
 scope="col"
 aria-sort={isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
 >
 <div 
 className={cn(
 "inline-flex items-center gap-2",
 col.sortable && "cursor-pointer hover:text-primary group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
 col.align === 'right' && "justify-end",
 col.align === 'center' && "justify-center"
 )}
 onClick={() => col.sortable && toggleSort(col.key)}
 tabIndex={col.sortable ? 0 : undefined}
 onKeyDown={(e) => {
 if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
 e.preventDefault();
 toggleSort(col.key);
 }
 }}
 >
 <span>{col.title}</span>
 {col.sortable && (
 <span className={cn("text-muted opacity-30 transition-all duration-200 group-hover:opacity-100", isSorted && "opacity-100 text-primary")}>
 <AnimatePresence mode="wait">
 {isSorted ? (
   sort.dir === 'desc' ? (
     <motion.svg key="desc" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></motion.svg>
   ) : (
     <motion.svg key="asc" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></motion.svg>
   )
 ) : (
   <motion.svg key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></motion.svg>
 )}
 </AnimatePresence>
 </span>
 )}
 </div>
 </th>
 );
 })}

 {showActions && <th className="px-4 py-3 font-medium text-subtle whitespace-nowrap select-none text-right" scope="col"></th>}
 </tr>
 </thead>

 {/* BODY */}
 <tbody role="rowgroup">
 {paginatedRows.length === 0 ? (
 <tr>
 <td colSpan={columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)} className="p-8 text-center text-muted">
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
 "border-b border-default last:border-b-0 transition-colors duration-150 ease-in-out hover:bg-subtle",
 isSelected && "bg-subtle hover:bg-muted",
 isFocused && "outline-none ring-2 ring-inset ring-primary",
 onRowClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
 )}
 onClick={() => {
 if (selectable) toggleSelectRow(rid);
 onRowClick?.(row);
 setFocusedIndex(idx);
 }}
 >
 {selectable && (
 <td className="px-4 py-3 text-default align-middle w-12 text-center pr-0">
 <Checkbox
 checked={isSelected}
 onClick={(e) => e.stopPropagation()}
 onChange={() => toggleSelectRow(rid)}
 aria-label={`Select row`}
 />
 </td>
 )}

 {columns.map((col) => (
 <td
 key={col.key}
 role="gridcell"
 className="px-4 py-3 text-default align-middle"
 style={{ textAlign: col.align || 'left' }}
 >
 {col.render ? col.render(row) : String(row[col.key] ?? '')}
 </td>
 ))}

 {showActions && (
 <td className="px-4 py-3 text-default align-middle text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
 <div className="flex items-center justify-between px-4 py-3 border-t border-default bg-surface rounded-b-lg">
 <span className="text-sm text-subtle">
 Page {currentPage} of {totalPages}
 </span>
 <div className="flex gap-2">
 <button
 className="flex items-center justify-center w-8 h-8 bg-transparent border border-default rounded-md text-default cursor-pointer transition-all duration-200 hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent disabled:hover:border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
 onClick={() => setPage(currentPage - 1)}
 disabled={currentPage === 1}
 aria-label="Previous Page"
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
 </button>
 <button
 className="flex items-center justify-center w-8 h-8 bg-transparent border border-default rounded-md text-default cursor-pointer transition-all duration-200 hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent disabled:hover:border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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