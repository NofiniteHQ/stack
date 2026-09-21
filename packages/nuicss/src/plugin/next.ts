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

const virtualAliases: Record<string, string> = {
  '@nofinite/nuicss/virtual.css': '@nofinite/nuicss/styles.css',
  'virtual:nuicss.css': '@nofinite/nuicss/styles.css',
};

function getLocalRequire(): any {
  try {
    if (typeof require !== 'undefined') return require;
  } catch {
    /* ignore */
  }
  try {
    const globalReq = (globalThis as any).require;
    if (typeof globalReq === 'function') return globalReq;
  } catch {
    /* ignore */
  }
  return null;
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

  // Support Turbopack resolve aliases (Next.js 14 experimental.turbo and Next.js 15 turbopack)
  const experimental = nextConfig.experimental || {};
  const existingTurbo = experimental.turbo || {};
  const existingTurboResolve = existingTurbo.resolveAlias || {};

  const existingTurbopack = nextConfig.turbopack || {};
  const existingTurbopackResolve = existingTurbopack.resolveAlias || {};

  const patchedExperimental = {
    ...experimental,
    turbo: {
      ...existingTurbo,
      resolveAlias: {
        ...existingTurboResolve,
        ...virtualAliases,
      },
    },
  };

  const patchedTurbopack = {
    ...existingTurbopack,
    resolveAlias: {
      ...existingTurbopackResolve,
      ...virtualAliases,
    },
  };

  return {
    ...nextConfig,
    ...(transpile ? { transpilePackages } : {}),
    experimental: patchedExperimental,
    turbopack: patchedTurbopack,

    webpack(config: any, context: any) {
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};

      // Provide virtual css aliases for Webpack
      for (const [aliasKey, aliasVal] of Object.entries(virtualAliases)) {
        if (!config.resolve.alias[aliasKey]) {
          config.resolve.alias[aliasKey] = aliasVal;
        }
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
                (typeof p === 'string' &&
                  (p.includes('nuicss') || p.includes('unocss'))) ||
                (p &&
                  p.postcssPlugin &&
                  (p.postcssPlugin.includes('nuicss') ||
                    p.postcssPlugin.includes('unocss')))
            );
            if (!alreadyRegistered) {
              try {
                const req = getLocalRequire();
                if (req) {
                  const nuicssPostcss =
                    req('./postcss').default || req('./postcss');
                  po.plugins.push(nuicssPostcss({ configOrPath: configFile }));
                }
              } catch {
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
