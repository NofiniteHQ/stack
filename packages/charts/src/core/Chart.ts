import { renderChart, type ChartOptions } from './renderChart';
import {
  calculateAreaPath,
  calculatePieSegments,
  calculateMultiSeriesAreaPath,
  calculateMultiBarLayout,
  type ChartSeries,
  type DataPoint,
  normalizeData,
  defaultMargin,
} from './math';
import { formatMetricNumber } from './axis';
import {
  positionTooltip,
  renderTooltipHtml,
  type TooltipPayload,
} from './tooltip';
import { exportToCSV, exportToSVG, exportToPNG } from './export';

export interface ChartInstanceOptions extends ChartOptions {
  element?: HTMLElement;
}

export class Chart {
  public element: HTMLElement;
  public options: ChartOptions;
  private abortController: AbortController | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;

  constructor(options: ChartInstanceOptions) {
    this.options = options;
    if (options.element) {
      this.element = options.element;
      if (!options.width && options.element.clientWidth > 0) {
        this.options.width = options.element.clientWidth;
      }
    } else {
      this.element = document.createElement('div');
    }

    if (
      typeof ResizeObserver !== 'undefined' &&
      !options.width &&
      options.element
    ) {
      this.resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const newWidth = Math.round(entry.contentRect.width);
        if (
          newWidth > 0 &&
          Math.abs(newWidth - (this.options.width || 0)) >= 2
        ) {
          if (this.rafId) cancelAnimationFrame(this.rafId);
          this.rafId = requestAnimationFrame(() => {
            this.options.width = newWidth;
            this.render();
          });
        }
      });
      this.resizeObserver.observe(this.element);
    }

    this.render();
  }

  public render(): void {
    this.abortController?.abort();
    this.abortController = new AbortController();

    this.element.innerHTML = renderChart(this.options);
    this.attachInteractivity(this.abortController.signal);
  }

  private attachInteractivity(signal: AbortSignal): void {
    const container =
      this.element.querySelector<HTMLElement>('.chart-container') ||
      this.element;
    const tooltipEl = container.querySelector<HTMLElement>('.chart-tooltip');
    const overlay = container.querySelector<SVGRectElement>(
      '.chart-scrub-overlay'
    );
    if (overlay) {
      overlay.style.touchAction = 'none';
    }
    const crosshair =
      container.querySelector<SVGLineElement>('.chart-crosshair');
    const activeDot =
      container.querySelector<SVGCircleElement>('.chart-active-dot');

    const width = this.options.width || 600;
    const height = this.options.height || 300;
    const margin = this.options.margin || defaultMargin;
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - margin.top - margin.bottom);
    const color = this.options.color || 'var(--chart-1, var(--color-primary))';
    const variant = this.options.variant;

    const seriesList: ChartSeries[] =
      this.options.series && this.options.series.length > 0
        ? this.options.series
        : [
            {
              name: 'Series 1',
              data: this.options.data || [],
              color,
            },
          ];

    // Interactive Legend
    const legendButtons =
      container.querySelectorAll<HTMLButtonElement>('.chart-legend-item');
    legendButtons.forEach((btn) => {
      btn.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
          const seriesName = btn.getAttribute('data-series');
          const target = seriesList.find((s) => s.name === seriesName);
          if (target) {
            target.hidden = !target.hidden;
            this.options.series = seriesList;
            this.render();
          }
        },
        { signal }
      );
    });

    if (
      this.options.showTooltip === false &&
      this.options.showCrosshair === false
    ) {
      return;
    }

    if ((variant === 'area' || variant === 'line') && overlay) {
      if (seriesList.length > 1) {
        // Multi-Series Interactivity
        const { series } = calculateMultiSeriesAreaPath(
          seriesList,
          { width, height, margin },
          this.options.xAccessor,
          this.options.yAccessor
        );

        const activeSeries = series.filter((s) => !s.hidden);

        const onPointerMove = (e: PointerEvent) => {
          if (activeSeries.length === 0) return;
          const rect = overlay.getBoundingClientRect();
          const localX = (e.clientX - rect.left) * (innerWidth / rect.width);

          // Find primary closest point across all active series
          const primaryPoints = activeSeries[0].points;
          let primaryClosest = primaryPoints[0];
          let minDistance = Infinity;
          for (const p of primaryPoints) {
            const dist = Math.abs(p.x - localX);
            if (dist < minDistance) {
              minDistance = dist;
              primaryClosest = p;
            }
          }

          if (primaryClosest) {
            if (crosshair && this.options.showCrosshair !== false) {
              crosshair.setAttribute('x1', String(primaryClosest.x));
              crosshair.setAttribute('x2', String(primaryClosest.x));
              crosshair.style.opacity = '0.7';
            }
            if (activeDot) {
              activeDot.setAttribute('cx', String(primaryClosest.x));
              activeDot.setAttribute('cy', String(primaryClosest.y));
              activeDot.style.opacity = '1';
            }

            if (tooltipEl && this.options.showTooltip !== false) {
              const multiPayload: TooltipPayload = {
                title:
                  primaryClosest.data.label ||
                  (primaryClosest.data.x instanceof Date
                    ? primaryClosest.data.x.toLocaleDateString()
                    : String(primaryClosest.data.x)),
                items: activeSeries.map((s) => {
                  let sClosest = s.points[0];
                  let sMin = Infinity;
                  for (const pt of s.points) {
                    const d = Math.abs(pt.x - localX);
                    if (d < sMin) {
                      sMin = d;
                      sClosest = pt;
                    }
                  }
                  return {
                    color: s.color,
                    label: s.name,
                    value:
                      typeof sClosest.data.y === 'number'
                        ? formatMetricNumber(sClosest.data.y)
                        : String(sClosest.data.y),
                  };
                }),
              };

              tooltipEl.innerHTML = renderTooltipHtml(multiPayload);

              const virtualRef = {
                getBoundingClientRect: () => {
                  const cRect = container.getBoundingClientRect();
                  const scaleX = cRect.width / width;
                  const scaleY = cRect.height / height;
                  const px =
                    cRect.left + (margin.left + primaryClosest.x) * scaleX;
                  const py =
                    cRect.top + (margin.top + primaryClosest.y) * scaleY;
                  return new DOMRect(px, py, 0, 0);
                },
              };
              positionTooltip(virtualRef, tooltipEl);
              tooltipEl.style.opacity = '1';
            }
          }
        };

        const onPointerLeave = () => {
          if (crosshair) crosshair.style.opacity = '0';
          if (activeDot) activeDot.style.opacity = '0';
          if (tooltipEl) tooltipEl.style.opacity = '0';
        };

        overlay.addEventListener('pointermove', onPointerMove, { signal });
        overlay.addEventListener('pointerdown', onPointerMove, { signal });
        overlay.addEventListener('pointerleave', onPointerLeave, { signal });
      } else {
        // Single Series Interactivity
        const { points } = calculateAreaPath(
          seriesList[0].data,
          { width, height, margin },
          this.options.xAccessor,
          this.options.yAccessor
        );

        const onPointerMove = (e: PointerEvent) => {
          if (!points || points.length === 0) return;
          const rect = overlay.getBoundingClientRect();
          const localX = (e.clientX - rect.left) * (innerWidth / rect.width);

          let closest = points[0];
          let minDistance = Infinity;
          for (const p of points) {
            const dist = Math.abs(p.x - localX);
            if (dist < minDistance) {
              minDistance = dist;
              closest = p;
            }
          }

          if (closest) {
            if (crosshair && this.options.showCrosshair !== false) {
              crosshair.setAttribute('x1', String(closest.x));
              crosshair.setAttribute('x2', String(closest.x));
              crosshair.style.opacity = '0.7';
            }
            if (activeDot) {
              activeDot.setAttribute('cx', String(closest.x));
              activeDot.setAttribute('cy', String(closest.y));
              activeDot.style.opacity = '1';
            }
            if (tooltipEl && this.options.showTooltip !== false) {
              const seriesName =
                seriesList[0]?.name && seriesList[0].name !== 'Series 1'
                  ? seriesList[0].name
                  : '';
              const payload = this.options.tooltipFormatter
                ? this.options.tooltipFormatter(closest.data)
                : {
                    title:
                      closest.data.label ||
                      (closest.data.x instanceof Date
                        ? closest.data.x.toLocaleDateString()
                        : String(closest.data.x)),
                    items: [
                      {
                        color,
                        label: seriesName,
                        value: formatMetricNumber(closest.data.y),
                      },
                    ],
                  };
              tooltipEl.innerHTML = renderTooltipHtml(payload);

              const virtualRef = {
                getBoundingClientRect: () => {
                  const cRect = container.getBoundingClientRect();
                  const scaleX = cRect.width / width;
                  const scaleY = cRect.height / height;
                  const px = cRect.left + (margin.left + closest.x) * scaleX;
                  const py = cRect.top + (margin.top + closest.y) * scaleY;
                  return new DOMRect(px, py, 0, 0);
                },
              };
              positionTooltip(virtualRef, tooltipEl);
              tooltipEl.style.opacity = '1';
            }
          }
        };

        const onPointerLeave = () => {
          if (crosshair) crosshair.style.opacity = '0';
          if (activeDot) activeDot.style.opacity = '0';
          if (tooltipEl) tooltipEl.style.opacity = '0';
        };

        overlay.addEventListener('pointermove', onPointerMove, { signal });
        overlay.addEventListener('pointerdown', onPointerMove, { signal });
        overlay.addEventListener('pointerleave', onPointerLeave, { signal });
      }
    } else if (variant === 'bar') {
      const barEls = container.querySelectorAll<SVGRectElement>('.chart-bar');
      const layout = this.options.barLayout || 'grouped';
      const { bars } = calculateMultiBarLayout(
        seriesList,
        { width, height, margin },
        layout,
        { xAccessor: this.options.xAccessor, yAccessor: this.options.yAccessor }
      );

      barEls.forEach((barEl, i) => {
        const b = bars[i];
        if (!b) return;

        barEl.addEventListener(
          'pointerenter',
          () => {
            barEls.forEach((el, j) => {
              el.style.opacity = i === j ? '1' : '0.5';
            });
            if (tooltipEl && this.options.showTooltip !== false) {
              const isMulti = seriesList.length > 1;
              const payload = this.options.tooltipFormatter
                ? this.options.tooltipFormatter(b.data)
                : {
                    title: b.data.label,
                    items: [
                      {
                        color: b.color,
                        label: isMulti ? b.seriesName : '',
                        value:
                          typeof b.data.y === 'number'
                            ? formatMetricNumber(b.data.y)
                            : String(b.data.y),
                      },
                    ],
                  };
              tooltipEl.innerHTML = renderTooltipHtml(payload);
              positionTooltip(barEl, tooltipEl);
              tooltipEl.style.opacity = '1';
            }
          },
          { signal }
        );

        barEl.addEventListener(
          'pointerleave',
          () => {
            barEls.forEach((el) => {
              el.style.opacity = '1';
            });
            if (tooltipEl) tooltipEl.style.opacity = '0';
          },
          { signal }
        );
      });
    } else if (variant === 'pie' || variant === 'donut') {
      const segmentEls =
        container.querySelectorAll<SVGPathElement>('.chart-segment');
      const radius = Math.min(innerWidth, innerHeight) / 2 - 8;
      const cutout = variant === 'donut' ? this.options.donutCutout ?? 0.6 : 0;
      const segments = calculatePieSegments(
        seriesList[0].data,
        radius,
        cutout,
        {
          xAccessor: this.options.xAccessor,
          yAccessor: this.options.yAccessor,
        }
      );

      segmentEls.forEach((segmentEl, i) => {
        const s = segments[i];
        if (!s) return;

        segmentEl.addEventListener(
          'pointerenter',
          () => {
            segmentEls.forEach((el, j) => {
              el.style.opacity = i === j ? '1' : '0.5';
              el.style.transform = i === j ? 'scale(1.04)' : 'scale(1)';
            });
            if (tooltipEl && this.options.showTooltip !== false) {
              const totalVal = segments.reduce(
                (sum, seg) =>
                  sum + (typeof seg.data.y === 'number' ? seg.data.y : 0),
                0
              );
              const val = typeof s.data.y === 'number' ? s.data.y : 0;
              const pct =
                totalVal > 0 ? ((val / totalVal) * 100).toFixed(1) : '0';
              const payload = this.options.tooltipFormatter
                ? this.options.tooltipFormatter(s.data)
                : {
                    title: s.data.label || `Segment ${i + 1}`,
                    items: [
                      {
                        color:
                          s.data.color ||
                          `var(--chart-${(i % 8) + 1}, var(--color-primary))`,
                        label: '',
                        value: `${formatMetricNumber(val)} (${pct}%)`,
                      },
                    ],
                  };
              tooltipEl.innerHTML = renderTooltipHtml(payload);
              positionTooltip(segmentEl, tooltipEl);
              tooltipEl.style.opacity = '1';
            }
          },
          { signal }
        );

        segmentEl.addEventListener(
          'pointerleave',
          () => {
            segmentEls.forEach((el) => {
              el.style.opacity = '1';
              el.style.transform = 'scale(1)';
            });
            if (tooltipEl) tooltipEl.style.opacity = '0';
          },
          { signal }
        );
      });
    } else if (variant === 'scatter') {
      const hitTargetEls = container.querySelectorAll<SVGCircleElement>(
        '.chart-scatter-hit-target'
      );
      const normalized = normalizeData(seriesList[0].data, {
        xAccessor: this.options.xAccessor,
        yAccessor: this.options.yAccessor,
      });

      hitTargetEls.forEach((hitEl, i) => {
        const d = normalized[i];
        if (!d) return;
        const visualDot =
          hitEl.parentElement?.querySelector<SVGCircleElement>('.chart-point');

        hitEl.addEventListener(
          'pointerenter',
          () => {
            if (visualDot) visualDot.setAttribute('r', '6');
            if (tooltipEl && this.options.showTooltip !== false) {
              const pointTitle =
                d.label ||
                `(${formatMetricNumber(
                  typeof d.x === 'number' ? d.x : 0
                )}, ${formatMetricNumber(d.y)})`;
              const payload = this.options.tooltipFormatter
                ? this.options.tooltipFormatter(d)
                : {
                    title: pointTitle,
                    items: [
                      {
                        color: d.color || color,
                        label: 'X',
                        value: formatMetricNumber(
                          typeof d.x === 'number' ? d.x : 0
                        ),
                      },
                      {
                        color: d.color || color,
                        label: 'Y',
                        value: formatMetricNumber(d.y),
                      },
                    ],
                  };
              tooltipEl.innerHTML = renderTooltipHtml(payload);
              positionTooltip(hitEl, tooltipEl);
              tooltipEl.style.opacity = '1';
            }
          },
          { signal }
        );

        hitEl.addEventListener(
          'pointerleave',
          () => {
            if (visualDot) visualDot.setAttribute('r', '4');
            if (tooltipEl) tooltipEl.style.opacity = '0';
          },
          { signal }
        );
      });
    }
  }

  public update(
    newData?: DataPoint[],
    newOptions?: Partial<ChartOptions>
  ): void {
    if (newData) {
      if (this.options.series) {
        this.options.data = newData;
      } else {
        this.options.data = newData;
      }
    }
    if (newOptions) {
      this.options = { ...this.options, ...newOptions };
    }
    this.render();
  }

  public destroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.abortController?.abort();
    this.abortController = null;
    this.element.innerHTML = '';
  }

  public toCSV(filename = 'chart-data.csv'): string {
    const seriesList = this.options.series || [
      { name: 'Series 1', data: this.options.data || [] },
    ];
    return exportToCSV(seriesList, filename);
  }

  public toSVG(filename = 'chart.svg'): string {
    const svgEl = this.element.querySelector('svg');
    if (!svgEl) return '';
    return exportToSVG(svgEl, filename);
  }

  public toPNG(
    filenameOrOptions:
      | string
      | { filename?: string; scale?: number } = 'chart.png',
    scaleArg = 2
  ): Promise<Blob | null> {
    const filename =
      typeof filenameOrOptions === 'string'
        ? filenameOrOptions
        : filenameOrOptions?.filename || 'chart.png';
    const scale =
      typeof filenameOrOptions === 'object' &&
      filenameOrOptions?.scale !== undefined
        ? filenameOrOptions.scale
        : scaleArg;
    const svgEl = this.element.querySelector('svg');
    if (!svgEl) return Promise.resolve(null);
    return exportToPNG(svgEl, filename, scale);
  }
}
