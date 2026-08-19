"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '../../utils';
import { motion } from 'framer-motion';

/* ============================================================
 * Types
 * ============================================================ */

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
 /** The minimum allowed value. Defaults to 0. */
 min?: number;
 /** The maximum allowed value. Defaults to 100. */
 max?: number;
 /** The interval between valid values. Defaults to 1. */
 step?: number;
 /** The controlled value of the slider. */
 value?: number;
 /** The initial uncontrolled value of the slider. */
 defaultValue?: number;
 /** Callback fired when the value changes. */
 onChange?: (value: number) => void;
 /** Disables the slider and prevents interaction. */
 disabled?: boolean;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Slider Component
 * * A WAI-ARIA compliant input that allows users to select a value from a given range.
 * * Automatically handles global window pointer events for smooth dragging outside the hit area.
 */
export function Slider({
 min = 0,
 max = 100,
 step = 1,
 value,
 defaultValue,
 onChange,
 disabled = false,
 className,
 'aria-label': ariaLabel,
 'aria-labelledby': ariaLabelledby,
 ...props // <-- Capture the rest of the HTML attributes (like style, id, etc.)
}: SliderProps) {
 const isControlled = value !== undefined;
 const [internalValue, setInternalValue] = useState(defaultValue ?? min);
 
 // Safely clamp the initial/current value to prevent out-of-bounds rendering
 const rawVal = isControlled ? value : internalValue;
 const val = Math.min(max, Math.max(min, rawVal as number));

 const trackRef = useRef<HTMLDivElement | null>(null);
 const thumbRef = useRef<HTMLDivElement | null>(null);
 const [isDragging, setIsDragging] = useState(false);

 /* ----------------------------------------------------
 Value Management
 ---------------------------------------------------- */
 const setVal = useCallback(
 (v: number) => {
 const clamped = Math.min(max, Math.max(min, v));
 // Ensures the stepped value correctly aligns with the minimum bound
 let stepped = min + Math.round((clamped - min) / step) * step;
 
 // Fixes JavaScript floating point math errors (e.g., 0.3000000000004)
 stepped = Number(stepped.toFixed(5));

 if (!isControlled) setInternalValue(stepped);
 onChange?.(stepped);
 },
 [isControlled, max, min, step, onChange]
 );

 const calculateValueFromPointer = useCallback(
 (clientX: number) => {
 const track = trackRef.current;
 if (!track) return val;

 const rect = track.getBoundingClientRect();
 const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
 const ratio = x / rect.width;
 
 return min + ratio * (max - min);
 },
 [min, max, val]
 );

 /* ----------------------------------------------------
 Drag State Management
 ---------------------------------------------------- */
 const getClientX = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
 return 'touches' in e ? e.touches[0].clientX : (e as MouseEvent | React.MouseEvent).clientX;
 };

 const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
 if (disabled) return;
 
 // Instantly focus the thumb so Arrow Keys work immediately!
 thumbRef.current?.focus(); 
 
 setIsDragging(true);
 setVal(calculateValueFromPointer(getClientX(e)));
 };

 // Syncs global drag listeners without memory leaks
 useEffect(() => {
 if (!isDragging || disabled) return;

 const handleMove = (e: MouseEvent | TouchEvent) => {
 setVal(calculateValueFromPointer(getClientX(e)));
 };

 const handleUp = () => {
 setIsDragging(false);
 };

 window.addEventListener('mousemove', handleMove);
 window.addEventListener('touchmove', handleMove, { passive: false });
 window.addEventListener('mouseup', handleUp);
 window.addEventListener('touchend', handleUp);

 return () => {
 window.removeEventListener('mousemove', handleMove);
 window.removeEventListener('touchmove', handleMove);
 window.removeEventListener('mouseup', handleUp);
 window.removeEventListener('touchend', handleUp);
 };
 }, [isDragging, disabled, calculateValueFromPointer, setVal]);

 /* ----------------------------------------------------
 Keyboard Navigation (WAI-ARIA)
 ---------------------------------------------------- */
 const onKeyDown = useCallback(
 (e: React.KeyboardEvent) => {
 if (disabled) return;

 let next = val;

 switch (e.key) {
 case 'ArrowRight':
 case 'ArrowUp':
 next = val + step;
 break;
 case 'ArrowLeft':
 case 'ArrowDown':
 next = val - step;
 break;
 case 'PageUp':
 next = val + step * 10;
 break;
 case 'PageDown':
 next = val - step * 10;
 break;
 case 'Home':
 next = min;
 break;
 case 'End':
 next = max;
 break;
 default:
 return; // Exit if it's not a recognized key
 }

 e.preventDefault(); // Prevent page scrolling ONLY when using valid arrow keys
 setVal(next);
 },
 [disabled, val, step, min, max, setVal]
 );

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 const percent = ((val - min) / (max - min)) * 100;

 return (
 <div 
 className={cn(
 "relative w-full flex items-center touch-none select-none text-slate-900 dark:text-slate-100 py-2", 
 disabled && "opacity-50 pointer-events-none",
 className
 )}
 onMouseDown={handlePointerDown}
 onTouchStart={handlePointerDown}
 {...props} 
 >
 {/* Track Container */}
 <div ref={trackRef} className="group relative w-full h-5 flex items-center cursor-pointer">
 {/* Inactive Background Track */}
 <div className="absolute w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full" />
 
 {/* Active Filled Track */}
 <motion.div 
 className={cn(
 "absolute left-0 h-2 rounded-full",
 disabled ? "bg-slate-400 dark:bg-slate-600" : "bg-primary dark:bg-blue-500"
 )}
 animate={{ width: `${percent}%` }}
 transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
 />

 {/* Thumb */}
 <motion.div
 ref={thumbRef}
 className={cn(
 "absolute top-1/2 w-[18px] h-[18px] rounded-full cursor-grab shadow-sm border-solid focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] transition-shadow",
 disabled 
 ? "bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600" 
 : "bg-white dark:bg-white border-2 border-blue-600 dark:border-blue-500 hover:scale-110 active:scale-95 active:cursor-grabbing hover:shadow-md"
 )}
 role="slider"
 aria-label={ariaLabel}
 aria-labelledby={ariaLabelledby}
 tabIndex={disabled ? -1 : 0}
 aria-valuemin={min}
 aria-valuemax={max}
 aria-valuenow={val}
 aria-disabled={disabled || undefined}
 onKeyDown={onKeyDown}
 animate={{ left: `${percent}%` }}
 style={{ x: '-50%', y: '-50%' }}
 transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
 />
 </div>
 </div>
 );
}