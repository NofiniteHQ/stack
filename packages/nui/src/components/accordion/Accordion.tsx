"use client";

import React, { useState } from 'react';
import { cn } from '../../utils';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** ID of the item that should be open by default */
  defaultOpenId?: string;
  /** If true, allows multiple accordion panels to remain open simultaneously */
  multiple?: boolean;
  className?: string;
}

/**
 * Accordion Component
 * * A progressively disclosed content container.
 * Implements the WAI-ARIA Accordion pattern for screen reader and keyboard accessibility.
 */
export function Accordion({
  items,
  defaultOpenId,
  multiple = false,
  className = '',
}: AccordionProps) {
  // Initialize state. We use an array even for single-select to maintain a consistent state signature.
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const isOpen = (id: string) => openIds.includes(id);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (multiple) {
        // Toggle the specific ID in/out of the array for multiple mode
        return isOpen(id) ? prev.filter((x) => x !== id) : [...prev, id];
      } else {
        // Replace the array entirely for single mode
        return isOpen(id) ? [] : [id];
      }
    });
  };

  return (
    <div className={cn("nui-accordion", className)}>
      {items.map((item) => {
        const open = isOpen(item.id);

        return (
          <div 
            key={item.id} 
            className="nui-accordion__item"
            // Expose state to the DOM for CSS attribute selectors (e.g., [data-state="open"])
            // This enables CSS-only animations and styling without JS overhead.
            data-state={open ? 'open' : 'closed'}
          >
            {/* HEADER
              Native <button> is used to ensure out-of-the-box keyboard support.
              Browsers natively translate 'Enter' and 'Space' keydowns on buttons to 'click' events,
              making custom keyboard listeners redundant.
            */}
            <button
              className="nui-accordion__header"
              aria-expanded={open}
              aria-controls={`panel-${item.id}`}
              id={`accordion-${item.id}`}
              onClick={() => toggle(item.id)}
            >
              <span className="nui-accordion__title">{item.title}</span>
              {/* Chevron Icon: aria-hidden="true" prevents screen readers from announcing it */}
              <svg 
                className="nui-accordion__icon" 
                width="20" height="20" viewBox="0 0 24 24" 
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* PANEL
              Rendered conditionally via CSS (not JS) to allow for enter/exit CSS grid animations.
              aria-labelledby binds the panel context directly to the triggering button.
            */}
            <div
              id={`panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-${item.id}`}
              className="nui-accordion__panel"
            >
              <div className="nui-accordion__content">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}