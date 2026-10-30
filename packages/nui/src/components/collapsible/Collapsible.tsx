import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  disabled?: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextValue | undefined>(
  undefined
);

export const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsible must be used within a Collapsible');
  }
  return context;
};

export interface CollapsibleProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onToggle' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  defaultOpen?: boolean;
  isOpen?: boolean;
  open?: boolean;
  onToggle?: (isOpen: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      children,
      defaultOpen = false,
      isOpen,
      open: openProp,
      onToggle,
      onOpenChange,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    const isControlled = isOpen !== undefined || openProp !== undefined;
    const open = isControlled ? isOpen ?? openProp ?? false : internalOpen;

    const toggle = () => {
      if (disabled) return;
      if (!isControlled) setInternalOpen(!open);
      onToggle?.(!open);
      onOpenChange?.(!open);
    };

    return (
      <CollapsibleContext.Provider value={{ open, toggle, disabled }}>
        <div
          ref={ref}
          className={cn(
            'w-full border-b border-default',
            disabled && 'opacity-60 cursor-not-allowed',
            className
          )}
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = 'Collapsible';

export type CollapsibleTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(
  (
    { children, className, disabled: triggerDisabled, onClick, ...props },
    ref
  ) => {
    const { open, toggle, disabled: contextDisabled } = useCollapsible();
    const isDisabled = contextDisabled || triggerDisabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          'group flex justify-between items-center w-full px-0 py-3 bg-transparent border-none cursor-pointer text-left text-default outline-none hover:text-primary transition-colors duration-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] font-sans text-base font-medium disabled:cursor-not-allowed disabled:hover:text-default',
          className
        )}
        onClick={(e) => {
          if (!isDisabled) {
            toggle();
          }
          onClick?.(e);
        }}
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </button>
    );
  }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export type CollapsibleContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ children, className, ...props }, ref) => {
  const { open } = useCollapsible();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div
            ref={ref}
            className={cn(
              'text-muted font-sans text-base leading-relaxed pb-4',
              className
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
CollapsibleContent.displayName = 'CollapsibleContent';
