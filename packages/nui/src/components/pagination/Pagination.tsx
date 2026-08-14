import React, { useMemo } from 'react';
import { cn } from '../../utils';

/* ============================================================
 * Types
 * ============================================================ */

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
 /** The current active page number (1-indexed) */
 page: number;
 /** The total number of pages available */
 total: number;
 /** Callback fired when a new page is selected */
 onChange: (page: number) => void;
 /** Number of page links to show on each side of the current page. Defaults to 1. */
 siblings?: number;
 /** Custom class name applied to the root navigation element */
 className?: string;
 /** Disables all interaction with the pagination controls */
 disabled?: boolean;
}

type PaginationItem = number | 'left-ellipsis' | 'right-ellipsis';

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Pagination Component
 * * A navigation structure for splitting large lists across multiple pages.
 * * Automatically calculates when to collapse page ranges into ellipses based on siblings.
 * * Uses standard <nav> and <ul> elements for WAI-ARIA compliance.
 */
export function Pagination({
 page,
 total,
 onChange,
 siblings = 1,
 className,
 disabled = false,
 ...props
}: PaginationProps) {
 
 // Guard against invalid ranges supplied by the developer
 const currentPage = Math.max(1, Math.min(page, total));

 const goTo = (p: number) => {
 if (disabled || p < 1 || p > total || p === currentPage) return;
 onChange(p);
 };

 /* ----------------------------------------------------
 Mathematically Perfect Page Generation
 ---------------------------------------------------- */
 const pages = useMemo<PaginationItem[]>(() => {
 // Math: 1 (first) + 1 (last) + 2 (siblings) + 1 (current) + 2 (ellipses)
 const totalPageNumbersToShow = 5 + siblings * 2;

 // 1. If we don't have enough pages to warrant an ellipsis, show them all
 if (total <= totalPageNumbersToShow) {
 return Array.from({ length: total }, (_, i) => i + 1);
 }

 const leftSiblingIndex = Math.max(currentPage - siblings, 1);
 const rightSiblingIndex = Math.min(currentPage + siblings, total);

 // 2. We only show an ellipsis if there are MORE than 2 pages hidden
 const showLeftDots = leftSiblingIndex > 2;
 const showRightDots = rightSiblingIndex < total - 2;

 const firstPageIndex = 1;
 const lastPageIndex = total;

 // Case 1: Show right dots only (e.g., [1] 2 3 4 5 ... 10)
 if (!showLeftDots && showRightDots) {
 const leftItemCount = 3 + 2 * siblings;
 const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
 return [...leftRange, 'right-ellipsis', lastPageIndex];
 }

 // Case 2: Show left dots only (e.g., 1 ... 6 7 8 9 [10])
 if (showLeftDots && !showRightDots) {
 const rightItemCount = 3 + 2 * siblings;
 const rightRange = Array.from({ length: rightItemCount }, (_, i) => total - rightItemCount + 1 + i);
 return [firstPageIndex, 'left-ellipsis', ...rightRange];
 }

 // Case 3: Show both dots (e.g., 1 ... 4 [5] 6 ... 10)
 if (showLeftDots && showRightDots) {
 const middleRange = Array.from(
 { length: rightSiblingIndex - leftSiblingIndex + 1 },
 (_, i) => leftSiblingIndex + i
 );
 return [firstPageIndex, 'left-ellipsis', ...middleRange, 'right-ellipsis', lastPageIndex];
 }

 return [];
 }, [total, currentPage, siblings]);

 if (total <= 1) return null;

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 return (
 <nav
 className={cn("flex items-center justify-center font-sans", className)}
 aria-label="Pagination Navigation"
 {...props}
 >
 <ul className="flex items-center gap-1 list-none p-0 m-0">
 
 {/* Previous Button */}
 <li className="block">
 <button
 className="inline-flex items-center justify-center min-w-[36px] h-9 px-2 bg-transparent border border-default rounded-md text-muted text-sm font-sans font-medium cursor-pointer transition-all duration-200 hover:not(:disabled):text-primary hover:not(:disabled):border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:text-muted"
 onClick={() => goTo(currentPage - 1)}
 disabled={disabled || currentPage === 1}
 aria-label="Previous Page"
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polyline points="15 18 9 12 15 6"></polyline>
 </svg>
 </button>
 </li>

 {/* Page Numbers & Ellipses */}
 {pages.map((p) => {
 if (p === 'left-ellipsis' || p === 'right-ellipsis') {
 return (
 <li key={p} className="inline-flex items-center justify-center w-9 h-9 text-muted select-none tracking-widest font-bold" aria-hidden="true">
 ...
 </li>
 );
 }

 const isCurrent = p === currentPage;

 return (
 <li key={`page-${p}`} className="block">
 <button
 className={cn(
 "inline-flex items-center justify-center min-w-[36px] h-9 px-2 border rounded-md font-sans text-sm font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:text-muted",
 isCurrent 
 ? "border-primary text-primary font-bold shadow-sm bg-subtle" 
 : "bg-transparent border-transparent text-default hover:not(:disabled):text-primary hover:not(:disabled):border-primary"
 )}
 aria-current={isCurrent ? 'page' : undefined}
 aria-label={isCurrent ? `Page ${p}` : `Go to page ${p}`}
 disabled={disabled}
 onClick={() => goTo(p)}
 >
 {p}
 </button>
 </li>
 );
 })}

 {/* Next Button */}
 <li className="block">
 <button
 className="inline-flex items-center justify-center min-w-[36px] h-9 px-2 bg-transparent border border-default rounded-md text-muted text-sm font-sans font-medium cursor-pointer transition-all duration-200 hover:not(:disabled):text-primary hover:not(:disabled):border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:text-muted"
 onClick={() => goTo(currentPage + 1)}
 disabled={disabled || currentPage === total}
 aria-label="Next Page"
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polyline points="9 18 15 12 9 6"></polyline>
 </svg>
 </button>
 </li>
 </ul>
 </nav>
 );
}