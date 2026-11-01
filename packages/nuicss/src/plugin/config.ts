import { defineConfig as defineUnoConfig, UserConfig } from 'unocss';
import { loadConfig } from '@unocss/config';
import { nuicssPreset } from './preset';

export type NuicssConfig = UserConfig;

export function defineConfig(config: NuicssConfig = {}): NuicssConfig {
  const userPresets: any[] = (config.presets as any[]) || [];
  const hasNuicssPreset = userPresets.some(
    (p: any) => p && (p.name === 'nuicss-preset' || p._isNuicss)
  );

  return defineUnoConfig({
    ...config,
    presets: hasNuicssPreset
      ? userPresets
      : [nuicssPreset() as any, ...userPresets],
  });
}

export const defineNuicssConfig = defineConfig;

export async function loadNuicssConfig(
  cwd: string = process.cwd(),
  configOrPath?: string | NuicssConfig
): Promise<NuicssConfig> {
  if (configOrPath && typeof configOrPath === 'object') {
    return defineConfig(configOrPath);
  }
  const loaded = await loadConfig(
    cwd,
    typeof configOrPath === 'string' ? configOrPath : undefined
  );
  return loaded.config ? defineConfig(loaded.config) : defineConfig();
}
