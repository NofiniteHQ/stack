import unocssVitePlugin from '@unocss/vite';
import type { PluginOption } from 'vite';
import { nuicssPreset } from './preset';
import fs from 'node:fs';
import path from 'node:path';

export interface NuicssViteOptions {
  /** Path to custom config file, or false to disable config file lookup */
  configFile?: string | false;
  /** Working directory to look for config files */
  cwd?: string;
  [key: string]: any;
}

function findNuicssConfig(
  cwd: string,
  explicitPath?: string | false
): string | false | undefined {
  if (explicitPath === false) return false;
  if (typeof explicitPath === 'string') {
    const p = path.resolve(cwd, explicitPath);
    if (fs.existsSync(p)) return p;
    return undefined;
  }
  const candidates = [
    'nuicss.config.ts',
    'nuicss.config.js',
    'nuicss.config.mjs',
    'nuicss.config.cjs',
    'nuicss.config.mts',
  ];
  for (const name of candidates) {
    const p = path.resolve(cwd, name);
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

export function nuicss(options: NuicssViteOptions = {}): PluginOption {
  const cwd = options.cwd || process.cwd();
  const detectedConfig = findNuicssConfig(cwd, options.configFile);

  let finalOptions: any;

  if (detectedConfig) {
    finalOptions = {
      ...options,
      configFile: detectedConfig,
    };
  } else {
    // Zero-Config Vite Integration Defaults:
    // When no nuicss.config.(ts|js|mjs|cjs|mts) exists at project root, automatically provide
    // default nuicssPreset() and content scanning ('src/**/*.{html,js,ts,jsx,tsx,vue,svelte}').
    const userPresets = (options.presets as any[]) || [];
    const hasNuicssPreset = userPresets.some(
      (p: any) => p && (p.name === 'nuicss-preset' || p._isNuicss)
    );
    const presets = hasNuicssPreset
      ? userPresets
      : [nuicssPreset(), ...userPresets];

    const defaultContentPatterns = ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'];
    const userContent = options.content;

    let content: any;
    if (userContent) {
      content = {
        ...userContent,
        filesystem: userContent.filesystem || defaultContentPatterns,
        pipeline:
          userContent.pipeline !== undefined
            ? userContent.pipeline
            : {
                include: [
                  /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
                  ...defaultContentPatterns,
                  '**/node_modules/@nofinite/nui/**/*.{js,mjs,cjs,jsx,tsx}',
                ],
              },
      };
    } else {
      content = {
        filesystem: defaultContentPatterns,
        pipeline: {
          include: [
            /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
            ...defaultContentPatterns,
            '**/node_modules/@nofinite/nui/**/*.{js,mjs,cjs,jsx,tsx}',
          ],
        },
      };
    }

    finalOptions = {
      ...options,
      configFile: false,
      presets,
      content,
    };
  }

  const getUnoPlugin =
    typeof unocssVitePlugin === 'function'
      ? unocssVitePlugin
      : (unocssVitePlugin as any)?.default || unocssVitePlugin;
  const unoPlugin = getUnoPlugin(finalOptions);

  const shieldPlugin: any = {
    name: 'nuicss:entry-shield',
    enforce: 'pre' as const,
    resolveId(this: any, id: string, importer?: string, resolveOpts?: any) {
      // 1. Intercept virtual CSS specifiers and direct static CSS references
      if (
        id === 'virtual:nuicss.css' ||
        id === '@nofinite/nuicss/virtual.css' ||
        id === '@nofinite/nuicss/styles.css' ||
        id === '@nofinite/nuicss/index.css'
      ) {
        return this.resolve('virtual:uno.css', importer, {
          skipSelf: true,
          ...resolveOpts,
        });
      }

      // 2. Intercept @import '@nofinite/nuicss' or @import 'nuicss' when imported from CSS stylesheets
      if (
        (id === '@nofinite/nuicss' || id === 'nuicss') &&
        importer &&
        /\.(css|postcss|scss|sass|less)($|\?)/i.test(importer)
      ) {
        return this.resolve('virtual:uno.css', importer, {
          skipSelf: true,
          ...resolveOpts,
        });
      }

      return null;
    },
  };

  return [
    shieldPlugin,
    ...(Array.isArray(unoPlugin) ? unoPlugin : [unoPlugin]),
  ];
}

export const nuicssVitePlugin = nuicss;
export default nuicss;
