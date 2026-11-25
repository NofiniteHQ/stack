import { defineConfig as defineUnoConfig, UserConfig } from 'unocss';
import { loadConfig } from '@unocss/config';
import { nuicssPreset } from './preset';

export type NuicssConfig = UserConfig;

/**
 * Safely copies configuration while shielding against prototype pollution.
 * Specifically rejects or filters dangerous own `__proto__` properties and
 * constructor.prototype tampering without mutating caller-owned input.
 * Preserves all valid UnoCSS/NUICSS configuration types: functions (rules, variants,
 * extractors), RegExp objects, Arrays, Sets, Maps, and nested configuration records.
 */
export function sanitizeConfig<T>(input: T): T {
  if (input === null || typeof input !== 'object') {
    return input;
  }

  // Preserve non-plain objects and built-ins
  if (
    input instanceof RegExp ||
    input instanceof Date ||
    input instanceof Map ||
    input instanceof Set
  ) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeConfig(item)) as unknown as T;
  }

  // Handle plain objects: copy safe own enumerable keys without mutating caller input
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(input)) {
    // 1. Never copy an own property named '__proto__'
    if (key === '__proto__') {
      continue;
    }

    // 2. Guard against constructor.prototype tampering
    if (key === 'constructor') {
      const val = (input as Record<string, unknown>)[key];
      if (
        val &&
        typeof val === 'object' &&
        Object.prototype.hasOwnProperty.call(val, 'prototype')
      ) {
        // Disallow constructor payload attempting to modify prototype
        continue;
      }
      // Legitimate constructor reference (e.g., class or function reference)
      result[key] = val;
      continue;
    }

    const value = (input as Record<string, unknown>)[key];
    result[key] = sanitizeConfig(value);
  }

  return result as T;
}

export function defineConfig(config: NuicssConfig = {}): NuicssConfig {
  const safeConfig = sanitizeConfig(config);
  const userPresets: any[] = (safeConfig.presets as any[]) || [];
  const hasNuicssPreset = userPresets.some(
    (p: any) => p && (p.name === 'nuicss-preset' || p._isNuicss)
  );

  return defineUnoConfig({
    ...safeConfig,
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
