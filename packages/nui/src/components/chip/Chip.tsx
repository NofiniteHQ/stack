import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import './Chip.css';

export type ChipSize = 'sm' | 'md';

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  children: React.ReactNode;
  /** If true, renders a trailing 'X' button that triggers onRemove */
  removable?: boolean;
  /** Controls the visual and ARIA active state of the chip */
  selected?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: ChipSize;
  /** Callback fired when the 'X' button is clicked */
  onRemove?: () => void;
  /** Callback fired when the main body of the chip is clicked or activated via keyboard */
  onSelect?: () => void;
}

/**
 * Chip Component
 * * A compact element representing an input, attribute, or action.
 * Architecture Note: Dynamically switches between a static visual element and an 
 * interactive button role depending on the presence of `onSelect` or `onClick`.
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      children,
      removable = false,
      selected = false,
      iconLeft,
      iconRight,
      size = 'md',
      onRemove,
      onSelect,
      className,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    
    // * Interaction Handling: 
    // We unify both the custom onSelect and the standard HTML onClick 
    // so consumers can use either without breaking the component's internal logic.
    const handleSelect = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
      onSelect?.();
      if (e.type === 'click' && onClick) {
        onClick(e as React.MouseEvent<HTMLDivElement>);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) onKeyDown(e);
      
      // Trigger select on Enter or Space for keyboard accessibility
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent page scroll on Space
        handleSelect(e);
      }
    };

    const isInteractive = Boolean(onSelect || onClick);

    return (
      <div
        ref={ref}
        className={cn(
          'nui-chip',
          `nui-chip--${size}`,
          selected && 'nui-chip--selected',
          isInteractive && 'nui-chip--interactive',
          className
        )}
        // Assign button role only if it actually does something
        role={isInteractive ? 'button' : 'generic'}
        tabIndex={isInteractive ? 0 : undefined}
        aria-pressed={isInteractive ? selected : undefined}
        onClick={isInteractive ? handleSelect : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        {...props}
      >
        {iconLeft && <span className="nui-chip__icon -left">{iconLeft}</span>}

        <span className="nui-chip__label">{children}</span>

        {iconRight && <span className="nui-chip__icon -right">{iconRight}</span>}

        {removable && (
          <button
            type="button"
            className="nui-chip__remove"
            aria-label="Remove"
            onClick={(e) => {
              // * Event Propagation: 
              // Stop click from bubbling up to the parent <div> and triggering `onSelect`
              e.stopPropagation(); 
              onRemove?.();
            }}
            onKeyDown={(e) => e.stopPropagation()} 
          >
            {/* Crisp X SVG */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';