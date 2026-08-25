import '../styles/index.css';

export { nuicssPreset } from './preset';
export { nuicssVitePlugin } from './vite';
export { default as postcssPlugin } from './postcss';
export { defineConfig } from './config';
export type { NuicssConfig } from './config';
export { getThemeValue } from '../helpers/theme';
export { DARK_MODE_SCRIPT } from '../helpers/fouc';
