import React, { useMemo, useCallback } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { ParentSize } from '@visx/responsive';
import { max } from '@visx/vendor/d3-array';

export type BarChartProps<T> = {
 data: T[];
 xAccessor: (d: T) => string;
 yAccessor: (d: T) => number;
 width?: number;
 height?: number;
 margin?: { top: number; right: number; bottom: number; left: number };
};

const accentColor = 'var(--color-primary, #3b82f6)';
const tooltipStyles = {
 ...defaultStyles,
 border: '1px solid var(--nui-border-default)',
 color: 'inherit',
 backgroundColor: 'transparent',
 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
 padding: '8px 12px',
 borderRadius: '8px',
};

function BaseBarChart<T>({
 data,
 xAccessor,
 yAccessor,
 width,
 height,
 margin = { top: 40, right: 30, bottom: 50, left: 40 },
}: BarChartProps<T>) {
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

 const xScale = useMemo(
 () =>
 scaleBand<string>({
 range: [0, Math.max(0, innerWidth)],
 domain: data.map(xAccessor),
 padding: 0.4,
 }),
 [innerWidth, data, xAccessor],
 );

 const yScale = useMemo(
 () =>
 scaleLinear<number>({
 range: [Math.max(0, innerHeight), 0],
 domain: [0, (max(data, yAccessor) || 0) + (max(data, yAccessor) || 0) * 0.1],
 nice: true,
 }),
 [innerHeight, data, yAccessor],
 );

 const handleMouseOver = useCallback(
 (event: React.MouseEvent<SVGRectElement> | React.TouchEvent<SVGRectElement>, datum: T) => {
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
 <GridRows
 left={margin.left}
 top={margin.top}
 scale={yScale}
 width={innerWidth}
 height={innerHeight}
 strokeDasharray="4,4"
 stroke="currentColor"
 strokeOpacity={0.1}
 pointerEvents="none"
 />
 <AxisLeft 
 left={margin.left} 
 top={margin.top} 
 scale={yScale} 
 hideAxisLine
 hideTicks
 numTicks={5}
 tickLabelProps={() => ({ 
 fill: 'currentColor', 
 fontSize: 11, 
 opacity: 0.5,
 textAnchor: 'end', 
 dy: '0.33em', 
 dx: '-1em' 
 })} 
 />
 <AxisBottom
 top={innerHeight + margin.top}
 left={margin.left}
 scale={xScale}
 hideAxisLine
 hideTicks
 tickLabelProps={() => ({ 
 fill: 'currentColor', 
 fontSize: 11, 
 opacity: 0.5,
 textAnchor: 'middle', 
 dy: '1em' 
 })}
 />
 <Group left={margin.left} top={margin.top}>
 {data.map((d, i) => {
 const x = xAccessor(d);
 const barWidth = xScale.bandwidth();
 const barHeight = innerHeight - (yScale(yAccessor(d)) ?? 0);
 const barX = xScale(x);
 const barY = innerHeight - barHeight;
 return (
 <Bar
 key={`bar-${x}-${i}`}
 x={barX}
 y={barY}
 width={barWidth}
 height={barHeight}
 fill={accentColor}
 onMouseOver={(e) => handleMouseOver(e, d)}
 onMouseOut={hideTooltip}
 onTouchStart={(e) => handleMouseOver(e, d)}
 onTouchEnd={hideTooltip}
 />
 );
 })}
 </Group>
 </svg>
 {tooltipData && (
 <TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tooltipStyles} className="bg-glass backdrop-blur-sm text-default z-50">
 <div className="text-muted text-xs mb-1 font-medium uppercase tracking-wider">
 {xAccessor(tooltipData)}
 </div>
 <div className="font-bold text-lg">
 {yAccessor(tooltipData).toLocaleString()}
 </div>
 </TooltipWithBounds>
 )}
 </div>
 );
}

export function BarChart<T>(props: Omit<BarChartProps<T>, 'width' | 'height'>) {
 return (
 <div style={{ width: '100%', height: '100%', minHeight: 300, minWidth: 300 }}>
 <ParentSize>
 {({ width, height }) => (
 <BaseBarChart width={width} height={height} {...props} />
 )}
 </ParentSize>
 </div>
 );
}
