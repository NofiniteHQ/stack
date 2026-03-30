"use client";

import React, { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils';
import './Switch.css';

/* ============================================================
 * Types
 * ============================================================ */

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  /** The controlled checked state of the switch */
  checked?: boolean;
  /** The uncontrolled default checked state */
  defaultChecked?: boolean;
  /** Callback fired when the state changes */
  onChange?: (checked: boolean) => void;
  
  /** Disables the switch, preventing interaction */
  disabled?: boolean;
  /** The primary text label for the switch */
  label?: React.ReactNode;
  /** Secondary descriptive text linked via WAI-ARIA */
  description?: React.ReactNode;
  
  /** Name attribute for native form submission */
  name?: string;
  /** Value submitted in a native form when checked. Defaults to "on". */
  value?: string;
  /** The visual size variant. Defaults to 'md'. */
  size?: 'sm' | 'md';
  
  /** Additional CSS classes for the outer wrapping div */
  wrapperClassName?: string;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Switch Component
 * * A WAI-ARIA compliant toggle switch used to turn settings on or off.
 * * Automatically handles native form submission using a hidden input.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      disabled = false,
      label,
      description,
      id,
      name,
      value,
      size = 'md',
      className,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    // Unique ID generation for WCAG label and description linkage
    const reactId = useId();
    const switchId = id ?? `nui-switch-${reactId}`;
    const descriptionId = `${switchId}-description`;

    // State Management
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const currentChecked = isControlled ? checked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const nextState = !currentChecked;
      if (!isControlled) setInternalChecked(nextState);
      onChange?.(nextState);
    };

    // Keyboard Accessibility (Space & Enter)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault(); // Prevent page scroll on Spacebar
        toggle();
      }
      props.onKeyDown?.(e);
    };

    // Robust Label Click Handler
    // Standard <label> clicks only *focus* <button> elements in Safari/Firefox. 
    // This handler ensures clicking the text always toggles the state.
    const handleLabelClick = (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault(); 
      toggle();
      document.getElementById(switchId)?.focus();
    };

    // Hidden input value for standard HTML form submissions
    const hiddenValue = value ?? (currentChecked ? 'on' : 'off');

    return (
      <div 
        className={cn(
          "nui-switch-wrapper", 
          disabled && "nui-switch-wrapper--disabled", 
          wrapperClassName
        )}
      >
        {/* Hidden Form Input */}
        {name && (
          <input type="hidden" name={name} value={currentChecked ? hiddenValue : ''} />
        )}

        {/* The Actual Switch (Button) */}
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={currentChecked}
          aria-disabled={disabled}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "nui-switch",
            `nui-switch--${size}`,
            currentChecked && "nui-switch--checked",
            className
          )}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          {...props}
        >
          <span 
            className={cn(
              "nui-switch__thumb", 
              `nui-switch__thumb--${size}`, 
              currentChecked && "nui-switch__thumb--checked"
            )} 
            aria-hidden="true" 
          />
        </button>

        {/* Text Content */}
        {(label || description) && (
          <div className="nui-switch__text-container">
            {label && (
              <label 
                htmlFor={switchId} 
                className="nui-switch__label"
                onClick={handleLabelClick}
              >
                {label}
              </label>
            )}
            {description && (
              <div id={descriptionId} className="nui-switch__description">
                {description}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';