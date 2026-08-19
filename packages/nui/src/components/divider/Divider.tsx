import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(({
  orientation = 'horizontal',
  className,
  children,
  ...props
}, ref) => {
  const isHorizontal = orientation === 'horizontal';

  // If there are no children, we can render a simple self-closing line for better performance.
  if (!children) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-[var(--border-default)]",
          isHorizontal ? "w-full h-[1px]" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }

  // If there are children, render the flex layout with two lines framing the content.
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "flex items-center",
        isHorizontal ? "w-full flex-row" : "h-full flex-col",
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "bg-[var(--border-default)]", 
          isHorizontal ? "h-[1px] flex-1" : "w-[1px] flex-1"
        )} 
      />
      <div 
        className={cn(
          "text-xs font-medium text-muted uppercase tracking-wider font-sans shrink-0",
          isHorizontal ? "px-4" : "py-4"
        )}
      >
        {children}
      </div>
      <div 
        className={cn(
          "bg-[var(--border-default)]", 
          isHorizontal ? "h-[1px] flex-1" : "w-[1px] flex-1"
        )} 
      />
    </div>
  );
});

Divider.displayName = 'Divider';
