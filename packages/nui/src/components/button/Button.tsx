"use client";

import React from 'react';
import { cn, Slot, Slottable } from '../../utils';
import './Button.css';

export type ButtonVariant = 'default' | 'primary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual style of the button. */
  variant?: ButtonVariant;
  /** The dimensional size of the button (controls padding and height). */
  size?: ButtonSize;
  /** Automatically disables the button and replaces the left icon with a loading spinner. */
  isLoading?: boolean;
  /** An element (usually an SVG or Icon component) placed before the text. */
  iconLeft?: React.ReactNode;
  /** An element (usually an SVG or Icon component) placed after the text. */
  iconRight?: React.ReactNode;
  /** * Polymorphic Prop: When true, the button will render as its immediate child element 
   * (e.g., a Next.js `<Link>` or an `<a>` tag) instead of a native `<button>`, 
   * while inheriting all button styles.
   */
  asChild?: boolean;
}

/**
 * Button Component
 * ----------------
 * The primary interactive element for user actions.
 * * Architecture Note: 
 * - Automatically handles its disabled state when `isLoading` is true to prevent double-submissions.
 * - Supports polymorphism via the `asChild` prop for seamless router integration.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    isLoading = false, 
    iconLeft,
    iconRight,
    asChild = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    
    // State Management: Loading strictly implies the button cannot be interacted with.
    const isDisabled = disabled || isLoading;

    // Polymorphic Node: Use our custom zero-dependency Slot if asChild is true.
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "nui-btn",
          `nui-btn--${variant}`,
          `nui-btn--${size}`,
          className
        )}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <svg 
            className="nui-btn__spinner" 
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true" // Hides the SVG from screen readers; 'disabled' attribute handles the state announcement
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}

        {/* Icon Left: Hidden when loading to prevent UI layout shifts */}
        {!isLoading && iconLeft && <span className="nui-btn__icon -left">{iconLeft}</span>}
        
        {/* Slottable: Directs the Slot component to inject the provided children right here, 
            preserving the spinners and icons on the outside. */}
        <Slottable>
          {asChild ? children : <span className="nui-btn__content">{children}</span>}
        </Slottable>
        
        {/* Icon Right */}
        {!isLoading && iconRight && <span className="nui-btn__icon -right">{iconRight}</span>}
      </Comp>
    );
  }
);

Button.displayName = "Button";