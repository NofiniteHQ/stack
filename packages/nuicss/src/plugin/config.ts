import { defineConfig as defineUnoConfig, UserConfig } from 'unocss';
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
