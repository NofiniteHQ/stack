"use client";

import React, { createContext, useContext, useState, useRef, forwardRef, useId } from 'react';
import { cn } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================================
 * Context
 * ============================================================ */

interface TabsContextValue {
 value: string;
 onValueChange: (value: string) => void;
 // A unique ID prefix to link triggers and panels for screen readers
 idPrefix: string; 
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
 const ctx = useContext(TabsContext);
 if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
 return ctx;
}

/* ============================================================
 * 1. Tabs Root
 * ============================================================ */

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
 /** Controlled state value representing the active tab */
 value?: string;
 /** Uncontrolled initial value */
 defaultValue?: string;
 /** Callback fired when the active tab changes */
 onChange?: (value: string) => void;
 children: React.ReactNode;
}

/**
 * Tabs Component (Root)
 * * A Compound Component that manages the state and accessibility linking for a tabbed interface.
 */
const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(
 ({ value, defaultValue, onChange, children, className, ...props }, ref) => {
 const isControlled = value !== undefined;
 const [internalValue, setInternalValue] = useState(defaultValue || '');
 
 // Generate a stable, SSR-safe ID for ARIA linkage
 const idPrefix = useId();

 const currentValue = isControlled ? value : internalValue;

 const handleValueChange = (newValue: string) => {
 if (!isControlled) setInternalValue(newValue);
 onChange?.(newValue);
 };

 return (
 <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, idPrefix }}>
 <div ref={ref} className={cn("flex flex-col w-full font-sans", className)} {...props}>
 {children}
 </div>
 </TabsContext.Provider>
 );
 }
);
TabsRoot.displayName = 'Tabs';

/* ============================================================
 * 2. Tabs List
 * ============================================================ */

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
 children: React.ReactNode;
}

/**
 * Tabs List
 * * Contains the tab triggers.
 * * Implements a "Roving Tabindex" to allow users to navigate tabs via arrow keys.
 */
const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
 ({ children, className, ...props }, ref) => {
 const listRef = useRef<HTMLDivElement>(null);

 // Smart Roving Tabindex for Keyboard Navigation
 const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
 const target = e.target as HTMLElement;
 if (target.getAttribute('role') !== 'tab') return;

 const list = listRef.current;
 if (!list) return;

 // Find all valid tab triggers
 const tabs = Array.from(
 list.querySelectorAll('[role="tab"]:not([disabled])')
 ) as HTMLElement[];
 
 const currentIndex = tabs.indexOf(target);
 if (currentIndex === -1) return;

 let nextIndex = currentIndex;

 if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
 else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
 else if (e.key === 'Home') nextIndex = 0;
 else if (e.key === 'End') nextIndex = tabs.length - 1;
 else return;

 e.preventDefault();
 tabs[nextIndex].focus();
 };

 return (
 <div
 ref={(node) => {
 listRef.current = node;
 if (typeof ref === 'function') ref(node);
 else if (ref) ref.current = node;
 }}
 role="tablist"
 aria-orientation="horizontal"
 className={cn("flex flex-nowrap gap-4 border-b border-default overflow-x-auto scrollbar-hide", className)}
 onKeyDown={handleKeyDown}
 {...props}
 >
 {children}
 </div>
 );
 }
);
TabsList.displayName = 'Tabs.List';

/* ============================================================
 * 3. Tabs Trigger
 * ============================================================ */

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 /** The unique identifier associated with this tab's content */
 value: string;
}

/**
 * Tabs Trigger
 * * The interactive button that activates a specific tab panel.
 * * Follows the WAI-ARIA "Automatic Activation" pattern (focusing the tab activates it).
 */
const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
 ({ value, children, className, disabled, onClick, onFocus, ...props }, ref) => {
 const { value: selectedValue, onValueChange, idPrefix } = useTabs();
 const isSelected = selectedValue === value;

 return (
 <button
 ref={ref}
 type="button"
 role="tab"
 id={`tab-${idPrefix}-${value}`}
 aria-selected={isSelected}
 aria-controls={`panel-${idPrefix}-${value}`}
 tabIndex={isSelected ? 0 : -1} // Only active tab is in the natural page tab sequence
 disabled={disabled}
 className={cn(
 "relative inline-flex items-center justify-center whitespace-nowrap px-4 py-3 -mb-px bg-transparent border-0 border-b-2 border-transparent text-sm font-medium text-muted cursor-pointer transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:bg-subtle focus-visible:text-default focus-visible:rounded-t-md",
 isSelected && "!text-primary font-semibold",
 disabled && "opacity-50 cursor-not-allowed",
 className
 )}
 onClick={(e) => {
 if (!disabled) onValueChange(value);
 onClick?.(e);
 }}
 onFocus={(e) => {
 // Automatic Activation: Auto-select on keyboard focus
 if (!disabled) onValueChange(value);
 onFocus?.(e);
 }}
 {...props}
 >
 {children}
 {isSelected && (
 <motion.div
 layoutId="activeTab"
 className="absolute left-0 right-0 bottom-[-2px] h-[2px] bg-primary"
 />
 )}
 </button>
 );
 }
);
TabsTrigger.displayName = 'Tabs.Trigger';

/* ============================================================
 * 4. Tabs Content
 * ============================================================ */

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
 /** The unique identifier connecting this panel to its trigger */
 value: string;
}

/**
 * Tabs Content
 * * The panel that displays when its associated trigger is active.
 * * Only mounts to the DOM when active to keep the DOM clean.
 */
const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
 ({ value, children, className, ...props }, ref) => {
 const { value: selectedValue, idPrefix } = useTabs();
 const isSelected = selectedValue === value;

 return (
 <AnimatePresence>
 {isSelected && (
 <motion.div
 ref={ref as any}
 role="tabpanel"
 id={`panel-${idPrefix}-${value}`}
 aria-labelledby={`tab-${idPrefix}-${value}`}
 tabIndex={0} // Allows content area to be focused and read by screen readers
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className={cn("py-6 text-default outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm", className)}
 {...props}
 >
 {children}
 </motion.div>
 )}
 </AnimatePresence>
 );
 }
);
TabsContent.displayName = 'Tabs.Content';

/* ============================================================
 * Export
 * ============================================================ */

export const Tabs = Object.assign(TabsRoot, {
 List: TabsList,
 Trigger: TabsTrigger,
 Content: TabsContent,
});