"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

const statusBorders: Record<string, string> = {
  default: 'border-strong',
  primary: 'border-primary',
  success: 'border-success',
  warning: 'border-warning',
  error: 'border-danger',
};

const statusBackgrounds: Record<string, string> = {
  default: 'bg-muted',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-danger',
};

const statusText: Record<string, string> = {
  default: 'text-muted',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-danger',
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
          "flex relative font-sans",
          isVert ? "flex-col gap-8 [&>div:last-child_.timeline-line]:hidden" : "flex-row gap-8 overflow-x-auto pb-4 w-full [&>div:last-child_.timeline-line]:hidden",
          className
        )}
        role="list"
        aria-label="Timeline"
        {...(props as any)}
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
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "relative flex",
        isVert ? "flex-row items-start" : "flex-col items-start w-64 flex-shrink-0",
        className
      )}
      role="listitem"
      {...(props as any)}
    >
      {!shouldHideLine && (
        <div 
          className={cn(
            "timeline-line absolute z-0 bg-[var(--border-default)]",
            isVert 
              ? "left-[15px] top-8 h-full w-[2px]" 
              : "top-[15px] left-8 w-full h-[2px]"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.div>
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
      "flex items-center justify-center rounded-full border-2 z-10 w-8 h-8 flex-shrink-0 bg-surface shadow-sm transition-transform duration-300 hover:scale-105",
      statusBorders[status],
      className
    )}
    {...(props as any)}
  >
    {children ?? (
      icon ? (
        <span className={cn("text-sm flex items-center justify-center", statusText[status])}>{icon}</span>
      ) : (
        <div className={cn("w-2 h-2 rounded-full", statusBackgrounds[status])} />
      )
    )}
  </div>
));
TimelineNode.displayName = 'Timeline.Node';

export interface TimelineContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
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
      {...(props as any)}
    >
      {children ?? (
        <>
          {time && (
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              {time}
            </span>
          )}
          {title && (
            <h3 className="text-base font-semibold text-default m-0">
              {title}
            </h3>
          )}
          {description && (
            <div className="text-sm text-muted mt-1.5 leading-relaxed">
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
