/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Chart } from './Chart';

// Mock ResizeObserver for ParentSize
class ResizeObserver {
 observe() {}
 unobserve() {}
 disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe('Chart Components', () => {
 const timeData = [{ date: new Date().getTime(), value: 10 }];
 const catData = [{ label: 'A', value: 10 }];

 it('renders AreaChart without crashing', () => {
 const { container } = render(
 <Chart
 variant="area"
 data={timeData}
 xAccessor={(d) => d.date}
 yAccessor={(d) => d.value}
 />
 );
 expect(container).toBeInTheDocument();
 });

 it('renders BarChart without crashing', () => {
 const { container } = render(
 <Chart
 variant="bar"
 data={catData}
 xAccessor={(d) => d.label}
 yAccessor={(d) => d.value}
 />
 );
 expect(container).toBeInTheDocument();
 });

 it('renders DonutChart without crashing', () => {
 const { container } = render(
 <Chart
 variant="donut"
 data={catData}
 labelAccessor={(d) => d.label}
 valueAccessor={(d) => d.value}
 />
 );
 expect(container).toBeInTheDocument();
 });

 it('renders LineChart without crashing', () => {
 const { container } = render(
 <Chart
 variant="line"
 data={timeData}
 xAccessor={(d) => d.date}
 yAccessor={(d) => d.value}
 />
 );
 expect(container).toBeInTheDocument();
 });

 it('renders PieChart without crashing', () => {
 const { container } = render(
 <Chart
 variant="pie"
 data={catData}
 labelAccessor={(d) => d.label}
 valueAccessor={(d) => d.value}
 />
 );
 expect(container).toBeInTheDocument();
 });

 it('renders ScatterChart without crashing', () => {
 const { container } = render(
 <Chart
 variant="scatter"
 data={timeData}
 xAccessor={(d) => d.date}
 yAccessor={(d) => d.value}
 />
 );
 expect(container).toBeInTheDocument();
 });
});
