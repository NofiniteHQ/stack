import React, { forwardRef } from 'react';
import { cn } from '../../utils';

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
 /** Content to render below the stepper when this step is active */
 content?: React.ReactNode;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
 /** Array of steps. Can be simple strings or rich objects. */
 data: (string | StepItem)[];
 /** The 0-based index of the currently active step. */
 active: number;
 /** Callback fired when a step is clicked. */
 onChange?: (index: number) => void;
 /** Prevents the user from clicking on steps that come after the currently active one. */
 disableFuture?: boolean;
 /** The orientation of the stepper */
 orientation?: 'horizontal' | 'vertical';
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Stepper Component
 * * A visual indicator for multi-step workflows.
 * * Uses standard `<nav>` and `<ol>` HTML elements for strict WAI-ARIA compliance.
 */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(({
 data,
 active,
 onChange,
 className,
 disableFuture = false,
 orientation = 'horizontal',
 ...props
}, ref) => {
 
 // Helper to normalize string arrays into StepItem objects
 const getStepData = (s: string | StepItem): StepItem => {
 if (typeof s === 'string') return { label: s };
 return s;
 };

 return (
 <div className={cn(`flex w-full ${orientation === 'vertical' ? 'flex-row' : 'flex-col'} gap-6`, className)}>
 <nav 
 ref={ref}
 className={cn("w-full font-sans overflow-x-auto scrollbar-hide")} 
 aria-label="Progress Steps"
 {...props}
 >
 <ol className="flex justify-between items-start m-0 p-0 list-none min-w-[450px]">
 {data.map((rawStep, index) => {
 const step = getStepData(rawStep);
 const isActive = index === active;
 const isCompleted = index < active;
 const isDisabled = disableFuture && index > active;

 return (
 <li
 key={index}
 className={cn(
 "relative flex-1 flex flex-col items-center",
 index !== data.length - 1 && [
 "after:content-[''] after:absolute after:top-[14px] after:left-[calc(50%_+_20px)] after:w-[calc(100%_-_40px)] after:h-[2px] after:z-[1] after:transition-colors after:duration-300",
 isCompleted ? "after:bg-primary" : "after:bg-subtle"
 ]
 )}
 >
 <button
 type="button"
 className="relative z-[2] flex flex-col items-center gap-2 bg-transparent border-none p-0 cursor-pointer outline-none text-center disabled:cursor-not-allowed disabled:opacity-60 group"
 aria-current={isActive ? 'step' : undefined}
 disabled={isDisabled}
 onClick={() => {
 if (!isDisabled && onChange) onChange(index);
 }}
 >
 {/* Circle Indicator */}
 <div 
 className={cn(
 "shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2 border-solid text-sm font-bold transition-all duration-200 group-focus-visible:outline-none group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--nui-fg-default)] z-10 bg-surface",
 isActive ? "border-primary text-primary" :
 isCompleted ? "bg-primary border-primary text-inverse" :
 "border-default text-muted"
 )}
 >
 {isCompleted ? (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polyline points="20 6 9 17 4 12"></polyline>
 </svg>
 ) : (
 <span aria-hidden="true">{index + 1}</span>
 )}
 </div>

 {/* Text Content */}
 <div className="flex flex-col items-center gap-[2px] w-full px-1">
 <span 
 className={cn(
 "text-sm font-medium transition-colors duration-200 text-center break-words",
 isActive ? "text-default font-semibold" : isCompleted ? "text-default" : "text-muted"
 )}
 >
 {/* Invisible text for screen readers so they announce "Step 1: Shipping" */}
 <span className="sr-only">Step {index + 1}: </span>
 {step.label}
 {step.optional && (
 <span className="text-[0.7rem] text-muted font-normal block">(Optional)</span>
 )}
 </span>
 {step.description && (
 <span className="text-[0.75rem] text-muted text-center max-w-full line-clamp-2 break-normal">
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

 {data[active] && typeof data[active] !== 'string' && (data[active] as StepItem).content && (
 <div className="w-full">
 {(data[active] as StepItem).content}
 </div>
 )}
 </div>
 );
});

Stepper.displayName = 'Stepper';