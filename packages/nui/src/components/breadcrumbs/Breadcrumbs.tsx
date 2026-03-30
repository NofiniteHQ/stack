import React from 'react';
import { cn } from '../../utils';
import './Breadcrumbs.css';

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
      className={cn("nui-breadcrumbs", className)} 
      {...props}
    >
      <ol className="nui-breadcrumbs__list">
        {renderItems.map((item, index) => {
          const isLast = index === renderItems.length - 1;
          const key = `crumb-${index}`;

          // --- 1. Render Ellipsis ---
          if (item === 'ellipsis') {
            return (
              <li key={key} className="nui-breadcrumbs__item">
                <span className="nui-breadcrumbs__ellipsis" aria-hidden="true">
                  …
                </span>
                <span className="nui-breadcrumbs__separator" aria-hidden="true">
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
            <li key={key} className="nui-breadcrumbs__item">
              {isInteractive ? (
                // Interactive Link
                <a
                  href={href}
                  onClick={onClick}
                  className="nui-breadcrumbs__link"
                >
                  {label}
                </a>
              ) : (
                // Static Text (Current Page or non-linked breadcrumb)
                <span 
                  className={cn(
                    "nui-breadcrumbs__link", 
                    isLast && "nui-breadcrumbs__link--current"
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {label}
                </span>
              )}

              {/* Separator (except for last item) */}
              {!isLast && (
                <span className="nui-breadcrumbs__separator" aria-hidden="true">
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