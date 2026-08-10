import React, { useMemo, useCallback } from 'react';
import { AreaClosed, LinePath, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from '@visx/vendor/d3-array';
import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';

export type AreaChartProps<T> = {
 data: T[];
 xAccessor: (d: T) => number | Date;
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
 backgroundColor: 'transparent', // overridden by class
 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
 padding: '8px 12px',
 borderRadius: '8px',
};

function BaseChart<T>({
 data,
 xAccessor,
 yAccessor,
 width,
 height,
 margin = { top: 40, right: 30, bottom: 50, left: 40 },
}: AreaChartProps<T>) {
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

 const xValue = useCallback((d: T) => {
 const val = xAccessor(d);
 return val instanceof Date ? val : new Date(val);
 }, [xAccessor]);

 const xScale = useMemo(
 () =>
 scaleTime({
 range: [0, Math.max(0, innerWidth)],
 domain: extent(data, xValue) as [Date, Date],
 }),
 [innerWidth, data, xValue],
 );

 const yScale = useMemo(
 () =>
 scaleLinear({
 range: [Math.max(0, innerHeight), 0],
 domain: [0, (max(data, yAccessor) || 0) + (max(data, yAccessor) || 0) * 0.2],
 nice: true,
 }),
 [innerHeight, data, yAccessor],
 );

 const bisectDate = bisector<T, Date>(xValue).left;

 const handleTooltip = useCallback(
 (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
 const { x } = localPoint(event) || { x: 0 };
 const x0 = xScale.invert(x - margin.left);
 const index = bisectDate(data, x0, 1);
 const d0 = data[index - 1];
 const d1 = data[index];
 let d = d0;
 if (d1 && xValue(d1)) {
 const v1 = xValue(d1).getTime();
 const v0 = xValue(d0).getTime();
 const x0Val = x0.getTime();

 d = x0Val - v0 > v1 - x0Val ? d1 : d0;
 }
 showTooltip({
 tooltipData: d,
 tooltipLeft: x,
 tooltipTop: yScale(yAccessor(d)) + margin.top,
 });
 },
 [showTooltip, yScale, xScale, data, xAccessor, yAccessor, margin.left, margin.top, bisectDate],
 );

 return (
 <div style={{ position: 'relative', width: '100%', height: '100%' }} className="text-default font-sans">
 <svg width={safeWidth} height={safeHeight} className="overflow-visible">
 <LinearGradient id="area-gradient" from={accentColor} to={accentColor} fromOpacity={0.3} toOpacity={0.01} />
 
 {/* Subtle Horizontal Grid Only */}
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

 {/* Y Axis - No axis line, no ticks, just clean text */}
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

 {/* X Axis - No axis line, no ticks, clean date formatting */}
 <AxisBottom
 top={innerHeight + margin.top}
 left={margin.left}
 scale={xScale}
 hideAxisLine
 hideTicks
 numTicks={innerWidth > 500 ? 8 : 4} // Prevent overlapping on small screens
 tickFormat={(d) => {
 const date = d as Date;
 return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
 <AreaClosed<T>
 data={data}
 x={(d) => xScale(xValue(d)) ?? 0}
 y={(d) => yScale(yAccessor(d)) ?? 0}
 yScale={yScale}
 strokeWidth={1}
 stroke="url(#area-gradient)"
 fill="url(#area-gradient)"
 curve={curveMonotoneX}
 />
 <LinePath<T>
 data={data}
 x={(d) => xScale(xValue(d)) ?? 0}
 y={(d) => yScale(yAccessor(d)) ?? 0}
 stroke={accentColor}
 strokeWidth={2}
 curve={curveMonotoneX}
 />
 </Group>
 <Bar
 x={margin.left}
 y={margin.top}
 width={innerWidth}
 height={innerHeight}
 fill="transparent"
 rx={14}
 onTouchStart={handleTooltip}
 onTouchMove={handleTooltip}
 onMouseMove={handleTooltip}
 onMouseLeave={() => hideTooltip()}
 />
 {tooltipData && (
 <Group left={margin.left} top={margin.top}>
 <circle
 cx={xScale(xValue(tooltipData))}
 cy={yScale(yAccessor(tooltipData))}
 r={4}
 fill={accentColor}
 stroke="var(--bg-surface, #ffffff)"
 strokeWidth={2}
 pointerEvents="none"
 />
 </Group>
 )}
 </svg>
 {tooltipData && (
 <TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tooltipStyles} className="bg-glass backdrop-blur-sm text-default z-50">
 <div className="text-muted text-xs mb-1 font-medium uppercase tracking-wider">
 {xValue(tooltipData).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
 </div>
 <div className="font-bold text-lg">
 {yAccessor(tooltipData).toLocaleString()}
 </div>
 </TooltipWithBounds>
 )}
 </div>
 );
}

export function AreaChart<T>(props: Omit<AreaChartProps<T>, 'width' | 'height'>) {
 return (
 <div style={{ width: '100%', height: '100%', minHeight: 300, minWidth: 300 }}>
 <ParentSize>
 {({ width, height }) => (
 <BaseChart width={width} height={height} {...props} />
 )}
 </ParentSize>
 </div>
 );
}
