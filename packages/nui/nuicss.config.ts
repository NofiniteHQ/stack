import { defineConfig } from '../nuicss/src/plugin/config';
import { nuiPreset } from './src/preset';

export default defineConfig({
  presets: [
    nuiPreset(),
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
