import unocssPostcssPlugin from '@unocss/postcss';
import { loadConfig } from '@unocss/config';
import { nuicssPreset } from './preset';
import fs from 'node:fs';
import path from 'node:path';

function findNuicssConfig(cwd: string, explicitPath?: string): string | undefined {
  if (explicitPath) {
    const p = path.resolve(cwd, explicitPath);
    if (fs.existsSync(p)) return p;
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

export default function postcssPlugin(options: any = {}) {
  const cwd = options.cwd || process.cwd();
  let currentPlugin: any = null;
  let lastMtime = 0;
  let cachedConfig: any = null;

  const directiveMap = {
    unocss: 'nuicss',
    ...options.directiveMap,
  };

  return {
    postcssPlugin: directiveMap.unocss || 'nuicss',
    plugins: [
      async (root: any, result: any) => {
        const configFile = findNuicssConfig(cwd, options.configOrPath);
        const mtime = configFile && fs.existsSync(configFile) ? fs.statSync(configFile).mtimeMs : 0;

        // Load or reload if config changed or first run
        if (!currentPlugin || mtime > lastMtime) {
          try {
            if (configFile) {
              const loaded = await loadConfig(cwd, configFile);
              cachedConfig = loaded.config;
            } else {
              cachedConfig = {
                presets: [nuicssPreset() as any],
              };
            }
          } catch (err) {
            console.error(`[@nofinite/nuicss] Failed to load config from ${configFile}:`, err);
            if (!cachedConfig) {
              cachedConfig = {
                presets: [nuicssPreset() as any],
              };
            }
          }

          // Pass the resolved config object with configFile: false.
          // This tells @unocss/postcss to use the inline config directly and prevents
          // @unocss/postcss from attempting its buggy no-argument reload that wipes styles on HMR.
          const finalOptions = {
            ...options,
            configOrPath: {
              ...cachedConfig,
              configFile: false,
            },
            directiveMap,
          };

          const createUno = (unocssPostcssPlugin as any).default || unocssPostcssPlugin;
          currentPlugin = createUno(finalOptions);
          lastMtime = mtime;
        }

        // Delegate execution to the underlying UnoCSS processor
        if (currentPlugin && currentPlugin.plugins && currentPlugin.plugins[0]) {
          return await currentPlugin.plugins[0](root, result);
        }
      },
    ],
  };
}
