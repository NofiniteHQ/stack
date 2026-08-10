import React from 'react';
import { AreaChart, AreaChartProps } from './AreaChart';
import { BarChart, BarChartProps } from './BarChart';
import { DonutChart, DonutChartProps } from './DonutChart';
import { LineChart, LineChartProps } from './LineChart';
import { PieChart, PieChartProps } from './PieChart';
import { ScatterChart, ScatterChartProps } from './ScatterChart';

export type ChartVariant = 'area' | 'bar' | 'donut' | 'line' | 'pie' | 'scatter';

type BaseWrapperProps = {
 variant: ChartVariant;
};

export type UnifiedChartProps<T> = BaseWrapperProps & (
 | ({ variant: 'area' } & Omit<AreaChartProps<T>, 'width' | 'height'>)
 | ({ variant: 'bar' } & Omit<BarChartProps<T>, 'width' | 'height'>)
 | ({ variant: 'donut' } & Omit<DonutChartProps<T>, 'width' | 'height'>)
 | ({ variant: 'line' } & Omit<LineChartProps<T>, 'width' | 'height'>)
 | ({ variant: 'pie' } & Omit<PieChartProps<T>, 'width' | 'height'>)
 | ({ variant: 'scatter' } & Omit<ScatterChartProps<T>, 'width' | 'height'>)
);

export function Chart<T>(props: UnifiedChartProps<T>) {
 switch (props.variant) {
 case 'area':
 return <AreaChart {...props} />;
 case 'bar':
 return <BarChart {...props} />;
 case 'donut':
 return <DonutChart {...props} />;
 case 'line':
 return <LineChart {...props} />;
 case 'pie':
 return <PieChart {...props} />;
 case 'scatter':
 return <ScatterChart {...props} />;
 default:
 return null;
 }
}
