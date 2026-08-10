import React from 'react';
import { cn } from '../../utils';

export interface BreadcrumbItem {
 label: React.ReactNode;
 /** If provided, renders the item as an <a> tag */
 href?: string;
 /** Triggered when the breadcrumb is clicked */
 onClick?: (e: React.MouseEvent) => void;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
 items: BreadcrumbItem[];
 /** The maximum number of items to display before truncating the middle path. Default: 5 */
 maxItems?: number;
 /** The visual separator between items. Default: '›' */
 separator?: React.ReactNode;
 className?: string;
}

/**
 * Breadcrumbs Component
 * * A navigation aid that helps users understand their current location within a website.
 * Implements strict WAI-ARIA navigation patterns.
 */
export function Breadcrumbs({
 items,
 maxItems = 5,
 separator = '›',
 className,
 ...props
}: BreadcrumbsProps) {
 if (!items.length) return null;

 // * Truncation Engine
 // If the path length exceeds maxItems, we truncate the middle.
 // We strictly preserve the root (index 0) and the immediate parent + current page (last 2).
 let renderItems: (BreadcrumbItem | 'ellipsis')[] = items;

 if (items.length > maxItems) {
 const start = items.slice(0, 1); 
 const end = items.slice(-2); 
 renderItems = [...start, 'ellipsis', ...end];
 }

 return (
 <nav 
 aria-label="Breadcrumb"
 className={cn("font-sans text-sm", className)} 
 {...props}
 >
 <ol className="flex flex-wrap items-center p-0 m-0 list-none gap-2">
 {renderItems.map((item, index) => {
 const isLast = index === renderItems.length - 1;
 const key = `crumb-${index}`;

 // --- 1. Render Ellipsis ---
 if (item === 'ellipsis') {
 return (
 <li key={key} className="inline-flex items-center gap-2">
 <span className="text-muted flex items-center justify-center" aria-hidden="true">
 …
 </span>
 <span className="text-muted select-none text-[0.9em]" aria-hidden="true">
 {separator}
 </span>
 </li>
 );
 }

 // --- 2. Render Item ---
 const { label, href, onClick } = item;
 // An item is only interactive if it has a destination/action AND is not the current page
 const isInteractive = Boolean(href || onClick) && !isLast;
 
 return (
 <li key={key} className="inline-flex items-center gap-2">
 {isInteractive ? (
 // Interactive Link
 <a
 href={href}
 onClick={onClick}
 className="text-muted no-underline transition-colors cursor-pointer hover:text-primary hover:underline hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
 >
 {label}
 </a>
 ) : (
 // Static Text (Current Page or non-linked breadcrumb)
 <span 
 className={cn(
 "text-muted no-underline transition-colors cursor-pointer hover:text-default hover:underline hover:decoration-default", 
 isLast && "!text-default font-medium cursor-default pointer-events-none hover:no-underline"
 )}
 aria-current={isLast ? 'page' : undefined}
 >
 {label}
 </span>
 )}

 {/* Separator (except for last item) */}
 {!isLast && (
 <span className="text-muted select-none text-[0.9em]" aria-hidden="true">
 {separator}
 </span>
 )}
 </li>
 );
 })}
 </ol>
 </nav>
 );
}