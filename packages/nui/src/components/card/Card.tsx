import React from 'react';
import { cn } from '../../utils';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** If true, makes the card interactive via mouse and keyboard (Enter/Space) */
  clickable?: boolean;
  /** If true, adds a shadow elevation effect on hover */
  hover?: boolean;
}

/**
 * CardRoot
 * * The main container for the Card component.
 * Architecture Note: We manage the 'clickable' state here to ensure the container
 * receives the correct ARIA roles and keyboard event listeners, transforming a standard
 * <div> into an accessible interactive element when needed.
 */
const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, clickable = false, hover = false, onClick, onKeyDown, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'nui-card',
          clickable && 'nui-card--clickable',
          hover && 'nui-card--hover',
          className
        )}
        // Assign button role if clickable for screen readers
        role={clickable ? 'button' : undefined}
        // Make focusable if clickable
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? onClick : undefined}
        onKeyDown={(e) => {
          // Preserve any user-provided onKeyDown logic
          if (onKeyDown) onKeyDown(e);
          
          if (!clickable) return;
          
          // Trigger click on Enter or Space for keyboard users
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // * Type Casting Note: React types expect a MouseEvent for onClick.
            // Since we are synthesizing a click from a KeyboardEvent, we must cast it
            // through 'unknown' to satisfy TypeScript's strict event typing.
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardRoot.displayName = 'Card';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("nui-card__header", className)} {...props} />
  )
);
Header.displayName = 'Card.Header';

const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("nui-card__body", className)} {...props} />
  )
);
Body.displayName = 'Card.Body';

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("nui-card__footer", className)} {...props} />
  )
);
Footer.displayName = 'Card.Footer';

const Divider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cn("nui-card__divider", className)} {...props} />
  )
);
Divider.displayName = 'Card.Divider';

/**
 * Compound Component Architecture
 * Exposes sub-components via dot notation (e.g., <Card.Header>) for a cleaner API.
 */
export const Card = Object.assign(CardRoot, {
  Header,
  Body,
  Footer,
  Divider,
});