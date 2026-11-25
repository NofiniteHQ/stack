import { describe, it, expect } from 'vitest';
import { nuicss, nuicssVitePlugin } from './vite';
import { defineConfig } from './config';
import { nuicssPreset } from './preset';
import { createGenerator } from 'unocss';

describe('NUICSS Vite Plugin & Configuration Standardization', () => {
  it('should export nuicss as default and named nuicssVitePlugin', () => {
    expect(nuicss).toBeDefined();
    expect(nuicssVitePlugin).toBeDefined();
    expect(nuicss).toBe(nuicssVitePlugin);
  });

  it('should create vite plugins array containing entry-shield', () => {
    const plugins = nuicss({ configFile: false }) as any[];
    expect(Array.isArray(plugins)).toBe(true);
    const shieldPlugin = plugins.find((p) => p.name === 'nuicss:entry-shield');
    expect(shieldPlugin).toBeDefined();
    expect(shieldPlugin.enforce).toBe('pre');
  });

  it('should intercept virtual:nuicss.css and resolve to virtual:uno.css', async () => {
    const plugins = nuicss({ configFile: false }) as any[];
    const shieldPlugin = plugins.find((p) => p.name === 'nuicss:entry-shield');

    let resolvedId: string | null = null;
    const mockContext = {
      resolve: (target: string) => {
        resolvedId = target;
        return { id: target };
      },
    };

    shieldPlugin.resolveId.call(mockContext, 'virtual:nuicss.css');
    expect(resolvedId).toBe('virtual:uno.css');

    shieldPlugin.resolveId.call(mockContext, '@nofinite/nuicss/styles.css');
    expect(resolvedId).toBe('virtual:uno.css');

    shieldPlugin.resolveId.call(
      mockContext,
      '@nofinite/nuicss',
      'src/main.css'
    );
    expect(resolvedId).toBe('virtual:uno.css');

    // JS imports of @nofinite/nuicss should NOT be intercepted as CSS
    const jsResult = shieldPlugin.resolveId.call(
      mockContext,
      '@nofinite/nuicss',
      'src/main.ts'
    );
    expect(jsResult).toBeNull();
  });

  it('defineConfig should automatically inject nuicssPreset()', () => {
    const config = defineConfig({
      theme: {
        colors: {
          customColor: '#123456',
        },
      },
    });

    expect(config.presets).toBeDefined();
    expect(config.presets!.length).toBeGreaterThan(0);
    const preset = config.presets![0] as { name?: string };
    expect(preset.name).toBe('nuicss-preset');
  });

  it('nuicssPreset should inject base resets and tokens as preflights by default', async () => {
    const preset = nuicssPreset();
    expect(preset.preflights).toBeDefined();
    expect(preset.preflights!.length).toBeGreaterThan(0);
    expect(preset.preflights![0].layer).toBe('base');

    const cssContent = await preset.preflights![0].getCSS({} as never);
    expect(cssContent).toContain(':where(:root)');
    expect(cssContent).toContain('--color-primary');
    expect(cssContent).toContain('@layer base');

    // JIT generator should include preflight tokens
    const uno = await createGenerator(preset as never);
    const { css } = await uno.generate('btn');
    expect(css).toContain('--color-primary');
    expect(css).toContain(':where(:root)');
  });

  it('nuicssPreset should allow disabling preflights when requested', () => {
    const preset = nuicssPreset({ preflights: false });
    expect(preset.preflights).toBeDefined();
    expect(preset.preflights!.length).toBe(0);
  });

  it('nuicss() should provide zero-config integration defaults when no config file exists', () => {
    const plugins = nuicss({
      cwd: 'C:/fake-nonexistent-zero-config-dir',
    }) as any[];
    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins.length).toBeGreaterThan(1);

    const shieldPlugin = plugins.find((p) => p.name === 'nuicss:entry-shield');
    expect(shieldPlugin).toBeDefined();
    expect(shieldPlugin.enforce).toBe('pre');

    const unoPlugin = plugins.find((p) => p.name === 'unocss:api');
    expect(unoPlugin).toBeDefined();
  });
});
