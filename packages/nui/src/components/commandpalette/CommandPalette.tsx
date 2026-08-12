"use client";

import {
 useEffect,
 useRef,
 useState,
 ReactNode,
 KeyboardEvent as ReactKeyboardEvent,
 useCallback,
} from 'react';
import { Portal, onClickOutside, cn } from '../../utils';
import { Kbd } from '../kbd/Kbd';

/* ============================================================
 * Types
 * ============================================================ */

export interface CommandItem {
 id: string;
 label: string;
 icon?: ReactNode;
 /** Displayed as a <kbd> hint, e.g., "⌘ K" */
 shortcut?: string;
 description?: string;
 onSelect?: () => void;
}

export interface CommandSection {
 title?: string;
 items: CommandItem[];
}

export interface CommandPaletteProps {
 sections: CommandSection[];
 placeholder?: string;
 className?: string;
 /** Forces the palette open/closed. If undefined, it operates purely via Cmd+K internally. */
 open?: boolean; 
 onOpenChange?: (open: boolean) => void;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * CommandPalette Component
 * * A fast, composable, unstyled command menu for React.
 * Architecture Note: Manages a nested data structure (Sections > Items) but mathematically 
 * flattens it for seamless O(1) keyboard navigation across section boundaries.
 */
export function CommandPalette({
 sections,
 placeholder = 'Search commands…',
 className,
 open: controlledOpen,
 onOpenChange,
}: CommandPaletteProps) {
 const [internalOpen, setInternalOpen] = useState(false);
 const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

 const handleOpenChange = useCallback((newOpen: boolean) => {
 if (controlledOpen === undefined) setInternalOpen(newOpen);
 onOpenChange?.(newOpen);
 }, [controlledOpen, onOpenChange]);

 const [query, setQuery] = useState('');
 const [active, setActive] = useState<{ section: number; index: number }>({
 section: 0,
 index: 0,
 });

 const paletteRef = useRef<HTMLDivElement | null>(null);
 const inputRef = useRef<HTMLInputElement | null>(null);
 const activeItemRef = useRef<HTMLDivElement | null>(null);

 /* ----------------------------------------------------
 Filtering & Flat Mapping
 ---------------------------------------------------- */
 // 1. Filter items based on query (checks both label and description)
 // 2. Filter out sections that end up completely empty
 const filteredSections = sections
 .map((sec) => ({
 ...sec,
 items: sec.items.filter(
 (i) =>
 i.label.toLowerCase().includes(query.toLowerCase()) ||
 i.description?.toLowerCase().includes(query.toLowerCase())
 ),
 }))
 .filter((sec) => sec.items.length > 0); 

 // * Navigation Engine: 
 // Creates a flat list of coordinates [{section: 0, index: 0}, {section: 0, index: 1}, {section: 1, index: 0}]
 // This allows the ArrowUp/ArrowDown keys to easily increment/decrement a single integer 
 // and look up the exact multidimensional coordinate.
 const flatList = filteredSections.flatMap((sec, sIdx) =>
 sec.items.map((_, iIdx) => ({ section: sIdx, index: iIdx }))
 );

 /* ----------------------------------------------------
 Event Listeners & Effects
 ---------------------------------------------------- */
 // Global Cmd+K / Ctrl+K shortcut
 useEffect(() => {
 const handler = (e: KeyboardEvent) => {
 const isMac = navigator.platform.toLowerCase().includes('mac');
 const cmd = isMac ? e.metaKey : e.ctrlKey;

 if (cmd && e.key.toLowerCase() === 'k') {
 e.preventDefault();
 handleOpenChange(!isOpen);
 }
 };
 document.addEventListener('keydown', handler);
 return () => document.removeEventListener('keydown', handler);
 }, [isOpen, handleOpenChange]);

 // Close on ESC
 useEffect(() => {
 if (!isOpen) return;
 const handler = (e: KeyboardEvent) => {
 if (e.key === 'Escape') handleOpenChange(false);
 };
 document.addEventListener('keydown', handler);
 return () => document.removeEventListener('keydown', handler);
 }, [isOpen, handleOpenChange]);

 // Click outside to close
 useEffect(() => {
 if (!isOpen) return;
 return onClickOutside(paletteRef, () => handleOpenChange(false));
 }, [isOpen, handleOpenChange]);

 // Reset state and autofocus when opened
 useEffect(() => {
 if (isOpen) {
 setQuery('');
 setActive({ section: 0, index: 0 });
 // Small timeout ensures the React Portal has mounted the DOM node before focusing
 setTimeout(() => inputRef.current?.focus(), 10);
 }
 }, [isOpen]);

 // Auto-scroll active item into view
 useEffect(() => {
 if (isOpen && activeItemRef.current) {
 activeItemRef.current.scrollIntoView({ block: 'nearest' });
 }
 }, [active, isOpen, query]);

 // Reset active index when user types (so it jumps back to top)
 useEffect(() => {
 setActive({ section: 0, index: 0 });
 }, [query]);

 /* ----------------------------------------------------
 Keyboard Navigation
 ---------------------------------------------------- */
 const move = (dir: 1 | -1) => {
 if (flatList.length === 0) return;

 const currentIndex = flatList.findIndex(
 (x) => x.section === active.section && x.index === active.index
 );

 let next = currentIndex + dir;
 // Wrap around logic
 if (next < 0) next = flatList.length - 1;
 if (next >= flatList.length) next = 0;

 setActive(flatList[next]);
 };

 const handleKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
 const key = e.key;

 if (key === 'ArrowDown') {
 e.preventDefault();
 move(1);
 } else if (key === 'ArrowUp') {
 e.preventDefault();
 move(-1);
 } else if (key === 'Enter') {
 e.preventDefault();
 const sec = filteredSections[active.section];
 const item = sec?.items[active.index];

 if (item && item.onSelect) {
 item.onSelect();
 handleOpenChange(false);
 }
 }
 };

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 if (!isOpen) return null;

