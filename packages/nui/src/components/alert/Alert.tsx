import React from 'react';
import { cn } from '../../utils';
import './Alert.css';

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
  ...props
}: AlertProps) {
  // * Accessibility routing: 
  // 'error' and 'warning' are high-priority interruptions, mapped to role="alert".
  // 'info' and 'success' are low-priority updates, mapped to role="status" 
  // so screen readers don't aggressively interrupt the user.
  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

  return (
    <div 
      className={cn("nui-alert", className)} 
      data-variant={variant}
      role={role}
      {...props}
    >
      <div className="nui-alert__content">
        {title && <div className="nui-alert__title">{title}</div>}
        <div className="nui-alert__description">{children}</div>
      </div>

      {closable && (
        <button
          type="button"
          className="nui-alert__close"
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
    </div>
  );
}