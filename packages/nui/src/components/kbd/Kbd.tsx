"use client";
import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Kbd Component
 * A visual representation of a keyboard key, typically used to document keyboard shortcuts.
 * Automatically translates Mac symbols (⌘, ⌥, ⇧) to Windows equivalents (Ctrl, Alt, Shift) on non-Mac OS.
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, children, ...props }, ref) => {
  const [isMac, setIsMac] = useState(true); // Default to true to prevent hydration mismatch on Mac

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'));
  }, []);

  let content = children;
  
  if (typeof content === 'string' && !isMac) {
    content = content.replace(/⌘|cmd|command/gi, 'Ctrl');
    content = content.replace(/⌥|option/gi, 'Alt');
    content = content.replace(/⇧|shift/gi, 'Shift');
  }

  return (
    <kbd
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-default bg-subtle px-1.5 py-0.5 text-xs font-medium font-mono text-default shadow-sm min-w-[1.5rem]",
        className
      )}
      {...props}
    >
      {content}
    </kbd>
  );
});

Kbd.displayName = 'Kbd';
