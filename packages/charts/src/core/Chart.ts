import { renderChart, type ChartOptions } from './renderChart';

export class Chart {
  public element: HTMLElement;
  public options: ChartOptions;

  constructor(options: ChartOptions & { element?: HTMLElement }) {
    this.options = options;
    if (options.element) {
      this.element = options.element;
    } else {
      const container = document.createElement('div');
      container.innerHTML = renderChart(options);
      this.element = container.firstElementChild as HTMLElement;
    }

    this.render();
  }

  public render(): void {
    this.element.innerHTML = renderChart(this.options);
  }

  public update(newData: any[]): void {
    this.options.data = newData;
    this.render();
  }

  public destroy(): void {
    this.element.innerHTML = '';
  }
}
