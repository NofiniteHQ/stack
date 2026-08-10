import React from 'react';
import { cn, Slot } from '../../utils';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * We Omit 'title' from the standard HTML attributes because the native HTML 'title' 
 * expects a string (for native tooltips). We override it here to accept ReactNode, 
 * allowing for rich text, icons, or custom JSX inside the alert's title area.
 */
interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
 variant?: AlertVariant;
 title?: React.ReactNode;
 children?: React.ReactNode;
 /** Determines if the close icon button is rendered */
 closable?: boolean;
 /** Callback fired when the close button is clicked. 
 * Note: The component is controlled; it does not unmount itself. 
 */
 onClose?: () => void;
 className?: string;
 /** Renders the component using its child element */
 asChild?: boolean;
}

/**
 * Alert Component
 * * Used to communicate important messages to the user.
 */
export function Alert({
 variant = 'info',
 title,
 children,
 closable = false,
 onClose,
 className,
 asChild,
 ...props
}: AlertProps) {
 // * Accessibility routing: 
 // 'error' and 'warning' are high-priority interruptions, mapped to role="alert".
 // 'info' and 'success' are low-priority updates, mapped to role="status" 
 // so screen readers don't aggressively interrupt the user.
 const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

 const variantStyles = {
 info: 'bg-info-subtle text-info border-info border-l-4 shadow-sm',
 success: 'bg-success-subtle text-success border-success border-l-4 shadow-sm',
 warning: 'bg-warning-subtle text-warning border-warning border-l-4 shadow-sm',
 error: 'bg-danger-subtle text-danger border-danger border-l-4 shadow-sm',
 };

 const Comp = asChild ? Slot : "div";

 return (
 <Comp 
 className={cn(
 "relative flex w-full rounded-lg border p-4",
 variantStyles[variant],
 className
 )} 
 data-variant={variant}
 role={role}
 {...props}
 >
 <div className="flex flex-col gap-1">
 {title && <div className="font-medium leading-none tracking-tight">{title}</div>}
 <div className="text-sm opacity-90">{children}</div>
 </div>

 {closable && (
 <button
 type="button"
 className="absolute right-4 top-4 flex items-center justify-center rounded-md p-1 bg-transparent border-none text-inherit cursor-pointer opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
 aria-label="Close alert"
 onClick={onClose}
 >
 {/* SVG Close Icon: aria-hidden is not needed because the button has an aria-label */}
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="18" y1="6" x2="6" y2="18"></line>
 <line x1="6" y1="6" x2="18" y2="18"></line>
 </svg>
 </button>
 )}
 </Comp>
 );
}