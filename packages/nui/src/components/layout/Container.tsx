/* src/components/layout/Container.tsx */
import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
 /** The maximum width bounds for the container. Defaults to 'lg'. */
 size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
 sm: 'max-w-screen-sm',
 md: 'max-w-screen-md',
 lg: 'max-w-screen-lg',
 xl: 'max-w-screen-xl',
 full: 'max-w-full',
};

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
 className={cn("w-full mx-auto px-4", sizeClasses[size], className)}
 {...props}
 >
 {children}
 </div>
 );
});

Container.displayName = 'Container';