"use client";

import React, { useState } from 'react';
import { cn } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';

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
 <div className={cn("w-full border-t border-default bg-surface text-default", className)}>
 {items.map((item) => {
 const open = isOpen(item.id);

 return (
 <div 
 key={item.id} 
 className="group border-b border-default"
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
 className="flex justify-between items-center w-full px-4 py-3 bg-transparent border-none cursor-pointer text-left text-default outline-none hover:text-primary transition-colors duration-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
 aria-expanded={open}
 aria-controls={`panel-${item.id}`}
 id={`accordion-${item.id}`}
 onClick={() => toggle(item.id)}
 >
 <span className="font-sans text-base font-medium">{item.title}</span>
 {/* Chevron Icon: aria-hidden="true" prevents screen readers from announcing it */}
 <svg 
 className="text-muted transition-transform duration-200 ease-in-out w-4 h-4 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" 
 width="20" height="20" viewBox="0 0 24 24" 
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
 aria-hidden="true"
 >
 <path d="m6 9 6 6 6-6"/>
 </svg>
 </button>

 {/* PANEL
 Rendered conditionally with framer-motion for smooth enter/exit animations.
 aria-labelledby binds the panel context directly to the triggering button.
 */}
 <AnimatePresence initial={false}>
 {open && (
 <motion.div
 id={`panel-${item.id}`}
 role="region"
 aria-labelledby={`accordion-${item.id}`}
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="text-muted font-sans text-base leading-relaxed px-4 pb-4">
 {item.content}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </div>
 );
}