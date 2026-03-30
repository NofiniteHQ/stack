/* src/components/layout/Flex.tsx */
import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import './Layout.css';

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

/**
 * Flex Component
 * * A highly configurable Flexbox container.
 * * Uses data-attributes for standard flex properties and inline CSS variables 
 * to securely pass dynamic values (like gap) to the stylesheet without recalculating classes.
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
      className={cn("nui-flex", className)}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap}
      style={{
        // We only use an inline style for the exact dynamic gap value
        '--nui-flex-gap': typeof gap === 'number' ? `${gap}px` : gap,
        ...style,
      } as React.CSSProperties}
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