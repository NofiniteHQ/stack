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
});
