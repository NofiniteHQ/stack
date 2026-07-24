import { createJiti } from 'jiti';
import path from 'path';
import fs from 'fs';
import { GeneratorOptions } from '../engine/generator';

export interface NuicssConfig extends GeneratorOptions {
  content?: string[];
}

export async function loadConfig(configPath?: string): Promise<NuicssConfig> {
  const cwd = process.cwd();
  
  // Try to find default config if none provided
  let resolvedPath = configPath ? path.resolve(cwd, configPath) : null;
  
  if (!resolvedPath) {
    const defaults = ['nuicss.config.ts', 'nuicss.config.js', 'nuicss.config.mjs'];
    for (const file of defaults) {
      if (fs.existsSync(path.resolve(cwd, file))) {
        resolvedPath = path.resolve(cwd, file);
        break;
      }
    }
  }

  if (!resolvedPath || !fs.existsSync(resolvedPath)) {
    return {};
  }

  try {
    // @ts-ignore
    const jiti = createJiti(import.meta.url);
    const config = await jiti.import(resolvedPath);
    return (config as any).default || config;
  } catch (e) {
    console.warn(`[NUI CSS] Failed to load config at ${resolvedPath}:`, e);
    return {};
  }
}
