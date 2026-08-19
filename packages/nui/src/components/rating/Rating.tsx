"use client";

import React, { useState, useCallback } from 'react';
import { cn } from '../../utils';

/* ============================================================
 * Default Icons (Crisp, scalable SVGs)
 * ============================================================ */
const DefaultStarEmpty = (
 <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
 </svg>
);

const DefaultStarFilled = (
 <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
 </svg>
);

/* ============================================================
 * Types
 * ============================================================ */
export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
 /** Controlled state value */
 value?: number;
 /** Uncontrolled initial value */
 defaultValue?: number;
 /** The maximum possible rating. Determines how many icons to render. Defaults to 5. */
 max?: number;
 /** Callback fired when a rating is selected */
 onChange?: (value: number) => void;
 /** Custom React node for the empty state */
 icon?: React.ReactNode;
 /** Custom React node for the filled state */
 iconFilled?: React.ReactNode;
 /** Size variant */
 size?: 'sm' | 'md' | 'lg';
 /** Makes the rating strictly decorative */
 readOnly?: boolean;
 /** Disables interactions and applies a muted style */
 disabled?: boolean;
 /** Enables fractional half-step selections (e.g., 3.5 stars) */
 allowHalf?: boolean; 
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Rating Component
 * * A WAI-ARIA compliant slider that allows users to provide a numerical rating.
 * * Architecture Note (Fractional Display):
 * The component supports infinitely precise fractional rendering (e.g., 4.7 stars). 
 * It achieves this by overlaying an `absolute` filled icon on top of the empty icon 
 * and using CSS `overflow: hidden` combined with an inline `width: X%` style to "clip" the SVG.
 */
export function Rating({
 value,
 defaultValue = 0,
 max = 5,
 onChange,
 icon = DefaultStarEmpty,
 iconFilled = DefaultStarFilled,
 size = 'md',
 readOnly = false,
 disabled = false,
 allowHalf = false,
 className,
 ...props
}: RatingProps) {
 const isControlled = value !== undefined;
 const [internalValue, setInternalValue] = useState(defaultValue);
 const current = isControlled ? value : internalValue;

 const [hoverValue, setHoverValue] = useState<number | null>(null);

 // If hovering, temporarily show the hover value for visual feedback
 const displayValue = hoverValue !== null ? hoverValue : current;

 /* ----------------------------------------------------
 Event Handlers
 ---------------------------------------------------- */
 const handleSelect = useCallback((v: number) => {
 if (readOnly || disabled) return;
 if (!isControlled) setInternalValue(v);
 onChange?.(v);
 }, [readOnly, disabled, isControlled, onChange]);

 const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>, index: number) => {
 if (readOnly || disabled) return;
 
 // Calculate if we are hovering over the left half or right half of the star
 if (allowHalf) {
 const rect = e.currentTarget.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const isLeftHalf = x < rect.width / 2;
 setHoverValue(isLeftHalf ? index - 0.5 : index);
 } else {
 setHoverValue(index);
 }
 };

 const handlePointerLeave = () => {
 if (readOnly || disabled) return;
 setHoverValue(null);
 };

 const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
 if (readOnly || disabled) return;

 const step = allowHalf ? 0.5 : 1;
 let nextValue = current;

 if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
 nextValue = Math.min(current + step, max);
 e.preventDefault();
 } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
 nextValue = Math.max(current - step, 0);
 e.preventDefault();
 } else if (e.key === 'Home') {
 nextValue = 0;
 e.preventDefault();
 } else if (e.key === 'End') {
 nextValue = max;
 e.preventDefault();
 }

 if (nextValue !== current) {
 handleSelect(nextValue);
 }
 };

 /* ----------------------------------------------------
 Render Math
 ---------------------------------------------------- */
 return (
 <div
 className={cn(
 "inline-flex items-center gap-1 font-sans select-none touch-none focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] rounded-sm",
 size === 'sm' && "text-base",
 size === 'md' && "text-2xl",
 size === 'lg' && "text-3xl",
 readOnly && "cursor-default",
 disabled && "opacity-50 cursor-not-allowed",
 className
 )}
 role="slider"
 aria-valuemin={0}
 aria-valuemax={max}
 aria-valuenow={current}
 aria-disabled={disabled || undefined}
 aria-readonly={readOnly || undefined}
 tabIndex={readOnly || disabled ? -1 : 0}
 onKeyDown={handleKey}
 onPointerLeave={handlePointerLeave}
 {...props}
 >
 {Array.from({ length: max }, (_, i) => {
 const starIndex = i + 1;
 
 // Calculate exact fill percentage for fractional display (e.g., 4.7)
 let fillPercent = 0;
 if (displayValue >= starIndex) {
 fillPercent = 100;
 } else if (displayValue > starIndex - 1) {
 fillPercent = (displayValue - (starIndex - 1)) * 100;
 }

 return (
 <span
 key={starIndex}
 data-testid="star-item"
 className={cn(
 "relative inline-flex transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
 !readOnly && !disabled && "cursor-pointer hover:scale-110"
 )}
 onPointerMove={(e) => handlePointerMove(e, starIndex)}
 onClick={() => handleSelect(hoverValue ?? starIndex)}
 >
 {/* 1. Base Empty Icon */}
 <span className="flex text-muted">
 {icon}
 </span>
 
 {/* 2. Absolute Overlay Filled Icon (Clipped by width math) */}
 <span 
 className="absolute top-0 left-0 h-full flex overflow-hidden text-default transition-[width] duration-100 ease-in"
 style={{ width: `${fillPercent}%` }}
 >
 {iconFilled}
 </span>
 </span>
 );
 })}
 </div>
 );
}