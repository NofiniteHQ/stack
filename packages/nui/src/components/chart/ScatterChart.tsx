import React, { useMemo, useCallback } from 'react';
import { scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { ParentSize } from '@visx/responsive';
import { max, min } from '@visx/vendor/d3-array';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';

export type ScatterChartProps<T> = {
 data: T[];
 xAccessor: (d: T) => number;
 yAccessor: (d: T) => number;
 rAccessor?: (d: T) => number;
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

function BaseScatterChart<T>({
 data,
 xAccessor,
 yAccessor,
 rAccessor,
 width,
 height,
 margin = { top: 40, right: 40, bottom: 50, left: 50 },
}: ScatterChartProps<T>) {
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

 const xMax = max(data, xAccessor) || 10;
 const xMin = min(data, xAccessor) || 0;
 const yMax = max(data, yAccessor) || 10;
 const yMin = min(data, yAccessor) || 0;

 const xPadding = (xMax - xMin) * 0.1;
 const yPadding = (yMax - yMin) * 0.1;

 const xScale = useMemo(
 () =>
 scaleLinear({
 range: [0, Math.max(0, innerWidth)],
 domain: [xMin - xPadding, xMax + xPadding],
 nice: true,
 }),
 [innerWidth, xMin, xMax, xPadding],
 );

 const yScale = useMemo(
 () =>
 scaleLinear({
 range: [Math.max(0, innerHeight), 0],
 domain: [yMin - yPadding, yMax + yPadding],
 nice: true,
 }),
 [innerHeight, yMin, yMax, yPadding],
 );

 const handleMouseOver = useCallback(
 (event: React.MouseEvent<SVGCircleElement> | React.TouchEvent<SVGCircleElement>, datum: T) => {
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
 {/* Subtle Grid */}
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
 <GridColumns
 left={margin.left}
 top={margin.top}
 scale={xScale}
 width={innerWidth}
 height={innerHeight}
 strokeDasharray="4,4"
 stroke="currentColor"
 strokeOpacity={0.05}
 pointerEvents="none"
 />
 
 {/* Y Axis */}
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
 
 {/* X Axis */}
 <AxisBottom
 top={innerHeight + margin.top}
 left={margin.left}
 scale={xScale}
 hideAxisLine
 hideTicks
 numTicks={innerWidth > 500 ? 8 : 4} // Prevent overlapping
 tickFormat={(val) => {
 // Check if it's likely a timestamp (e.g. > 1000000000000)
 if (Number(val) > 1000000000000) {
 return new Date(Number(val)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
 }
 return String(val);
 }}
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
 const cx = xScale(xAccessor(d));
 const cy = yScale(yAccessor(d));
 const r = rAccessor ? rAccessor(d) : 5;
 return (
 <Circle
 key={`point-${i}`}
 cx={cx}
 cy={cy}
 r={r}
 fill={accentColor}
 fillOpacity={0.8}
 stroke="var(--bg-surface, #ffffff)"
 strokeWidth={1}
 onMouseOver={(e) => handleMouseOver(e, d)}
 onMouseOut={hideTooltip}
 onTouchStart={(e) => handleMouseOver(e, d)}
 onTouchEnd={hideTooltip}
 className="transition-all duration-200 hover:fillOpacity-100 hover:r-8 cursor-pointer"
 />
 );
 })}
 </Group>
 </svg>
 {tooltipData && (
 <TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tooltipStyles} className="bg-glass backdrop-blur-sm text-default z-50">
 <div className="text-muted text-xs mb-1 font-medium uppercase tracking-wider">
 {Number(xAccessor(tooltipData)) > 1000000000000 
 ? new Date(Number(xAccessor(tooltipData))).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
 : `X: ${xAccessor(tooltipData).toLocaleString()}`}
 </div>
 <div className="font-bold text-lg">
 Y: {yAccessor(tooltipData).toLocaleString()}
 </div>
 </TooltipWithBounds>
 )}
 </div>
 );
}

export function ScatterChart<T>(props: Omit<ScatterChartProps<T>, 'width' | 'height'>) {
 return (
 <div style={{ width: '100%', height: '100%', minHeight: 300, minWidth: 300 }}>
 <ParentSize>
 {({ width, height }) => (
 <BaseScatterChart width={width} height={height} {...props} />
 )}
 </ParentSize>
 </div>
 );
}
