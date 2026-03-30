/* src/components/layout/Grid.tsx */
import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import './Layout.css';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of fixed columns, or responsive auto algorithms. Defaults to 'auto-fit'. */
  columns?: number | 'auto-fit' | 'auto-fill';
  /** The gap between grid items. Accepts numbers (px) or valid CSS strings. Defaults to 16. */
  gap?: number | string;
  /** The minimum width a column can shrink to before wrapping. Used with auto-fit/fill. Defaults to '250px'. */
  minColWidth?: string;
}

/**
 * Grid Component
 * * A responsive CSS Grid container.
 * * Passes complex grid math to CSS via targeted variables for high performance.
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(({
  columns = 'auto-fit',
  gap = 16,
  minColWidth = '250px',
  className,
  style,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("nui-grid", className)}
      data-cols={typeof columns === 'number' ? 'fixed' : columns}
      style={{
        '--nui-grid-gap': typeof gap === 'number' ? `${gap}px` : gap,
        '--nui-grid-min-width': minColWidth,
        '--nui-grid-cols-fixed': typeof columns === 'number' ? columns : undefined,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';