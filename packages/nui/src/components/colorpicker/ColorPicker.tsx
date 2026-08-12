"use client";

import React, { forwardRef } from 'react';
import { Popover } from '../popover/Popover';
import { cn } from '../../utils';
import { Palette, LucideIcon } from 'lucide-react';

export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The currently selected color in hex format */
  value?: string;
  /** Callback fired when a color is selected */
  onChange?: (color: string) => void;
  /** Array of hex colors to show in the preset grid */
  presets?: string[];
  /** Whether to show the native color picker input for custom colors */
  showCustom?: boolean;
  /** Disable the color picker */
  disabled?: boolean;
  /** Custom icon to display on the trigger button. Defaults to Palette. */
  icon?: LucideIcon;
}

const DEFAULT_PRESETS = [
  '#000000', '#52525b', '#a1a1aa', '#ffffff',
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#d946ef', '#f43f5e',
  '#7f1d1d', '#7c2d12', '#78350f', '#3f6212', '#14532d', '#134e4a', '#164e63', '#1e3a8a', '#312e81', '#581c87', '#701a75'
];

/**
 * ColorPicker Component
 * A customizable color picker with preset swatches and a native custom color input.
 */
export const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(
  ({ value = '#000000', onChange, presets = DEFAULT_PRESETS, showCustom = true, disabled = false, icon: Icon = Palette, className, ...props }, ref) => {
    
    const isTransparent = value === 'transparent';
    const displayColor = isTransparent ? '#ffffff' : value;

    return (
      <Popover>
        <Popover.Trigger>
          <button 
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              "flex-shrink-0 relative flex items-center justify-center h-8 w-8 rounded-md bg-transparent border border-transparent outline-none cursor-pointer transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-subtle",
              className
            )}
            title="Choose Color"
            {...(props as any)}
          >
            <Icon size={16} className="text-muted group-hover:text-default" />
            <div 
              className={cn(
                "absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border shadow-sm",
                isTransparent ? "border-dashed border-default" : "border-default"
              )} 
              style={{ backgroundColor: displayColor }} 
            />
          </button>
        </Popover.Trigger>
        <Popover.Content placement="bottom-start" className="p-3 w-[260px] bg-surface border border-default rounded-lg shadow-xl z-50">
          <div className="grid grid-cols-7 gap-2">
            {presets.map((c) => (
              <Popover.Close key={c}>
                <button
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-transform hover:scale-110",
                    value === c ? "ring-2 ring-offset-1 ring-primary border-primary" : "border-black/10"
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => onChange?.(c)}
                  title={c}
                />
              </Popover.Close>
            ))}
            
            {showCustom && (
              <div 
                className="relative w-6 h-6 rounded-full border border-default shadow-sm focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-primary hover:scale-110 transition-transform overflow-hidden cursor-pointer flex items-center justify-center" 
                style={{ background: 'conic-gradient(from 180deg at 50% 50%, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
                title="Custom Color"
              >
                <input 
                  type="color" 
                  className="absolute inset-[-10px] w-12 h-12 cursor-pointer opacity-0"
                  value={isTransparent ? '#000000' : value}
                  onChange={(e) => onChange?.(e.target.value)}
                />
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';
