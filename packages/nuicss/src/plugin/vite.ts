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

  // If a config file was found, use it. Otherwise, disable file lookup and provide nuicssPreset().
  const finalOptions: any = {
    ...options,
    configFile: detectedConfig !== undefined ? detectedConfig : false,
    ...(detectedConfig ? {} : { presets: [nuicssPreset()] }),
  };

  const unoPlugin = unocssVitePlugin(finalOptions);

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
