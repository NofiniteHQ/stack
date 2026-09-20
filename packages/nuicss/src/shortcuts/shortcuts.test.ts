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
    expect(names).toContain('table');
    expect(names).toContain('nui-table');
  });

  it('should generate CSS for standard and nui-* prefixed component classes', async () => {
    const uno = await createGenerator(nuicssPreset());

    const { css: standardCss } = await uno.generate(
      'btn btn-primary card badge input'
    );
    expect(standardCss).toContain('inline-flex');
    expect(standardCss).toContain('var(--color-primary)');
    expect(standardCss).toContain('var(--radius-xl)');

    const { css: prefixedCss } = await uno.generate(
      'nui-btn nui-btn-primary nui-card nui-badge nui-input'
    );
    expect(prefixedCss).toContain('inline-flex');
    expect(prefixedCss).toContain('var(--color-primary)');
    expect(prefixedCss).toContain('var(--radius-xl)');
  });

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
    // Table or modal classes should not be in the output CSS
    expect(css).not.toContain('table-sortable');
    expect(css).not.toContain('modal-box');
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
});
