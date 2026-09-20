import { describe, it, expect } from 'vitest';
import { withNuicss } from './next';

describe('withNuicss Next.js integration', () => {
  it('adds @nofinite/nuicss to transpilePackages by default', () => {
    const config = withNuicss({
      reactStrictMode: true,
    });

    expect(config.reactStrictMode).toBe(true);
    expect(config.transpilePackages).toContain('@nofinite/nuicss');
  });

  it('preserves existing transpilePackages', () => {
    const config = withNuicss({
      transpilePackages: ['lucide-react', 'some-pkg'],
    });

    expect(config.transpilePackages).toContain('lucide-react');
    expect(config.transpilePackages).toContain('some-pkg');
    expect(config.transpilePackages).toContain('@nofinite/nuicss');
  });

  it('skips transpilePackages when transpile is false', () => {
    const config = withNuicss({}, { transpile: false });
    expect(config.transpilePackages).toBeUndefined();
  });

  it('configures webpack aliases for virtual css', () => {
    const config = withNuicss({});
    const webpackConfig: any = { resolve: { alias: {} } };

    const result = config.webpack(webpackConfig, {});

    expect(result.resolve.alias['@nofinite/nuicss/virtual.css']).toBe(
      '@nofinite/nuicss/styles.css'
    );
    expect(result.resolve.alias['virtual:nuicss.css']).toBe(
      '@nofinite/nuicss/styles.css'
    );
  });

  it('calls existing custom webpack function if provided', () => {
    let customWebpackCalled = false;
    const config = withNuicss({
      webpack(cfg: any) {
        customWebpackCalled = true;
        cfg.customProp = true;
        return cfg;
      },
    });

    const webpackConfig: any = {};
    const result = config.webpack(webpackConfig, {});

    expect(customWebpackCalled).toBe(true);
    expect(result.customProp).toBe(true);
  });
});
