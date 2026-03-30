import React from 'react';
import { cn, Slot } from '../../utils';
import './Link.css';

export type LinkVariant = 'default' | 'primary' | 'muted' | 'danger';
export type LinkUnderline = 'none' | 'hover' | 'always';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  underline?: LinkUnderline;
  /** Automatically applies `target="_blank"` and `rel="noopener noreferrer"` for external routing security. */
  isExternal?: boolean;
  /** * Polymorphic Prop: When true, delegates rendering to its child.
   * Crucial for integrating with framework routers like Next.js `<Link>` or React Router.
   */
  asChild?: boolean;
}

/**
 * Link Component
 * --------------
 * Typographical navigation element designed to blend seamlessly into paragraphs, lists, and breadcrumbs.
 * Architecture Note: For functional Call-to-Action links that require button-like padding and backgrounds, 
 * use the `<Button asChild>` component instead.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    className, 
    variant = 'default', 
    underline = 'hover',
    isExternal = false,
    asChild = false,
    children, 
    ...props 
  }, ref) => {
    
    // Auto-apply security attributes for external navigation to prevent tabnabbing attacks
    const externalProps = isExternal ? {
      target: "_blank",
      rel: "noopener noreferrer"
    } : {};

    // Determine the root node. If asChild is true, use our zero-dependency Slot to merge props onto the child.
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        className={cn(
          "nui-link",
          `nui-link--${variant}`,
          `nui-link--underline-${underline}`,
          className
        )}
        {...externalProps}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Link.displayName = "Link";