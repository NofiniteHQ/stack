/* eslint-disable */
import { defineConfig } from 'unocss';
import { nuicssPreset } from '../../nuicss/src/plugin/preset';

export default defineConfig({
  presets: [
    nuicssPreset(),
  ],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        'src/**/*.{js,ts,jsx,tsx}',
      ],
    },
  },
});
