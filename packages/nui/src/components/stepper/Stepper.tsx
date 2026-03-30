import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import './Stepper.css';

/* ============================================================
 * Types
 * ============================================================ */

export interface StepItem {
  /** The primary title of the step */
  label: React.ReactNode;
  /** Secondary descriptive text displayed below the label */
  description?: React.ReactNode;
  /** Marks the step with an "(Optional)" tag */
  optional?: boolean;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Array of steps. Can be simple strings or rich objects. */
  steps: (string | StepItem)[];
  /** The 0-based index of the currently active step. */
  active: number;
  /** Callback fired when a step is clicked. */
  onChange?: (index: number) => void;
  /** Prevents the user from clicking on steps that come after the currently active one. */
  disableFuture?: boolean; 
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Stepper Component
 * * A visual indicator for multi-step workflows.
 * * Uses standard `<nav>` and `<ol>` HTML elements for strict WAI-ARIA compliance.
 */
export const Stepper = forwardRef<HTMLElement, StepperProps>(({
  steps,
  active,
  onChange,
  className,
  disableFuture = false,
  ...props
}, ref) => {
  
  // Helper to normalize string arrays into StepItem objects
  const getStepData = (s: string | StepItem): StepItem => {
    if (typeof s === 'string') return { label: s };
    return s;
  };

  return (
    <nav 
      ref={ref}
      className={cn("nui-stepper-root", className)} 
      aria-label="Progress Steps"
      {...props}
    >
      <ol className="nui-stepper__list">
        {steps.map((rawStep, index) => {
          const step = getStepData(rawStep);
          const isActive = index === active;
          const isCompleted = index < active;
          const isDisabled = disableFuture && index > active;

          return (
            <li
              key={index}
              className={cn(
                "nui-stepper__item",
                isActive && "active",
                isCompleted && "completed"
              )}
            >
              <button
                type="button"
                className="nui-stepper__button"
                aria-current={isActive ? 'step' : undefined}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled && onChange) onChange(index);
                }}
              >
                {/* Circle Indicator */}
                <div className="nui-stepper__circle">
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span aria-hidden="true">{index + 1}</span>
                  )}
                </div>

                {/* Text Content */}
                <div className="nui-stepper__content">
                  <span className="nui-stepper__label">
                    {/* Invisible text for screen readers so they announce "Step 1: Shipping" */}
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.label}
                    {step.optional && (
                      <span className="nui-stepper__optional">(Optional)</span>
                    )}
                  </span>
                  {step.description && (
                    <span className="nui-stepper__description">
                      {step.description}
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Stepper.displayName = 'Stepper';