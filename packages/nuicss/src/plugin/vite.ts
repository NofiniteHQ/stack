import type { Plugin } from 'vite';
import { generateCSS, generateVariables, GeneratorOptions } from '../engine/generator';
import fs from 'fs';
import { globSync } from 'glob';
import { loadConfig } from './config';

// A simple regex to extract potential class names from source files
const CLASS_REGEX = /[^<>"'`\s]+/g;

export interface NuicssPluginOptions extends GeneratorOptions {
  include?: string | string[];
}

export function nuicssVitePlugin(options: NuicssPluginOptions = {}): Plugin {
  const virtualModuleId = 'virtual:nuicss.css';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const classSet = new Set<string>();
  let server: any = null;

  return {
    name: 'vite-plugin-nuicss',
    enforce: 'pre',

    configureServer(viteServer) {
      server = viteServer;
    },

    resolveId(id) {
      if (id === virtualModuleId || id === '@nofinite/nuicss/virtual.css') {
        return resolvedVirtualModuleId;
      }
      return null;
    },

    async buildStart() {
      const config = await loadConfig();
      const mergedOptions = { ...config, ...options };
      const contentFiles = mergedOptions.content || ['src/**/*.{tsx,jsx,ts,js,vue,svelte,html}'];
      const files = globSync(contentFiles, { absolute: true });
      for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const code = fs.readFileSync(file, 'utf-8');
        let match;
        while ((match = CLASS_REGEX.exec(code)) !== null) {
          classSet.add(match[0]);
        }
      }
    },

    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const config = await loadConfig();
        const mergedOptions = { ...config, ...options };
        console.log('[NUI CSS] Vite Plugin Loaded Config:', Object.keys(config));
        
        const baseVars = generateVariables(mergedOptions.theme);
        const utilities = generateCSS(Array.from(classSet), mergedOptions);
        return `${baseVars}\n${utilities}`;
      }
      return null;
    },

    transform(code, id) {
      // Basic heuristic to only scan source files (not node_modules, not binary)
      if (id.includes('node_modules') || !/\.(tsx|jsx|ts|js|html|svelte|vue)$/.test(id)) {
        return;
      }

      let hasNewClass = false;
      let match;
      
      while ((match = CLASS_REGEX.exec(code)) !== null) {
        const potentialClass = match[0];
        if (!classSet.has(potentialClass)) {
          classSet.add(potentialClass);
          hasNewClass = true;
        }
      }

      if (hasNewClass && server) {
        // If we found a new class during dev mode, invalidate the virtual CSS module
        // so Vite requests it again and the browser updates.
        const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (module) {
          server.moduleGraph.invalidateModule(module);
          server.ws.send({
            type: 'update',
            updates: [
              {
                type: 'css-update',
                path: virtualModuleId,
                acceptedPath: virtualModuleId,
                timestamp: Date.now(),
              },
            ],
          });
        }
      }

      // We don't transform the actual source code
      return null;
    },
  };
}
