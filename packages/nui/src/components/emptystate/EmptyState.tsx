import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The icon or illustration to display at the top of the empty state.
   */
  icon?: React.ReactNode;
  /**
   * The main title describing the empty state.
   */
  title: string;
  /**
   * The descriptive text explaining what is missing or how to resolve it.
   */
  description?: React.ReactNode;
  /**
   * Call to action buttons or links.
   */
  actions?: React.ReactNode;
}

/**
 * A standardized placeholder component for when data or content is not available.
 * Fits naturally inside Cards, DataGrids, or page layouts.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(({
  icon,
  title,
  description,
  actions,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto animate-in fade-in zoom-in-[0.98] duration-300 font-sans",
        className
      )}
      role="region"
      aria-label={title}
      {...props}
    >
      {icon && (
        <div 
          className="mb-5 text-muted flex items-center justify-center opacity-80"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-default tracking-tight mb-2">
        {title}
      </h3>
      {description && (
        <div className="text-sm text-muted mb-6 max-w-sm leading-relaxed">
          {description}
        </div>
      )}
      {actions && (
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {actions}
        </div>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
