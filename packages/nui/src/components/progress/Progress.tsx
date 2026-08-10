import React, { forwardRef } from 'react';
import { cn } from '../../utils';

/* ============================================================
 * Types
 * ============================================================ */

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
 /** The current progress value */
 value?: number;
 /** The maximum possible value. Defaults to 100. */
 max?: number;
 /** Forces the progress bar into an animated indeterminate state */
 indeterminate?: boolean;
 /** The visual height of the progress bar. Defaults to 'md'. */
 size?: 'sm' | 'md' | 'lg';
 /** The semantic color variant. Defaults to 'default'. */
 variant?: 'default' | 'success' | 'warning' | 'danger';
 /** WAI-ARIA hidden label for screen readers. Defaults to 'Progress'. */
 label?: string; 
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Progress Component
 * * A WAI-ARIA compliant progress bar indicating the completion status of a task.
 * * Architecture Note: Uses CSS `transform: translateX` instead of `width` for 
 * hardware-accelerated (GPU) 60fps rendering to prevent layout thrashing on the main thread.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
 value,
 max = 100,
 indeterminate = false,
 size = 'md',
 variant = 'default',
 label = 'Progress',
 className,
 ...props
}, ref) => {
 // If no value is provided, safely fall back to indeterminate mode
 const isIndeterminate = indeterminate || value === undefined;

 // Safely clamp the percentage between 0 and 100 to prevent layout breakage
 const safeValue = Math.min(Math.max(value ?? 0, 0), max);
 const percentage = (safeValue / max) * 100;

 const sizeStyles = {
 sm: 'h-1.5',
 md: 'h-2.5',
 lg: 'h-4',
 };

 const variantStyles = {
 default: 'bg-primary text-inverse',
 success: 'bg-success text-inverse',
 warning: 'bg-warning text-inverse',
 danger: 'bg-danger text-inverse',
 };

 return (
 <div
 ref={ref}
 role="progressbar"
 aria-valuemin={0}
 aria-valuemax={max}
 aria-valuenow={isIndeterminate ? undefined : safeValue}
 aria-label={label}
 className={cn(
 "relative w-full overflow-hidden rounded-full bg-subtle",
 sizeStyles[size],
 className
 )}
 {...props}
 >
 {isIndeterminate ? (
 /* Hardware-Accelerated Indeterminate Bar */
 <div className={cn("h-full w-full flex-1 animate-pulse origin-left", variantStyles[variant])} />
 ) : (
 /* Hardware-Accelerated Determinate Bar */
 <div
 className={cn("h-full flex-1 transition-all duration-300 ease-in-out", variantStyles[variant])}
 style={{ width: `${percentage}%` }}
 />
 )}
 </div>
 );
});

Progress.displayName = 'Progress';