import { renderChart, type ChartOptions } from './renderChart';
import {
  calculateAreaPath,
  calculateBarLayout,
  calculatePieSegments,
  normalizeData,
  defaultMargin,
} from './math';
import {
  positionTooltip,
  defaultTooltipPayload,
  renderTooltipHtml,
} from './tooltip';

export interface ChartInstanceOptions extends ChartOptions {
  element?: HTMLElement;
}

export class Chart {
  public element: HTMLElement;
  public options: ChartOptions;
  private abortController: AbortController | null = null;

  constructor(options: ChartInstanceOptions) {
    this.options = options;
    if (options.element) {
      this.element = options.element;
    } else {
      this.element = document.createElement('div');
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
    if (
      this.options.showTooltip === false &&
      this.options.showCrosshair === false
    ) {
      return;
    }

    const container =
      this.element.querySelector<HTMLElement>('.chart-container') ||
      this.element;
    const tooltipEl = container.querySelector<HTMLElement>('.chart-tooltip');
    const overlay = container.querySelector<SVGRectElement>(
      '.chart-scrub-overlay'
    );
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

    if ((variant === 'area' || variant === 'line') && overlay) {
      const { points } = calculateAreaPath(
        this.options.data,
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
            const payload = this.options.tooltipFormatter
              ? this.options.tooltipFormatter(closest.data)
              : defaultTooltipPayload(closest.data, color);
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
    } else if (variant === 'bar') {
      const barEls = container.querySelectorAll<SVGRectElement>('.chart-bar');
      const { bars } = calculateBarLayout(
        this.options.data,
        { width, height, margin },
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
              const payload = this.options.tooltipFormatter
                ? this.options.tooltipFormatter(b.data)
                : defaultTooltipPayload(b.data, b.data.color || color);
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
      const segments = calculatePieSegments(this.options.data, radius, cutout, {
        xAccessor: this.options.xAccessor,
        yAccessor: this.options.yAccessor,
      });

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
              const payload = this.options.tooltipFormatter
                ? this.options.tooltipFormatter(s.data)
                : defaultTooltipPayload(
                    s.data,
                    s.data.color ||
                      `var(--chart-${(i % 8) + 1}, var(--color-primary))`
                  );
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
      const pointEls =
        container.querySelectorAll<SVGCircleElement>('.chart-point');
      const normalized = normalizeData(this.options.data, {
        xAccessor: this.options.xAccessor,
        yAccessor: this.options.yAccessor,
      });

      pointEls.forEach((pointEl, i) => {
        const d = normalized[i];
        if (!d) return;

        pointEl.addEventListener(
          'pointerenter',
          () => {
            if (tooltipEl && this.options.showTooltip !== false) {
              const payload = this.options.tooltipFormatter
                ? this.options.tooltipFormatter(d)
                : defaultTooltipPayload(d, d.color || color);
              tooltipEl.innerHTML = renderTooltipHtml(payload);
              positionTooltip(pointEl, tooltipEl);
              tooltipEl.style.opacity = '1';
            }
          },
          { signal }
        );

        pointEl.addEventListener(
          'pointerleave',
          () => {
            if (tooltipEl) tooltipEl.style.opacity = '0';
          },
          { signal }
        );
      });
    }
  }

  public update(newData?: any[], newOptions?: Partial<ChartOptions>): void {
    if (newData) {
      this.options.data = newData;
    }
    if (newOptions) {
      this.options = { ...this.options, ...newOptions };
    }
    this.render();
  }

  public destroy(): void {
    this.abortController?.abort();
    this.abortController = null;
    this.element.innerHTML = '';
  }
}
