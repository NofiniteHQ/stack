import React from 'react';
import { cn } from '../../utils';
import { Badge } from './Badge';
import './Badge.css';

interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  // Marked as optional to allow empty dynamic arrays without TS errors
  children?: React.ReactNode; 
  max?: number;
}

/**
 * BadgeGroup Component
 * * Visually groups multiple Badges together, handling overflow truncation.
 */
export function BadgeGroup({
  children,
  max = 3,
  className,
  ...props
}: BadgeGroupProps) {
  const items = React.Children.toArray(children);
  const visible = items.slice(0, max);
  const extra = items.length - max;

  return (
    <div className={cn("nui-badge-group", className)} {...props}>
      {visible.map((item, i) => (
        // Wrapper span ensures spacing/layout integrity regardless of badge element type
        <span key={i} className="nui-badge-group__item">{item}</span>
      ))}

      {extra > 0 && (
        <Badge variant="default" size="sm" className="nui-badge--more">
          +{extra}
        </Badge>
      )}
    </div>
  );
}