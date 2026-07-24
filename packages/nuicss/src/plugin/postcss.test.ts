import postcss from 'postcss';
import nuicssPlugin from './postcss';
import { expect, test, describe } from 'vitest';

describe('PostCSS Plugin Integration', () => {
  test('processes @apply directive', async () => {
    const css = `.test { @apply bg-primary hover:bg-danger text-center; }`;
    const result = await postcss([nuicssPlugin()]).process(css, { from: undefined });
    
    expect(result.css).toContain('background-color: var(--nui-color-primary');
    expect(result.css).toContain('text-align: center;');
    expect(result.css).toMatch(/\.test:hover {\s*background-color: var\(--nui-color-danger/);
  });

  test('processes @nuicss base and utilities', async () => {
    const css = `
      @nuicss base;
      @nuicss utilities;
    `;
    const result = await postcss([nuicssPlugin()]).process(css, { from: undefined });
    
    // Base resets and variables should be present
    expect(result.css).toContain(':root {');
    expect(result.css).toContain('--nui-bg-surface:');
    expect(result.css).toContain('/* NUI Base Reset */');
  });
});
