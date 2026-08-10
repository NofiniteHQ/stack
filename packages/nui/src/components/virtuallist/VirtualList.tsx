"use client";

import React, { useRef, useState, useCallback, UIEvent, forwardRef } from 'react';
import { cn } from '../../utils';

/* ============================================================
 * Types
 * ============================================================ */

export interface VirtualListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
 /** Array of data items to render */
 items: T[];
 /** Height of the scrollable viewport in pixels */
 height: number;
 /** Fixed height for each row in pixels. Defaults to 40. */
 itemHeight?: number;
 /** Extra rows to render above and below the viewport to prevent white flashes during fast scrolling */
 overscan?: number;
 /** Extracts a unique React key for each item. Crucial for stable rendering during sorts/filters! */
 keyExtractor?: (item: T, index: number) => string | number;
 /** The render function for the row */
 renderItem: (item: T, index: number) => React.ReactNode;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * VirtualList Component
 * * High-performance scrolling for massive datasets.
 * * Uses GPU-accelerated transforms and strict mathematical windowing to only render visible DOM nodes.
 */
function VirtualListInner<T>(
 {
 items,
 height,
 itemHeight = 40,
 overscan = 3,
 keyExtractor,
 renderItem,
 className,
 onScroll,
 ...props
 }: VirtualListProps<T>,
 ref: React.ForwardedRef<HTMLDivElement>
) {
 const [scrollTop, setScrollTop] = useState(0);

 // Internal ref for scroll tracking, merged with forwarded ref
 const internalRef = useRef<HTMLDivElement>(null);
 const setRefs = useCallback(
 (node: HTMLDivElement | null) => {
 internalRef.current = node;
 if (typeof ref === 'function') {
 ref(node);
 } else if (ref) {
 ref.current = node;
 }
 },
 [ref]
 );

 /* ----------------------------------------------------
 Scroll Handling (React Synthetic Event)
 ---------------------------------------------------- */
 const handleScroll = useCallback(
 (e: UIEvent<HTMLDivElement>) => {
 // React's Synthetic events are perfectly batched in React 18+
 setScrollTop(e.currentTarget.scrollTop);
 // Preserve any consumer-provided onScroll handlers
 onScroll?.(e);
 },
 [onScroll]
 );

 /* ----------------------------------------------------
 Virtualization Math
 ---------------------------------------------------- */
 const totalItems = items.length;
 const totalHeight = totalItems * itemHeight;

 // Calculate exactly which indices are currently visible in the viewport
 const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
 const endIndex = Math.min(
 totalItems - 1,
 Math.floor((scrollTop + height) / itemHeight) + overscan
 );

 const visibleItems = items.slice(startIndex, endIndex + 1);

 // Calculate the exact pixel offset to push the visible window down
 const offsetY = startIndex * itemHeight;

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 return (
 <div
 ref={setRefs}
 className={cn("relative w-full overflow-y-auto overflow-x-hidden bg-surface border border-default rounded-md font-sans will-change-[scroll-position] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", className)}
 style={{ height: `${height}px` }}
 onScroll={handleScroll}
 role="list"
 tabIndex={0}
 {...props}
 >
 {/* 1. The Spacer: Forces the container to be the exact scrollable height of 10k+ rows */}
 <div
 className="w-full pointer-events-none"
 style={{ height: `${totalHeight}px` }}
 />

 {/* 2. The Window: Hardware accelerated sliding container */}
 <div
 className="absolute top-0 left-0 w-full will-change-transform"
 style={{ transform: `translateY(${offsetY}px)` }}
 >
 {visibleItems.map((item, i) => {
 const actualIndex = startIndex + i;
 // Safely fall back to index if no keyExtractor is provided
 const itemKey = keyExtractor ? keyExtractor(item, actualIndex) : actualIndex;

 return (
 <div
 key={itemKey}
 role="listitem"
 className="flex items-center px-4 text-default text-sm whitespace-nowrap overflow-hidden text-ellipsis border-b border-default transition-colors duration-100 ease-in-out hover:bg-subtle last:border-b-0"
 style={{ height: `${itemHeight}px` }}
 >
 {renderItem(item, actualIndex)}
 </div>
 );
 })}
 </div>
 </div>
 );
}

// Type assertion required to allow forwardRef to support generics <T>
export const VirtualList = forwardRef(VirtualListInner) as <T>(
 props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

(VirtualList as React.FC).displayName = 'VirtualList';