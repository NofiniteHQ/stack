import { describe, it, expect } from 'vitest';
import { createGenerator } from 'unocss';
import { nuicssPreset } from '../plugin/preset';
import { componentShortcuts, rawShortcuts } from './index';

describe('nuicss shortcuts', () => {
  it('should include all raw shortcuts with dual nui-* aliases', () => {
    expect(componentShortcuts.length).toBeGreaterThan(rawShortcuts.length);
    // Spot check presence of key component shortcuts
    const names = (componentShortcuts as any[]).map(([name]) => name);
    expect(names).toContain('btn');
    expect(names).toContain('nui-btn');
    expect(names).toContain('btn-primary');
    expect(names).toContain('nui-btn-primary');
    expect(names).toContain('card');
    expect(names).toContain('nui-card');
    expect(names).toContain('badge');
    expect(names).toContain('nui-badge');
    expect(names).toContain('input');
    expect(names).toContain('nui-input');
    expect(names).toContain('stat-card');
    expect(names).toContain('nui-stat-card');
    expect(names).toContain('modal');
    expect(names).toContain('nui-modal');
    expect(names).toContain('modal-backdrop');
    expect(names).toContain('nui-modal-backdrop');
    expect(names).toContain('dialog-backdrop');
    expect(names).toContain('nui-dialog-backdrop');
    expect(names).toContain('table');
    expect(names).toContain('nui-table');
  });

  it('should generate CSS for standard and nui-* prefixed component classes', async () => {
    const uno = await createGenerator(nuicssPreset());

    const { css: standardCss } = await uno.generate(
      'btn btn-primary card badge input modal-backdrop'
    );
    expect(standardCss).toContain('inline-flex');
    expect(standardCss).toContain('var(--color-primary)');
    expect(standardCss).toContain('var(--radius-xl)');
    expect(standardCss).toContain('var(--bg-overlay)');

    const { css: prefixedCss } = await uno.generate(
      'nui-btn nui-btn-primary nui-card nui-badge nui-input nui-modal-backdrop'
    );
    expect(prefixedCss).toContain('inline-flex');
    expect(prefixedCss).toContain('var(--color-primary)');
    expect(prefixedCss).toContain('var(--radius-xl)');
    expect(prefixedCss).toContain('var(--bg-overlay)');
  }, 15000);

  it('should generate modern stat-card without harsh 2018 borders', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'stat-card stat-card-value stat-card-trend'
    );

    expect(css).toContain('var(--radius-xl)');
    expect(css).not.toContain('border-t-[3px]');
    expect(css).not.toContain('border-t-3');
  });

  it('should generate tooltip with placement classes', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'tooltip tooltip-top tooltip-bottom tooltip-left tooltip-right'
    );

    expect(css).toContain('position:fixed');
    expect(css).toContain('bottom:100%');
    expect(css).toContain('top:100%');
    expect(css).toContain('right:100%');
    expect(css).toContain('left:100%');
  });

  it('should support tree-shaking: only requested shortcuts are emitted', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('btn btn-primary');

    expect(css).toContain('btn');
    // Table, modal, or domain classes should not be in the output CSS
    expect(css).not.toContain('table-sortable');
    expect(css).not.toContain('modal-box');
    expect(css).not.toContain('kanban-board');
    expect(css).not.toContain('markon-editor');
    expect(css).not.toContain('chart-container');
  });

  it('should selectively emit domain component rules only when referenced', async () => {
    const uno = await createGenerator(nuicssPreset());

    // 1. Kanban selective emission
    const { css: kanbanCss } = await uno.generate('kanban-board');
    expect(kanbanCss).toContain('kanban-board');
    expect(kanbanCss).not.toContain('markon-editor');
    expect(kanbanCss).not.toContain('chart-container');

    // 2. Markon selective emission
    const { css: markonCss } = await uno.generate('markon-editor');
    expect(markonCss).toContain('markon-editor');
    expect(markonCss).not.toContain('kanban-board');
    expect(markonCss).not.toContain('chart-container');

    // 3. Charts selective emission
    const { css: chartCss } = await uno.generate('chart-container');
    expect(chartCss).toContain('chart-container');
    expect(chartCss).not.toContain('kanban-board');
    expect(chartCss).not.toContain('markon-editor');

    // 4. Table container selective emission with descendant table styling
    const { css: tableCss } = await uno.generate('table-container');
    expect(tableCss).toContain('table-container');
    expect(tableCss).toContain('.table-container table');
    expect(tableCss).not.toContain('kanban-board');
  });

  it('should generate ARIA state styles for tabs, accordion, and inputs', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'tab accordion-icon input select switch'
    );

    expect(css).toContain('aria-selected');
    expect(css).toContain('aria-expanded');
    expect(css).toContain('aria-invalid');
    expect(css).toContain('aria-checked');
  });

  it('should generate micro-interaction classes and physics easing', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'press-scale hover-lift focus-ring skeleton-shimmer ease-spring ease-bounce'
    );

    expect(css).toContain('var(--ease-spring)');
    expect(css).toContain('var(--ease-bounce)');
    expect(css).toContain('shimmer');
    expect(css).toContain('scale');
  });

  it('should generate pure CSS charts, sparklines, and metric cards', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'metric-card metric-label metric-value chart-bar-horizontal chart-bar-fill sparkline-container sparkline-bar progress-ring metric-badge-success'
    );

    expect(css).toContain('.metric-card');
    expect(css).toContain('.chart-bar-horizontal');
    expect(css).toContain('.chart-bar-fill');
    expect(css).toContain('.sparkline-container');
    expect(css).toContain('.sparkline-bar');
    expect(css).toContain('.progress-ring');
    expect(css).toContain('.metric-badge-success');
    expect(css).toContain('var(--border-default)');
  });

  it('should generate aria-busy, aria-disabled, and aria-hidden states', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'btn dropdown-item modal drawer checkbox glow-brand glow-success'
    );

    expect(css).toContain('[aria-busy=true]');
    expect(css).toContain('[aria-disabled=true]');
    expect(css).toContain('[aria-hidden=true]');
    expect(css).toContain('[aria-checked=true]');
    expect(css).toContain('var(--brand-primary-hover)');
    expect(css).toContain('var(--color-success)');
  });

  it('should generate focus-visible:border-focus for btn-outline', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('btn-outline');

    expect(css).toContain('var(--border-focus)');
  });

  it('should have zero duplicate shortcut definitions across all shortcuts', () => {
    const names = (rawShortcuts as any[])
      .filter((s) => Array.isArray(s))
      .map(([name]) => name);
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const name of names) {
      if (seen.has(name)) {
        duplicates.push(name);
      }
      seen.add(name);
    }
    expect(duplicates).toEqual([]);
  });
});