 return (
 <Portal>
 <div className="fixed inset-0 z-[99998] bg-overlay animate-in fade-in" />

 <div
 ref={paletteRef}
 className={cn("fixed left-1/2 top-[15%] z-[99999] flex w-full max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-default bg-surface backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-4 font-sans", className)}
 role="dialog"
 aria-modal="true"
 onKeyDown={handleKey}
 >
 {/* Search Header */}
 <div className="flex items-center gap-2 border-b border-default px-4">
 <svg className="shrink-0 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <circle cx="11" cy="11" r="8"></circle>
 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
 </svg>
 <input
 ref={inputRef}
 className="flex-1 min-w-0 w-full bg-transparent px-2 py-4 text-lg text-default border-none outline-none ring-0 shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none placeholder:text-muted"
 placeholder={placeholder}
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 />
 {query && (
 <button className="shrink-0 rounded bg-subtle px-2 py-1 text-[10px] font-semibold text-muted border border-default outline-none focus:outline-none" onClick={() => setQuery('')}>
 ESC
 </button>
 )}
 </div>

 {/* Results List */}
 <div className="max-h-[400px] overflow-y-auto p-2 scroll-smooth" role="listbox">
 {filteredSections.length === 0 ? (
 <div className="px-4 py-12 text-center">
 <span className="text-sm text-muted">No results found for "{query}"</span>
 </div>
 ) : (
 filteredSections.map((sec, sIdx) => (
 <div key={sIdx} className="mb-2">
 {sec.title && (
 <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">{sec.title}</div>
 )}

 <div>
 {sec.items.map((item, iIdx) => {
 const isActive = active.section === sIdx && active.index === iIdx;

 return (
 <div
 key={item.id}
 ref={isActive ? activeItemRef : null}
 role="option"
 aria-selected={isActive}
 className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200", isActive ? "bg-subtle text-default font-medium shadow-sm" : "text-default hover:bg-subtle/50")}
 onMouseEnter={() => setActive({ section: sIdx, index: iIdx })}
 onClick={() => {
 item.onSelect?.();
 handleOpenChange(false);
 }}
 >
 {item.icon && (
 <div className={cn("flex h-5 w-5 items-center justify-center", isActive ? "text-default" : "text-muted")}>{item.icon}</div>
 )}

 <div className="flex grow flex-col">
 <div className="text-sm font-semibold tracking-tight">{item.label}</div>
 {item.description && (
 <div className="mt-[2px] text-[12px] text-muted">
 {item.description}
 </div>
 )}
 </div>

 {item.shortcut && (
 <div className="hidden ml-auto md:flex items-center gap-1">
 {item.shortcut.split(' ').map((key, k) => (
 <Kbd key={k} className="flex min-w-[24px] items-center justify-center rounded-md border border-default bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-muted shadow-sm">{key}</Kbd>
 ))}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </Portal>
 );
}