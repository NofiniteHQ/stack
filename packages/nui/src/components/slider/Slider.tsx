"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '../../utils';
import './Slider.css';

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
        "nui-slider-root", 
        disabled && "nui-slider--disabled",
        className
      )}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      {...props} // <-- Spread the rest of the props (including style) to the root element
    >
      <div className="nui-slider-track-container">
        <div ref={trackRef} className="nui-slider-track">
          
          <div 
            className="nui-slider-fill" 
            style={{ width: `${percent}%` }} 
          />

          <div
            ref={thumbRef}
            className="nui-slider-thumb"
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val}
            aria-disabled={disabled || undefined}
            onKeyDown={onKeyDown}
            style={{ left: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}