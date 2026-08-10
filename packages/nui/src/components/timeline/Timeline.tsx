"use client";

import React from 'react';
import { cn } from '../../utils';

export interface TimelineItem {
 id: string;
 title: React.ReactNode;
 description?: React.ReactNode;
 time?: React.ReactNode;
 icon?: React.ReactNode;
 status?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
 items: TimelineItem[];
 orientation?: 'vertical' | 'horizontal';
}

const statusColors = {
 default: 'bg-muted text-default border-default',
 primary: 'bg-primary text-primary-fg border-primary',
 success: 'bg-success text-success-fg border-success',
 warning: 'bg-warning text-warning-fg border-warning',
 error: 'bg-danger text-danger-fg border-danger',
};

const statusGlows = {
 default: 'shadow-none',
 primary: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
 success: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
 warning: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
 error: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
};

export function Timeline({ items, orientation = 'vertical', className, ...props }: TimelineProps) {
 const isVert = orientation === 'vertical';

 return (
 <div
 className={cn(
 "flex relative",
 isVert ? "flex-col gap-8" : "flex-row gap-8 overflow-x-auto pb-4 w-full",
 className
 )}
 {...props}
 >
 {/* Background connecting line */}
 <div 
 className={cn(
 "absolute bg-border",
 isVert ? "left-[19px] top-4 bottom-4 w-[2px]" : "top-[19px] left-4 right-4 h-[2px]"
 )}
 />

 {items.map((item, index) => (
 <div 
 key={item.id} 
 className={cn(
 "relative flex",
 isVert ? "flex-row items-start" : "flex-col items-start w-64 flex-shrink-0",
 "animate-fade-in animate-slide-in-up"
 )}
 style={{ animationDelay: `${index * 100}ms` }}
 >
 {/* Node Icon */}
 <div 
 className={cn(
 "flex items-center justify-center rounded-full border-2 z-10 w-10 h-10 flex-shrink-0 transition-transform duration-300 hover:scale-110",
 statusColors[item.status || 'default'],
 statusGlows[item.status || 'default']
 )}
 >
 {item.icon ? (
 <span className="text-sm">{item.icon}</span>
 ) : (
 <div className="w-2.5 h-2.5 rounded-full bg-current" />
 )}
 </div>

 {/* Content */}
 <div 
 className={cn(
 "flex flex-col",
 isVert ? "ml-6 pt-1" : "mt-6 ml-1"
 )}
 >
 {item.time && (
 <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
 {item.time}
 </span>
 )}
 <h3 className="text-base font-semibold text-default m-0">
 {item.title}
 </h3>
 {item.description && (
 <div className="text-sm text-muted mt-1.5 leading-relaxed">
 {item.description}
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 );
}
