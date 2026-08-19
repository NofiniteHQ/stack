import React, { forwardRef } from 'react';
import { cn } from '../../utils';

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

 const sizeStyles = {
 sm: 'h-6 text-xs px-2',
 md: 'h-8 text-sm px-3',
 };

 return (
 <div
 ref={ref}
 className={cn(
 'inline-flex items-center justify-center rounded-full border font-medium transition-colors duration-200',
 selected ? 'border-primary bg-primary text-inverse' : 'border-default bg-subtle text-default hover:bg-muted',
 sizeStyles[size],
 isInteractive && 'cursor-pointer focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]',
 className
 )}
 // Assign button role only if it actually does something
 role={isInteractive ? 'button' : undefined}
 tabIndex={isInteractive ? 0 : undefined}
 aria-pressed={isInteractive ? selected : undefined}
 onClick={isInteractive ? handleSelect : undefined}
 onKeyDown={isInteractive ? handleKeyDown : undefined}
 {...props}
 >
 {iconLeft && <span className="mr-1.5 flex items-center justify-center">{iconLeft}</span>}

 <span className="truncate">{children}</span>

 {iconRight && <span className="ml-1.5 flex items-center justify-center">{iconRight}</span>}

 {removable && (
 <button
 type="button"
 className="ml-1.5 inline-flex items-center justify-center rounded-full appearance-none border-none bg-transparent p-0.5 text-muted hover:bg-black/10 dark:hover:bg-white/10 hover:text-default focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] focus-visible:ring-offset-1 focus-visible:ring-offset-background transition-all duration-200"
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