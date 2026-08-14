"use client";

import React, { useRef, useState, useCallback, UIEvent, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { cn } from '../../utils';

/* ============================================================
 * Types
 * ============================================================ */

export interface VirtualListHandle {
  /** Exposes the underlying scroll container DOM element */
  element: HTMLDivElement | null;
  /** Programmatically scroll to a specific index */
  scrollToIndex: (index: number) => void;
}

export interface VirtualListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
 /** Array of data items to render */
 items: T[];
 /** Height of the scrollable viewport in pixels. If omitted, it will automatically size to its container. */
 height?: number;
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
  ref: React.ForwardedRef<VirtualListHandle>
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height || 0);

  const internalRef = useRef<HTMLDivElement>(null);

  /* ----------------------------------------------------
  Auto-Sizing (ResizeObserver)
  ---------------------------------------------------- */
  useLayoutEffect(() => {
    // If a hardcoded height is provided, use it and don't observe
    if (height !== undefined) {
      setContainerHeight(height);
      return;
    }

    const node = internalRef.current;
    if (!node) return;

    // Use ResizeObserver to auto-detect the container height dynamically
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [height]);

  /* ----------------------------------------------------
  Imperative API (scrollToIndex)
  ---------------------------------------------------- */
  useImperativeHandle(ref, () => ({
    element: internalRef.current,
    scrollToIndex: (index: number) => {
      if (internalRef.current) {
        // Safely clamp the index to prevent scrolling out of bounds
        const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
        internalRef.current.scrollTop = clampedIndex * itemHeight;
      }
    }
  }));

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
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  /* ----------------------------------------------------
  Render
  ---------------------------------------------------- */
  return (
    <div
      ref={internalRef}
      className={cn("relative w-full overflow-y-auto overflow-x-hidden bg-surface border border-default rounded-md font-sans will-change-[scroll-position] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", className)}
      style={{ height: height !== undefined ? `${height}px` : '100%' }}
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

      {/* 2. Absolutely Positioned Items */}
      {visibleItems.map((item, i) => {
        const actualIndex = startIndex + i;
        // Safely fall back to index if no keyExtractor is provided
        const itemKey = keyExtractor ? keyExtractor(item, actualIndex) : actualIndex;

        return (
          <div
            key={itemKey}
            role="listitem"
            aria-setsize={totalItems}
            aria-posinset={actualIndex + 1}
            className={cn(
              "absolute top-0 left-0 w-full flex items-center px-4 text-default text-sm whitespace-nowrap overflow-hidden text-ellipsis border-default hover:bg-subtle",
              actualIndex === totalItems - 1 ? "border-b-0" : "border-b"
            )}
            style={{ 
              height: `${itemHeight}px`,
              transform: `translateY(${actualIndex * itemHeight}px)` 
            }}
          >
            {renderItem(item, actualIndex)}
          </div>
        );
      })}
    </div>
  );
}

// Type assertion required to allow forwardRef to support generics <T>
export const VirtualList = forwardRef(VirtualListInner) as <T>(
 props: VirtualListProps<T> & { ref?: React.ForwardedRef<VirtualListHandle> }
) => React.ReactElement;

(VirtualList as React.FC).displayName = 'VirtualList';