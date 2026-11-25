'use client';
import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';

export type KbdSize = 'sm' | 'md' | 'lg';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: KbdSize;
}

const sizeClasses: Record<KbdSize, string> = {
  sm: 'px-1 py-0.5 text-[10px] min-w-[1.25rem] h-5',
  md: 'px-1.5 py-0.5 text-xs min-w-[1.5rem] h-6',
  lg: 'px-2 py-1 text-sm min-w-[1.75rem] h-7',
};

/**
 * Kbd Component
 * A visual representation of a keyboard key, typically used to document keyboard shortcuts.
 * Automatically translates Mac symbols (⌘, ⌥, ⇧) to Windows equivalents (Ctrl, Alt, Shift) on non-Mac OS.
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, children, size = 'md', ...props }, ref) => {
    const [isMac, setIsMac] = useState(true); // Default to true to prevent hydration mismatch on Mac

    useEffect(() => {
      setIsMac(navigator.platform.toLowerCase().includes('mac'));
    }, []);

    let content = children;

    if (typeof children === 'string' && !isMac) {
      let str = children.replace(/⌘\s*([A-Za-z0-9])/g, 'Ctrl + $1');
      str = str.replace(/⌘|cmd|command/gi, 'Ctrl');
      str = str.replace(/⌥\s*([A-Za-z0-9])/g, 'Alt + $1');
      str = str.replace(/⌥|option/gi, 'Alt');
      str = str.replace(/⇧\s*([A-Za-z0-9])/g, 'Shift + $1');
      str = str.replace(/⇧|shift/gi, 'Shift');
      content = str;
    }

    return (
      <kbd
        ref={ref}
        suppressHydrationWarning
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-default bg-subtle font-medium font-mono text-default shadow-sm',
          sizeClasses[size] || sizeClasses.md,
          className
        )}
        {...props}
      >
        {content}
      </kbd>
    );
  }
);

Kbd.displayName = 'Kbd';
