"use client";

import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      className,
      orientation = 'vertical',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "nui-scroll-area relative overflow-auto font-sans outline-none",
          orientation === 'vertical' && "overflow-x-hidden",
          orientation === 'horizontal' && "overflow-y-hidden",
          
          // Premium Minimal Scrollbar Styling
          "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-subtle [&::-webkit-scrollbar-thumb]:rounded-full",
          "hover:[&::-webkit-scrollbar-thumb]:bg-muted",
          
          // Accessibility Focus State
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
          className
        )}
        tabIndex={0}
        {...props}
      >
        <div className="w-full h-full min-w-full min-h-full">
          {children}
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
