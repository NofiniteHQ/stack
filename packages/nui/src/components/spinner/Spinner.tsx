import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import './Spinner.css';

/* ============================================================
 * Types
 * ============================================================ */

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The predefined size of the spinner. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** The color theme variant. Defaults to 'primary'. */
  variant?: 'primary' | 'muted' | 'inverse';
  /** WAI-ARIA label read by screen readers. Defaults to 'Loading...'. */
  label?: string;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Spinner Component
 * * A visual indicator for loading states.
 * * WAI-ARIA compliant: Uses role="status" to announce the loading state politely
 * to screen readers without immediately interrupting the user.
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = 'md',
  variant = 'primary',
  className,
  label = 'Loading...',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(
        "nui-spinner",
        `nui-spinner--${size}`,
        `nui-spinner--${variant}`,
        className
      )}
      {...props}
    >
      <svg
        className="nui-spinner__svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true" /* Hide SVG itself, relying on the aria-label and hidden text */
      >
        {/* The faint background track */}
        <circle
          className="nui-spinner__track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        {/* The solid moving head */}
        <path
          className="nui-spinner__head"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      
      {/* Visually hidden text fallback for older screen readers */}
      <span className="nui-spinner__sr-only">{label}</span>
    </div>
  );
});

Spinner.displayName = 'Spinner';