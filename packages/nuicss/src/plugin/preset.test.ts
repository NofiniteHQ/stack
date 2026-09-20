import { describe, it, expect } from 'vitest';
import { createGenerator } from 'unocss';
import { nuicssPreset } from './preset';

describe('nuicssPreset', () => {
  it('should generate correct CSS for semantic color tokens and opacity modifiers', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'bg-surface bg-surface/80 text-muted text-subtle/70 border-subtle border-t-default border-x-strong/60'
    );

    expect(css).toContain('var(--bg-surface)');
    expect(css).toContain(
      'color-mix(in oklch, var(--bg-surface) 80%, transparent)'
    );
    expect(css).toContain('var(--fg-muted)');
    expect(css).toContain(
      'color-mix(in oklch, var(--fg-subtle) 70%, transparent)'
    );
    expect(css).toContain('var(--border-subtle)');
    expect(css).toContain('border-top-color');
    expect(css).toContain('var(--border-default)');
    expect(css).toContain(
      'color-mix(in oklch, var(--border-strong) 60%, transparent)'
    );
  });

  it('should generate correct CSS for fluid typography and fluid spacing', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('text-fluid-lg p-fluid-md gap-fluid-sm');

    expect(css).toContain('var(--text-fluid-lg)');
    expect(css).toContain('var(--space-fluid-md)');
    expect(css).toContain('var(--space-fluid-sm)');
  });

  it('should generate correct CSS for container query shortcuts', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('cq card-responsive');

    expect(css).toContain('container-type:inline-size');
    expect(css).toContain('@container');
  });

  it('should generate correct CSS for custom theme tokens', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'text-primary bg-primary/90 bg-danger-subtle p-4 rounded-md rounded-control shadow-sm shadow-popover'
    );

    expect(css).toContain('var(--color-primary)');
    expect(css).toContain(
      'color-mix(in srgb, var(--color-primary) 90%, transparent)'
    );
    expect(css).toContain('var(--color-danger-subtle)');
    expect(css).toContain('calc(var(--spacing) * 4)');
    expect(css).toContain('var(--radius-md)');
    expect(css).toContain('var(--radius-control)');
    expect(css).toContain('var(--shadow-sm)');
    expect(css).toContain('var(--shadow-popover)');
  });

  it('should generate correct CSS for ring and focus shortcuts', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('ring-focus ring-offset-surface');

    expect(css).toContain('var(--focus-ring)');
    expect(css).toContain('var(--bg-surface)');
  });

  it('should generate correct keyframes for custom animations', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('animate-zoom-in animate-slide-up');

    // Check if the keyframes are generated
    expect(css).toContain('@keyframes zoom-in');
    expect(css).toMatch(/transform:\s*scale\(\.?95\)/);

    // Check if the animation utility classes are generated
    expect(css).toMatch(/animation:\s*(\.2s|200ms).*zoom-in/);
  });

  it('should support arbitrary values', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('w-[343px] bg-[#ff0055]');

    expect(css).toContain('width:343px');
    expect(css).toContain('#ff0055');
  });

  it('should not let pseudo variants hijack component shortcuts like hover-card and empty-state', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'empty-state hover-card file-list link-muted hover:text-primary'
    );

    expect(css).toContain('.empty-state');
    expect(css).toContain('.hover-card');
    expect(css).toContain('.file-list');
    expect(css).toContain('.link-muted');
    expect(css).toContain(':hover');
  });
});
