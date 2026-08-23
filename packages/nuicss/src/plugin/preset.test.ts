import { describe, it, expect } from 'vitest';
import { createGenerator } from 'unocss';
import { nuicssPreset } from './preset';

describe('nuicssPreset', () => {
  it('should generate correct CSS for semantic color shortcuts', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('bg-surface text-muted border-subtle');
    
    expect(css).toContain('var(--bg-surface)');
    expect(css).toContain('var(--fg-muted)');
    expect(css).toContain('var(--border-subtle)');
  });

  it('should generate correct CSS for custom theme tokens', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('text-primary bg-danger-subtle p-4 rounded-md shadow-sm');
    
    expect(css).toContain('var(--color-primary)');
    expect(css).toContain('var(--color-danger-subtle)');
    expect(css).toContain('var(--space-4)');
    expect(css).toContain('var(--radius-md)');
    expect(css).toContain('var(--shadow-sm)');
  });

  it('should generate correct keyframes for custom animations', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('animate-zoom-in animate-slide-up');
    
    // Check if the keyframes are generated
    expect(css).toContain('@keyframes zoom-in');
    expect(css).toContain('transform: scale(0.95)');
    
    // Check if the animation utility classes are generated
    expect(css).toContain('animation:zoom-in 200ms');
  });

  it('should support arbitrary values', async () => {
    const uno = await createGenerator(nuicssPreset());
    const { css } = await uno.generate('w-[343px] bg-[#ff0055]');
    
    expect(css).toContain('width:343px');
    expect(css).toContain('background-color:rgb(255 0 85');
  });
});
