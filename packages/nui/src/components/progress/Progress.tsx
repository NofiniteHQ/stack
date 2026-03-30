import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import './Progress.css';

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

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={isIndeterminate ? undefined : safeValue}
      aria-label={label}
      className={cn(
        "nui-progress",
        `nui-progress--${size}`,
        `nui-progress--${variant}`,
        className
      )}
      {...props}
    >
      {isIndeterminate ? (
        /* Hardware-Accelerated Indeterminate Bar */
        <div className="nui-progress-indicator nui-progress-indicator--indeterminate" />
      ) : (
        /* Hardware-Accelerated Determinate Bar */
        <div
          className="nui-progress-indicator"
          style={{
            // We use translateX instead of width for buttery smooth 60fps rendering
            transform: `translateX(-${100 - percentage}%)`,
          }}
        />
      )}
    </div>
  );
});

Progress.displayName = 'Progress';