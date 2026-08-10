import { defineConfig as defineUnoConfig, UserConfig } from 'unocss';

export type NuicssConfig = UserConfig;

export function defineConfig(config: NuicssConfig) {
  return defineUnoConfig(config);
}
