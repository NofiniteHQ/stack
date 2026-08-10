"use client";

import React, { createContext, useContext, useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';

/* ============================================================
 * Contexts
 * ============================================================ */

interface MegaMenuContextValue {
  activeValue: string | null;
  setActiveValue: (val: string | null) => void;
  viewportNode: HTMLDivElement | null;
  setViewportNode: (node: HTMLDivElement | null) => void;
  activeTriggerNode: HTMLButtonElement | null;
  setActiveTriggerNode: (node: HTMLButtonElement | null) => void;
  ignoreFocusRef: React.MutableRefObject<boolean>;
  isHoveringViewport: boolean;
  setIsHoveringViewport: (val: boolean) => void;
}

const MegaMenuContext = createContext<MegaMenuContextValue | null>(null);

function useMegaMenu() {
  const ctx = useContext(MegaMenuContext);
  if (!ctx) throw new Error('Must be used within <MegaMenu>');
  return ctx;
}

interface MegaMenuItemContextValue {
  value: string;
}

const MegaMenuItemContext = createContext<MegaMenuItemContextValue | null>(null);

function useMegaMenuItem() {
  const ctx = useContext(MegaMenuItemContext);
  if (!ctx) throw new Error('Must be used within <MegaMenu.Item>');
  return ctx;
}

/* ============================================================
 * 1. MegaMenu Root
 * ============================================================ */

export type MegaMenuProps = React.HTMLAttributes<HTMLDivElement>;

const MegaMenuRoot = forwardRef<HTMLDivElement, MegaMenuProps>(({
  className,
  children,
  ...props
}, ref) => {
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const [isHoveringViewport, setIsHoveringViewport] = useState(false);
  const [viewportNode, setViewportNode] = useState<HTMLDivElement | null>(null);
  const [activeTriggerNode, setActiveTriggerNode] = useState<HTMLButtonElement | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreFocusRef = useRef(false);

  const handleMouseLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      if (!isHoveringViewport) {
        setActiveValue(null);
      }
    }, 150); // Debounce duration to prevent jitter
  }, [isHoveringViewport]);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!activeValue) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        ignoreFocusRef.current = true;
        setActiveValue(null);
        activeTriggerNode?.focus();
        setTimeout(() => { ignoreFocusRef.current = false; }, 100);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeValue, activeTriggerNode]);

  return (
    <MegaMenuContext.Provider value={{ 
      activeValue, 
      setActiveValue, 
      viewportNode,
      setViewportNode,
      activeTriggerNode,
      setActiveTriggerNode,
      ignoreFocusRef,
      isHoveringViewport,
      setIsHoveringViewport 
    }}>
      <div 
        ref={ref} 
        className={cn("relative inline-block font-sans", className)}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onBlur={(e) => {
          // If focus moves completely outside the MegaMenu, close it
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setActiveValue(null);
          }
        }}
        {...props}
      >
        {children}
      </div>
    </MegaMenuContext.Provider>
  );
});
MegaMenuRoot.displayName = 'MegaMenu';

/* ============================================================
 * 2. MegaMenu Item
 * ============================================================ */

export interface MegaMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const MegaMenuItem = forwardRef<HTMLDivElement, MegaMenuItemProps>(({
  className,
  value,
  children,
  ...props
}, ref) => {
  return (
    <MegaMenuItemContext.Provider value={{ value }}>
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        {children}
      </div>
    </MegaMenuItemContext.Provider>
  );
});
MegaMenuItem.displayName = 'MegaMenu.Item';

/* ============================================================
 * 3. MegaMenu Trigger
 * ============================================================ */

