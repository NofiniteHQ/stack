import '../styles/index.css';

export { nuicssPreset } from './preset';
export { nuicssVitePlugin } from './vite';
export { default as postcssPlugin } from './postcss';
export { defineConfig } from './config';
export type { NuicssConfig } from './config';
export { getThemeValue } from '../helpers/theme';
export { DARK_MODE_SCRIPT } from '../helpers/fouc';
export { withNuicss } from './next';
export {
  extractCriticalNuicss,
  injectCriticalNuicss,
  extractCriticalCssForTokens,
  clearCriticalNuicssCache,
  createCriticalStyleTag,
} from '../helpers/ssr';
export type {
  CriticalNuicssOptions,
  CriticalNuicssResult,
} from '../helpers/ssr';
export * from '../shortcuts';
