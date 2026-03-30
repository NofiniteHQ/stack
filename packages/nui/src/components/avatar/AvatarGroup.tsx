import React from 'react';
import { cn } from '../../utils'; 
import { AvatarSize, AvatarProps } from './Avatar'; 
import './Avatar.css';

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Maximum number of avatars to display before truncating */
  max?: number;
  /** Size passed down to all nested Avatar components */
  size?: AvatarSize;
  className?: string;
}

/**
 * AvatarGroup Component
 * * Visually groups multiple Avatar components together, handling truncation and overlapping.
 */
export function AvatarGroup({
  children,
  max = 3,
  size = 'md',
  className,
  ...props
}: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visibleItems = items.slice(0, max);
  const extraCount = items.length - max;

  return (
    <div 
      className={cn("nui-avatar-group", className)} 
      data-size={size}
      {...props}
    >
      {visibleItems.map((child) => {
        // * Library Architecture: We strictly check and cast children to ensure we are only
        // injecting props into valid Avatar elements, preventing runtime crashes if users
        // accidentally pass text or invalid DOM nodes as children.
        if (React.isValidElement(child)) {
          const avatarChild = child as React.ReactElement<AvatarProps>;
          
          return React.cloneElement(avatarChild, { 
            size,
            className: cn("nui-avatar-group__item", avatarChild.props.className) 
          });
        }
        return child;
      })}

      {/* Overflow Indicator */}
      {extraCount > 0 && (
        <div className="nui-avatar nui-avatar--excess" data-size={size}>
          <span className="nui-avatar__fallback">+{extraCount}</span>
        </div>
      )}
    </div>
  );
}