export type MegaMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const MegaMenuTrigger = forwardRef<HTMLButtonElement, MegaMenuTriggerProps>(({
  className,
  children,
  onClick,
  ...props
}, ref) => {
  const { activeValue, setActiveValue, viewportNode, setActiveTriggerNode, ignoreFocusRef } = useMegaMenu();
  const { value } = useMegaMenuItem();
  
  const isActive = activeValue === value;
  
  const handleMouseEnter = (e: React.MouseEvent | React.FocusEvent) => {
    if (e.type === 'focus' && ignoreFocusRef.current) return;
    setActiveValue(value);
    setActiveTriggerNode(e.currentTarget as HTMLButtonElement);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && isActive) {
      e.preventDefault();
      if (viewportNode) {
        const focusable = viewportNode.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (focusable.length > 0) {
          (focusable[0] as HTMLElement).focus();
        }
      }
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center gap-1 px-3 py-2 bg-transparent border-none rounded-sm font-inherit text-sm font-medium text-default cursor-pointer transition-colors hover:bg-subtle hover:text-default focus-visible:outline-none focus-visible:bg-subtle",
        isActive && "bg-subtle text-default",
        className
      )}
      aria-expanded={isActive}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      onKeyDown={(e) => {
        handleKeyDown(e);
        props.onKeyDown?.(e);
      }}
      onClick={(e) => {
        setActiveValue(isActive ? null : value);
        setActiveTriggerNode(e.currentTarget);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
      <svg 
        className={cn("opacity-60 transition-transform duration-300", isActive && "rotate-180 opacity-100")} 
        width="14" height="14" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
});
MegaMenuTrigger.displayName = 'MegaMenu.Trigger';

/* ============================================================
 * 4. MegaMenu Content
 * ============================================================ */

export type MegaMenuContentProps = React.HTMLAttributes<HTMLDivElement>;

const MegaMenuContent = forwardRef<HTMLDivElement, MegaMenuContentProps>(({
  className,
  children,
  ...props
}, ref) => {
  const { activeValue, viewportNode } = useMegaMenu();
  const { value } = useMegaMenuItem();

  const isActive = activeValue === value;

  if (!isActive || !viewportNode) return null;

  // Render into the shared Viewport using Portals. 
  // We use absolute positioning on exit so the layout shrinks smoothly to fit the new content.
  return createPortal(
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0, position: 'relative' }}
      exit={{ opacity: 0, x: 10, position: 'absolute' }}
      transition={{ duration: 0.2 }}
      className={cn("w-max top-0 left-0", className)}
      {...props}
    >
      {children}
    </motion.div>,
    viewportNode
  );
});
MegaMenuContent.displayName = 'MegaMenu.Content';

/* ============================================================
 * 5. MegaMenu Viewport
 * ============================================================ */

export type MegaMenuViewportProps = React.HTMLAttributes<HTMLDivElement>;

const MegaMenuViewport = forwardRef<HTMLDivElement, MegaMenuViewportProps>(({
  className,
  ...props
}, ref) => {
  const { activeValue, setViewportNode, setIsHoveringViewport } = useMegaMenu();

  return (
    <div 
      className="absolute top-full left-0 pt-2 flex justify-start z-50"
      onMouseEnter={() => setIsHoveringViewport(true)}
      onMouseLeave={() => setIsHoveringViewport(false)}
    >
      <AnimatePresence>
        {activeValue && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative bg-surface backdrop-blur-md ring-1 ring-[var(--border-default)] rounded-lg shadow-2xl overflow-hidden transform-gpu",
              className
            )}
            {...props}
          >
            {/* The Portal target node */}
            <div 
              ref={(node) => {
                setViewportNode(node);
                if (typeof ref === 'function') ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
              }}
              className="relative"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
MegaMenuViewport.displayName = 'MegaMenu.Viewport';

/* ============================================================
 * 6. MegaMenu Link (Standardized Item)
 * ============================================================ */

export type MegaMenuLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const MegaMenuLink = forwardRef<HTMLAnchorElement, MegaMenuLinkProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "block w-full cursor-pointer select-none rounded-md px-3 py-2 text-sm font-medium text-default no-underline transition-colors hover:bg-subtle hover:text-default focus-visible:outline-none focus-visible:bg-subtle",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
});
MegaMenuLink.displayName = 'MegaMenu.Link';

/* ============================================================
 * Export
 * ============================================================ */

export const MegaMenu = Object.assign(MegaMenuRoot, {
  Item: MegaMenuItem,
  Trigger: MegaMenuTrigger,
  Content: MegaMenuContent,
  Viewport: MegaMenuViewport,
  Link: MegaMenuLink,
});