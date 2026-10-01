import { renderChart, type ChartOptions } from './renderChart';

export interface ChartInstanceOptions extends ChartOptions {
  element?: HTMLElement;
}

export class Chart {
  public element: HTMLElement;
  public options: ChartOptions;

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
    this.element.innerHTML = renderChart(this.options);
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
    this.element.innerHTML = '';
  }
}
