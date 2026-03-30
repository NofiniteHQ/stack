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
import './CommandPalette.css';

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
      <div className="nui-cmd-overlay" />

      <div
        ref={paletteRef}
        className={cn("nui-cmd", className)}
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKey}
      >
        {/* Search Header */}
        <div className="nui-cmd-header">
          <svg className="nui-cmd-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            className="nui-cmd-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="nui-cmd-clear" onClick={() => setQuery('')}>
              ESC
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="nui-cmd-list" role="listbox">
          {filteredSections.length === 0 ? (
            <div className="nui-cmd-empty">
              <span className="nui-cmd-empty-text">No results found for "{query}"</span>
            </div>
          ) : (
            filteredSections.map((sec, sIdx) => (
              <div key={sIdx} className="nui-cmd-section">
                {sec.title && (
                  <div className="nui-cmd-section-title">{sec.title}</div>
                )}

                <div className="nui-cmd-section-items">
                  {sec.items.map((item, iIdx) => {
                    const isActive = active.section === sIdx && active.index === iIdx;

                    return (
                      <div
                        key={item.id}
                        ref={isActive ? activeItemRef : null}
                        role="option"
                        aria-selected={isActive}
                        className={cn("nui-cmd-item", isActive && "active")}
                        onMouseEnter={() => setActive({ section: sIdx, index: iIdx })}
                        onClick={() => {
                          item.onSelect?.();
                          handleOpenChange(false);
                        }}
                      >
                        {item.icon && (
                          <div className="nui-cmd-item-icon">{item.icon}</div>
                        )}

                        <div className="nui-cmd-item-meta">
                          <div className="nui-cmd-item-label">{item.label}</div>
                          {item.description && (
                            <div className="nui-cmd-item-description">
                              {item.description}
                            </div>
                          )}
                        </div>

                        {item.shortcut && (
                          <div className="nui-cmd-item-shortcut">
                            {item.shortcut.split(' ').map((key, k) => (
                              <kbd key={k}>{key}</kbd>
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