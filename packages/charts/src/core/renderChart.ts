import {
  type DataPoint,
  defaultMargin,
  calculateAreaPath,
  calculateBarLayout,
  calculatePieSegments,
} from './math';

export type ChartVariant =
  | 'area'
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'scatter';

export interface ChartOptions {
  variant: ChartVariant;
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  donutCutout?: number;
  showGrid?: boolean;
  showAxes?: boolean;
}

let gradientCounter = 0;

export function renderChart(options: ChartOptions): string {
  const width = options.width || 600;
  const height = options.height || 300;
  const margin = options.margin || defaultMargin;
  const data = options.data || [];
  const variant = options.variant;
  const color = options.color || 'var(--chart-1, var(--color-primary))';
  const showGrid = options.showGrid !== false;

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const gradientId = `nui-chart-grad-${++gradientCounter}`;

  let contentSvg = '';

  if (variant === 'area' || variant === 'line') {
    const { areaPath, linePath, yScale } = calculateAreaPath(
      data,
      { width, height, margin },
      (d) => (d.date ? new Date(d.date) : data.indexOf(d)),
      (d) => d.value
    );

    // Grid lines
    let gridSvg = '';
    if (showGrid && yScale.ticks) {
      const ticks = yScale.ticks(5);
      gridSvg = ticks
        .map(
          (t: number) => `
        <line x1="0" y1="${yScale(t)}" x2="${innerWidth}" y2="${yScale(t)}"
              stroke="var(--border-default)" stroke-opacity="0.6" stroke-dasharray="3,3" />
      `
        )
        .join('');
    }

    contentSvg = `
      <g transform="translate(${margin.left}, ${margin.top})">
        ${gridSvg}
        ${
          variant === 'area'
            ? `<path d="${areaPath}" fill="url(#${gradientId})" />`
            : ''
        }
        <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${data
          .map((d, i) => {
            const x = (i / Math.max(1, data.length - 1)) * innerWidth;
            const y = yScale(d.value);
            return `
            <circle cx="${x}" cy="${y}" r="3.5" fill="${color}" stroke="var(--bg-surface)" stroke-width="2" class="chart-point transition-transform hover:scale-150" />
          `;
          })
          .join('')}
      </g>
    `;
  } else if (variant === 'bar') {
    const { bars, yScale } = calculateBarLayout(data, {
      width,
      height,
      margin,
    });

    let gridSvg = '';
    if (showGrid && yScale.ticks) {
      const ticks = yScale.ticks(5);
      gridSvg = ticks
        .map(
          (t: number) => `
        <line x1="0" y1="${yScale(t)}" x2="${innerWidth}" y2="${yScale(t)}"
              stroke="var(--border-default)" stroke-opacity="0.6" stroke-dasharray="3,3" />
      `
        )
        .join('');
    }

    contentSvg = `
      <g transform="translate(${margin.left}, ${margin.top})">
        ${gridSvg}
        ${bars
          .map(
            (b) => `
          <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${
              b.height
            }" rx="4"
                fill="${
                  b.data.color || color
                }" class="chart-bar transition-opacity hover:opacity-80" />
        `
          )
          .join('')}
      </g>
    `;
  } else if (variant === 'pie' || variant === 'donut') {
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const cutout = variant === 'donut' ? options.donutCutout ?? 0.6 : 0;
    const segments = calculatePieSegments(data, radius, cutout);
    const centerX = width / 2;
    const centerY = height / 2;

    contentSvg = `
      <g transform="translate(${centerX}, ${centerY})">
        ${segments
          .map(
            (s, i) => `
          <path d="${s.path}" fill="${
              s.data.color ||
              `var(--chart-${(i % 5) + 1}, var(--color-primary))`
            }"
                stroke="var(--bg-surface)" stroke-width="2" class="chart-segment transition-transform hover:scale-105" />
        `
          )
          .join('')}
      </g>
    `;
  } else if (variant === 'scatter') {
    const xExt = [0, 100];
    const yExt = [0, 100];
    if (data.length) {
      const xs = data.map((d: any) => d.x ?? 0);
      const ys = data.map((d: any) => d.y ?? d.value ?? 0);
      xExt[0] = Math.min(...xs);
      xExt[1] = Math.max(...xs) || 100;
      yExt[0] = Math.min(...ys);
      yExt[1] = Math.max(...ys) || 100;
    }
    const xScale = (val: number) =>
      ((val - xExt[0]) / (xExt[1] - xExt[0] || 1)) * innerWidth;
    const yScale = (val: number) =>
      innerHeight - ((val - yExt[0]) / (yExt[1] - yExt[0] || 1)) * innerHeight;

    contentSvg = `
      <g transform="translate(${margin.left}, ${margin.top})">
        ${data
          .map(
            (d: any) => `
          <circle cx="${xScale(d.x ?? 0)}" cy="${yScale(
              d.y ?? d.value ?? 0
            )}" r="4"
                  fill="${
                    d.color || color
                  }" stroke="var(--bg-surface)" stroke-width="2"
                  class="chart-point transition-transform hover:scale-125" />
        `
          )
          .join('')}
      </g>
    `;
  }

  return `
    <div class="nui-chart-container relative w-full font-sans select-none" style="height: ${height}px;">
      <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.28" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.00" />
          </linearGradient>
        </defs>
        ${contentSvg}
      </svg>
    </div>
  `.trim();
}
