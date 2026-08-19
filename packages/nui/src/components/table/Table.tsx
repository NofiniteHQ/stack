"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';

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

export interface TableProps<T> extends Omit<React.HTMLAttributes<HTMLTableElement>, 'data'> {
 /** Array of column configuration objects */
 columns?: TableColumn<T>[];
 /** Array of data objects to render */
 data?: T[];
 /** A unique identifier for each row (string/number key, or a function that returns a string) */
 rowKey?: keyof T | ((row: T) => string);
 /** Text or React Node to display when the data array is empty */
 emptyText?: React.ReactNode;
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
function SmartTable<T>({
 columns = [],
 data = [],
 rowKey = 'id' as keyof T,
 emptyText = 'No data available',
 className,
 ...props
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
 <span className={cn("flex items-center justify-center transition-all duration-200", isActive ? "opacity-100 text-primary" : "text-muted opacity-50")} aria-hidden="true">
 {isActive && dir === 'asc' ? (
 <motion.svg initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></motion.svg>
 ) : isActive && dir === 'desc' ? (
 <motion.svg initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></motion.svg>
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
 <div className="w-full overflow-x-auto border border-default rounded-lg bg-surface">
 <table role="table" className={cn("w-full border-collapse font-sans text-sm text-default", className)}>
 <thead role="rowgroup">
 <tr role="row">
 {columns.map((col) => (
 <th 
 key={String(col.key)} 
 scope="col"
 role="columnheader"
 className="px-4 py-3 bg-subtle border-b border-default font-bold text-muted whitespace-nowrap transition-colors duration-200"
 style={{ textAlign: col.align || 'left' }}
 aria-sort={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
 >
 {col.sortable ? (
 <button
 type="button"
 className="inline-flex items-center gap-2 w-full py-1 bg-transparent border-none font-bold text-default cursor-pointer rounded-sm transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] "
 onClick={() => toggleSort(col)}
 style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}
 >
 {col.label}
 {renderSortIcon(col)}
 </button>
 ) : (
 <span className="inline-block py-1">{col.label}</span>
 )}
 </th>
 ))}
 </tr>
 </thead>

 <tbody role="rowgroup">
 {sortedData.length === 0 ? (
 <tr role="row">
 <td role="cell" className="p-8 text-center text-muted" colSpan={columns.length}>
 <div className="flex flex-col items-center justify-center gap-2">
 {emptyText}
 </div>
 </td>
 </tr>
 ) : (
 <AnimatePresence>
 {sortedData.map((row) => (
 <motion.tr 
 role="row"
 layout
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 key={getRowId(row)} 
 className="border-b border-default last:border-b-0 transition-colors duration-150 hover:bg-subtle"
 >
 {columns.map((col) => (
 <td 
 role="cell"
 key={String(col.key)}
 className="px-4 py-3 align-middle"
 style={{ textAlign: col.align || 'left' }}
 >
 {col.render ? col.render(row) : String(row[col.key] ?? '')}
 </td>
 ))}
 </motion.tr>
 ))}
 </AnimatePresence>
 )}
 </tbody>
 </table>
 </div>
 );
}

/* ============================================================
 * Primitives
 * ============================================================ */

const TableRoot = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
  <div className="w-full overflow-auto border border-default rounded-lg bg-surface">
    <table role="table" ref={ref} className={cn("w-full caption-bottom border-collapse font-sans text-sm text-default", className)} {...props} />
  </div>
  )
);
TableRoot.displayName = "Table.Root";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead role="rowgroup" ref={ref} className={cn("", className)} {...props} />
  )
);
TableHeader.displayName = "Table.Header";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody role="rowgroup" ref={ref} className={cn("", className)} {...props} />
  )
);
TableBody.displayName = "Table.Body";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr role="row" ref={ref} className={cn("border-b border-default transition-colors hover:bg-subtle data-[state=selected]:bg-muted", className)} {...props} />
  )
);
TableRow.displayName = "Table.Row";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th role="columnheader" ref={ref} className={cn("h-10 px-4 py-3 bg-subtle text-left align-middle font-bold text-muted whitespace-nowrap", className)} {...props} />
  )
);
TableHead.displayName = "Table.Head";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td role="cell" ref={ref} className={cn("px-4 py-3 align-middle", className)} {...props} />
  )
);
TableCell.displayName = "Table.Cell";

/* ============================================================
 * Polymorphic Export
 * ============================================================ */

type TableComponent = (<T>(props: TableProps<T> & { ref?: React.Ref<HTMLTableElement> }) => React.ReactElement) & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
};

const PolymorphicTable = React.forwardRef<HTMLTableElement, TableProps<any>>((props, ref) => {
  if (props.data) {
    return <SmartTable {...props} />;
  }
  return <TableRoot ref={ref} {...props} />;
}) as unknown as TableComponent;

PolymorphicTable.Header = TableHeader;
PolymorphicTable.Body = TableBody;
PolymorphicTable.Row = TableRow;
PolymorphicTable.Head = TableHead;
PolymorphicTable.Cell = TableCell;

export const Table = PolymorphicTable;