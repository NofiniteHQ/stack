"use client";

import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils';
import './Input.css';

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The text label associated with the input field. */
  label?: React.ReactNode;
  /** Auxiliary text displayed below the input to provide additional context. */
  description?: React.ReactNode;
  /** Error message. Replaces the description text and applies error styling when present. */
  error?: React.ReactNode;
  /** Size variant of the input field. Defaults to 'md'. */
  inputSize?: 'sm' | 'md' | 'lg';
  /** An icon element rendered on the left side (leading edge) inside the input. */
  leftIcon?: React.ReactNode;
  /** An icon element rendered on the right side (trailing edge) inside the input. */
  rightIcon?: React.ReactNode;
  /** Custom CSS class applied to the outermost wrapper element. */
  wrapperClassName?: string;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Input Component
 * * A fundamental form element for capturing user data.
 * * Automatically generates stable IDs for strict WAI-ARIA compliance, 
 * linking the input to its label, description, and error messages.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      inputSize = 'md',
      leftIcon,
      rightIcon,
      className,
      wrapperClassName,
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    // Stable ID generation for WAI-ARIA linkage
    const reactId = useId();
    const inputId = id ?? reactId;
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;

    // ARIA connections: Error takes precedence over description
    const describedBy = error ? errorId : description ? descriptionId : undefined;

    return (
      <div className={cn("nui-input-wrapper", wrapperClassName)}>
        
        {/* LABEL */}
        {label && (
          <label 
            htmlFor={inputId} 
            className={cn("nui-input__label", disabled && "nui-input__label--disabled")}
          >
            {label}
            {required && <span className="nui-input__required" aria-hidden="true"> *</span>}
          </label>
        )}

        {/* INPUT CONTAINER (For Icon Positioning) */}
        <div className="nui-input__container">
          {leftIcon && <span className="nui-input__icon -left">{leftIcon}</span>}
          
          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            className={cn(
              "nui-input",
              `nui-input--${inputSize}`,
              !!error && "nui-input--error",
              !!leftIcon && "nui-input--has-left",
              !!rightIcon && "nui-input--has-right",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />

          {rightIcon && <span className="nui-input__icon -right">{rightIcon}</span>}
        </div>

        {/* DESCRIPTION */}
        {description && !error && (
          <div id={descriptionId} className="nui-input__description">
            {description}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div id={errorId} className="nui-input__error" aria-live="polite">
            {error}
          </div>
        )}
        
      </div>
    );
  }
);

Input.displayName = 'Input';