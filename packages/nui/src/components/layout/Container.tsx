/* src/components/layout/Container.tsx */
import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import './Layout.css';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The maximum width bounds for the container. Defaults to 'lg'. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Container Component
 * * A structural primitive used to constrain content width to the current breakpoint.
 * * Centers content horizontally and provides standard gutter padding.
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(({
  size = 'lg',
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("nui-container", className)}
      data-size={size}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';