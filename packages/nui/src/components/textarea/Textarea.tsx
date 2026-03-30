"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  forwardRef,
} from 'react';
import { cn } from '../../utils';
import './Textarea.css';

/* ============================================================
 * Types
 * ============================================================ */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Displays a character counter below the textarea */
  showCount?: boolean;
  /** Enables automatic vertical resizing based on content. Defaults to true. */
  autoGrow?: boolean;
  /** Applies visual error styling and WAI-ARIA invalid states */
  error?: boolean;
  /** The ID of the element describing this input (for screen readers) */
  helperId?: string;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Textarea Component
 * * A multi-line text input that supports automatic resizing and character counting.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      className,
      maxLength,
      showCount = false,
      autoGrow = true,
      disabled = false,
      readOnly = false,
      required = false,
      error = false,
      id,
      name,
      placeholder,
      helperId,
      rows = 3,
      ...rest
    },
    ref 
  ) => {
    // Internal ref required for the auto-grow math calculations
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const isControlled = value !== undefined;
    
    // Manage local state for uncontrolled inputs
    const [internalValue, setInternalValue] = useState<string>(
      () => (defaultValue as string) || ''
    );
    const currentValue = isControlled ? value : internalValue;
    
    // Ensure we always have a string to prevent .length crashes on undefined
    const safeValue = String(currentValue ?? '');

    /* ----------------------------------------------------
       Ref Merging Logic
    ---------------------------------------------------- */
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref]
    );

    /* ----------------------------------------------------
       Auto-Grow Logic
    ---------------------------------------------------- */
    const resize = useCallback(() => {
      if (!autoGrow || !innerRef.current) return;
      
      const el = innerRef.current;
      // Capture current scroll position to prevent page jumping during DOM manipulation
      const scrollY = window.scrollY;
      
      // Reset height to 'auto' to force the browser to recalculate the true scrollHeight
      el.style.height = 'auto';
      // Set to new scrollHeight + a tiny buffer to account for border widths
      el.style.height = `${el.scrollHeight + 2}px`;
      
      window.scrollTo(0, scrollY);
    }, [autoGrow]);

    // Resize on mount and when the window resizes
    useEffect(() => {
      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }, [resize]);

    // Resize when value changes (e.g., user typing, or incoming API data)
    useEffect(() => {
      resize();
    }, [safeValue, resize]);

    /* ----------------------------------------------------
       Event Handlers
    ---------------------------------------------------- */
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
      if (autoGrow) resize();
    };

    /* ----------------------------------------------------
       Render
    ---------------------------------------------------- */
    return (
      <div className={cn("nui-textarea-root", className)}>
        <textarea
          ref={setRefs}
          id={id}
          name={name}
          value={currentValue}
          defaultValue={!isControlled ? undefined : defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            "nui-textarea",
            error && "nui-textarea--error",
            autoGrow && "nui-textarea--autogrow"
          )}
          {...rest}
        />

        {(showCount || maxLength) && (
          <div className="nui-textarea-counter" aria-hidden="true">
            {safeValue.length}
            {maxLength ? ` / ${maxLength}` : ''}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';