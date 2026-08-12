"use client";

import React from 'react';
import { cn } from '../../utils';

const statusColors: Record<string, string> = {
  default: 'border-default text-muted',
  primary: 'border-primary text-primary',
  success: 'border-success text-success',
  warning: 'border-warning text-warning',
  error: 'border-danger text-danger',
};

const statusGlows: Record<string, string> = {
  default: 'shadow-sm',
  primary: 'shadow-sm ring-[3px] ring-primary/15 hover:ring-primary/25',
  success: 'shadow-sm ring-[3px] ring-success/15 hover:ring-success/25',
  warning: 'shadow-sm ring-[3px] ring-warning/15 hover:ring-warning/25',
  error: 'shadow-sm ring-[3px] ring-danger/15 hover:ring-danger/25',
};

export interface TimelineItem {
 id: string;
 title: React.ReactNode;
 description?: React.ReactNode;
 time?: React.ReactNode;
 icon?: React.ReactNode;
 status?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
 /** Array of items for Smart Default mode */
 data?: TimelineItem[];
 orientation?: 'vertical' | 'horizontal';
 /** If true, hides the connecting lines between all nodes */
 hideLine?: boolean;
 children?: React.ReactNode;
}

const TimelineContext = React.createContext<{ orientation: 'vertical' | 'horizontal', hideLine?: boolean }>({ orientation: 'vertical' });

const TimelineRoot = React.forwardRef<HTMLDivElement, TimelineProps>(({
 data,
 orientation = 'vertical',
 hideLine = false,
 className,
 children,
 ...props
}, ref) => {
 const isVert = orientation === 'vertical';

 return (
  <TimelineContext.Provider value={{ orientation, hideLine }}>
   <div
    ref={ref}
    className={cn(
     "flex relative",
     isVert ? "flex-col gap-8 [&>div:last-child_.timeline-line]:hidden" : "flex-row gap-8 overflow-x-auto pb-4 w-full [&>div:last-child_.timeline-line]:hidden",
     className
    )}
    {...props}
   >
    {data ? data.map((item, index) => (
     <TimelineItem key={item.id} index={index}>
      <TimelineNode status={item.status} icon={item.icon} />
      <TimelineContent title={item.title} time={item.time} description={item.description} />
     </TimelineItem>
    )) : children}
   </div>
  </TimelineContext.Provider>
 );
});
TimelineRoot.displayName = 'Timeline';

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
 index?: number;
 /** Hides the line extending from this specific item */
 hideLine?: boolean;
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(({
 className,
 index = 0,
 hideLine,
 children,
 ...props
}, ref) => {
 const ctx = React.useContext(TimelineContext);
 const isVert = ctx.orientation === 'vertical';
 const shouldHideLine = hideLine || ctx.hideLine;

 return (
  <div 
   ref={ref}
   className={cn(
    "relative flex",
    isVert ? "flex-row items-start" : "flex-col items-start w-64 flex-shrink-0",
    "animate-fade-in animate-slide-in-up",
    className
   )}
   style={{ animationDelay: `${index * 100}ms` }}
   {...props}
  >
   {!shouldHideLine && (
    <div 
     className={cn(
      "timeline-line absolute z-0",
      isVert 
       ? "left-[15px] top-8 h-full w-[2px] bg-slate-200 dark:bg-slate-700" 
       : "top-[15px] left-8 w-full h-[2px] bg-slate-200 dark:bg-slate-700"
     )}
    />
   )}
   {children}
  </div>
 );
});
TimelineItem.displayName = 'Timeline.Item';

export interface TimelineNodeProps extends React.HTMLAttributes<HTMLDivElement> {
 status?: 'default' | 'primary' | 'success' | 'warning' | 'error';
 icon?: React.ReactNode;
}

const TimelineNode = React.forwardRef<HTMLDivElement, TimelineNodeProps>(({
 className,
 status = 'default',
 icon,
 children,
 ...props
}, ref) => (
 <div 
  ref={ref}
  className={cn(
   "flex items-center justify-center rounded-full border-2 z-10 w-8 h-8 flex-shrink-0 transition-transform duration-300 hover:scale-105 bg-surface",
   statusColors[status],
   statusGlows[status],
   className
  )}
  {...props}
 >
  {children ?? (
   icon ? (
    <span className="text-sm flex items-center justify-center">{icon}</span>
   ) : (
    <div className="w-2 h-2 rounded-full bg-current" />
   )
  )}
 </div>
));
TimelineNode.displayName = 'Timeline.Node';

export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
 time?: React.ReactNode;
 title?: React.ReactNode;
 description?: React.ReactNode;
}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(({
 className,
 time,
 title,
 description,
 children,
 ...props
}, ref) => {
 const { orientation } = React.useContext(TimelineContext);
 const isVert = orientation === 'vertical';

 return (
  <div 
   ref={ref}
   className={cn(
    "flex flex-col",
    isVert ? "ml-6 pt-1" : "mt-6 ml-1",
    className
   )}
   {...props}
  >
   {children ?? (
    <>
     {time && (
      <span className="font-sans text-xs font-semibold text-primary uppercase tracking-wider mb-1">
       {time}
      </span>
     )}
     {title && (
      <h3 className="font-sans text-base font-semibold text-default m-0">
       {title}
      </h3>
     )}
     {description && (
      <div className="font-sans text-sm text-muted mt-1.5 leading-relaxed">
       {description}
      </div>
     )}
    </>
   )}
  </div>
 );
});
TimelineContent.displayName = 'Timeline.Content';

export const Timeline = Object.assign(TimelineRoot, {
 Item: TimelineItem,
 Node: TimelineNode,
 Content: TimelineContent,
});
