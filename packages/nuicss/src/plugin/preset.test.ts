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

  it('should generate correct CSS for selected background tokens with opacity support', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'bg-selected bg-selected/80 bg-selected-hover'
    );

    expect(css).toContain('var(--bg-selected)');
    expect(css).toContain(
      'color-mix(in oklch, var(--bg-selected) 80%, transparent)'
    );
    expect(css).toContain('var(--bg-selected-hover)');
  });

  it('should generate correct CSS for modern physics easing curves', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'ease-spring ease-bounce ease-smooth ease-out-expo'
    );

    expect(css).toContain('var(--ease-spring)');
    expect(css).toContain('var(--ease-bounce)');
    expect(css).toContain('var(--ease-smooth)');
    expect(css).toContain('var(--ease-out-expo)');
  });

  it('should generate correct CSS for semantic SVG fill and stroke utilities', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'fill-primary fill-muted stroke-subtle stroke-strong'
    );

    expect(css).toContain('fill:var(--color-primary)');
    expect(css).toContain('fill:var(--fg-muted)');
    expect(css).toContain('stroke:var(--border-subtle)');
    expect(css).toContain('stroke:var(--border-strong)');
  });

  it('should support full Tailwind drop-in parity for group, peer, and container queries', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate(
      'group-hover:opacity-100 peer-focus:border-primary @sm:grid-cols-2'
    );

    expect(css).toContain('.group:hover');
    expect(css).toContain('.peer:focus');
    expect(css).toContain('@container');
  });
});
