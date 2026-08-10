/* src/components/layout/Flex.tsx */
import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
 /** Defines the flex-direction. Defaults to 'row'. */
 direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
 /** Defines the align-items cross-axis behavior. Defaults to 'stretch'. */
 align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
 /** Defines the justify-content main-axis behavior. Defaults to 'start'. */
 justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
 /** Defines the flex-wrap behavior. Defaults to 'nowrap'. */
 wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
 /** The gap between flex items. Accepts numbers (px) or valid CSS strings. Defaults to 0. */
 gap?: number | string;
}

const directionClasses = {
 'row': 'flex-row',
 'column': 'flex-col',
 'row-reverse': 'flex-row-reverse',
 'column-reverse': 'flex-col-reverse'
};

const alignClasses = {
 'start': 'items-start',
 'center': 'items-center',
 'end': 'items-end',
 'stretch': 'items-stretch',
 'baseline': 'items-baseline'
};

const justifyClasses = {
 'start': 'justify-start',
 'center': 'justify-center',
 'end': 'justify-end',
 'between': 'justify-between',
 'around': 'justify-around',
 'evenly': 'justify-evenly'
};

const wrapClasses = {
 'wrap': 'flex-wrap',
 'nowrap': 'flex-nowrap',
 'wrap-reverse': 'flex-wrap-reverse'
};

/**
 * Flex Component
 * * A highly configurable Flexbox container.
 * * Uses standard utility classes.
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(({
 direction = 'row',
 align = 'stretch',
 justify = 'start',
 wrap = 'nowrap',
 gap = 0,
 className,
 style,
 children,
 ...props
}, ref) => {
 return (
 <div
 ref={ref}
 className={cn(
 "flex",
 directionClasses[direction],
 alignClasses[align],
 justifyClasses[justify],
 wrapClasses[wrap],
 className
 )}
 style={{
 gap: typeof gap === 'number' ? `${gap}px` : gap,
 ...style,
 }}
 {...props}
 >
 {children}
 </div>
 );
});

Flex.displayName = 'Flex';

/* -----------------------------------------------------------------
 * Syntactic Sugar Layouts
 * ----------------------------------------------------------------- */

/**
 * Stack Component
 * * Syntactic sugar for a vertical Flex container.
 */
export const Stack = forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>((props, ref) => (
 <Flex ref={ref} direction="column" {...props} />
));
Stack.displayName = 'Stack';

/**
 * HStack Component
 * * Syntactic sugar for a horizontal Flex container with vertically centered items.
 */
export const HStack = forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>((props, ref) => (
 <Flex ref={ref} direction="row" align="center" {...props} />
));
HStack.displayName = 'HStack';