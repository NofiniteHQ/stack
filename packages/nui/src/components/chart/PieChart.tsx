import React, { useMemo, useCallback } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { ParentSize } from '@visx/responsive';

export type PieChartProps<T> = {
 data: T[];
 labelAccessor: (d: T) => string;
 valueAccessor: (d: T) => number;
 width?: number;
 height?: number;
 margin?: { top: number; right: number; bottom: number; left: number };
 colors?: string[];
};

const defaultColors = [
 'var(--color-primary, #3b82f6)',
 'var(--color-info, #0ea5e9)',
 'var(--color-success, #22c55e)',
 'var(--color-warning, #eab308)',
 'var(--color-danger, #ef4444)',
 '#8b5cf6', // violet-500
 '#ec4899', // pink-500
 '#f97316', // orange-500
];

const tooltipStyles = {
 ...defaultStyles,
 border: '1px solid var(--nui-border-default)',
 color: 'inherit',
 backgroundColor: 'transparent',
 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
 padding: '8px 12px',
 borderRadius: '8px',
};

function BasePieChart<T>({
 data,
 labelAccessor,
 valueAccessor,
 width,
 height,
 margin = { top: 20, right: 20, bottom: 20, left: 20 },
 colors = defaultColors,
}: PieChartProps<T>) {
 const {
 showTooltip,
 hideTooltip,
 tooltipData,
 tooltipTop = 0,
 tooltipLeft = 0,
 } = useTooltip<T>();

 const safeWidth = width || 300;
 const safeHeight = height || 300;

 const innerWidth = safeWidth - margin.left - margin.right;
 const innerHeight = safeHeight - margin.top - margin.bottom;
 const radius = Math.min(innerWidth, innerHeight) / 2;
 const centerY = innerHeight / 2;
 const centerX = innerWidth / 2;

 const colorScale = useMemo(
 () =>
 scaleOrdinal({
 domain: data.map(labelAccessor),
 range: colors,
 }),
 [data, labelAccessor, colors],
 );

 const handleMouseOver = useCallback(
 (event: React.MouseEvent<SVGPathElement> | React.TouchEvent<SVGPathElement>, datum: T) => {
 const coords = localPoint(event) || { x: 0, y: 0 };
 showTooltip({
 tooltipData: datum,
 tooltipLeft: coords.x,
 tooltipTop: coords.y,
 });
 },
 [showTooltip]
 );

 return (
 <div style={{ position: 'relative', width: '100%', height: '100%' }} className="text-default font-sans">
 <svg width={safeWidth} height={safeHeight} className="overflow-visible">
 <Group top={centerY + margin.top} left={centerX + margin.left}>
 <Pie
 data={data}
 pieValue={valueAccessor}
 outerRadius={radius}
 innerRadius={0}
 cornerRadius={0}
 padAngle={0.01}
 >
 {(pie) => {
 return pie.arcs.map((arc, index) => {
 const label = labelAccessor(arc.data);
 const arcFill = colorScale(label);
 return (
 <g key={`arc-${label}-${index}`}>
 <path
 d={pie.path(arc) ?? undefined}
 fill={arcFill}
 onMouseOver={(e) => handleMouseOver(e, arc.data)}
 onMouseOut={hideTooltip}
 onTouchStart={(e) => handleMouseOver(e, arc.data)}
 onTouchEnd={hideTooltip}
 className="transition-all duration-200 hover:opacity-80 cursor-pointer"
 />
 </g>
 );
 });
 }}
 </Pie>
 </Group>
 </svg>
 {tooltipData && (
 <TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tooltipStyles} className="bg-glass backdrop-blur-sm text-default z-50">
 <div className="flex items-center gap-2 mb-1">
 <span 
 className="w-3 h-3 rounded-full" 
 style={{ backgroundColor: colorScale(labelAccessor(tooltipData)) }} 
 />
 <span className="text-muted text-xs font-medium uppercase tracking-wider">
 {labelAccessor(tooltipData)}
 </span>
 </div>
 <div className="font-bold text-lg">
 {valueAccessor(tooltipData).toLocaleString()}
 </div>
 </TooltipWithBounds>
 )}
 </div>
 );
}

export function PieChart<T>(props: Omit<PieChartProps<T>, 'width' | 'height'>) {
 return (
 <div style={{ width: '100%', height: '100%', minHeight: 300, minWidth: 300 }}>
 <ParentSize>
 {({ width, height }) => (
 <BasePieChart width={width} height={height} {...props} />
 )}
 </ParentSize>
 </div>
 );
}
