import React from 'react';
import { cn } from '../../utils';
import { Badge } from './Badge';

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
 <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
 {visible.map((item, i) => (
 // Wrapper span ensures spacing/layout integrity regardless of badge element type
 <span key={i} className="inline-flex">{item}</span>
 ))}

 {extra > 0 && (
 <Badge variant="default" size="sm" className="ml-1">
 +{extra}
 </Badge>
 )}
 </div>
 );
}