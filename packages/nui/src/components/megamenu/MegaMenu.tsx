"use client";

import React, { createContext, useContext, useState, useRef, useEffect, forwardRef } from 'react';
import { cn } from '../../utils';
import './MegaMenu.css';

/* ============================================================
 * Context
 * ============================================================ */

interface MegaMenuContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
}

const MegaMenuContext = createContext<MegaMenuContextValue | null>(null);

function useMegaMenu() {
  const ctx = useContext(MegaMenuContext);
  if (!ctx) throw new Error('MegaMenu components must be used within <MegaMenu>');
  return ctx;
}

/* ============================================================
 * 1. MegaMenu Root
 * ============================================================ */

export type MegaMenuProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * MegaMenu Component
 * * A structural navigation wrapper designed to hold complex layouts (like multi-column grids).
 * * Uses Compound Component Architecture.
 */
const MegaMenuRoot = forwardRef<HTMLDivElement, MegaMenuProps>(({
  className,
  children,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  // Unique ID for WAI-ARIA linkage between trigger and content
  const reactId = React.useId();
  const contentId = `nui-megamenu-content-${reactId}`;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      // Check that the click occurred outside BOTH the menu content and the trigger button
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Close on Escape key and restore WAI-ARIA focus to the trigger
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus(); 
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <MegaMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef, contentId }}>
      <div 
        ref={(node) => {
          menuRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }} 
        className={cn("nui-megamenu", className)} 
        {...props}
      >
        {children}
      </div>
    </MegaMenuContext.Provider>
  );
});
MegaMenuRoot.displayName = 'MegaMenu';

/* ============================================================
 * 2. MegaMenu Trigger
 * ============================================================ */

export type MegaMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * MegaMenu Trigger
 * * The interactive button that toggles the visibility of the MegaMenu Content.
 * * Automatically handles ARIA states (expanded, controls).
 */
const MegaMenuTrigger = forwardRef<HTMLButtonElement, MegaMenuTriggerProps>(({
  className,
  children,
  onClick,
  ...props
}, ref) => {
  const { isOpen, setIsOpen, triggerRef, contentId } = useMegaMenu();

  return (
    <button
      ref={(node) => {
        // Assign to internal context ref
        if (triggerRef) {
          (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
        // Assign to forwarded ref
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
      className={cn("nui-megamenu__trigger", isOpen && "active", className)}
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={(e) => {
        setIsOpen((prev) => !prev);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
      <svg 
        className="nui-megamenu__chevron" 
        width="16" height="16" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
});
MegaMenuTrigger.displayName = 'MegaMenu.Trigger';

/* ============================================================
 * 3. MegaMenu Content
 * ============================================================ */

export type MegaMenuContentProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * MegaMenu Content
 * * The dropdown panel containing the complex layout grid.
 * * Unmounts from the DOM when closed to improve performance.
 */
const MegaMenuContent = forwardRef<HTMLDivElement, MegaMenuContentProps>(({
  className,
  children,
  ...props
}, ref) => {
  const { isOpen, contentId } = useMegaMenu();

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      id={contentId}
      role="menu"
      className={cn("nui-megamenu__content", className)}
      {...props}
    >
      {children}
    </div>
  );
});
MegaMenuContent.displayName = 'MegaMenu.Content';

/* ============================================================
 * Export
 * ============================================================ */

export const MegaMenu = Object.assign(MegaMenuRoot, {
  Trigger: MegaMenuTrigger,
  Content: MegaMenuContent,
});