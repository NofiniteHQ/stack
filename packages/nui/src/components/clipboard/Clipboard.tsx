"use client";

import React, { useState, forwardRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from '../button/Button';

export interface ClipboardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  timeout?: number;
  hideIcon?: boolean;
}

export const Clipboard = forwardRef<HTMLDivElement, ClipboardProps>(
  (
    {
      value,
      timeout = 2000,
      className,
      children,
      hideIcon = false,
      ...props
    },
    ref
  ) => {
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
      let timeoutId: number;
      if (hasCopied) {
        timeoutId = window.setTimeout(() => setHasCopied(false), timeout);
      }
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }, [hasCopied, timeout]);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setHasCopied(true);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    };

    return (
      <div 
        ref={ref} 
        className={cn(
          "group relative flex items-center justify-between gap-3 bg-subtle hover:bg-subtle border border-default rounded-lg pl-3 pr-1.5 py-1.5 text-[13px] font-mono overflow-hidden transition-colors duration-200", 
          className
        )}
        {...props}
      >
        <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide text-default">
          {children || value}
        </div>
        {!hideIcon && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "shrink-0 h-7 w-7 rounded-md opacity-70 transition-all duration-200",
              hasCopied ? "text-success opacity-100" : "text-muted hover:text-default hover:opacity-100"
            )}
            onClick={handleCopy}
            aria-label="Copy to clipboard"
          >
            {hasCopied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        )}
      </div>
    );
  }
);

Clipboard.displayName = 'Clipboard';
