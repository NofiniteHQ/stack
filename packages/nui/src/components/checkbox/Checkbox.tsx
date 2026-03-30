"use client";

import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { cn } from '../../utils';
import './Checkbox.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** If provided, makes the checkbox a controlled component. */
  checked?: boolean; 
  /** If provided, sets the initial state of an uncontrolled checkbox. */
  defaultChecked?: boolean;
  /** Sets the visual state to mixed/indeterminate. This is visually distinct from checked/unchecked. */
  indeterminate?: boolean;
  /** Callback fired when the state changes. */
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

/**
 * Checkbox Component
 * * A control that allows the user to toggle between checked and not checked.
 * Architecture Note: This component seamlessly handles both controlled and uncontrolled 
 * paradigms, and directly manipulates the DOM node to support the HTML5 'indeterminate' property.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      onChange,
      label,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    // 1. Internal Ref to handle the indeterminate DOM property
    // The 'indeterminate' state does not exist as an HTML attribute, it only exists
    // as a property on the DOM node itself, so we must access it via ref.
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge external ref with internal ref
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = internalRef.current;
      }
    }, [ref]);

    // 2. Controlled vs Uncontrolled Logic
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const currentChecked = isControlled ? checked : internalChecked;

    // 3. Sync Indeterminate state to the actual DOM element
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const newVal = e.target.checked;
      
      // Only update internal state if the component is uncontrolled
      if (!isControlled) setInternalChecked(newVal);
      
      onChange?.(newVal);
    };

    return (
      <label 
        className={cn(
          "nui-checkbox", 
          disabled && "nui-checkbox--disabled", 
          className
        )}
      >
        <div className="nui-checkbox__wrapper">
          {/* Hidden but accessible input */}
          <input
            ref={internalRef}
            type="checkbox"
            className="nui-checkbox__input"
            disabled={disabled}
            checked={currentChecked}
            onChange={handleChange}
            // aria-checked explicitly supports the 'mixed' state for screen readers
            aria-checked={indeterminate ? 'mixed' : currentChecked}
            data-state={
              indeterminate ? 'indeterminate' : currentChecked ? 'checked' : 'unchecked'
            }
            {...props}
          />
          
          {/* Visual Indicator (Overlays the input) */}
          <span className="nui-checkbox__indicator" aria-hidden="true">
            {indeterminate ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            ) : currentChecked ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : null}
          </span>
        </div>

        {/* Label */}
        {label && <span className="nui-checkbox__label">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';