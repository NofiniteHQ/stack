/**
 * @nofinite/nuicss/next
 * Zero-config Next.js plugin for NUICSS.
 * Works seamlessly with Next.js App Router and Pages Router.
 */

export interface NuicssNextOptions {
  /**
   * Path to custom nuicss.config.ts / nuicss.config.js
   */
  configFile?: string;

  /**
   * Whether to automatically add '@nofinite/nuicss' to transpilePackages.
   * Default: true
   */
  transpile?: boolean;

  /**
   * Whether to patch Webpack's PostCSS loader to include nuicssPostcss plugin
   * automatically when PostCSS is active in Next.js.
   * Default: true
   */
  injectPostcss?: boolean;
}

/**
 * Wraps your Next.js configuration to automatically configure NUICSS.
 *
 * @example
 * // next.config.mjs
 * import { withNuicss } from '@nofinite/nuicss/next';
 *
 * export default withNuicss({
 *   // your existing next.js config
 * });
 */
export function withNuicss(
  nextConfig: Record<string, any> = {},
  options: NuicssNextOptions = {}
): Record<string, any> {
  const transpile = options.transpile ?? true;
  const injectPostcss = options.injectPostcss ?? true;

  // Ensure @nofinite/nuicss is in transpilePackages
  const existingTranspile = Array.isArray(nextConfig.transpilePackages)
    ? nextConfig.transpilePackages
    : [];
  const transpilePackages = transpile
    ? Array.from(new Set([...existingTranspile, '@nofinite/nuicss']))
    : nextConfig.transpilePackages;

  return {
    ...nextConfig,
    ...(transpile ? { transpilePackages } : {}),

    webpack(config: any, context: any) {
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};

      // Provide virtual css aliases
      if (!config.resolve.alias['@nofinite/nuicss/virtual.css']) {
        config.resolve.alias['@nofinite/nuicss/virtual.css'] =
          '@nofinite/nuicss/styles.css';
      }
      if (!config.resolve.alias['virtual:nuicss.css']) {
        config.resolve.alias['virtual:nuicss.css'] =
          '@nofinite/nuicss/styles.css';
      }

      // Optionally patch PostCSS loader rules
      if (
        injectPostcss &&
        config.module &&
        Array.isArray(config.module.rules)
      ) {
        patchPostcssLoaderInRules(config.module.rules, options.configFile);
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, context);
      }
      return config;
    },
  };
}

function patchPostcssLoaderInRules(rules: any[], configFile?: string) {
  for (const rule of rules) {
    if (!rule) continue;
    if (Array.isArray(rule.use)) {
      for (const loader of rule.use) {
        if (
          loader &&
          typeof loader.loader === 'string' &&
          loader.loader.includes('postcss-loader')
        ) {
          loader.options = loader.options || {};
          loader.options.postcssOptions = loader.options.postcssOptions || {};
          const po = loader.options.postcssOptions;
          if (Array.isArray(po.plugins)) {
            const alreadyRegistered = po.plugins.some(
              (p: any) =>
                (typeof p === 'string' && p.includes('nuicss')) ||
                (p && p.postcssPlugin && p.postcssPlugin.includes('nuicss'))
            );
            if (!alreadyRegistered) {
              try {
                // Dynamic require to prevent bundling PostCSS prematurely
                const nuicssPostcss =
                  require('./postcss').default || require('./postcss');
                po.plugins.push(nuicssPostcss({ configOrPath: configFile }));
              } catch (_) {
                // Ignore fallback if local require is unavailable
              }
            }
          }
        }
      }
    }
    if (Array.isArray(rule.oneOf)) {
      patchPostcssLoaderInRules(rule.oneOf, configFile);
    }
  }
}

export default withNuicss;
